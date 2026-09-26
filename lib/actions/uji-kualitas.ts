'use server';

import { db } from '@/db';
import * as schema from '@/db/schema';
import {
  inputUjiKualitasSchema,
  type InputUjiKualitas,
} from '@/lib/validations/uji-kualitas';
import {
  hitungStatusKelayakan,
  hitungKesimpulan,
  type StatusKelayakan,
} from '@/lib/validations/../validasi-baku-mutu';
import { eq, inArray, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function submitHasilUjiAction(payload: unknown) {
  // 1. Validasi Zod Server-Side (WAJIB)
  // Perhatikan: status_kelayakan dan kesimpulan TIDAK ADA di payload input dari client!
  const validation = inputUjiKualitasSchema.safeParse(payload);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Data pengujian kualitas air tidak valid.',
    };
  }

  const {
    nomor_sampel,
    lokasi_id,
    ik_id,
    tanggal_pengambilan,
    petugas_uji,
    penguji_pegawai_id,
    penandatangan_pegawai_id,
    catatan_lapangan,
    kesimpulan_umum,
    saran_rekomendasi_lapangan,
    detail_parameter,
    tipe_sop,
    sop_manual_kode,
    sop_manual_judul,
  } = validation.data;

  // 2. Buat SOP baru jika mode manual dipilih
  let effectiveIkId = ik_id || null;
  if (tipe_sop === 'manual' && sop_manual_judul) {
    const { generateIkHash } = await import('@/lib/qr');
    const kode = sop_manual_kode?.trim() || `IK-M-${Date.now().toString().slice(-4)}`;
    const qrHash = generateIkHash(kode);
    const [createdIk] = await db
      .insert(schema.instruksiKerja)
      .values({
        kode_ik: kode,
        judul: sop_manual_judul.trim(),
        kategori: 'Standar Operasional Lapangan (Manual)',
        file_path: '/uploads/sop-manual.pdf',
        qr_code_hash: qrHash,
        versi: 1,
      })
      .returning();
    if (createdIk) {
      effectiveIkId = createdIk.id;
    }
  }

  // 3. Cek nomor sampel duplikat
  const existingSampel = await db.query.ujiKualitasAir.findFirst({
    where: eq(schema.ujiKualitasAir.nomor_sampel, nomor_sampel),
  });

  if (existingSampel) {
    return {
      success: false,
      errors: { nomor_sampel: ['Nomor sampel ini sudah ada dalam sistem'] },
      message: 'Nomor sampel sudah terdaftar.',
    };
  }

  // 4. Ambil data baku mutu terkait dari database (Server Otoritatif)
  const bakuMutuIds = detail_parameter.map((d) => d.baku_mutu_id);
  const bakuMutuRecords = await db.query.masterBakuMutu.findMany({
    where: inArray(schema.masterBakuMutu.id, bakuMutuIds),
  });

  const bakuMutuMap = new Map(bakuMutuRecords.map((bm) => [bm.id, bm]));

  // 5. Hitung Status Kelayakan per Parameter secara Server-Side
  const calculatedDetails: {
    baku_mutu_id: string;
    nilai_hasil: string;
    status_kelayakan: StatusKelayakan;
  }[] = [];

  for (const item of detail_parameter) {
    const bm = bakuMutuMap.get(item.baku_mutu_id);
    const minVal = bm?.nilai_min !== null && bm?.nilai_min !== undefined ? Number(bm.nilai_min) : null;
    const maxVal = bm?.nilai_max !== null && bm?.nilai_max !== undefined ? Number(bm.nilai_max) : null;

    const status = hitungStatusKelayakan(item.nilai_hasil, minVal, maxVal);

    calculatedDetails.push({
      baku_mutu_id: item.baku_mutu_id,
      nilai_hasil: item.nilai_hasil.toString(),
      status_kelayakan: status,
    });
  }

  // 6. Hitung Kesimpulan Umum secara Server-Side
  const calculatedKesimpulan = hitungKesimpulan(
    calculatedDetails.map((d) => ({ status_kelayakan: d.status_kelayakan }))
  );

  // 7. Simpan Transaksi ke Database
  try {
    const [ujiBaru] = await db
      .insert(schema.ujiKualitasAir)
      .values({
        nomor_sampel,
        lokasi_id,
        ik_id: effectiveIkId,
        tanggal_pengambilan,
        petugas_uji,
        penguji_pegawai_id: penguji_pegawai_id || null,
        penandatangan_pegawai_id: penandatangan_pegawai_id || null,
        catatan_lapangan: catatan_lapangan || null,
        kesimpulan: calculatedKesimpulan,
        kesimpulan_umum: kesimpulan_umum || null,
        saran_rekomendasi_lapangan: saran_rekomendasi_lapangan || null,
      })
      .returning();

    // Simpan semua detail parameter
    for (const detail of calculatedDetails) {
      await db.insert(schema.detailUjiParameter).values({
        uji_id: ujiBaru.id,
        baku_mutu_id: detail.baku_mutu_id,
        nilai_hasil: detail.nilai_hasil,
        status_kelayakan: detail.status_kelayakan,
      });
    }

    revalidatePath('/uji-kualitas');
    revalidatePath('/dashboard');
    revalidatePath('/tren');

    return {
      success: true,
      data: ujiBaru,
      kesimpulan: calculatedKesimpulan,
      message: `Hasil uji sampel ${nomor_sampel} berhasil disimpan dengan kesimpulan: ${calculatedKesimpulan}.`,
    };
  } catch (error) {
    console.error('Error submitHasilUjiAction:', error);
    return {
      success: false,
      message: 'Gagal menyimpan transaksi hasil uji ke database.',
    };
  }
}
