'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { lokasiKolamSchema } from '@/lib/validations/lokasi-kolam';

export async function createLokasiKolamAction(formData: FormData | Record<string, unknown>) {
	const rawData = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

	// Validasi Zod Server-Side (WAJIB)
	const validation = lokasiKolamSchema.safeParse(rawData);
	if (!validation.success) {
		return {
			success: false,
			errors: validation.error.flatten().fieldErrors,
			message: 'Data lokasi kolam tidak valid.'
		};
	}

	const data = validation.data;

	try {
		const [inserted] = await db
			.insert(schema.lokasiKolam)
			.values({
				nama_pokdakan: data.nama_pokdakan,
				pemilik: data.pemilik,
				kecamatan: data.kecamatan,
				desa: data.desa,
				titik_koordinat: data.titik_koordinat || null,
				komoditas_ikan: data.komoditas_ikan || null
			})
			.returning();

		revalidatePath('/lokasi-kolam');
		return {
			success: true,
			data: inserted,
			message: 'Lokasi kolam pembudidaya berhasil ditambahkan.'
		};
	} catch (error) {
		console.error('Error createLokasiKolamAction:', error);
		return { success: false, message: 'Terjadi kesalahan sistem saat menyimpan lokasi kolam.' };
	}
}

export async function updateLokasiKolamAction(
	id: string,
	formData: FormData | Record<string, unknown>
) {
	const rawData = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

	const validation = lokasiKolamSchema.safeParse(rawData);
	if (!validation.success) {
		return {
			success: false,
			errors: validation.error.flatten().fieldErrors,
			message: 'Data lokasi kolam tidak valid.'
		};
	}

	const data = validation.data;

	try {
		const [updated] = await db
			.update(schema.lokasiKolam)
			.set({
				nama_pokdakan: data.nama_pokdakan,
				pemilik: data.pemilik,
				kecamatan: data.kecamatan,
				desa: data.desa,
				titik_koordinat: data.titik_koordinat || null,
				komoditas_ikan: data.komoditas_ikan || null
			})
			.where(eq(schema.lokasiKolam.id, id))
			.returning();

		revalidatePath('/lokasi-kolam');
		revalidatePath('/uji-kualitas/baru');
		return { success: true, data: updated, message: 'Lokasi kolam berhasil diperbarui.' };
	} catch (error) {
		console.error('Error updateLokasiKolamAction:', error);
		return { success: false, message: 'Gagal memperbarui lokasi kolam.' };
	}
}

export async function toggleLokasiKolamAction(id: string, aktif: boolean) {
	try {
		await db.update(schema.lokasiKolam).set({ aktif }).where(eq(schema.lokasiKolam.id, id));

		revalidatePath('/lokasi-kolam');
		revalidatePath('/uji-kualitas/baru');
		return {
			success: true,
			message: aktif ? 'Lokasi kolam diaktifkan kembali.' : 'Lokasi kolam dinonaktifkan.'
		};
	} catch (error) {
		console.error('Error toggleLokasiKolamAction:', error);
		return { success: false, message: 'Gagal mengubah status lokasi kolam.' };
	}
}

export async function deleteLokasiKolamAction(id: string) {
	try {
		await db.delete(schema.lokasiKolam).where(eq(schema.lokasiKolam.id, id));
		revalidatePath('/lokasi-kolam');
		revalidatePath('/uji-kualitas/baru');
		return { success: true, message: 'Lokasi kolam berhasil dihapus.' };
	} catch (error) {
		console.error('Error deleteLokasiKolamAction:', error);
		return {
			success: false,
			message: 'Gagal menghapus lokasi kolam (mungkin telah terkait riwayat uji air).'
		};
	}
}
