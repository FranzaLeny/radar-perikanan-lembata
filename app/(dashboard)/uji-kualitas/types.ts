export interface DetailParameterItem {
  id: string;
  nilai_hasil: string;
  status_kelayakan: string | null;
  bakuMutu: {
    parameter: string;
    satuan: string;
    nilai_min: string | null;
    nilai_max: string | null;
  } | null;
}

export interface UjiItem {
  id: string;
  nomor_sampel: string;
  tanggal_pengambilan: Date;
  petugas_uji: string;
  catatan_lapangan: string | null;
  kesimpulan: string | null;
  lokasi: {
    nama_pokdakan: string;
    pemilik: string;
    kecamatan: string;
    desa: string;
    komoditas_ikan: string | null;
  } | null;
  instruksiKerja: {
    kode_ik: string;
    judul: string;
  } | null;
  detailParameters: DetailParameterItem[];
}

export interface UjiKualitasListClientProps {
  initialList: UjiItem[];
}
