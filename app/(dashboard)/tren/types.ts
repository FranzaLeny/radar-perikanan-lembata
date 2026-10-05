export type BakuMutuItem = {
	id: string;
	parameter: string;
	satuan: string;
	nilai_min: string | null;
	nilai_max: string | null;
};

export type LokasiItem = { id: string; nama_pokdakan: string; kecamatan: string };

export type UjiItem = {
	id: string;
	nomor_sampel: string;
	tanggal_pengambilan: Date;
	lokasi_id: string | null;
	lokasi: { nama_pokdakan: string; kecamatan: string } | null;
	detailParameters: {
		id: string;
		baku_mutu_id: string | null;
		nilai_hasil: string;
		status_kelayakan: string | null;
		bakuMutu: {
			parameter: string;
			satuan: string;
			nilai_min: string | null;
			nilai_max: string | null;
		} | null;
	}[];
};

export type TrenClientProps = {
	bakuMutuList: BakuMutuItem[];
	lokasiList: LokasiItem[];
	ujiList: UjiItem[];
};

export type ChartDataPoint = { tanggal: string; nilai: number; sampel: string; pokdakan?: string };

export type DetailRow = {
	id: string;
	nomor_sampel: string;
	tanggal: string;
	pokdakan: string;
	nilai: number;
	status: string;
};
