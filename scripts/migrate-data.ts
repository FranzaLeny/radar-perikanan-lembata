import { db } from '../db';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import { generateIkHash } from '../lib/qr';

async function migrateData() {
  console.log('[Migration] 🚀 Memulai migrasi data Dokumen Mutu & Baku Mutu...');

  // 1. Seed Kategori Dokumen Mutu Baku
  const kategoriList = [
    {
      kode_kategori: 'PM',
      nama_kategori: 'Pedoman Mutu',
      deskripsi: 'Manual mutu kebijakan laboratorium dan tata kelola pengawasan perikanan',
      urutan: 1,
      aktif: true,
    },
    {
      kode_kategori: 'PP',
      nama_kategori: 'Prosedur Pelaksanaan',
      deskripsi: 'Prosedur pelaksanaan teknis pengawasan kolam dan lintas fungsi',
      urutan: 2,
      aktif: true,
    },
    {
      kode_kategori: 'SOP',
      nama_kategori: 'Standar Operasional Prosedur',
      deskripsi: 'Standar operasional prosedur rutin pengambilan sampel dan pengujian air',
      urutan: 3,
      aktif: true,
    },
    {
      kode_kategori: 'IK',
      nama_kategori: 'Instruksi Kerja',
      deskripsi: 'Instruksi kerja teknis operasional alat & metode pengujian spesifik per 1 parameter',
      urutan: 4,
      aktif: true,
    },
    {
      kode_kategori: 'FR',
      nama_kategori: 'Formulir',
      deskripsi: 'Formulir rekaman mutu, berita acara, dan lembar kerja pemeliharaan alat',
      urutan: 5,
      aktif: true,
    },
  ];

  console.log('[Migration] Menyemai master kategori dokumen mutu...');
  for (const kat of kategoriList) {
    const existing = await db.query.kategoriDokumenMutu.findFirst({
      where: eq(schema.kategoriDokumenMutu.kode_kategori, kat.kode_kategori),
    });
    if (!existing) {
      await db.insert(schema.kategoriDokumenMutu).values(kat);
    }
  }

  // Ambil map kategori ID
  const allKategori = await db.query.kategoriDokumenMutu.findMany();
  const katMap = new Map(allKategori.map((k) => [k.kode_kategori, k.id]));
  const ikKategoriId = katMap.get('IK')!;
  const sopKategoriId = katMap.get('SOP')!;

  // 2. Hubungkan Dokumen Mutu eksisting ke kategori dan lengkapi atribut
  console.log('[Migration] Memperbarui dokumen mutu eksisting...');
  const existingDocs = await db.query.instruksiKerja.findMany();

  for (const doc of existingDocs) {
    if (doc.kode_ik === 'IK-001') {
      await db
        .update(schema.instruksiKerja)
        .set({
          judul: 'Pengukuran Suhu Air Kolam Budidaya (In-situ Thermometer)',
          kategori_id: ikKategoriId,
          kategori: 'Instruksi Kerja',
          parameter_uji: 'Suhu',
          metode_pengujian: 'SNI 06-6989.23-2005 (In-situ Thermometer)',
        })
        .where(eq(schema.instruksiKerja.id, doc.id));
    } else if (doc.kode_ik === 'IK-002') {
      await db
        .update(schema.instruksiKerja)
        .set({
          judul: 'Pengujian Kadar Amonia (NH₃-N) Air Kolam Budidaya',
          kategori_id: ikKategoriId,
          kategori: 'Instruksi Kerja',
          parameter_uji: 'Amonia (NH₃-N)',
          metode_pengujian: 'SNI 06-6989.30-2005 (Spektrofotometri Fenat)',
        })
        .where(eq(schema.instruksiKerja.id, doc.id));
    } else if (doc.kode_ik === 'IK-003') {
      await db
        .update(schema.instruksiKerja)
        .set({
          judul: 'Pengujian Derajat Keasaman (pH) Air Kolam Menggunakan pH Meter Digital',
          kategori_id: ikKategoriId,
          kategori: 'Instruksi Kerja',
          parameter_uji: 'pH',
          metode_pengujian: 'SNI 6989.11:2019 (In-situ pH Meter)',
        })
        .where(eq(schema.instruksiKerja.id, doc.id));
    } else if (doc.kode_ik === 'IK-004') {
      await db
        .update(schema.instruksiKerja)
        .set({
          kategori_id: sopKategoriId,
          kategori: 'SOP',
          judul: 'SOP Panduan Teknis Budidaya Ikan KKP & Monitoring Kolam',
        })
        .where(eq(schema.instruksiKerja.id, doc.id));
    } else if (!doc.kategori_id) {
      await db
        .update(schema.instruksiKerja)
        .set({
          kategori_id: doc.judul.toLowerCase().includes('sop') ? sopKategoriId : ikKategoriId,
        })
        .where(eq(schema.instruksiKerja.id, doc.id));
    }
  }

  // Tambah default IK untuk DO, Nitrit, Turbiditas jika belum ada
  const ikTambahan = [
    {
      kode_ik: 'IK-005',
      judul: 'Pengujian Oksigen Terlarut (DO) Air Kolam Menggunakan DO Meter Digital',
      kategori_id: ikKategoriId,
      kategori: 'Instruksi Kerja',
      parameter_uji: 'DO (Oksigen Terlarut)',
      metode_pengujian: 'SNI 06-6989.14-2004 (In-situ DO Meter)',
      file_path: '/uploads/ik-005-do.pdf',
    },
    {
      kode_ik: 'IK-006',
      judul: 'Pengujian Kadar Nitrit (NO₂-N) Air Kolam Budidaya',
      kategori_id: ikKategoriId,
      kategori: 'Instruksi Kerja',
      parameter_uji: 'Nitrit (NO₂-N)',
      metode_pengujian: 'SNI 06-6989.9-2004 (Spektrofotometri)',
      file_path: '/uploads/ik-006-nitrit.pdf',
    },
    {
      kode_ik: 'IK-007',
      judul: 'Pengukuran Kecerahan dan Turbiditas Air Kolam Menggunakan Secchi Disk',
      kategori_id: ikKategoriId,
      kategori: 'Instruksi Kerja',
      parameter_uji: 'Kecerahan / Turbiditas',
      metode_pengujian: 'SNI 06-6989.25-2005 (Secchi Disk)',
      file_path: '/uploads/ik-007-kecerahan.pdf',
    },
  ];

  for (const ik of ikTambahan) {
    const existing = await db.query.instruksiKerja.findFirst({
      where: eq(schema.instruksiKerja.kode_ik, ik.kode_ik),
    });
    if (!existing) {
      const qrHash = generateIkHash(ik.kode_ik);
      await db.insert(schema.instruksiKerja).values({
        ...ik,
        qr_code_hash: qrHash,
        versi: 1,
        aktif: true,
      });
    }
  }

  // 3. Perbarui Master Baku Mutu: Bersihkan metode uji dari nama regulasi & set nomor_regulasi
  console.log('[Migration] Memperbarui Master Baku Mutu (nomor regulasi & ambang dinamis)...');
  const allBM = await db.query.masterBakuMutu.findMany();

  for (const bm of allBM) {
    let nomorRegulasi = 'PP No. 22/2021';
    let dasarRegulasiBersih = bm.dasar_regulasi || '';
    let tipeAmbang = 'tetap';
    let deviasi = null;

    if (bm.parameter.toLowerCase().includes('suhu')) {
      tipeAmbang = 'deviasi_suhu_lingkungan';
      deviasi = '2.00';
      nomorRegulasi = 'PP No. 22/2021';
      dasarRegulasiBersih = 'PP No. 22 Tahun 2021 Lampiran VI (Deviasi ± 2°C dari Suhu Udara Alami)';
    } else if (bm.parameter.toLowerCase().includes('ph')) {
      nomorRegulasi = 'PP No. 22/2021';
      dasarRegulasiBersih = 'PP No. 22 Tahun 2021 Lampiran VI';
    } else if (bm.parameter.toLowerCase().includes('do') || bm.parameter.toLowerCase().includes('oksigen')) {
      nomorRegulasi = 'PP No. 22/2021';
      dasarRegulasiBersih = 'PP No. 22 Tahun 2021 Lampiran VI';
    } else if (bm.parameter.toLowerCase().includes('amonia')) {
      nomorRegulasi = 'PP No. 22/2021';
      dasarRegulasiBersih = 'SNI Budidaya & PP No. 22 Tahun 2021 Lampiran VI';
    } else if (bm.parameter.toLowerCase().includes('nitrit')) {
      nomorRegulasi = 'PP No. 22/2021';
      dasarRegulasiBersih = 'SNI Budidaya & PP No. 22 Tahun 2021 Lampiran VI';
    } else if (bm.parameter.toLowerCase().includes('kecerahan') || bm.parameter.toLowerCase().includes('turbiditas')) {
      nomorRegulasi = 'SNI Budidaya';
      dasarRegulasiBersih = 'SNI Budidaya Perikanan Air Tawar & Payau';
    } else if (bm.parameter.toLowerCase().includes('klorin')) {
      nomorRegulasi = 'PP No. 22/2021';
      dasarRegulasiBersih = 'PP No. 22 Tahun 2021 Lampiran VI';
    }

    await db
      .update(schema.masterBakuMutu)
      .set({
        nomor_regulasi: nomorRegulasi,
        dasar_regulasi: dasarRegulasiBersih,
        tipe_ambang_batas: tipeAmbang,
        deviasi_toleransi: deviasi,
      })
      .where(eq(schema.masterBakuMutu.id, bm.id));
  }

  // 4. Perbarui Detail Uji Parameter eksisting agar memiliki ik_id dan snapshot
  console.log('[Migration] Memperbarui detail uji parameter riwayat...');
  const allIK = await db.query.instruksiKerja.findMany();
  const allDetails = await db.query.detailUjiParameter.findMany({
    with: { bakuMutu: true },
  });

  for (const det of allDetails) {
    if (!det.ik_id && det.bakuMutu) {
      // Cari IK yang cocok untuk parameter ini
      const matchedIk = allIK.find((ik) => ik.parameter_uji === det.bakuMutu?.parameter) || allIK[0];
      if (matchedIk) {
        await db
          .update(schema.detailUjiParameter)
          .set({
            ik_id: matchedIk.id,
            metode_pengujian: matchedIk.metode_pengujian || 'SNI Pengujian Mutu Air',
            nomor_regulasi: det.bakuMutu.nomor_regulasi || 'PP No. 22/2021',
            nilai_min_terapkan: det.bakuMutu.nilai_min,
            nilai_max_terapkan: det.bakuMutu.nilai_max,
          })
          .where(eq(schema.detailUjiParameter.id, det.id));
      }
    }
  }

  console.log('[Migration] ✅ Sukses! Migrasi Dokumen Mutu & Baku Mutu selesai sempurna.');
  process.exit(0);
}

migrateData().catch((err) => {
  console.error('[Migration] ❌ Gagal migrasi:', err);
  process.exit(1);
});
