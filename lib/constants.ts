import type { Metadata } from 'next';
import { Droplets } from 'lucide-react';

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
    name: 'MHLB',
    credit: 'with ❤️ by MHLB',
    shortCredit: 'with ❤️ MHLB',
    copyrightYear: 2026,
    copyrightText: '© 2026 Dinas Perikanan Kabupaten Lembata • SIPEKA',
  },

  /** Pejabat pengesahan & tanda tangan resmi dokumen LHU dan laporan */
  officials: {
    pengelola: {
      name: 'Ellen Veronika Maran, S.Pi',
      nip: '19890815 201503 2 004',
      jabatan: 'Pengelola Pengawasan Mutu Air',
    },
    kepalaDinas: {
      name: 'Ir. Hadi Mahmud, M.Si',
      nip: '19740512 200003 1 005',
      pangkat: 'Pembina Utama Muda (IV/c)',
      jabatan: 'Kepala Dinas Perikanan Kabupaten Lembata',
      lokasiTtd: 'Lewoleba',
    },
  },

  /** Referensi visual brand dan logo aplikasi */
  logo: {
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
export const APP_OFFICIALS = APP_CONFIG.officials;
export const APP_LOGO = APP_CONFIG.logo;
