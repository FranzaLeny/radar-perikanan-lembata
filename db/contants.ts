export const KATEGORI_DATA = [
	{
		kode_kategori: 'PM',
		nama_kategori: 'Pedoman Mutu',
		deskripsi: 'Manual mutu kebijakan laboratorium dan tata kelola pengawasan perikanan (Arsip)',
		tingkatan: 1,
		aktif: true
	},
	{
		kode_kategori: 'PP',
		nama_kategori: 'Prosedur Pelaksanaan',
		deskripsi: 'Prosedur pelaksanaan teknis pengawasan kolam budidaya dan lintas fungsi (General)',
		tingkatan: 2,
		aktif: true
	},
	{
		kode_kategori: 'SOP',
		nama_kategori: 'Standar Operasional Prosedur',
		deskripsi:
			'Standar operasional prosedur rutin pengambilan sampel dan pengujian mutu air (General)',
		tingkatan: 2,
		aktif: true
	},
	{
		kode_kategori: 'IK',
		nama_kategori: 'Instruksi Kerja',
		deskripsi:
			'Instruksi kerja teknis operasional alat & metode pengujian spesifik per 1 parameter (Uji Lapangan/Lab)',
		tingkatan: 3,
		aktif: true
	},
	{
		kode_kategori: 'FR',
		nama_kategori: 'Formulir',
		deskripsi: 'Formulir rekaman mutu, berita acara, dan lembar kerja pemeliharaan alat uji (Arsip)',
		tingkatan: 4,
		aktif: true
	}
];

export const BAKU_MUTU = [
	// =========================================================================
	// 1. REGULASI: PERMEN KKP NOMOR 75/PERMEN-KP/2016 (LENGKAP AIR BUDIDAYA)
	// =========================================================================
	{
		parameter: 'Suhu (Permen KKP)',
		satuan: '°C',
		nilai_min: '28.00',
		nilai_max: '32.00',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: 28 - 32 °C)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Salinitas Air (Permen KKP)',
		satuan: 'ppt',
		nilai_min: '5.00',
		nilai_max: '40.00',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: 5 - 40 g/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'pH Air (Permen KKP)',
		satuan: '-',
		nilai_min: '7.50',
		nilai_max: '8.50',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: 7,5 - 8,5)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'DO / Oksigen Terlarut (Permen KKP)',
		satuan: 'mg/L',
		nilai_min: '3.00',
		nilai_max: null,
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: > 3,0 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Alkalinitas (Permen KKP)',
		satuan: 'mg/L',
		nilai_min: '100.00',
		nilai_max: '250.00',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: 100 - 250 ppm)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Bahan Organik Total / TOM (Permen KKP)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '55.00',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: Maks 55 - 90 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Amonia (Permen KKP)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '0.01',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: < 0,01 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Nitrit (Permen KKP)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '0.01',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: < 0,01 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Nitrat (Permen KKP)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '0.50',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: Maks 0,5 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Phosfat (Permen KKP)',
		satuan: 'mg/L',
		nilai_min: '0.10',
		nilai_max: '5.00',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: 0,1 - 5,0 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Kecerahan Air (Permen KKP)',
		satuan: 'cm',
		nilai_min: '30.00',
		nilai_max: '45.00',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: 30 - 45 cm)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'TDS / Total Padatan Terlarut (Permen KKP)',
		satuan: 'mg/L',
		nilai_min: '150.00',
		nilai_max: '200.00',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1: 150 - 200 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Hidrogen Sulfida / H₂S (Permen KKP)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '0.010',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: ≤ 0,01 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Timbal / Pb (Permen KKP)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '0.03',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: Maks 0,03 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Kadmium / Cd (Permen KKP)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '0.01',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: Maks 0,01 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Raksa / Hg (Permen KKP)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '0.002',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: Maks 0,002 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Total Vibrio (Permen KKP)',
		satuan: 'CFU/ml',
		nilai_min: null,
		nilai_max: '1000',
		nomor_regulasi: 'Permen KKP No. 75/2016',
		dasar_regulasi: 'Permen KKP No. 75/PERMEN-KP/2016 Lampiran (Tabel 1 & 2: ≤ 1x10³ CFU/ml)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},

	// =========================================================================
	// 2. REGULASI: PP NO. 22 TAHUN 2021 (KHUSUS KELAS II & III BUDIDAYA AIR)
	// =========================================================================
	{
		parameter: 'Suhu (PP 22/2021)',
		satuan: '°C',
		nilai_min: '28.00',
		nilai_max: '32.00',
		nomor_regulasi: 'PP No. 22/2021',
		dasar_regulasi: 'PP No. 22 Tahun 2021 Lampiran VI (Deviasi ± 3°C dari Suhu Udara Alami)',
		tipe_ambang_batas: 'deviasi_suhu_lingkungan',
		deviasi_toleransi: '3.00',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'pH (PP 22/2021)',
		satuan: '-',
		nilai_min: '6.00',
		nilai_max: '9.00',
		nomor_regulasi: 'PP No. 22/2021',
		dasar_regulasi: 'PP No. 22 Tahun 2021 Lampiran VI (Baku Mutu Kelas II & III: 6 - 9)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'DO / Oksigen Terlarut (PP 22/2021)',
		satuan: 'mg/L',
		nilai_min: '3.00',
		nilai_max: null,
		nomor_regulasi: 'PP No. 22/2021',
		dasar_regulasi:
			'PP No. 22 Tahun 2021 Lampiran VI (Baku Mutu Kelas II: ≥ 4 mg/L, Kelas III: ≥ 3 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Amonia (PP 22/2021)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '0.20',
		nomor_regulasi: 'PP No. 22/2021',
		dasar_regulasi: 'PP No. 22 Tahun 2021 Lampiran VI (Baku Mutu Kelas II & III: 0,2 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Nitrit (PP 22/2021)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '0.06',
		nomor_regulasi: 'PP No. 22/2021',
		dasar_regulasi: 'PP No. 22 Tahun 2021 Lampiran VI (Baku Mutu Kelas II & III: 0,06 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Nitrat (PP 22/2021)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '10.00',
		nomor_regulasi: 'PP No. 22/2021',
		dasar_regulasi:
			'PP No. 22 Tahun 2021 Lampiran VI (Baku Mutu Kelas II: 10 mg/L, Kelas III: 20 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Asam Sulfida / H₂S (PP 22/2021)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '0.002',
		nomor_regulasi: 'PP No. 22/2021',
		dasar_regulasi: 'PP No. 22 Tahun 2021 Lampiran VI (Baku Mutu Kelas II & III: 0,002 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Padatan Tersuspensi / TSS (PP 22/2021)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '50.00',
		nomor_regulasi: 'PP No. 22/2021',
		dasar_regulasi:
			'PP No. 22 Tahun 2021 Lampiran VI (Baku Mutu Kelas II: 50 mg/L, Kelas III: 100 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'BOD₅ (PP 22/2021)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '6.00',
		nomor_regulasi: 'PP No. 22/2021',
		dasar_regulasi:
			'PP No. 22 Tahun 2021 Lampiran VI (Baku Mutu Kelas II: 3 mg/L, Kelas III: 6 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'COD (PP 22/2021)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '25.00',
		nomor_regulasi: 'PP No. 22/2021',
		dasar_regulasi:
			'PP No. 22 Tahun 2021 Lampiran VI (Baku Mutu Kelas II: 25 mg/L, Kelas III: 40 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Fosfat / PO₄-P (PP 22/2021)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '0.20',
		nomor_regulasi: 'PP No. 22/2021',
		dasar_regulasi: 'PP No. 22 Tahun 2021 Lampiran VI (Baku Mutu Kelas II: 0,2 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	}
];

export const DOKUMEN_MUTU = [
	{
		kode_ik: 'SOP-001',
		judul: 'SOP Pengujian Kualitas Air Kolam Budidaya Lembata',
		kategori: 'SOP',
		file_path: '/uploads/sop-001-kualitas-air.pdf',
		versi: 1
	},
	{
		kode_ik: 'PP-001',
		judul: 'Prosedur Pelaksanaan Pengawasan Kualitas Lingkungan Budidaya Perikanan',
		kategori: 'PP',
		file_path: '/uploads/pp-001-pengawasan-kolam.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-001',
		judul: 'Pengukuran Suhu Air Kolam Budidaya In-situ',
		kategori: 'IK',
		parameter_uji: 'Suhu',
		metode_pengujian: 'SNI 06-6989.23-2005 (In-situ Thermometer)',
		file_path: '/uploads/sop-ik-001-suhu.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-002',
		judul: 'Pengujian Derajat Keasaman (pH) Air Kolam In-situ',
		kategori: 'IK',
		parameter_uji: 'pH',
		metode_pengujian: 'SNI 6989.11:2019 (In-situ pH Meter)',
		file_path: '/uploads/sop-ik-002-ph.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-003',
		judul: 'Pengujian Oksigen Terlarut (DO) Air Kolam In-situ',
		kategori: 'IK',
		parameter_uji: 'DO',
		metode_pengujian: 'SNI 06-6989.14-2004 (In-situ DO Meter)',
		file_path: '/uploads/sop-ik-003-do.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-004',
		judul: 'Pengujian Kadar Amonia Bebas (NH₃-N) Air Kolam',
		kategori: 'IK',
		parameter_uji: 'Amonia',
		metode_pengujian: 'SNI 06-6989.30-2005 (Spektrofotometri Fenat)',
		file_path: '/uploads/sop-ik-004-amonia.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-005',
		judul: 'Pengujian Kadar Nitrit (NO₂-N) Air Kolam',
		kategori: 'IK',
		parameter_uji: 'Nitrit',
		metode_pengujian: 'SNI 06-6989.9-2004 (Spektrofotometri NED Dihidroklorida)',
		file_path: '/uploads/sop-ik-005-nitrit.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-006',
		judul: 'Pengujian Kadar Nitrat (NO₃-N) Air Kolam',
		kategori: 'IK',
		parameter_uji: 'Nitrat',
		metode_pengujian: 'SNI 6989.79:2011 (Spektrofotometri Reduksi Kadmium)',
		file_path: '/uploads/sop-ik-006-nitrat.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-007',
		judul: 'Pengujian Kadar Asam Sulfida (H₂S) Air Kolam',
		kategori: 'IK',
		parameter_uji: 'Asam Sulfida',
		metode_pengujian: 'SNI 6989.70:2009 (Spektrofotometri Metilen Biru)',
		file_path: '/uploads/sop-ik-007-h2s.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-008',
		judul: 'Pengukuran Kecerahan Air Kolam Budidaya',
		kategori: 'IK',
		parameter_uji: 'Kecerahan',
		metode_pengujian: 'Metode Visual Secchi Disk (Permen KKP No. 75/2016)',
		file_path: '/uploads/sop-ik-008-kecerahan.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-009',
		judul: 'Pengukuran Salinitas Air Kolam Budidaya',
		kategori: 'IK',
		parameter_uji: 'Salinitas',
		metode_pengujian: 'Metode Refraktometer Optik / Salinometer Digital',
		file_path: '/uploads/sop-ik-009-salinitas.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-010',
		judul: 'Pengujian Alkalinitas Air Kolam Budidaya',
		kategori: 'IK',
		parameter_uji: 'Alkalinitas',
		metode_pengujian: 'SNI 06-2420-1991 (Titrasi Asidimetri)',
		file_path: '/uploads/sop-ik-010-alkalinitas.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-011',
		judul: 'Pengujian Bahan Organik Total (TOM) Air Kolam',
		kategori: 'IK',
		parameter_uji: 'Bahan Organik Total',
		metode_pengujian: 'SNI 06-6989.22-2004 (Permanganometri)',
		file_path: '/uploads/sop-ik-011-tom.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-012',
		judul: 'Pengujian Total Padatan Terlarut (TDS)',
		kategori: 'IK',
		parameter_uji: 'TDS',
		metode_pengujian: 'SNI 06-6989.27-2005 (Gravimetri / TDS Meter)',
		file_path: '/uploads/sop-ik-012-tds.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-013',
		judul: 'Pengujian Padatan Tersuspensi Total (TSS)',
		kategori: 'IK',
		parameter_uji: 'Padatan Tersuspensi',
		metode_pengujian: 'SNI 06-6989.3-2004 (Gravimetri)',
		file_path: '/uploads/sop-ik-013-tss.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-014',
		judul: 'Pengujian Kebutuhan Oksigen Biokimia (BOD₅)',
		kategori: 'IK',
		parameter_uji: 'BOD₅',
		metode_pengujian: 'SNI 6989.72:2009 (Inkubasi 5 Hari 20°C)',
		file_path: '/uploads/sop-ik-014-bod.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-015',
		judul: 'Pengujian Kebutuhan Oksigen Kimiawi (COD)',
		kategori: 'IK',
		parameter_uji: 'COD',
		metode_pengujian: 'SNI 6989.73:2019 (Refluks Tertutup Spektrofotometri)',
		file_path: '/uploads/sop-ik-015-cod.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-016',
		judul: 'Pengujian Kadar Fosfat / Ortofosfat (PO₄-P)',
		kategori: 'IK',
		parameter_uji: 'Fosfat',
		metode_pengujian: 'SNI 06-6989.31-2005 (Spektrofotometri Asam Askorbat)',
		file_path: '/uploads/sop-ik-016-fosfat.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-017',
		judul: 'Pengujian Logam Berat (Pb, Cd, Hg) Air Kolam',
		kategori: 'IK',
		parameter_uji: 'Logam Berat',
		metode_pengujian: 'SNI 6989.8:2009 (AAS / Atomic Absorption Spectroscopy)',
		file_path: '/uploads/sop-ik-017-logam-berat.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-018',
		judul: 'Pengujian Total Bakteri Vibrio sp. Air Kolam',
		kategori: 'IK',
		parameter_uji: 'Total Vibrio',
		metode_pengujian: 'SNI 01-2332.1-2006 (Metode Cawan Tuang Media TCBS)',
		file_path: '/uploads/sop-ik-018-vibrio.pdf',
		versi: 1
	},
	{
		kode_ik: 'PM-001',
		judul: 'Pedoman Mutu Kebijakan Laboratorium & Pengawasan Mutu Air Lembata',
		kategori: 'PM',
		file_path: '/uploads/pm-001-kebijakan-mutu.pdf',
		versi: 1
	},
	{
		kode_ik: 'FR-001',
		judul: 'Formulir Berita Acara Sampling & Kalibrasi Alat Lapangan',
		kategori: 'FR',
		file_path: '/uploads/fr-001-sampling-kalibrasi.pdf',
		versi: 1
	}
];

export const LOKASI_KOLAM = [
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
		komoditas_ikan: 'Ikan Bandeng & Udang'
	},
	{
		nama_pokdakan: 'Pokdakan Uyelewun Jaya',
		pemilik: 'Yohanes Kopong',
		kecamatan: 'Omesuri',
		desa: 'Balauring',
		titik_koordinat: '-8.23910, 123.75420',
		komoditas_ikan: 'Ikan Kerapu, Kakap & Udang Vaname'
	}
];

export const PEGAWAI_LIST = [
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

export const USERS_TO_SEED = [{ name: 'Admin Radar', email: 'admin@radar.com', role: 'admin' }];
