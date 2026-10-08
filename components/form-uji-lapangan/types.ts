import type { LokasiItem } from '@/components/quick-add-lokasi-dialog';
import type { StatusKelayakan } from '@/lib/validasi-baku-mutu';

export type IKItem = {
	id: string;
	kode_ik: string;
	judul: string;
	kategori?: string | null;
	kategoriDokumen?: { kode_kategori: string; nama_kategori: string; tingkatan?: number } | null;
	parameter_uji?: string | null;
	metode_pengujian?: string | null;
	file_path?: string | null;
};

export type BakuMutuItem = {
	id: string;
	parameter: string;
	satuan: string;
	nilai_min: string | null;
	nilai_max: string | null;
	nomor_regulasi: string;
	dasar_regulasi?: string | null;
	tipe_ambang_batas?: string | null;
	deviasi_toleransi?: string | null;
	aktif: boolean;
};

export type PegawaiItem = {
	id: string;
	nip: string;
	nama: string;
	jabatan: string;
	pangkat_golongan?: string | null;
	aktif: boolean;
	peran_tanda_tangan: string;
	is_penanggungjawab?: boolean;
};

export type ParameterRow = {
	tempId: string;
	baku_mutu_id: string;
	ik_id: string; // Wajib per parameter
	nilai_hasil: string;
	is_custom_ambang: boolean;
	nilai_min_override: string;
	nilai_max_override: string;
};

export interface EvaluatedParameterRow extends ParameterRow {
	bm?: BakuMutuItem;
	ik?: IKItem;
	effectiveMin: number | null;
	effectiveMax: number | null;
	isDinamis: boolean;
	catatanAmbang: string | null;
	status: StatusKelayakan;
	isEvaluated: boolean;
}

export type OptionItem = { value: string; label: string; sublabel?: string; badge?: string };

export type ExistingUjiData = {
	id: string;
	nomor_sampel: string;
	lokasi_id: string;
	sop_id?: string | null;
	ik_id?: string | null;
	suhu_lingkungan?: number | string | null;
	tanggal_pengambilan: Date | string;
	petugas_uji: string;
	penguji_pegawai_id?: string | null;
	penandatangan_pegawai_id?: string | null;
	catatan_lapangan?: string | null;
	kesimpulan_umum?: string | null;
	saran_rekomendasi_lapangan?: string | null;
	status?: string;
	detailParameters?: {
		baku_mutu_id: string;
		ik_id?: string;
		nilai_hasil: string | number;
		nilai_min_terapkan?: string | number | null;
		nilai_max_terapkan?: string | number | null;
		catatan_ambang?: string | null;
	}[];
};

export type FormUjiLapanganProps = {
	lokasiList: LokasiItem[];
	ikList: IKItem[];
	bakuMutuList: BakuMutuItem[];
	pegawaiList?: PegawaiItem[];
	prefilledIkId?: string;
	prefilledLokasiId?: string;
	currentOfficerName?: string;
	mode?: 'create' | 'edit';
	existingUji?: ExistingUjiData;
};
