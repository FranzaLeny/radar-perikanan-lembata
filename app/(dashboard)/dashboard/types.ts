export interface RecentUjiItem {
  id: string;
  nomor_sampel: string;
  tanggal_pengambilan: Date | string;
  kesimpulan: string | null;
  lokasi?: {
    nama_pokdakan: string;
    kecamatan: string;
  } | null;
}

export interface MasterBakuMutuItem {
  id: string;
  parameter: string;
  satuan: string;
  nilai_min: string | null;
  nilai_max: string | null;
  aktif?: boolean;
}

export interface DashboardKpiProps {
  complianceRate: number;
  normalCount: number;
  totalUjiCount: number;
  criticalCount: number;
  warningCount: number;
  totalPokdakan: number;
  totalIk: number;
}
