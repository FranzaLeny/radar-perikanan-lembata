export const KATEGORI_DATA = [
	{
		kode_kategori: 'PM',
		nama_kategori: 'Pedoman Mutu',
		deskripsi: 'Manual mutu kebijakan laboratorium dan tata kelola pengawasan perikanan',
		urutan: 1,
		aktif: true
	},
	{
		kode_kategori: 'PP',
		nama_kategori: 'Prosedur Pelaksanaan',
		deskripsi: 'Prosedur pelaksanaan teknis pengawasan kolam dan lintas fungsi',
		urutan: 2,
		aktif: true
	},
	{
		kode_kategori: 'SOP',
		nama_kategori: 'Standar Operasional Prosedur',
		deskripsi: 'Standar operasional prosedur rutin pengambilan sampel dan pengujian air',
		urutan: 3,
		aktif: true
	},
	{
		kode_kategori: 'IK',
		nama_kategori: 'Instruksi Kerja',
		deskripsi: 'Instruksi kerja teknis operasional alat & metode pengujian spesifik per 1 parameter',
		urutan: 4,
		aktif: true
	},
	{
		kode_kategori: 'FR',
		nama_kategori: 'Formulir',
		deskripsi: 'Formulir rekaman mutu, berita acara, dan lembar kerja pemeliharaan alat',
		urutan: 5,
		aktif: true
	}
];

export const BAKU_MUTU = [
	{
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

export const DOKUMEN_MUTU = [
	{
		kode_ik: 'SOP-001',
		judul: 'SOP Pengujian Kualitas Air Kolam Budidaya Lembata',
		kategori: 1,
		file_path: '/uploads/sop-001-kualitas-air.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-001',
		judul: 'Pengukuran Suhu Air Kolam Budidaya',
		kategori: 4,
		parameter_uji: 'Suhu',
		metode_pengujian: 'SNI 06-6989.23-2005 (In-situ Thermometer)',
		file_path: '/uploads/sop-ik-001-insitu.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-002',
		judul: 'Pengujian Derajat Keasaman (pH) Air Kolam',
		kategori: 4,
		parameter_uji: 'pH',
		metode_pengujian: 'SNI 6989.11:2019 (In-situ pH Meter)',
		file_path: '/uploads/sop-ik-002-ph.pdf',
		versi: 1
	},
	{
		kode_ik: 'IK-003',
		judul: 'Pengujian Oksigen Terlarut (DO) Air Kolam',
		kategori: 4,
		parameter_uji: 'DO (Oksigen Terlarut)',
		metode_pengujian: 'SNI 06-6989.14-2004 (In-situ DO Meter)',
		file_path: '/uploads/sop-ik-003-do.pdf',
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

export const USERS_TO_SEED = [
	{ name: 'Admin Test', email: 'admin@radar.test', role: 'admin' },
	{ name: 'Pengelola Mutu Test', email: 'pengelola@mutu.test', role: 'pengelola_mutu' },
	{ name: 'Petugas Lapangan Test', email: 'petugas@lapangan.test', role: 'petugas_lapangan' },
	{ name: 'Kepala Dinas Test', email: 'kadin@test.com', role: 'kepala_dinas' }
];
