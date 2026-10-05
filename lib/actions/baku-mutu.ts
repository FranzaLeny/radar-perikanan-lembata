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
        parameter: data.parameter.trim(),
        satuan: data.satuan.trim(),
        nilai_min: data.nilai_min !== null && data.nilai_min !== undefined ? data.nilai_min.toString() : null,
        nilai_max: data.nilai_max !== null && data.nilai_max !== undefined ? data.nilai_max.toString() : null,
        nomor_regulasi: data.nomor_regulasi.trim(),
        dasar_regulasi: data.dasar_regulasi?.trim() || null,
        tipe_ambang_batas: data.tipe_ambang_batas || 'tetap',
        deviasi_toleransi:
          data.deviasi_toleransi !== null && data.deviasi_toleransi !== undefined
            ? data.deviasi_toleransi.toString()
            : null,
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
 * Pembaruan Berversi (Versioning) dengan Validasi Idempoten:
 * Jika tidak ada perubahan nilai min, max, satuan, atau regulasi acuan:
 * - Tidak membuat baris baru (mencegah duplikasi data karena salah klik).
 * - Jika status sebelumnya nonaktif, cukup mengaktifkan kembali yang lama.
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
    // 1. Ambil data versi lama untuk komparasi idempoten
    const existing = await db.query.masterBakuMutu.findFirst({
      where: eq(schema.masterBakuMutu.id, oldId),
    });

    if (!existing) {
      return {
        success: false,
        message: 'Data baku mutu yang akan direvisi tidak ditemukan.',
      };
    }

    // 2. Deteksi perubahan nilai secara presisi
    const isParamSame = existing.parameter.trim().toLowerCase() === data.parameter.trim().toLowerCase();
    const isSatuanSame = existing.satuan.trim().toLowerCase() === data.satuan.trim().toLowerCase();
    const isMinSame =
      (existing.nilai_min === null && data.nilai_min === null) ||
      (existing.nilai_min !== null &&
        data.nilai_min !== null &&
        Number(existing.nilai_min) === Number(data.nilai_min));
    const isMaxSame =
      (existing.nilai_max === null && data.nilai_max === null) ||
      (existing.nilai_max !== null &&
        data.nilai_max !== null &&
        Number(existing.nilai_max) === Number(data.nilai_max));
    const isNomorRegulasiSame =
      (existing.nomor_regulasi || '').trim().toLowerCase() === data.nomor_regulasi.trim().toLowerCase();
    const isDasarRegulasiSame =
      (existing.dasar_regulasi || '').trim().toLowerCase() === (data.dasar_regulasi || '').trim().toLowerCase();
    const isTipeAmbangSame = (existing.tipe_ambang_batas || 'tetap') === data.tipe_ambang_batas;
    const isDeviasiSame =
      (existing.deviasi_toleransi === null && data.deviasi_toleransi === null) ||
      (existing.deviasi_toleransi !== null &&
        data.deviasi_toleransi !== null &&
        Number(existing.deviasi_toleransi) === Number(data.deviasi_toleransi));

    const isUnchanged =
      isParamSame &&
      isSatuanSame &&
      isMinSame &&
      isMaxSame &&
      isNomorRegulasiSame &&
      isDasarRegulasiSame &&
      isTipeAmbangSame &&
      isDeviasiSame;

    if (isUnchanged) {
      // Jika statusnya sedang non-aktif, aktifkan kembali yang lama
      if (!existing.aktif) {
        await db
          .update(schema.masterBakuMutu)
          .set({ aktif: true })
          .where(eq(schema.masterBakuMutu.id, oldId));

        revalidatePath('/baku-mutu');
        revalidatePath('/uji-kualitas/input');
        return {
          success: true,
          data: { ...existing, aktif: true },
          message: `Parameter ${existing.parameter} (${existing.nomor_regulasi}) berhasil diaktifkan kembali tanpa membuat duplikat versi baru.`,
        };
      }

      // Jika data sudah aktif dan tidak ada perubahan sama sekali, tolak insert baru
      return {
        success: false,
        message:
          'Tidak ada perubahan pada nilai ambang batas (min/max), satuan, maupun regulasi acuan. Pembuatan versi baru dibatalkan untuk menghindari duplikasi data.',
      };
    }

    // 3. Ada perubahan nilai: Nonaktifkan versi lama dan buat versi baru
    await db
      .update(schema.masterBakuMutu)
      .set({ aktif: false })
      .where(eq(schema.masterBakuMutu.id, oldId));

    const today = new Date().toISOString().split('T')[0];
    const [newVersion] = await db
      .insert(schema.masterBakuMutu)
      .values({
        parameter: data.parameter.trim(),
        satuan: data.satuan.trim(),
        nilai_min: data.nilai_min !== null && data.nilai_min !== undefined ? data.nilai_min.toString() : null,
        nilai_max: data.nilai_max !== null && data.nilai_max !== undefined ? data.nilai_max.toString() : null,
        nomor_regulasi: data.nomor_regulasi.trim(),
        dasar_regulasi: data.dasar_regulasi?.trim() || null,
        tipe_ambang_batas: data.tipe_ambang_batas || 'tetap',
        deviasi_toleransi:
          data.deviasi_toleransi !== null && data.deviasi_toleransi !== undefined
            ? data.deviasi_toleransi.toString()
            : null,
        aktif: true,
        berlaku_sejak: today,
      })
      .returning();

    revalidatePath('/baku-mutu');
    revalidatePath('/uji-kualitas/input');
    return {
      success: true,
      data: newVersion,
      message: `Versi baru untuk ${data.parameter} (${data.nomor_regulasi}) berhasil diterbitkan (berlaku sejak ${today}). Rekor sebelumnya diarsipkan.`,
    };
  } catch (error) {
    console.error('Error updateBakuMutuVersionedAction:', error);
    return {
      success: false,
      message: 'Gagal memperbarui versi baku mutu.',
    };
  }
}

export async function toggleBakuMutuAction(id: string, aktif: boolean) {
  try {
    await db
      .update(schema.masterBakuMutu)
      .set({ aktif })
      .where(eq(schema.masterBakuMutu.id, id));

    revalidatePath('/baku-mutu');
    revalidatePath('/uji-kualitas/input');
    return {
      success: true,
      message: aktif
        ? 'Parameter baku mutu diaktifkan kembali.'
        : 'Parameter baku mutu dinonaktifkan.',
    };
  } catch (error) {
    console.error('Error toggleBakuMutuAction:', error);
    return {
      success: false,
      message: 'Gagal mengubah status parameter baku mutu.',
    };
  }
}

export async function deleteBakuMutuAction(id: string) {
  try {
    // 1. Cek apakah ada data pengujian yang mereferensi baku mutu ini
    const [usage] = await db
      .select({ count: schema.detailUjiParameter.id })
      .from(schema.detailUjiParameter)
      .where(eq(schema.detailUjiParameter.baku_mutu_id, id))
      .limit(1);

    if (usage) {
      return {
        success: false,
        message:
          'Tidak dapat dihapus: parameter ini sudah digunakan pada data pengujian kualitas air. Nonaktifkan saja jika tidak ingin dipakai lagi.',
      };
    }

    // 2. Aman untuk dihapus (tidak ada relasi)
    await db
      .delete(schema.masterBakuMutu)
      .where(eq(schema.masterBakuMutu.id, id));

    revalidatePath('/baku-mutu');
    revalidatePath('/uji-kualitas/input');
    return {
      success: true,
      message: 'Parameter baku mutu berhasil dihapus permanen.',
    };
  } catch (error) {
    console.error('Error deleteBakuMutuAction:', error);
    return {
      success: false,
      message: 'Gagal menghapus parameter baku mutu.',
    };
  }
}
