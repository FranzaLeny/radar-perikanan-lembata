export type KategoriItem = {
	id: string;
	kode_kategori: string;
	nama_kategori: string;
	deskripsi?: string | null;
	urutan: number;
	aktif: boolean;
};

export type DokumenMutuItem = {
	id: string;
	kode_ik: string;
	judul: string;
	kategori: string | null;
	kategori_id?: string | null;
	kategoriDokumen?: KategoriItem | null;
	parameter_uji?: string | null;
	metode_pengujian?: string | null;
	deskripsi?: string | null;
	file_path: string;
	qr_code_hash: string;
	versi: number;
	aktif?: boolean;
	createdAt: Date | string;
};

export type DokumenMutuClientProps = {
	initialList: DokumenMutuItem[];
	kategoriList: KategoriItem[];
	parameterList: string[];
};
