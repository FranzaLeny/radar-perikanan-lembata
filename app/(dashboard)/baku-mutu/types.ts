export type BakuMutuItem = {
	id: string;
	parameter: string;
	satuan: string;
	nilai_min: string | null;
	nilai_max: string | null;
	nomor_regulasi: string;
	dasar_regulasi: string | null;
	tipe_ambang_batas: string;
	deviasi_toleransi: string | null;
	aktif: boolean;
	berlaku_sejak: string;
};

export type FilterTab = 'all' | 'active' | 'archived';
