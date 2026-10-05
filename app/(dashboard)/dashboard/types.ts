export type RecentUjiItem = {
	id: string;
	nomor_sampel: string;
	tanggal_pengambilan: Date | string;
	kesimpulan: string | null;
	lokasi?: { nama_pokdakan: string; kecamatan: string } | null;
};

export type MasterBakuMutuItem = {
	id: string;
	parameter: string;
	satuan: string;
	nilai_min: string | null;
	nilai_max: string | null;
	aktif?: boolean;
};

export type DashboardKpiProps = {
	complianceRate: number;
	normalCount: number;
	totalUjiCount: number;
	criticalCount: number;
	warningCount: number;
	totalPokdakan: number;
	totalIk: number;
};
