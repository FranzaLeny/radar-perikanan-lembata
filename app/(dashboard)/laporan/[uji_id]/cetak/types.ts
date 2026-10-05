import type { StatusKelayakan } from '@/lib/validasi-baku-mutu';

export interface DetailParameterUji {
  id: string;
  nilai_hasil: string;
  status_kelayakan: string | null;
  nilai_min_terapkan?: string | null;
  nilai_max_terapkan?: string | null;
  nomor_regulasi?: string | null;
  metode_pengujian?: string | null;
  bakuMutu: {
    parameter: string;
    satuan: string;
    nilai_min: string | null;
    nilai_max: string | null;
    nomor_regulasi?: string | null;
  } | null;
  ik?: {
    kode_ik: string;
    judul: string;
    metode_pengujian?: string | null;
  } | null;
}

export interface UjiCetakData {
  id: string;
  nomor_sampel: string;
  tanggal_pengambilan: Date | string;
  petugas_uji: string;
  kesimpulan: string | null;
  kesimpulan_umum?: string | null;
  saran_rekomendasi_lapangan?: string | null;
  catatan_lapangan?: string | null;
  suhu_lingkungan?: string | null;
  lokasi?: {
    nama_pokdakan: string;
    pemilik: string;
    kecamatan: string;
    desa: string;
    komoditas_ikan?: string | null;
  } | null;
  instruksiKerja?: {
    kode_ik: string;
    judul: string;
    qr_code_hash?: string | null;
  } | null;
  sop?: {
    kode_ik: string;
    judul: string;
    qr_code_hash?: string | null;
  } | null;
  pengujiPegawai?: {
    nama: string;
    nip?: string | null;
    jabatan: string;
  } | null;
  penandatanganPegawai?: {
    nama: string;
    nip?: string | null;
    jabatan: string;
    pangkat_golongan?: string | null;
  } | null;
  detailParameters: DetailParameterUji[];
}

export interface RekomendasiItem {
  parameter: string;
  saran: string;
}
