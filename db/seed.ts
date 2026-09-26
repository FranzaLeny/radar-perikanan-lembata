import { db } from './index';
import { masterBakuMutu, instruksiKerja, lokasiKolam, masterPegawai, user, account } from './schema';
import { generateIkHash } from '../lib/qr';
import { hashPassword } from 'better-auth/crypto';

async function seed() {
  console.log('[SIPEKA Seed] 🌊 Memulai penyemaian data awal...');

  // 1. Seed Master Baku Mutu (PP No. 22 Tahun 2021)
  const bakuMutuList = [
    {
      id: '871d3086-30f0-4e64-a045-7e7ff0c39ec5',
      parameter: 'Suhu',
      satuan: '°C',
      nilai_min: '28.00',
      nilai_max: '32.00',
      dasar_regulasi: 'PP No. 22/2021 Lampiran VI (In-situ Thermometer)',
      aktif: true,
      berlaku_sejak: '2026-01-01',
    },
    {
      id: 'a4296d05-0812-4707-b4f9-27d74404e9de',
      parameter: 'pH',
      satuan: '-',
      nilai_min: '6.50',
      nilai_max: '8.50',
      dasar_regulasi: 'PP No. 22/2021 Lampiran VI (In-situ pH Meter)',
      aktif: true,
      berlaku_sejak: '2026-01-01',
    },
    {
      id: '1b554f6b-c25e-425a-b323-37948763eb81',
      parameter: 'DO (Oksigen Terlarut)',
      satuan: 'mg/L',
      nilai_min: '3.00',
      nilai_max: null,
      dasar_regulasi: 'PP No. 22/2021 Lampiran VI (In-situ DO Meter)',
      aktif: true,
      berlaku_sejak: '2026-01-01',
    },
    {
      id: '543c113e-937e-4e02-9b27-1d4bcc3080b4',
      parameter: 'Amonia (NH₃-N)',
      satuan: 'mg/L',
      nilai_min: null,
      nilai_max: '0.02',
      dasar_regulasi: 'SNI Budidaya & PP 22/2021 (Spektrofotometri)',
      aktif: true,
      berlaku_sejak: '2026-01-01',
    },
    {
      id: '9f4613bf-e610-401c-a648-5f8db9f64cd1',
      parameter: 'Nitrit (NO₂-N)',
      satuan: 'mg/L',
      nilai_min: null,
      nilai_max: '0.06',
      dasar_regulasi: 'SNI Budidaya & PP 22/2021 (Spektrofotometri)',
      aktif: true,
      berlaku_sejak: '2026-01-01',
    },
    {
      id: '2fa3897d-c80e-44b6-ad48-a2412059d751',
      parameter: 'Kecerahan / Turbiditas',
      satuan: 'cm',
      nilai_min: '30.00',
      nilai_max: null,
      dasar_regulasi: 'SNI Budidaya (Secchi Disk)',
      aktif: true,
      berlaku_sejak: '2026-01-01',
    },
  ];

  console.log('[SIPEKA Seed] Menanam 6 parameter baku mutu...');
  for (const bm of bakuMutuList) {
    await db
      .insert(masterBakuMutu)
      .values(bm)
      .onConflictDoNothing();
  }

  // 2. Seed Contoh Instruksi Kerja
  console.log('[SIPEKA Seed] Menanam contoh Instruksi Kerja (IK)...');
  const ik1Hash = generateIkHash('IK-001');
  const ik2Hash = generateIkHash('IK-002');

  await db
    .insert(instruksiKerja)
    .values([
      {
        kode_ik: 'IK-001',
        judul: 'Pengukuran Parameter In-Situ Kualitas Air Kolam (Suhu, pH, DO)',
        kategori: 'Standar Operasional In-Situ',
        file_path: '/uploads/sop-ik-001-insitu.pdf',
        qr_code_hash: ik1Hash,
        versi: 1,
      },
      {
        kode_ik: 'IK-002',
        judul: 'Prosedur Pengambilan Sampel & Uji Kimia Air (Amonia, Nitrit)',
        kategori: 'Standar Operasional Laboratorium',
        file_path: '/uploads/sop-ik-002-kimia.pdf',
        qr_code_hash: ik2Hash,
        versi: 1,
      },
    ])
    .onConflictDoNothing();

  // 3. Seed Contoh Lokasi Kolam
  console.log('[SIPEKA Seed] Menanam contoh data Pokdakan / Kolam Lembata...');
  await db
    .insert(lokasiKolam)
    .values([
      {
        nama_pokdakan: 'Pokdakan Mina Bahari Sejahtera',
        pemilik: 'Antonius Leu',
        kecamatan: 'Nubatukan',
        desa: 'Lewoleba Utara',
        titik_koordinat: '-8.36841, 123.53812',
        komoditas_ikan: 'Ikan Nila & Lele',
      },
      {
        nama_pokdakan: 'Pokdakan Karang Lembata Lestari',
        pemilik: 'Maria Goreti Bala',
        kecamatan: 'Ile Ape',
        desa: 'Waowala',
        titik_koordinat: '-8.31250, 123.58720',
        komoditas_ikan: 'Ikan Bandeng',
      },
      {
        nama_pokdakan: 'Pokdakan Uyelewun Jaya',
        pemilik: 'Yohanes Kopong',
        kecamatan: 'Omesuri',
        desa: 'Balauring',
        titik_koordinat: '-8.23910, 123.75420',
        komoditas_ikan: 'Ikan Kerapu & Kakap',
      },
    ])
    .onConflictDoNothing();

  // 3.5 Seed Master Pegawai Dinas Perikanan Kabupaten Lembata
  console.log('[SIPEKA Seed] Menanam data master pegawai Dinas Perikanan Lembata...');
  const pegawaiList = [
    {
      nip: '197205141998031004',
      nama: 'Ir. Hadi Mahmud, M.Si',
      jabatan: 'Kepala Dinas Perikanan Kabupaten Lembata',
      pangkat_golongan: 'Pembina Utama Muda (IV/c)',
      peran_tanda_tangan: 'kepala_dinas',
      aktif: true,
    },
    {
      nip: '199508122022032008',
      nama: 'Ellen Veronika Maran, S.Pi',
      jabatan: 'Pengelola Mutu Hasil Budidaya Perikanan',
      pangkat_golongan: 'Penata Muda (III/a)',
      peran_tanda_tangan: 'pengelola_mutu',
      aktif: true,
    },
    {
      nip: '199304152020121003',
      nama: 'Markus Boli, A.Md.Pi',
      jabatan: 'Analis Akuakultur & Penguji Lapangan',
      pangkat_golongan: 'Pengatur (II/c)',
      peran_tanda_tangan: 'penguji',
      aktif: true,
    },
    {
      nip: '199011022019031005',
      nama: 'Yohanes Kopong Raya, S.Kel',
      jabatan: 'Teknisi Lapangan Mutu Air',
      pangkat_golongan: 'Penata Muda (III/a)',
      peran_tanda_tangan: 'penguji',
      aktif: true,
    },
  ];

  for (const p of pegawaiList) {
    await db
      .insert(masterPegawai)
      .values(p)
      .onConflictDoNothing();
  }


  // 4. Seed Akun Default Sistem
  console.log('[SIPEKA Seed] Menanam akun pengguna default...');
  const usersToSeed = [
    {
      id: 'usr_admin_01',
      name: 'Administrator SIPEKA',
      email: 'admin@sipeka.lembata.go.id',
      role: 'admin',
    },
    {
      id: 'usr_mutu_02',
      name: 'Ellen Maran (Pengelola Mutu)',
      email: 'pengelola@sipeka.lembata.go.id',
      role: 'pengelola_mutu',
    },
    {
      id: 'usr_petugas_01',
      name: 'Petugas Lapangan Nubatukan',
      email: 'petugas@sipeka.lembata.go.id',
      role: 'petugas_lapangan',
    },
    {
      id: 'usr_kadis_01',
      name: 'Kepala Dinas Perikanan Lembata',
      email: 'kadin@sipeka.lembata.go.id',
      role: 'kepala_dinas',
    },
  ];

  for (const u of usersToSeed) {
    await db
      .insert(user)
      .values({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        banned: false,
        emailVerified: true,
      })
      .onConflictDoNothing();

    const hashedPassword = await hashPassword('password123');
    await db
      .insert(account)
      .values({
        id: `acc_${u.id}`,
        accountId: u.id,
        providerId: 'credential',
        userId: u.id,
        password: hashedPassword,
      })
      .onConflictDoNothing();
  }

  console.log('[SIPEKA Seed] ✅ Penyemaian data awal sukses!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[SIPEKA Seed] ❌ Gagal penyemaian data:', err);
  process.exit(1);
});
