'use server';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { instruksiKerjaSchema, type InstruksiKerjaInput } from '@/lib/validations/instruksi-kerja';
import { generateIkHash } from '@/lib/qr';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createInstruksiKerjaAction(formData: FormData | Record<string, unknown>) {
  const rawData = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

  // 1. Validasi Zod Server-Side (WAJIB)
  const validation = instruksiKerjaSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Data Instruksi Kerja tidak valid.',
    };
  }

  const { kode_ik, judul, kategori, file_path, versi } = validation.data;

  // Cek duplikasi kode_ik
  const existing = await db.query.instruksiKerja.findFirst({
    where: eq(schema.instruksiKerja.kode_ik, kode_ik),
  });

  if (existing) {
    return {
      success: false,
      errors: { kode_ik: ['Kode IK ini sudah terdaftar dalam sistem'] },
      message: 'Kode IK sudah terdaftar.',
    };
  }

  // Generate QR code hash unik
  const qrHash = generateIkHash(kode_ik);

  try {
    const [inserted] = await db
      .insert(schema.instruksiKerja)
      .values({
        kode_ik,
        judul,
        kategori: kategori || null,
        file_path,
        qr_code_hash: qrHash,
        versi: versi || 1,
      })
      .returning();

    revalidatePath('/instruksi-kerja');
    return {
      success: true,
      data: inserted,
      message: 'Instruksi Kerja dan QR Code berhasil dibuat.',
    };
  } catch (error) {
    console.error('Error createInstruksiKerjaAction:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan sistem saat menyimpan Instruksi Kerja.',
    };
  }
}

export async function updateInstruksiKerjaAction(
  id: string,
  formData: {
    judul: string;
    kategori?: string;
    file_path: string;
  }
) {
  if (!id || !formData.judul?.trim() || !formData.file_path?.trim()) {
    return { success: false, message: 'Judul dan Tautan / File Dokumen wajib diisi.' };
  }

  try {
    const existing = await db.query.instruksiKerja.findFirst({
      where: eq(schema.instruksiKerja.id, id),
    });

    if (!existing) {
      return { success: false, message: 'Dokumen Instruksi Kerja tidak ditemukan.' };
    }

    // PENTING: qr_code_hash TIDAK DIUBAH agar stiker QR fisik yang tertempel di kolam tetap valid!
    const newVersion = (existing.versi || 1) + 1;

    const [updated] = await db
      .update(schema.instruksiKerja)
      .set({
        judul: formData.judul.trim(),
        kategori: formData.kategori?.trim() || null,
        file_path: formData.file_path.trim(),
        versi: newVersion,
      })
      .where(eq(schema.instruksiKerja.id, id))
      .returning();

    revalidatePath('/instruksi-kerja');
    revalidatePath(`/instruksi-kerja/${id}/cetak-label`);
    return {
      success: true,
      data: updated,
      message: `Dokumen berhasil diperbarui ke v${newVersion}.0 (QR Code fisik tetap aktif).`,
    };
  } catch (error) {
    console.error('Error updateInstruksiKerjaAction:', error);
    return {
      success: false,
      message: 'Gagal memperbarui Instruksi Kerja.',
    };
  }
}

export async function deleteInstruksiKerjaAction(id: string) {
  try {
    await db.delete(schema.instruksiKerja).where(eq(schema.instruksiKerja.id, id));
    revalidatePath('/instruksi-kerja');
    return { success: true, message: 'Instruksi Kerja berhasil dihapus.' };
  } catch (error) {
    console.error('Error deleteInstruksiKerjaAction:', error);
    return {
      success: false,
      message: 'Gagal menghapus Instruksi Kerja (mungkin sudah ada relasi data uji air).',
    };
  }
}
