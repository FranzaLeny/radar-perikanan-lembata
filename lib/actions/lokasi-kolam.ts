'use server';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { lokasiKolamSchema, type LokasiKolamInput } from '@/lib/validations/lokasi-kolam';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createLokasiKolamAction(formData: FormData | Record<string, unknown>) {
  const rawData = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

  // Validasi Zod Server-Side (WAJIB)
  const validation = lokasiKolamSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Data lokasi kolam tidak valid.',
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
        komoditas_ikan: data.komoditas_ikan || null,
      })
      .returning();

    revalidatePath('/lokasi-kolam');
    return {
      success: true,
      data: inserted,
      message: 'Lokasi kolam pembudidaya berhasil ditambahkan.',
    };
  } catch (error) {
    console.error('Error createLokasiKolamAction:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan sistem saat menyimpan lokasi kolam.',
    };
  }
}

export async function deleteLokasiKolamAction(id: string) {
  try {
    await db.delete(schema.lokasiKolam).where(eq(schema.lokasiKolam.id, id));
    revalidatePath('/lokasi-kolam');
    return { success: true, message: 'Lokasi kolam berhasil dihapus.' };
  } catch (error) {
    console.error('Error deleteLokasiKolamAction:', error);
    return {
      success: false,
      message: 'Gagal menghapus lokasi kolam (mungkin telah terkait riwayat uji air).',
    };
  }
}
