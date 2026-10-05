export type LokasiItem = {
	id: string;
	nama_pokdakan: string;
	pemilik: string;
	kecamatan: string;
	desa: string;
	titik_koordinat: string | null;
	komoditas_ikan: string | null;
	aktif: boolean;
};

export type FilterTab = 'all' | 'active' | 'inactive';

export const KECAMATAN_LEMBATA = [
	'Nubatukan',
	'Ile Ape',
	'Ile Ape Timur',
	'Lebatukan',
	'Buyasuri',
	'Omesuri',
	'Wulandoni',
	'Atadei',
	'Nagawutung'
];
