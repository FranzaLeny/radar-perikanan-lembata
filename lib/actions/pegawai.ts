'use server';

import { asc, desc, eq, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { masterPegawai, ujiKualitasAir } from '@/db/schema';
import { pegawaiSchema } from '@/lib/validations/pegawai-master';

export type PegawaiItem = {
	id: string;
	nip: string;
	nama: string;
	jabatan: string;
	pangkat_golongan: string | null;
	aktif: boolean;
	peran_tanda_tangan: string;
	is_penanggungjawab: boolean;
	createdAt: Date;
};

export async function getPegawaiListAction(): Promise<PegawaiItem[]> {
	try {
		const list = await db
			.select()
			.from(masterPegawai)
			.where(eq(masterPegawai.aktif, true))
			.orderBy(asc(masterPegawai.nama));
		return list;
	} catch (err) {
		console.error('[getPegawaiListAction] Error:', err);
		return [];
	}
}

export async function getAllPegawaiAction(): Promise<PegawaiItem[]> {
	try {
		const list = await db.select().from(masterPegawai).orderBy(desc(masterPegawai.createdAt));
		return list;
	} catch (err) {
		console.error('[getAllPegawaiAction] Error:', err);
		return [];
	}
}

export async function createPegawaiAction(formData: {
	nip: string;
	nama: string;
	jabatan: string;
	pangkat_golongan?: string;
	peran_tanda_tangan?: string;
	is_penanggungjawab?: boolean;
}) {
	const validation = pegawaiSchema.safeParse(formData);
	if (!validation.success) {
		return {
			success: false,
			errors: validation.error.flatten().fieldErrors,
			message: 'Data pegawai tidak valid.'
		};
	}

	const data = validation.data;

	try {
		// Jika diset sebagai penanggungjawab, reset pegawai lain terlebih dahulu
		if (data.is_penanggungjawab) {
			await db
				.update(masterPegawai)
				.set({ is_penanggungjawab: false })
				.where(eq(masterPegawai.is_penanggungjawab, true));
		}

		const [created] = await db
			.insert(masterPegawai)
			.values({
				nip: data.nip,
				nama: data.nama.trim(),
				jabatan: data.jabatan.trim(),
				pangkat_golongan: data.pangkat_golongan?.trim() || null,
				peran_tanda_tangan: data.peran_tanda_tangan || 'penguji',
				is_penanggungjawab: data.is_penanggungjawab || false,
				aktif: true
			})
			.returning();

		revalidatePath('/pegawai');
		revalidatePath('/uji-kualitas/baru');
		revalidatePath('/laporan');
		return { success: true, data: created, message: 'Pegawai berhasil didaftarkan.' };
	} catch (err: unknown) {
		console.error('[createPegawaiAction] Error:', err);
		return { success: false, message: 'Gagal mendaftarkan pegawai. Pastikan NIP unik.' };
	}
}

export async function updatePegawaiAction(
	id: string,
	formData: {
		nip: string;
		nama: string;
		jabatan: string;
		pangkat_golongan?: string;
		peran_tanda_tangan?: string;
		is_penanggungjawab?: boolean;
	}
) {
	const validation = pegawaiSchema.safeParse(formData);
	if (!validation.success) {
		return {
			success: false,
			errors: validation.error.flatten().fieldErrors,
			message: 'Data pegawai tidak valid.'
		};
	}

	const data = validation.data;

	try {
		if (data.is_penanggungjawab) {
			await db
				.update(masterPegawai)
				.set({ is_penanggungjawab: false })
				.where(eq(masterPegawai.is_penanggungjawab, true));
		}

		const [updated] = await db
			.update(masterPegawai)
			.set({
				nip: data.nip,
				nama: data.nama.trim(),
				jabatan: data.jabatan.trim(),
				pangkat_golongan: data.pangkat_golongan?.trim() || null,
				peran_tanda_tangan: data.peran_tanda_tangan || 'penguji',
				is_penanggungjawab: data.is_penanggungjawab || false
			})
			.where(eq(masterPegawai.id, id))
			.returning();

		revalidatePath('/pegawai');
		revalidatePath('/uji-kualitas/baru');
		revalidatePath('/laporan');
		return { success: true, data: updated, message: 'Data pegawai berhasil diperbarui.' };
	} catch (err) {
		console.error('[updatePegawaiAction] Error:', err);
		return { success: false, message: 'Gagal memperbarui data pegawai. Pastikan NIP unik.' };
	}
}

export async function togglePegawaiAction(id: string, aktif: boolean) {
	try {
		await db.update(masterPegawai).set({ aktif }).where(eq(masterPegawai.id, id));

		revalidatePath('/pegawai');
		revalidatePath('/uji-kualitas/baru');
		return {
			success: true,
			message: aktif ? 'Pegawai diaktifkan kembali.' : 'Pegawai dinonaktifkan.'
		};
	} catch (err) {
		console.error('[togglePegawaiAction] Error:', err);
		return { success: false, message: 'Gagal mengubah status pegawai.' };
	}
}

export async function setPenanggungJawabAction(pegawaiId: string) {
	try {
		// 1. Reset semua penanggung jawab yang ada
		await db
			.update(masterPegawai)
			.set({ is_penanggungjawab: false })
			.where(eq(masterPegawai.is_penanggungjawab, true));

		// 2. Set penanggung jawab baru
		const [updated] = await db
			.update(masterPegawai)
			.set({ is_penanggungjawab: true })
			.where(eq(masterPegawai.id, pegawaiId))
			.returning();

		revalidatePath('/pegawai');
		revalidatePath('/uji-kualitas/baru');
		revalidatePath('/laporan');
		return {
			success: true,
			data: updated,
			message: `${updated.nama} berhasil ditetapkan sebagai Penanggung Jawab Default dokumen.`
		};
	} catch (err) {
		console.error('[setPenanggungJawabAction] Error:', err);
		return { success: false, message: 'Gagal mengatur penanggung jawab default.' };
	}
}

export async function deletePegawaiAction(id: string) {
	try {
		// Proteksi: Cek apakah pegawai telah tercatat dalam riwayat pengujian
		const [usage] = await db
			.select({ id: ujiKualitasAir.id })
			.from(ujiKualitasAir)
			.where(
				or(eq(ujiKualitasAir.penguji_pegawai_id, id), eq(ujiKualitasAir.penandatangan_pegawai_id, id))
			)
			.limit(1);

		if (usage) {
			return {
				success: false,
				message:
					'Tidak dapat dihapus: pegawai ini sudah tercatat dalam riwayat dokumen uji kualitas air. Nonaktifkan saja jika sudah tidak bertugas.'
			};
		}

		await db.delete(masterPegawai).where(eq(masterPegawai.id, id));

		revalidatePath('/pegawai');
		revalidatePath('/uji-kualitas/baru');
		revalidatePath('/laporan');
		return { success: true, message: 'Data pegawai berhasil dihapus permanen.' };
	} catch (err) {
		console.error('[deletePegawaiAction] Error:', err);
		return { success: false, message: 'Gagal menghapus data pegawai.' };
	}
}
