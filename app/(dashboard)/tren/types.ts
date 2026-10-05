export interface BakuMutuItem {
  id: string;
  parameter: string;
  satuan: string;
  nilai_min: string | null;
  nilai_max: string | null;
}

export interface LokasiItem {
  id: string;
  nama_pokdakan: string;
  kecamatan: string;
}

export interface UjiItem {
  id: string;
  nomor_sampel: string;
  tanggal_pengambilan: Date;
  lokasi_id: string | null;
  lokasi: {
    nama_pokdakan: string;
    kecamatan: string;
  } | null;
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
}

export interface TrenClientProps {
  bakuMutuList: BakuMutuItem[];
  lokasiList: LokasiItem[];
  ujiList: UjiItem[];
}

export interface ChartDataPoint {
  tanggal: string;
  nilai: number;
  sampel: string;
  pokdakan?: string;
}

export interface DetailRow {
  id: string;
  nomor_sampel: string;
  tanggal: string;
  pokdakan: string;
  nilai: number;
  status: string;
}
