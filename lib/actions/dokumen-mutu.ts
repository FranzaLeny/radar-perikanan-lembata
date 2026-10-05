'use server';

import { asc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { generateIkHash } from '@/lib/qr';
import { dokumenMutuSchema, kategoriDokumenSchema } from '@/lib/validations/dokumen-mutu';

// ==========================================
// 1. ACTIONS MANAJEMEN KATEGORI DOKUMEN MUTU
// ==========================================

export async function getKategoriDokumenListAction() {
	try {
		const list = await db.query.kategoriDokumenMutu.findMany({
			orderBy: [asc(schema.kategoriDokumenMutu.urutan), asc(schema.kategoriDokumenMutu.nama_kategori)]
		});
		return { success: true, data: list };
	} catch (error) {
		console.error('Error getKategoriDokumenListAction:', error);
		return { success: false, data: [] };
	}
}

export async function createKategoriDokumenAction(formData: FormData | Record<string, unknown>) {
	const rawData = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

	const validation = kategoriDokumenSchema.safeParse(rawData);
	if (!validation.success) {
		return {
			success: false,
			errors: validation.error.flatten().fieldErrors,
			message: 'Data kategori dokumen tidak valid.'
		};
	}

	const { kode_kategori, nama_kategori, deskripsi, urutan, aktif } = validation.data;

	// Cek duplikasi kode_kategori
	const existing = await db.query.kategoriDokumenMutu.findFirst({
		where: eq(schema.kategoriDokumenMutu.kode_kategori, kode_kategori)
	});

	if (existing) {
		return {
			success: false,
			errors: { kode_kategori: ['Kode kategori sudah terdaftar dalam sistem'] },
			message: 'Kode kategori sudah terdaftar.'
		};
	}

	try {
		const [inserted] = await db
			.insert(schema.kategoriDokumenMutu)
			.values({ kode_kategori, nama_kategori, deskripsi: deskripsi || null, urutan, aktif })
			.returning();

		revalidatePath('/dokumen-mutu');
		revalidatePath('/dokumen-mutu/kategori');
		return {
			success: true,
			data: inserted,
			message: `Kategori "${nama_kategori}" berhasil ditambahkan.`
		};
	} catch (error) {
		console.error('Error createKategoriDokumenAction:', error);
		return { success: false, message: 'Gagal menyimpan kategori dokumen mutu.' };
	}
}

export async function updateKategoriDokumenAction(
	id: string,
	formData: FormData | Record<string, unknown>
) {
	const rawData = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

	const validation = kategoriDokumenSchema.safeParse(rawData);
	if (!validation.success) {
		return {
			success: false,
			errors: validation.error.flatten().fieldErrors,
			message: 'Data kategori dokumen tidak valid.'
		};
	}

	const { kode_kategori, nama_kategori, deskripsi, urutan, aktif } = validation.data;

	try {
		const [updated] = await db
			.update(schema.kategoriDokumenMutu)
			.set({ kode_kategori, nama_kategori, deskripsi: deskripsi || null, urutan, aktif })
			.where(eq(schema.kategoriDokumenMutu.id, id))
			.returning();

		revalidatePath('/dokumen-mutu');
		revalidatePath('/dokumen-mutu/kategori');
		return {
			success: true,
			data: updated,
			message: `Kategori "${nama_kategori}" berhasil diperbarui.`
		};
	} catch (error) {
		console.error('Error updateKategoriDokumenAction:', error);
		return { success: false, message: 'Gagal memperbarui kategori dokumen mutu.' };
	}
}

export async function toggleKategoriDokumenAction(id: string, aktif: boolean) {
	try {
		await db
			.update(schema.kategoriDokumenMutu)
			.set({ aktif })
			.where(eq(schema.kategoriDokumenMutu.id, id));

		revalidatePath('/dokumen-mutu');
		revalidatePath('/dokumen-mutu/kategori');
		return {
			success: true,
			message: aktif ? 'Kategori berhasil diaktifkan.' : 'Kategori berhasil dinonaktifkan.'
		};
	} catch (error) {
		console.error('Error toggleKategoriDokumenAction:', error);
		return { success: false, message: 'Gagal mengubah status kategori dokumen mutu.' };
	}
}

export async function deleteKategoriDokumenAction(id: string) {
	try {
		// Cek apakah ada dokumen terkait
		const [usage] = await db
			.select({ id: schema.instruksiKerja.id })
			.from(schema.instruksiKerja)
			.where(eq(schema.instruksiKerja.kategori_id, id))
			.limit(1);

		if (usage) {
			return {
				success: false,
				message:
					'Kategori tidak dapat dihapus karena sudah memiliki dokumen mutu terhubung. Nonaktifkan saja.'
			};
		}

		await db.delete(schema.kategoriDokumenMutu).where(eq(schema.kategoriDokumenMutu.id, id));

		revalidatePath('/dokumen-mutu');
		revalidatePath('/dokumen-mutu/kategori');
		return { success: true, message: 'Kategori dokumen mutu berhasil dihapus.' };
	} catch (error) {
		console.error('Error deleteKategoriDokumenAction:', error);
		return { success: false, message: 'Gagal menghapus kategori dokumen mutu.' };
	}
}

// ==========================================
// 2. ACTIONS MANAJEMEN DOKUMEN MUTU & IK
// ==========================================

export async function createDokumenMutuAction(formData: FormData | Record<string, unknown>) {
	const rawData = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

	const validation = dokumenMutuSchema.safeParse(rawData);
	if (!validation.success) {
		return {
			success: false,
			errors: validation.error.flatten().fieldErrors,
			message: 'Data Dokumen Mutu tidak valid.'
		};
	}

	const {
		kategori_id,
		kode_dokumen,
		judul,
		parameter_uji,
		metode_pengujian,
		file_path,
		deskripsi,
		versi,
		aktif
	} = validation.data;

	// Cek duplikasi kode dokumen
	const existing = await db.query.instruksiKerja.findFirst({
		where: eq(schema.instruksiKerja.kode_ik, kode_dokumen)
	});

	if (existing) {
		return {
			success: false,
			errors: { kode_dokumen: ['Kode dokumen ini sudah terdaftar dalam sistem'] },
			message: 'Kode dokumen sudah terdaftar.'
		};
	}

	// Ambil nama kategori untuk fallback kategori teks
	const kat = await db.query.kategoriDokumenMutu.findFirst({
		where: eq(schema.kategoriDokumenMutu.id, kategori_id)
	});

	// Generate QR code hash unik
	const qrHash = generateIkHash(kode_dokumen);

	try {
		const [inserted] = await db
			.insert(schema.instruksiKerja)
			.values({
				kode_ik: kode_dokumen,
				judul,
				kategori_id,
				kategori: kat?.nama_kategori || 'Dokumen Mutu',
				parameter_uji: parameter_uji?.trim() || null,
				metode_pengujian: metode_pengujian?.trim() || null,
				deskripsi: deskripsi?.trim() || null,
				file_path,
				qr_code_hash: qrHash,
				versi: versi || 1,
				aktif: aktif ?? true
			})
			.returning();

		revalidatePath('/dokumen-mutu');
		revalidatePath('/instruksi-kerja');
		revalidatePath('/uji-kualitas/input');
		return {
			success: true,
			data: inserted,
			message: `Dokumen "${judul}" (${kode_dokumen}) dan QR Code berhasil disimpan.`
		};
	} catch (error) {
		console.error('Error createDokumenMutuAction:', error);
		return { success: false, message: 'Terjadi kesalahan sistem saat menyimpan Dokumen Mutu.' };
	}
}

export async function updateDokumenMutuAction(
	id: string,
	formData: {
		kategori_id?: string;
		kategori?: string | null;
		judul: string;
		parameter_uji?: string | null;
		metode_pengujian?: string | null;
		deskripsi?: string | null;
		file_path: string;
	}
) {
	if (!id || !formData.judul?.trim() || !formData.file_path?.trim()) {
		return { success: false, message: 'Judul dan File Dokumen / Tautan PDF wajib diisi.' };
	}

	try {
		const existing = await db.query.instruksiKerja.findFirst({
			where: eq(schema.instruksiKerja.id, id)
		});

		if (!existing) {
			return { success: false, message: 'Dokumen Mutu tidak ditemukan.' };
		}

		let katName = existing.kategori;
		if (formData.kategori_id) {
			const kat = await db.query.kategoriDokumenMutu.findFirst({
				where: eq(schema.kategoriDokumenMutu.id, formData.kategori_id)
			});
			if (kat) katName = kat.nama_kategori;
		}

		// Naikkan versi dokumen
		const newVersion = (existing.versi || 1) + 1;

		const [updated] = await db
			.update(schema.instruksiKerja)
			.set({
				judul: formData.judul.trim(),
				kategori_id: formData.kategori_id || existing.kategori_id,
				kategori: katName,
				parameter_uji:
					formData.parameter_uji !== undefined ? formData.parameter_uji : existing.parameter_uji,
				metode_pengujian:
					formData.metode_pengujian !== undefined
						? formData.metode_pengujian
						: existing.metode_pengujian,
				deskripsi: formData.deskripsi !== undefined ? formData.deskripsi : existing.deskripsi,
				file_path: formData.file_path.trim(),
				versi: newVersion
			})
			.where(eq(schema.instruksiKerja.id, id))
			.returning();

		revalidatePath('/dokumen-mutu');
		revalidatePath('/instruksi-kerja');
		revalidatePath('/uji-kualitas/input');
		revalidatePath(`/dokumen-mutu/${id}/cetak-label`);
		return {
			success: true,
			data: updated,
			message: `Dokumen berhasil diperbarui ke v${newVersion}.0 (QR Code fisik tetap aktif).`
		};
	} catch (error) {
		console.error('Error updateDokumenMutuAction:', error);
		return { success: false, message: 'Gagal memperbarui Dokumen Mutu.' };
	}
}

export async function toggleDokumenMutuAction(id: string, aktif: boolean) {
	try {
		await db.update(schema.instruksiKerja).set({ aktif }).where(eq(schema.instruksiKerja.id, id));

		revalidatePath('/dokumen-mutu');
		revalidatePath('/instruksi-kerja');
		revalidatePath('/uji-kualitas/input');
		return {
			success: true,
			message: aktif ? 'Dokumen berhasil diaktifkan kembali.' : 'Dokumen berhasil dinonaktifkan.'
		};
	} catch (error) {
		console.error('Error toggleDokumenMutuAction:', error);
		return { success: false, message: 'Gagal mengubah status dokumen.' };
	}
}

export async function deleteDokumenMutuAction(id: string) {
	try {
		// Cek apakah ada data pengujian yang mereferensikan dokumen ini (sebagai SOP atau IK parameter)
		const [usageSop] = await db
			.select({ id: schema.ujiKualitasAir.id })
			.from(schema.ujiKualitasAir)
			.where(eq(schema.ujiKualitasAir.ik_id, id))
			.limit(1);

		const [usageIk] = await db
			.select({ id: schema.detailUjiParameter.id })
			.from(schema.detailUjiParameter)
			.where(eq(schema.detailUjiParameter.ik_id, id))
			.limit(1);

		if (usageSop || usageIk) {
			return {
				success: false,
				message:
					'Dokumen ini sudah pernah digunakan dalam riwayat pengujian kualitas air. Nonaktifkan saja agar data riwayat tidak rusak.'
			};
		}

		await db.delete(schema.instruksiKerja).where(eq(schema.instruksiKerja.id, id));
		revalidatePath('/dokumen-mutu');
		revalidatePath('/instruksi-kerja');
		return { success: true, message: 'Dokumen berhasil dihapus permanen.' };
	} catch (error) {
		console.error('Error deleteDokumenMutuAction:', error);
		return { success: false, message: 'Gagal menghapus dokumen mutu.' };
	}
}
