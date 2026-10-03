import { Droplets } from 'lucide-react';
import type { Metadata } from 'next';

/**
 * Konfigurasi Utama Aplikasi & Branding SIPEKA
 * Menyimpan identitas aplikasi, brand, institusi, author, logo, pejabat pengesahan, dan teks metadata
 * sehingga dapat diimpor langsung oleh layout dan komponen di seluruh aplikasi tanpa hardcoding manual.
 */
export const APP_CONFIG = {
  /** Nama singkat / akronim brand aplikasi */
  name: 'SIPEKA',

  /** Nama branding portal cloud cetak */
  cloudName: 'SIPEKA Cloud',

  /** Kepanjangan nama aplikasi */
  fullName: 'Sistem Pemantauan Kualitas Air Budidaya',

  /** Judul lengkap gabungan */
  title: 'SIPEKA — Sistem Pemantauan Kualitas Air Budidaya',

  /** Tagline resmi aplikasi */
  tagline: 'Sistem Informasi Mutu Air Budidaya Perikanan Terpadu',

  /** Deskripsi lengkap aplikasi untuk metadata SEO dan informasi sistem */
  description:
    'Sistem Pemantauan Kualitas Air Budidaya (SIPEKA) Dinas Perikanan Kabupaten Lembata. Platform digitalisasi pengujian mutu air kolam pembudidaya (Pokdakan) berbasis validasi otomatis standar SNI & Kepmen-KP, pelabelan QR Code terintegrasi, dan penerbitan Lembar Hasil Uji (LHU) resmi.',

  /** Deskripsi singkat aplikasi */
  shortDescription: 'Dinas Perikanan Kabupaten Lembata',

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
    emailDomain: 'sipeka.lembata.go.id',
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
    copyrightText: '© 2026 Dinas Perikanan Kabupaten Lembata',
  },

  /** Referensi visual brand dan logo aplikasi serta pemerintah daerah */
  logo: {
    app: '/images/app-logo.png',
    kabupaten: '/images/lembata-kab.webp',
    garuda: '/images/garuda.png',
    Icon: Droplets,
    iconName: 'Droplets',
  },
} as const;

/**
 * Metadata standar Next.js untuk Root Layout dan SEO
 */
export const SITE_METADATA: Metadata = {
  title: {
    default: APP_CONFIG.title,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  applicationName: APP_CONFIG.name,
  authors: [{ name: APP_CONFIG.author.name }],
  creator: APP_CONFIG.author.name,
  publisher: APP_CONFIG.institution.name,
  keywords: [
    'SIPEKA',
    'Kualitas Air Budidaya',
    'Dinas Perikanan Lembata',
    'Pokdakan Lembata',
    'Pengujian Mutu Air',
    'Baku Mutu Air Perikanan',
    'LHU Mutu Air',
    'Kabupaten Lembata',
  ],
};

// Ekspor alias praktis untuk kemudahan impor langsung
export const APP_NAME = APP_CONFIG.name;
export const APP_CLOUD_NAME = APP_CONFIG.cloudName;
export const APP_FULL_NAME = APP_CONFIG.fullName;
export const APP_TITLE = APP_CONFIG.title;
export const APP_TAGLINE = APP_CONFIG.tagline;
export const APP_VERSION = APP_CONFIG.version;
export const APP_VERSION_LABEL = APP_CONFIG.versionLabel;
export const APP_DESCRIPTION = APP_CONFIG.description;
export const APP_INSTITUTION = APP_CONFIG.institution;
export const APP_AUTHOR = APP_CONFIG.author;
export const APP_LOGO = APP_CONFIG.logo;
export const LOGO_APP = APP_CONFIG.logo.app;
export const LOGO_KAB_LEMBATA = APP_CONFIG.logo.kabupaten;
export const LOGO_GARUDA = APP_CONFIG.logo.garuda;

