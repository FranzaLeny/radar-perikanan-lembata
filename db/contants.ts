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
	{
		parameter: 'Suhu',
		satuan: '°C',
		nilai_min: '28.00',
		nilai_max: '32.00',
		nomor_regulasi: 'Kepmen LH 115/2003 & PP 22/2021',
		dasar_regulasi:
			'Kepmen LH No. 115/2003 Lampiran I & PP No. 22/2021 (Deviasi ± 2°C dari Suhu Udara Alami)',
		tipe_ambang_batas: 'deviasi_suhu_lingkungan',
		deviasi_toleransi: '2.00',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'pH',
		satuan: '-',
		nilai_min: '6.50',
		nilai_max: '8.50',
		nomor_regulasi: 'Kepmen LH 115/2003 & PP 22/2021',
		dasar_regulasi:
			'Kepmen LH No. 115/2003 Lampiran I (Tabel 1.2) & PP No. 22 Tahun 2021 Lampiran VI',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'DO (Oksigen Terlarut)',
		satuan: 'mg/L',
		nilai_min: '3.00',
		nilai_max: null,
		nomor_regulasi: 'Kepmen LH 115/2003 & PP 22/2021',
		dasar_regulasi:
			'Kepmen LH No. 115/2003 (DO > 3 mg/L) & PP No. 22 Tahun 2021 Lampiran VI (DO ≥ 3 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Amonia (NH₃-N)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '0.02',
		nomor_regulasi: 'Kepmen LH 115/2003 & PP 22/2021',
		dasar_regulasi: 'Kepmen LH No. 115/2003 (Tabel 1.2 Baku 0.02 mg/L) & PP No. 22/2021 Lampiran VI',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Nitrit (NO₂-N)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '0.06',
		nomor_regulasi: 'Kepmen LH 115/2003 & PP 22/2021',
		dasar_regulasi: 'Kepmen LH No. 115/2003 (Tabel 1.2 Baku 0.06 mg/L) & PP No. 22/2021 Lampiran VI',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Nitrat (NO₃-N)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '10.00',
		nomor_regulasi: 'Kepmen LH 115/2003 & PP 22/2021',
		dasar_regulasi: 'Kepmen LH No. 115/2003 & PP No. 22/2021 Lampiran VI (Baku Mutu Kelas II & III)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Asam Sulfida (H₂S)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '0.002',
		nomor_regulasi: 'Kepmen LH 115/2003 & PP 22/2021',
		dasar_regulasi: 'Kepmen LH No. 115/2003 (Tabel 1.2 Baku 0.002 mg/L) & PP No. 22/2021 Lampiran VI',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Kecerahan / Turbiditas',
		satuan: 'cm',
		nilai_min: '30.00',
		nilai_max: '45.00',
		nomor_regulasi: 'SNI Budidaya & Kepmen LH 115/2003',
		dasar_regulasi:
			'SNI 01-6141 & SNI 7545.1 Budidaya Air Tawar/Payau (Kedalaman Secchi Disk 30 - 45 cm)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Padatan Tersuspensi Total (TSS)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '50.00',
		nomor_regulasi: 'Kepmen LH 115/2003 & PP 22/2021',
		dasar_regulasi: 'Kepmen LH No. 115/2003 Lampiran II & PP No. 22/2021 Lampiran VI (Maks 50 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'BOD₅ (Kebutuhan Oksigen Biokimia)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '6.00',
		nomor_regulasi: 'Kepmen LH 115/2003 & PP 22/2021',
		dasar_regulasi: 'Kepmen LH No. 115/2003 & PP No. 22/2021 Lampiran VI (Kelas II & III Perikanan)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'COD (Kebutuhan Oksigen Kimiawi)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '25.00',
		nomor_regulasi: 'Kepmen LH 115/2003 & PP 22/2021',
		dasar_regulasi: 'Kepmen LH No. 115/2003 & PP No. 22/2021 Lampiran VI (Maks 25 - 50 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Fosfat / Ortofosfat (PO₄-P)',
		satuan: 'mg/L',
		nilai_min: null,
		nilai_max: '0.20',
		nomor_regulasi: 'Kepmen LH 115/2003 & PP 22/2021',
		dasar_regulasi: 'Kepmen LH No. 115/2003 & PP No. 22/2021 Lampiran VI (Maks 0,2 mg/L)',
		tipe_ambang_batas: 'tetap',
		aktif: true,
		berlaku_sejak: '2026-01-01'
	},
	{
		parameter: 'Salinitas Air',
		satuan: 'ppt',
		nilai_min: '0.00',
		nilai_max: '15.00',
		nomor_regulasi: 'SNI Budidaya Perikanan',
		dasar_regulasi: 'Standar Budidaya Ikan Air Tawar & Payau Lembata (Rentang Optimal 0 - 15 ppt)',
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
		parameter_uji: 'DO (Oksigen Terlarut)',
		metode_pengujian: 'SNI 06-6989.14-2004 (In-situ DO Meter)',
		file_path: '/uploads/sop-ik-003-do.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-004',
		judul: 'Pengujian Kadar Amonia Bebas (NH₃-N) Air Kolam',
		kategori: 'IK',
		parameter_uji: 'Amonia (NH₃-N)',
		metode_pengujian: 'SNI 06-6989.30-2005 (Spektrofotometri Fenat)',
		file_path: '/uploads/sop-ik-004-amonia.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-005',
		judul: 'Pengujian Kadar Nitrit (NO₂-N) Air Kolam',
		kategori: 'IK',
		parameter_uji: 'Nitrit (NO₂-N)',
		metode_pengujian: 'SNI 06-6989.9-2004 (Spektrofotometri NED Dihidroklorida)',
		file_path: '/uploads/sop-ik-005-nitrit.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-006',
		judul: 'Pengujian Kadar Nitrat (NO₃-N) Air Kolam',
		kategori: 'IK',
		parameter_uji: 'Nitrat (NO₃-N)',
		metode_pengujian: 'SNI 6989.79:2011 (Spektrofotometri Reduksi Kadmium)',
		file_path: '/uploads/sop-ik-006-nitrat.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-007',
		judul: 'Pengujian Kadar Asam Sulfida (H₂S) Air Kolam',
		kategori: 'IK',
		parameter_uji: 'Asam Sulfida (H₂S)',
		metode_pengujian: 'SNI 6989.70:2009 (Spektrofotometri Metilen Biru)',
		file_path: '/uploads/sop-ik-007-h2s.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-008',
		judul: 'Pengukuran Kecerahan Air Kolam Budidaya',
		kategori: 'IK',
		parameter_uji: 'Kecerahan / Turbiditas',
		metode_pengujian: 'Metode Visual Secchi Disk (SNI Budidaya Perikanan)',
		file_path: '/uploads/sop-ik-008-kecerahan.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-009',
		judul: 'Pengujian Padatan Tersuspensi Total (TSS)',
		kategori: 'IK',
		parameter_uji: 'Padatan Tersuspensi Total (TSS)',
		metode_pengujian: 'SNI 06-6989.3-2004 (Gravimetri)',
		file_path: '/uploads/sop-ik-009-tss.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-010',
		judul: 'Pengujian Kebutuhan Oksigen Biokimia (BOD₅)',
		kategori: 'IK',
		parameter_uji: 'BOD₅ (Kebutuhan Oksigen Biokimia)',
		metode_pengujian: 'SNI 6989.72:2009 (Inkubasi 5 Hari 20°C)',
		file_path: '/uploads/sop-ik-010-bod.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-011',
		judul: 'Pengujian Kebutuhan Oksigen Kimiawi (COD)',
		kategori: 'IK',
		parameter_uji: 'COD (Kebutuhan Oksigen Kimiawi)',
		metode_pengujian: 'SNI 6989.73:2019 (Refluks Tertutup Spektrofotometri)',
		file_path: '/uploads/sop-ik-011-cod.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-012',
		judul: 'Pengujian Kadar Fosfat / Ortofosfat (PO₄-P)',
		kategori: 'IK',
		parameter_uji: 'Fosfat / Ortofosfat (PO₄-P)',
		metode_pengujian: 'SNI 06-6989.31-2005 (Spektrofotometri Asam Askorbat)',
		file_path: '/uploads/sop-ik-012-fosfat.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-013',
		judul: 'Pengukuran Salinitas Air Kolam Budidaya',
		kategori: 'IK',
		parameter_uji: 'Salinitas Air',
		metode_pengujian: 'Metode Refraktometer Optik / Salinometer Digital',
		file_path: '/uploads/sop-ik-013-salinitas.pdf',
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
