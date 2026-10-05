export interface UjiLaporanItem {
  id: string;
  nomor_sampel: string;
  tanggal_pengambilan: Date | string;
  petugas_uji: string;
  kesimpulan: string | null;
  status?: string;
  lokasi?: {
    nama_pokdakan: string;
    desa: string;
    kecamatan: string;
  } | null;
}

export type StatusTabType = 'all' | 'draft' | 'final' | 'arsip';

export interface LaporanTableClientProps {
  initialList: UjiLaporanItem[];
}
