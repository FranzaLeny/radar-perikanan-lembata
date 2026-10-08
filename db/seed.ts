/** biome-ignore-all lint/suspicious/noConsole: <> */
import { hashPassword } from 'better-auth/crypto';

import { generateIkHash } from '../lib/qr';
import { db } from './index';
import {
	account,
	instruksiKerja,
	kategoriDokumenMutu,
	lokasiKolam,
	masterBakuMutu,
	masterPegawai,
	user
} from './schema';

async function seed() {
	console.log('[SIPEKA Seed] 🌊 Memulai penyemaian data awal...');

	// 0. Seed Kategori Dokumen Mutu
	console.log('[SIPEKA Seed] Menanam kategori dokumen mutu...');
	const kategoriData = [
		{
			id: '11111111-1111-1111-1111-111111111111',
			kode_kategori: 'PM',
			nama_kategori: 'Pedoman Mutu',
			deskripsi: 'Manual mutu kebijakan laboratorium dan tata kelola pengawasan perikanan',
			urutan: 1,
			aktif: true
		},
		{
			id: '22222222-2222-2222-2222-222222222222',
			kode_kategori: 'PP',
			nama_kategori: 'Prosedur Pelaksanaan',
			deskripsi: 'Prosedur pelaksanaan teknis pengawasan kolam dan lintas fungsi',
			urutan: 2,
			aktif: true
		},
		{
			id: '33333333-3333-3333-3333-333333333333',
			kode_kategori: 'SOP',
			nama_kategori: 'Standar Operasional Prosedur',
			deskripsi: 'Standar operasional prosedur rutin pengambilan sampel dan pengujian air',
			urutan: 3,
			aktif: true
		},
		{
			id: '44444444-4444-4444-4444-444444444444',
			kode_kategori: 'IK',
			nama_kategori: 'Instruksi Kerja',
			deskripsi: 'Instruksi kerja teknis operasional alat & metode pengujian spesifik per 1 parameter',
			urutan: 4,
			aktif: true
		},
		{
			id: '55555555-5555-5555-5555-555555555555',
			kode_kategori: 'FR',
			nama_kategori: 'Formulir',
			deskripsi: 'Formulir rekaman mutu, berita acara, dan lembar kerja pemeliharaan alat',
			urutan: 5,
			aktif: true
		}
	];

	for (const k of kategoriData) {
		await db.insert(kategoriDokumenMutu).values(k).onConflictDoNothing();
	}

	// 1. Seed Master Baku Mutu (PP No. 22 Tahun 2021 & SNI)
	const bakuMutuList = [
		{
			id: '871d3086-30f0-4e64-a045-7e7ff0c39ec5',
			parameter: 'Suhu',
			satuan: '°C',
			nilai_min: '28.00',
			nilai_max: '32.00',
			nomor_regulasi: 'PP No. 22/2021',
			dasar_regulasi: 'PP No. 22 Tahun 2021 Lampiran VI (Deviasi ± 2°C dari Suhu Udara Alami)',
			tipe_ambang_batas: 'deviasi_suhu_lingkungan',
			deviasi_toleransi: '2.00',
			aktif: true,
			berlaku_sejak: '2026-01-01'
		},
		{
			id: 'a4296d05-0812-4707-b4f9-27d74404e9de',
			parameter: 'pH',
			satuan: '-',
			nilai_min: '6.50',
			nilai_max: '8.50',
			nomor_regulasi: 'PP No. 22/2021',
			dasar_regulasi: 'PP No. 22 Tahun 2021 Lampiran VI',
			tipe_ambang_batas: 'tetap',
			aktif: true,
			berlaku_sejak: '2026-01-01'
		},
		{
			id: '1b554f6b-c25e-425a-b323-37948763eb81',
			parameter: 'DO (Oksigen Terlarut)',
			satuan: 'mg/L',
			nilai_min: '3.00',
			nilai_max: null,
			nomor_regulasi: 'PP No. 22/2021',
			dasar_regulasi: 'PP No. 22 Tahun 2021 Lampiran VI',
			tipe_ambang_batas: 'tetap',
			aktif: true,
			berlaku_sejak: '2026-01-01'
		},
		{
			id: '543c113e-937e-4e02-9b27-1d4bcc3080b4',
			parameter: 'Amonia (NH₃-N)',
			satuan: 'mg/L',
			nilai_min: null,
			nilai_max: '0.02',
			nomor_regulasi: 'PP No. 22/2021',
			dasar_regulasi: 'SNI Budidaya & PP 22/2021 Lampiran VI',
			tipe_ambang_batas: 'tetap',
			aktif: true,
			berlaku_sejak: '2026-01-01'
		},
		{
			id: '9f4613bf-e610-401c-a648-5f8db9f64cd1',
			parameter: 'Nitrit (NO₂-N)',
			satuan: 'mg/L',
			nilai_min: null,
			nilai_max: '0.06',
			nomor_regulasi: 'PP No. 22/2021',
			dasar_regulasi: 'SNI Budidaya & PP 22/2021 Lampiran VI',
			tipe_ambang_batas: 'tetap',
			aktif: true,
			berlaku_sejak: '2026-01-01'
		},
		{
			id: '2fa3897d-c80e-44b6-ad48-a2412059d751',
			parameter: 'Kecerahan / Turbiditas',
			satuan: 'cm',
			nilai_min: '30.00',
			nilai_max: null,
			nomor_regulasi: 'SNI Budidaya',
			dasar_regulasi: 'SNI Budidaya Perikanan Air Tawar & Payau',
			tipe_ambang_batas: 'tetap',
			aktif: true,
			berlaku_sejak: '2026-01-01'
		}
	];

	console.log('[SIPEKA Seed] Menanam 6 parameter baku mutu...');
	for (const bm of bakuMutuList) {
		await db.insert(masterBakuMutu).values(bm).onConflictDoNothing();
	}

	// 2. Seed Contoh Dokumen Mutu (SOP & IK per Parameter)
	console.log('[SIPEKA Seed] Menanam Dokumen Mutu & Instruksi Kerja per parameter...');
	const ik1Hash = generateIkHash('IK-001');
	const ik2Hash = generateIkHash('IK-002');
	const ik3Hash = generateIkHash('IK-003');
	const sop1Hash = generateIkHash('SOP-001');

	await db
		.insert(instruksiKerja)
		.values([
			{
				kode_ik: 'SOP-001',
				judul: 'SOP Pengujian Kualitas Air Kolam Budidaya Lembata',
				kategori: 'Standar Operasional Prosedur',
				kategori_id: '33333333-3333-3333-3333-333333333333',
				file_path: '/uploads/sop-001-kualitas-air.pdf',
				qr_code_hash: sop1Hash,
				versi: 1
			},
			{
				kode_ik: 'IK-001',
				judul: 'Pengukuran Suhu Air Kolam Budidaya',
				kategori: 'Instruksi Kerja',
				kategori_id: '44444444-4444-4444-4444-444444444444',
				parameter_uji: 'Suhu',
				metode_pengujian: 'SNI 06-6989.23-2005 (In-situ Thermometer)',
				file_path: '/uploads/sop-ik-001-insitu.pdf',
				qr_code_hash: ik1Hash,
				versi: 1
			},
			{
				kode_ik: 'IK-002',
				judul: 'Pengujian Derajat Keasaman (pH) Air Kolam',
				kategori: 'Instruksi Kerja',
				kategori_id: '44444444-4444-4444-4444-444444444444',
				parameter_uji: 'pH',
				metode_pengujian: 'SNI 6989.11:2019 (In-situ pH Meter)',
				file_path: '/uploads/sop-ik-002-ph.pdf',
				qr_code_hash: ik2Hash,
				versi: 1
			},
			{
				kode_ik: 'IK-003',
				judul: 'Pengujian Oksigen Terlarut (DO) Air Kolam',
				kategori: 'Instruksi Kerja',
				kategori_id: '44444444-4444-4444-4444-444444444444',
				parameter_uji: 'DO (Oksigen Terlarut)',
				metode_pengujian: 'SNI 06-6989.14-2004 (In-situ DO Meter)',
				file_path: '/uploads/sop-ik-003-do.pdf',
				qr_code_hash: ik3Hash,
				versi: 1
			}
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
				komoditas_ikan: 'Ikan Nila & Lele'
			},
			{
				nama_pokdakan: 'Pokdakan Karang Lembata Lestari',
				pemilik: 'Maria Goreti Bala',
				kecamatan: 'Ile Ape',
				desa: 'Waowala',
				titik_koordinat: '-8.31250, 123.58720',
				komoditas_ikan: 'Ikan Bandeng'
			},
			{
				nama_pokdakan: 'Pokdakan Uyelewun Jaya',
				pemilik: 'Yohanes Kopong',
				kecamatan: 'Omesuri',
				desa: 'Balauring',
				titik_koordinat: '-8.23910, 123.75420',
				komoditas_ikan: 'Ikan Kerapu & Kakap'
			}
		])
		.onConflictDoNothing();

	// 3.5 Seed Master Pegawai Dinas Perikanan Kabupaten Lembata
	console.log('[SIPEKA Seed] Menanam data master pegawai Dinas Perikanan Lembata...');
	const pegawaiList = [
		{
			nip: '197205141998031004',
			nama: 'Hadi Umar, S.Pd., MT',
			jabatan: 'Kepala Dinas Perikanan Kabupaten Lembata',
			pangkat_golongan: 'Pembina Utama Muda (IV/c)',
			peran_tanda_tangan: 'kepala_dinas',
			aktif: true
		},
		{
			nip: '199403182025062005',
			nama: 'Melania Herlinda Lete Boro, S.Si',
			jabatan: 'Pengelola Pengawasan Mutu Air',
			pangkat_golongan: 'Penata Muda (III/a)',
			peran_tanda_tangan: 'pengelola_mutu',
			aktif: true
		},
		{
			nip: '199304152020121003',
			nama: 'Markus Boli, A.Md.Pi',
			jabatan: 'Analis Akuakultur & Penguji Lapangan',
			pangkat_golongan: 'Pengatur (II/c)',
			peran_tanda_tangan: 'penguji',
			aktif: true
		},
		{
			nip: '199011022019031005',
			nama: 'Yohanes Kopong Raya, S.Kel',
			jabatan: 'Teknisi Lapangan Mutu Air',
			pangkat_golongan: 'Penata Muda (III/a)',
			peran_tanda_tangan: 'penguji',
			aktif: true
		}
	];

	for (const p of pegawaiList) {
		await db.insert(masterPegawai).values(p).onConflictDoNothing();
	}

	// 4. Seed Akun Default Sistem
	console.log('[SIPEKA Seed] Menanam akun pengguna default...');
	const usersToSeed = [
		{
			id: 'usr_admin_radar',
			name: 'Administrator Sistem',
			email: 'admin@radar.lembata.go.id',
			role: 'admin'
		},
		{
			id: 'usr_admin_01',
			name: 'Administrator Sistem',
			email: 'admin@sipeka.lembata.go.id',
			role: 'admin'
		},
		{
			id: 'usr_admin_mina',
			name: 'Administrator Sistem',
			email: 'admin@minamutu.lembata.go.id',
			role: 'admin'
		},
		{
			id: 'usr_mutu_radar',
			name: 'Melania Herlinda Lete Boro, S.Si',
			email: 'pengelola@radar.lembata.go.id',
			role: 'pengelola_mutu'
		},
		{
			id: 'usr_mutu_02',
			name: 'Melania Herlinda Lete Boro, S.Si',
			email: 'pengelola@sipeka.lembata.go.id',
			role: 'pengelola_mutu'
		},
		{
			id: 'usr_mutu_mina',
			name: 'Melania Herlinda Lete Boro, S.Si',
			email: 'pengelola@minamutu.lembata.go.id',
			role: 'pengelola_mutu'
		},
		{
			id: 'usr_petugas_radar',
			name: 'Petugas Lapangan Pengawasan Mutu',
			email: 'petugas@radar.lembata.go.id',
			role: 'petugas_lapangan'
		},
		{
			id: 'usr_petugas_01',
			name: 'Petugas Lapangan Pengawasan Mutu',
			email: 'petugas@sipeka.lembata.go.id',
			role: 'petugas_lapangan'
		},
		{
			id: 'usr_petugas_mina',
			name: 'Petugas Lapangan Pengawasan Mutu',
			email: 'petugas@minamutu.lembata.go.id',
			role: 'petugas_lapangan'
		},
		{
			id: 'usr_kadis_radar',
			name: 'Hadi Umar, S.Pd., MT',
			email: 'kadin@radar.lembata.go.id',
			role: 'kepala_dinas'
		},
		{
			id: 'usr_kadis_01',
			name: 'Hadi Umar, S.Pd., MT',
			email: 'kadin@sipeka.lembata.go.id',
			role: 'kepala_dinas'
		},
		{
			id: 'usr_kadis_mina',
			name: 'Hadi Umar, S.Pd., MT',
			email: 'kadin@minamutu.lembata.go.id',
			role: 'kepala_dinas'
		}
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
				emailVerified: true
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
				password: hashedPassword
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
