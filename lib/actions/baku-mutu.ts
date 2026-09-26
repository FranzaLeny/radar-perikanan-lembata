'use server';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { bakuMutuSchema } from '@/lib/validations/baku-mutu';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createBakuMutuAction(formData: FormData | Record<string, unknown>) {
  const rawData = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

  const validation = bakuMutuSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Parameter baku mutu tidak valid.',
    };
  }

  const data = validation.data;

  try {
    const [inserted] = await db
      .insert(schema.masterBakuMutu)
      .values({
        parameter: data.parameter,
        satuan: data.satuan,
        nilai_min: data.nilai_min !== null && data.nilai_min !== undefined ? data.nilai_min.toString() : null,
        nilai_max: data.nilai_max !== null && data.nilai_max !== undefined ? data.nilai_max.toString() : null,
        dasar_regulasi: data.dasar_regulasi || null,
        aktif: true,
        berlaku_sejak: data.berlaku_sejak,
      })
      .returning();

    revalidatePath('/baku-mutu');
    return {
      success: true,
      data: inserted,
      message: 'Parameter baku mutu baru berhasil ditambahkan.',
    };
  } catch (error) {
    console.error('Error createBakuMutuAction:', error);
    return {
      success: false,
      message: 'Gagal menyimpan parameter baku mutu.',
    };
  }
}

/**
 * Pembaruan Berversi (Versioning):
 * Parameter lama dinonaktifkan (aktif = false), dan dibuat record baru yang aktif.
 * Ini memastikan riwayat uji kualitas air lampau tidak terdistorsi oleh ambang batas baru!
 */
export async function updateBakuMutuVersionedAction(
  oldId: string,
  formData: FormData | Record<string, unknown>
) {
  const rawData = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

  const validation = bakuMutuSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Data revisi baku mutu tidak valid.',
    };
  }

  const data = validation.data;

  try {
    // 1. Nonaktifkan versi lama
    await db
      .update(schema.masterBakuMutu)
      .set({ aktif: false })
      .where(eq(schema.masterBakuMutu.id, oldId));

    // 2. Buat versi baru yang aktif
    const today = new Date().toISOString().split('T')[0];
    const [newVersion] = await db
      .insert(schema.masterBakuMutu)
      .values({
        parameter: data.parameter,
        satuan: data.satuan,
        nilai_min: data.nilai_min !== null && data.nilai_min !== undefined ? data.nilai_min.toString() : null,
        nilai_max: data.nilai_max !== null && data.nilai_max !== undefined ? data.nilai_max.toString() : null,
        dasar_regulasi: data.dasar_regulasi || null,
        aktif: true,
        berlaku_sejak: today,
      })
      .returning();

    revalidatePath('/baku-mutu');
    return {
      success: true,
      data: newVersion,
      message: `Versi baru untuk ${data.parameter} berhasil diterbitkan (berlaku sejak ${today}). Rekord lama diarsipkan.`,
    };
  } catch (error) {
    console.error('Error updateBakuMutuVersionedAction:', error);
    return {
      success: false,
      message: 'Gagal memperbarui versi baku mutu.',
    };
  }
}
