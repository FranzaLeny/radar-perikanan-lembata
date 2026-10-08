import { Droplets } from 'lucide-react';
import type { Metadata } from 'next';

/**
 * Konfigurasi Utama Aplikasi & Branding SIPEKA
 * Menyimpan identitas aplikasi, brand, institusi, author, logo, pejabat pengesahan, dan teks metadata
 * sehingga dapat diimpor langsung oleh layout dan komponen di seluruh aplikasi tanpa hardcoding manual.
 */
export const APP_CONFIG = {
	/** Nama singkat / akronim brand aplikasi */
	name: 'RADAR',

	/** Nama branding portal cloud cetak */
	appName: 'RADAR Diskan Lembata',

	/** Kepanjangan nama aplikasi */
	fullName: 'Rekapitulasi dan Analisis Data Air Kolam Budidaya Perikanan Kabupaten Lembata',

	/** Judul lengkap gabungan */
	title: 'RADAR — Dinas Perikanan Kabupaten Lembata',

	/** Tagline resmi aplikasi */
	tagline: 'Satu Rekapitulasi Data, Kepastian Mutu Air Budidaya Lembata',

	/** Deskripsi lengkap aplikasi untuk metadata SEO dan informasi sistem */
	description:
		'RADAR (Rekapitulasi dan Analisis Data Air Kolam Budidaya Perikanan Kabupaten Lembata) merupakan instrumen digital terpadu yang dirancang untuk menghimpun, merekapitulasi, dan menganalisis parameter mutu air pada sentra kolam budidaya perikanan secara sistematis dan berkala. Sistem ini memadukan data pengukuran lapangan langsung dengan pengujian laboratorium—mencakup parameter kritis seperti derajat keasaman (pH), oksigen terlarut (Dissolved Oxygen), suhu, kekeruhan, serta senyawa nitrogen/amonia—ke dalam basis data terpusat. Melalui rekapitulasi yang terstruktur dan analisis tren yang akurat, RADAR berfungsi sebagai sistem peringatan dini terhadap penurunan baku mutu lingkungan budidaya sekaligus rujukan pengambilan keputusan teknis bagi Dinas Perikanan dan petambak demi menekan risiko kematian biota dan meningkatkan efisiensi panen perikanan di Kabupaten Lembata.',

	/** Deskripsi singkat aplikasi untuk media sosial dan preview link */
	shortDescription:
		'Sistem digital rekapitulasi dan analisis parameter mutu air kolam budidaya perikanan Dinas Perikanan Kabupaten Lembata.',

	/** Versi rilis aplikasi */
	version: '1.0.0',

	/** Label versi pendek */
	versionLabel: 'v1.0',

	/** Data instansi dan otoritas pengelola */
	institution: {
		government: 'Pemerintah Kabupaten Lembata',
		name: 'Dinas Perikanan Kabupaten Lembata',
		shortName: 'Dinas Perikanan Lembata',
		regency: 'Kabupaten Lembata',
		province: 'Nusa Tenggara Timur',
		country: 'Indonesia',
		email: 'perikanan@lembatakab.go.id',
		emailDomain: 'radar.lembata.go.id'
	},

	/** Data author, pengembang, dan hak cipta */
	author: {
		name: 'Melania Herlinda Lete Boro, S.Si',
		nip: '19940318 202506 2 005',
		angkatan: '353',
		nomorAbsen: '8',
		credit: 'with ❤️ by Melania Herlinda Lete Boro, S.Si',
		shortCredit: 'with ❤️ MHLB',
		copyrightYear: 2026,
		copyrightText: '© 2026 Dinas Perikanan Kabupaten Lembata'
	},

	/** Referensi visual brand dan logo aplikasi serta pemerintah daerah */
	logo: {
		app: '/images/app-logo.png',
		ogImage: '/images/og-image.jpg',
		kabupaten: '/images/lembata-kab.webp',
		garuda: '/images/garuda.png',
		Icon: Droplets,
		iconName: 'Droplets'
	}
} as const;

const getFullImageUrl = (pathname: string) => {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
	return new URL(pathname, baseUrl || 'http://localhost:3000').toString();
};

/**
 * Metadata standar Next.js untuk Root Layout dan SEO
 */
export const SITE_METADATA: Metadata = {
	title: { default: APP_CONFIG.appName, template: `%s | ${APP_CONFIG.name}` },
	description: APP_CONFIG.description,
	applicationName: APP_CONFIG.appName,
	authors: [{ name: APP_CONFIG.author.name }],
	creator: APP_CONFIG.author.name,
	publisher: APP_CONFIG.institution.name,
	keywords: [
		'RADAR',
		'Rekapitulasi dan Analisis Data Air',
		'Kualitas Air Budidaya',
		'Dinas Perikanan Lembata',
		'Pokdakan Lembata',
		'Pengujian Mutu Air',
		'Baku Mutu Air Perikanan',
		'LHU Mutu Air',
		'Kabupaten Lembata'
	],
	openGraph: {
		title: APP_CONFIG.title,
		description: APP_CONFIG.shortDescription,
		url: process.env.NEXT_PUBLIC_APP_URL,
		siteName: APP_CONFIG.appName,
		images: [
			{
				url: getFullImageUrl(APP_CONFIG.logo.ogImage),
				width: 1200,
				height: 630,
				alt: APP_CONFIG.title
			}
		],
		locale: 'id_ID',
		type: 'website'
	},
	twitter: {
		card: 'summary_large_image',
		title: APP_CONFIG.title,
		description: APP_CONFIG.shortDescription,
		images: [getFullImageUrl(APP_CONFIG.logo.ogImage)]
	}
	// applicationName: SITE_NAME,
	// icons: { icon: '/icon.png', shortcut: '/icon.png', apple: '/apple-icon.png' },
};

// Ekspor alias praktis untuk kemudahan impor langsung
export const BRAND_NAME = APP_CONFIG.name;
export const APP_NAME = APP_CONFIG.appName;
export const APP_TITLE = APP_CONFIG.title;
export const APP_TAGLINE = APP_CONFIG.tagline;
export const APP_VERSION = APP_CONFIG.version;
export const APP_VERSION_LABEL = APP_CONFIG.versionLabel;
export const APP_DESCRIPTION = APP_CONFIG.description;
export const APP_SHORT_DESCRIPTION = APP_CONFIG.shortDescription;
export const APP_INSTITUTION = APP_CONFIG.institution;
export const APP_AUTHOR = APP_CONFIG.author;
export const APP_LOGO = APP_CONFIG.logo;
export const LOGO_APP = APP_CONFIG.logo.app;
export const LOGO_KAB_LEMBATA = APP_CONFIG.logo.kabupaten;
export const LOGO_GARUDA = APP_CONFIG.logo.garuda;
