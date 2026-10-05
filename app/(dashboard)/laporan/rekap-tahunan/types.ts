export type PokdakanData = {
	id: string;
	nama_pokdakan: string;
	pemilik: string;
	kecamatan: string;
	desa: string;
	titik_koordinat?: string | null;
	komoditas_ikan?: string | null;
	aktif?: boolean;
};

export type UjiData = {
	id: string;
	lokasi_id: string | null;
	tanggal_pengambilan: Date | string;
	kesimpulan: string | null;
};

export type PegawaiData = {
	id: string;
	nip: string;
	nama: string;
	jabatan: string;
	pangkat_golongan: string | null;
	peran_tanda_tangan: string;
	aktif: boolean;
};

export type RekapTahunanClientProps = {
	allPokdakan: PokdakanData[];
	allUji: UjiData[];
	allPegawai: PegawaiData[];
	qrDataUrl: string;
};

export type PrintSettings = {
	tahunAnggaran: number;
	filterTahun: boolean;
	tanggalTtd: string; // YYYY-MM-DD
	lokasiTtd: string;
	pengelolaId: string;
	pengelolaNama: string;
	pengelolaNip: string;
	pengelolaJabatan: string;
	kepalaDinasId: string;
	kepalaDinasNama: string;
	kepalaDinasNip: string;
	kepalaDinasJabatan: string;
};
