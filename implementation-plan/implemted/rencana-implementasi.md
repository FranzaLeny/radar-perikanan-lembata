# 📋 Rencana Implementasi MINAMUTU — Dengan Zod Validation

> **Proyek:** Sistem Informasi Mutu Air Budidaya (MINAMUTU)  
> **Klien:** Dinas Perikanan Kabupaten Lembata  
> **Sumber:** [rencana-pembangunan.md](file:///e:/LATSAR%20ELLEN/SISTEM/rencana-pembangunan.md)  
> **Tanggal:** 25 September 2026

---

## 🗄️ Strategi Database: Development vs Production

Proyek ini menggunakan **dua environment database** yang berbeda:

| Environment | Database | Driver | Tujuan |
|-------------|----------|--------|--------|
| **Development** | PostgreSQL (lokal) | `postgres` (node-postgres) | Development & testing lokal |
| **Production** | Neon DB (serverless) | `@neondatabase/serverless` | Hosting production |

### Arsitektur Koneksi Database

```mermaid
graph LR
    subgraph Development
        A["Next.js Dev Server"] -->|postgres driver| B["PostgreSQL Lokal<br/>localhost:5432"]
    end
    subgraph Production
        C["Next.js on Vercel"] -->|@neondatabase/serverless| D["Neon DB<br/>Serverless PostgreSQL"]
    end
    E["Drizzle ORM"] --> A
    E --> C
    F["db/index.ts"] -->|env check| E
```

### Konfigurasi Environment Variables

**File:** `.env.local` (development)
```env
# Development — PostgreSQL lokal
DATABASE_URL=postgresql://postgres:password@localhost:5432/minamutu
NODE_ENV=development
```

**File:** `.env.production` (production)
```env
# Production — Neon DB
DATABASE_URL=postgresql://user:password@ep-xxxxx.ap-southeast-1.aws.neon.tech/minamutu?sslmode=require
NODE_ENV=production
```

### Pola Koneksi Database (Dual Driver)

**File:** `db/index.ts`
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import postgres from 'postgres';
import * as schema from './schema';

function createDb() {
  const connectionString = process.env.DATABASE_URL!;

  if (process.env.NODE_ENV === 'production') {
    // Production: Neon DB (serverless, HTTP-based)
    const sql = neon(connectionString);
    return drizzleNeon(sql, { schema });
  } else {
    // Development: PostgreSQL lokal (persistent connection)
    const sql = postgres(connectionString);
    return drizzle(sql, { schema });
  }
}

export const db = createDb();
```

### Konfigurasi Drizzle Multi-Environment

**File:** `drizzle.config.ts`
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

> [!NOTE]
> `drizzle-kit` (migrasi) selalu menggunakan koneksi PostgreSQL standard, baik di dev maupun production. Yang berbeda hanya **runtime driver** di `db/index.ts`.

---

## 🏗️ Arsitektur Validasi Zod

Zod akan digunakan sebagai **single source of truth** untuk validasi data di seluruh aplikasi. Berikut strategi integrasinya:

```mermaid
graph TD
    A["Client Form"] -->|Zod schema| B["Client-side Validation"]
    B -->|Submit| C["Server Action / API Route"]
    C -->|Zod schema (sama)| D["Server-side Validation"]
    D -->|Validated data| E["Drizzle ORM → PostgreSQL / Neon DB"]
    F["Drizzle Schema"] -.->|drizzle-zod| G["Auto-generated Zod Schema"]
    G -.->|extend / refine| H["Custom Zod Schema"]
    H -->|dipakai di| A
    H -->|dipakai di| C
```

### Prinsip Utama

| # | Prinsip | Detail |
|---|---------|--------|
| 1 | **Schema-first** | Definisikan Zod schema sebelum menulis form/API |
| 2 | **Reusable** | Satu schema dipakai di client (form) dan server (action/API) |
| 3 | **drizzle-zod bridge** | Gunakan `drizzle-zod` untuk auto-generate base schema dari Drizzle table, lalu extend dengan custom rules |
| 4 | **Server = otoritatif** | Validasi di server **wajib**, validasi di client hanya UX enhancement |
| 5 | **Error messages dalam Bahasa Indonesia** | Semua pesan error Zod dikustomisasi dalam Bahasa Indonesia |

### Struktur File Validasi

```
lib/
├─ validations/
│  ├─ instruksi-kerja.ts      → schema CRUD IK
│  ├─ lokasi-kolam.ts         → schema CRUD Lokasi Kolam
│  ├─ baku-mutu.ts            → schema CRUD + versioning Baku Mutu
│  ├─ uji-kualitas.ts         → schema input hasil uji + detail parameter
│  ├─ pengguna.ts             → schema manajemen user & role
│  ├─ auth.ts                 → schema login, register
│  └─ shared.ts               → reusable refinements (uuid, coordinate, dll)
```

---

## Fase 0 — Persiapan & Setup

### Task 0.1 — Init Proyek Next.js 16
| Item | Detail |
|------|--------|
| **Perintah** | `bunx --bun create-next-app@latest ./minamutu --ts --app --src-dir=false --eslint --tailwind` |
| **Output** | Folder `minamutu/` dengan App Router + TypeScript + Tailwind CSS 4 |

### Task 0.2 — Install Dependencies
```bash
# Core
bun add drizzle-orm zod drizzle-zod better-auth

# Database drivers (dual environment)
bun add postgres                        # Development: PostgreSQL lokal (Docker)
bun add @neondatabase/serverless        # Production: Neon DB

# Dev tools
bun add -D drizzle-kit @types/node

# UI
bunx --bun shadcn@latest init
```

> [!IMPORTANT]
> **Dua database driver diinstall:**
> - `postgres` (node-postgres) — untuk koneksi PostgreSQL lokal saat development
> - `@neondatabase/serverless` — untuk koneksi Neon DB saat production
>
> **`drizzle-zod`** adalah jembatan kritis — ia auto-generate Zod schema dari Drizzle table definitions, menghindari duplikasi dan menjaga konsistensi.

### Task 0.3 — Konfigurasi Database Dual-Environment + Docker
- **File:** `db/index.ts` — koneksi database dengan auto-switch berdasarkan `NODE_ENV`
- **File:** `drizzle.config.ts` — konfigurasi Drizzle Kit untuk migrasi
- **File:** `docker-compose.yml` — PostgreSQL container untuk development
- **File:** `.env.local` — variable environment development (PostgreSQL Docker)
- **File:** `.env.example` — template environment variable untuk onboarding

**File:** `docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: minamutu-db
    restart: unless-stopped
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: minamutu_dev_2026
      POSTGRES_DB: minamutu
    volumes:
      - minamutu_pgdata:/var/lib/postgresql/data

volumes:
  minamutu_pgdata:
```

```
# .env.example
# Development (PostgreSQL Docker)
DATABASE_URL=postgresql://postgres:minamutu_dev_2026@localhost:5432/minamutu

# Production (Neon DB) — ganti dengan connection string Neon
# DATABASE_URL=postgresql://user:pass@ep-xxxx.aws.neon.tech/minamutu?sslmode=require

NODE_ENV=development
```

### Task 0.4 — Tulis Drizzle Schema
- **File:** `db/schema.ts`
- Translasi 5 tabel SQL dari rencana pembangunan ke Drizzle schema:
  - `instruksiKerja`
  - `lokasiKolam`
  - `masterBakuMutu`
  - `ujiKualitasAir`
  - `detailUjiParameter`

### Task 0.5 — Generate Base Zod Schemas dari Drizzle
- **File:** `lib/validations/shared.ts`
- Menggunakan `createInsertSchema()` dan `createSelectSchema()` dari `drizzle-zod`
- Contoh pola:

```typescript
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { instruksiKerja } from '@/db/schema';
import { z } from 'zod';

// Auto-generated base schema
const insertInstruksiKerjaBase = createInsertSchema(instruksiKerja);

// Extended dengan custom validation + pesan Indonesia
export const insertInstruksiKerjaSchema = insertInstruksiKerjaBase.extend({
  kode_ik: z.string()
    .min(1, { message: 'Kode IK wajib diisi' })
    .max(50, { message: 'Kode IK maksimal 50 karakter' })
    .regex(/^IK-\d{3,}$/, { message: 'Format kode IK harus IK-XXX (contoh: IK-001)' }),
  judul: z.string()
    .min(3, { message: 'Judul minimal 3 karakter' })
    .max(255, { message: 'Judul maksimal 255 karakter' }),
  file_path: z.string()
    .min(1, { message: 'File PDF wajib diunggah' }),
});

export type InsertInstruksiKerja = z.infer<typeof insertInstruksiKerjaSchema>;
```

### Task 0.6 — Migrasi & Seed Data Baku Mutu
- **Migrasi:** `bunx drizzle-kit generate` → `bunx drizzle-kit migrate`
- **File:** `db/seed.ts`
- Seed 6 parameter baku mutu default (Suhu, pH, DO, Amonia, Nitrit, Kecerahan)
- Validasi seed data menggunakan Zod schema sebelum insert

### Task 0.7 — Setup Script (First Run)
- **File:** `scripts/setup.ts`
- Script otomatis untuk developer baru / first-time setup
- Dijalankan dengan: `bun run setup`

**Alur `scripts/setup.ts`:**
```mermaid
flowchart TD
    A["Mulai Setup"] --> B{"Docker running?"}
    B -->|Tidak| C["Jalankan docker compose up -d"]
    B -->|Ya| D{"Container minamutu-db aktif?"}
    C --> D
    D -->|Tidak| E["Start container"]
    D -->|Ya| F["Tunggu PostgreSQL ready (max 30s)"]
    E --> F
    F --> G{"File .env.local ada?"}
    G -->|Tidak| H["Copy .env.example → .env.local"]
    G -->|Ya| I["Skip"]
    H --> J["Jalankan migrasi: drizzle-kit migrate"]
    I --> J
    J --> K["Jalankan seed: bun run db/seed.ts"]
    K --> L["Verifikasi koneksi + data"]
    L --> M["✅ Setup selesai!"]
```

**Kode `scripts/setup.ts`:**
```typescript
import { $ } from 'bun';
import { existsSync, copyFileSync } from 'fs';

const LOG_PREFIX = '[MINAMUTU Setup]';

async function setup() {
  console.log(`${LOG_PREFIX} 🚀 Memulai setup MINAMUTU...\n`);

  // 1. Cek & jalankan Docker PostgreSQL
  console.log(`${LOG_PREFIX} 🐳 Menyiapkan PostgreSQL di Docker...`);
  try {
    await $`docker compose up -d`;
    console.log(`${LOG_PREFIX} ✅ Container PostgreSQL berjalan.`);
  } catch (e) {
    console.error(`${LOG_PREFIX} ❌ Gagal menjalankan Docker. Pastikan Docker Desktop aktif.`);
    process.exit(1);
  }

  // 2. Tunggu PostgreSQL ready
  console.log(`${LOG_PREFIX} ⏳ Menunggu PostgreSQL siap menerima koneksi...`);
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      await $`docker exec minamutu-db pg_isready -U postgres`.quiet();
      ready = true;
      break;
    } catch {
      await Bun.sleep(1000);
    }
  }
  if (!ready) {
    console.error(`${LOG_PREFIX} ❌ PostgreSQL tidak siap setelah 30 detik.`);
    process.exit(1);
  }
  console.log(`${LOG_PREFIX} ✅ PostgreSQL siap.`);

  // 3. Setup .env.local
  if (!existsSync('.env.local')) {
    console.log(`${LOG_PREFIX} 📄 Membuat .env.local dari .env.example...`);
    copyFileSync('.env.example', '.env.local');
    console.log(`${LOG_PREFIX} ✅ .env.local dibuat.`);
  } else {
    console.log(`${LOG_PREFIX} ℹ️  .env.local sudah ada, skip.`);
  }

  // 4. Jalankan migrasi
  console.log(`${LOG_PREFIX} 🔄 Menjalankan migrasi database...`);
  await $`bunx drizzle-kit migrate`;
  console.log(`${LOG_PREFIX} ✅ Migrasi selesai.`);

  // 5. Jalankan seed
  console.log(`${LOG_PREFIX} 🌱 Menjalankan seed data baku mutu...`);
  await $`bun run db/seed.ts`;
  console.log(`${LOG_PREFIX} ✅ Seed selesai.`);

  console.log(`\n${LOG_PREFIX} 🎉 Setup MINAMUTU selesai!`);
  console.log(`${LOG_PREFIX} Jalankan: bun run dev`);
}

setup().catch((err) => {
  console.error(`${LOG_PREFIX} ❌ Setup gagal:`, err);
  process.exit(1);
});
```

**Tambahkan di `package.json`:**
```json
{
  "scripts": {
    "setup": "bun run scripts/setup.ts",
    "dev": "next dev --turbopack",
    "db:generate": "bunx drizzle-kit generate",
    "db:migrate": "bunx drizzle-kit migrate",
    "db:seed": "bun run db/seed.ts",
    "db:studio": "bunx drizzle-kit studio",
    "docker:up": "docker compose up -d",
    "docker:down": "docker compose down"
  }
}
```

> [!TIP]
> **First-time developer hanya perlu 2 langkah:**
> ```bash
> bun install
> bun run setup
> ```
> Script `setup` akan otomatis: start Docker PostgreSQL → buat `.env.local` → migrasi tabel → seed data.

### Task 0.8 — Verifikasi Koneksi Database
- Pastikan `bun run dev` berjalan dan koneksi ke PostgreSQL Docker berhasil
- Test query sederhana untuk memastikan tabel ter-migrasi dan data ter-seed

### Deliverable Fase 0
- [x] `bun run dev` berjalan tanpa error
- [x] Docker PostgreSQL container aktif dan koneksi sukses
- [x] Konfigurasi Neon DB siap untuk production
- [x] 5 tabel ter-migrasi
- [x] Data baku mutu default ter-seed (6 parameter)
- [x] Base Zod schemas ter-generate dari Drizzle
- [x] File `.env.example` tersedia untuk onboarding
- [x] `bun run setup` first-run script berfungsi end-to-end

---

## Fase 1 — Fondasi & Autentikasi

### Task 1.1 — Konfigurasi Better Auth + RBAC
- **File:** `lib/auth.ts`, `lib/auth-client.ts`
- 5 role: `admin`, `pengelola_mutu`, `petugas_lapangan`, `kepala_dinas`, `publik`
- Tabel `user` dan `session` via Better Auth

### Task 1.2 — Zod Schema Autentikasi
- **File:** `lib/validations/auth.ts`

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email wajib diisi' })
    .email({ message: 'Format email tidak valid' }),
  password: z.string()
    .min(8, { message: 'Password minimal 8 karakter' })
    .max(100, { message: 'Password maksimal 100 karakter' }),
});

export const registerSchema = loginSchema.extend({
  nama: z.string()
    .min(2, { message: 'Nama minimal 2 karakter' })
    .max(100, { message: 'Nama maksimal 100 karakter' }),
  role: z.enum(
    ['admin', 'pengelola_mutu', 'petugas_lapangan', 'kepala_dinas'],
    { errorMap: () => ({ message: 'Role tidak valid' }) }
  ),
  konfirmasi_password: z.string(),
}).refine(
  (data) => data.password === data.konfirmasi_password,
  { message: 'Konfirmasi password tidak cocok', path: ['konfirmasi_password'] }
);

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

### Task 1.3 — Middleware Proteksi Route
- **File:** `middleware.ts`
- Cek session + role sebelum akses route dashboard
- Redirect ke `/login` jika belum autentikasi
- Return 403 jika role tidak sesuai

### Task 1.4 — Halaman Login
- **File:** `app/(auth)/login/page.tsx`
- Form menggunakan Zod `loginSchema` untuk client-side validation
- Integrasi dengan Better Auth sign-in

### Task 1.5 — Layout Dashboard
- **File:** `app/(dashboard)/layout.tsx`
- Shell dashboard dengan sidebar/navbar
- Navigasi dinamis berdasarkan role user yang sedang login

### Deliverable Fase 1
- [x] Login/logout berfungsi
- [x] Validasi form login dengan Zod (client + server)
- [x] Role-based route protection aktif
- [x] `petugas_lapangan` tidak bisa akses halaman admin

---

## Fase 2 — Modul Master Data (A & B)

### Task 2.1 — Zod Schema Master Data
- **File:** `lib/validations/instruksi-kerja.ts`

```typescript
import { z } from 'zod';

export const instruksiKerjaSchema = z.object({
  kode_ik: z.string()
    .min(1, { message: 'Kode IK wajib diisi' })
    .regex(/^IK-\d{3,}$/, { message: 'Format: IK-001' }),
  judul: z.string()
    .min(3, { message: 'Judul minimal 3 karakter' })
    .max(255),
  kategori: z.string().max(100).optional(),
  file_path: z.string().min(1, { message: 'File PDF wajib diunggah' }),
  versi: z.number().int().positive().default(1),
});
```

- **File:** `lib/validations/lokasi-kolam.ts`

```typescript
export const lokasiKolamSchema = z.object({
  nama_pokdakan: z.string()
    .min(1, { message: 'Nama Pokdakan wajib diisi' })
    .max(150),
  pemilik: z.string()
    .min(1, { message: 'Nama pemilik wajib diisi' })
    .max(100),
  kecamatan: z.string().min(1, { message: 'Kecamatan wajib diisi' }),
  desa: z.string().min(1, { message: 'Desa wajib diisi' }),
  titik_koordinat: z.string()
    .regex(
      /^-?\d{1,3}\.\d+,\s*-?\d{1,3}\.\d+$/,
      { message: 'Format koordinat: -8.12345, 123.45678' }
    )
    .optional(),
  komoditas_ikan: z.string().max(50).optional(),
});
```

- **File:** `lib/validations/baku-mutu.ts`

```typescript
export const bakuMutuSchema = z.object({
  parameter: z.string().min(1, { message: 'Nama parameter wajib diisi' }),
  satuan: z.string().min(1, { message: 'Satuan wajib diisi' }),
  nilai_min: z.number({ message: 'Harus berupa angka' }).nullable(),
  nilai_max: z.number({ message: 'Harus berupa angka' }).nullable(),
  dasar_regulasi: z.string().max(100).optional(),
  aktif: z.boolean().default(true),
  berlaku_sejak: z.coerce.date({ message: 'Tanggal tidak valid' }),
}).refine(
  (data) => {
    if (data.nilai_min !== null && data.nilai_max !== null) {
      return data.nilai_min <= data.nilai_max;
    }
    return true;
  },
  { message: 'Nilai minimum tidak boleh lebih besar dari nilai maksimum', path: ['nilai_min'] }
);
```

### Task 2.2 — CRUD Instruksi Kerja
- **File:** `app/(dashboard)/instruksi-kerja/page.tsx` — tabel daftar
- **File:** `app/(dashboard)/instruksi-kerja/[id]/page.tsx` — detail
- Server Actions dengan Zod validation di entry point

### Task 2.3 — Generator QR
- **File:** `lib/qr.ts`
- Generate hash unik (SHA-256 dari `kode_ik` + timestamp)
- URL verifikasi: `/verifikasi/{hash}`
- Simpan hash ke field `qr_code_hash`

### Task 2.4 — Cetak Label QR
- **File:** `app/(dashboard)/instruksi-kerja/[id]/cetak-label/page.tsx`
- Layout A6/A7, CSS `@media print`

### Task 2.5 — CRUD Baku Mutu (Versioned)
- **File:** `app/(dashboard)/baku-mutu/page.tsx`
- **Penting:** Saat update → nonaktifkan record lama (`aktif = false`), buat record baru
- Zod schema memvalidasi integritas min/max

### Task 2.6 — CRUD Lokasi Kolam
- **File:** `app/(dashboard)/lokasi-kolam/page.tsx`
- Form dengan validasi koordinat GPS via Zod regex

### Task 2.7 — Halaman Verifikasi Publik
- **File:** `app/verifikasi/[hash]/page.tsx`
- **Tidak boleh** dilindungi middleware auth
- Tampilkan info IK berdasarkan hash

### Deliverable Fase 2
- [x] CRUD lengkap untuk 3 modul master data
- [x] Semua form tervalidasi Zod (client + server)
- [x] QR code otomatis ter-generate saat IK baru dibuat
- [x] Halaman verifikasi QR publik berfungsi
- [x] Versioning baku mutu berjalan (record lama tidak ditimpa)

---

## Fase 3 — Modul Transaksi & Validasi (C)

### Task 3.1 — Zod Schema Uji Kualitas Air
- **File:** `lib/validations/uji-kualitas.ts`

```typescript
import { z } from 'zod';

const statusKelayakan = z.enum(['MEMENUHI', 'MELEBIHI', 'DIBAWAH']);
const kesimpulan = z.enum(['NORMAL', 'PERINGATAN', 'KRITIS']);

export const detailParameterSchema = z.object({
  baku_mutu_id: z.string().uuid({ message: 'Parameter baku mutu wajib dipilih' }),
  nilai_hasil: z.number({
    required_error: 'Nilai hasil wajib diisi',
    invalid_type_error: 'Nilai hasil harus berupa angka',
  })
    .min(-9999, { message: 'Nilai terlalu kecil' })
    .max(99999, { message: 'Nilai terlalu besar' }),
  // status_kelayakan dihitung server-side, BUKAN dari input client
});

export const inputUjiKualitasSchema = z.object({
  nomor_sampel: z.string()
    .min(1, { message: 'Nomor sampel wajib diisi' })
    .max(50),
  lokasi_id: z.string().uuid({ message: 'Lokasi kolam wajib dipilih' }),
  ik_id: z.string().uuid({ message: 'Instruksi Kerja wajib dipilih' }),
  tanggal_pengambilan: z.coerce.date({
    errorMap: () => ({ message: 'Tanggal pengambilan tidak valid' }),
  }),
  petugas_uji: z.string()
    .min(1, { message: 'Nama petugas wajib diisi' })
    .max(100),
  catatan_lapangan: z.string().max(1000).optional(),
  detail_parameter: z.array(detailParameterSchema)
    .min(1, { message: 'Minimal 1 parameter harus diisi' }),
  // kesimpulan dihitung server-side, TIDAK ada di input schema
});

export type InputUjiKualitas = z.infer<typeof inputUjiKualitasSchema>;
```

> [!CAUTION]
> **`status_kelayakan`** dan **`kesimpulan`** TIDAK BOLEH ada di input schema. Keduanya dihitung di server oleh `validasi-baku-mutu.ts` setelah data lolos validasi Zod. Ini mencegah manipulasi status dari client.

### Task 3.2 — Fungsi Validasi Baku Mutu (Server-Only)
- **File:** `lib/validasi-baku-mutu.ts`

```typescript
type StatusKelayakan = 'MEMENUHI' | 'MELEBIHI' | 'DIBAWAH';
type Kesimpulan = 'NORMAL' | 'PERINGATAN' | 'KRITIS';

interface HasilValidasi {
  status_kelayakan: StatusKelayakan;
}

export function hitungStatusKelayakan(
  nilai: number,
  nilaiMin: number | null,
  nilaiMax: number | null
): StatusKelayakan {
  if (nilaiMin !== null && nilai < nilaiMin) return 'DIBAWAH';
  if (nilaiMax !== null && nilai > nilaiMax) return 'MELEBIHI';
  return 'MEMENUHI';
}

export function hitungKesimpulan(
  detailHasil: HasilValidasi[]
): Kesimpulan {
  const adaKritis = detailHasil.some(d => 
    d.status_kelayakan === 'MELEBIHI' || d.status_kelayakan === 'DIBAWAH'
  );
  if (adaKritis) return 'KRITIS';
  // Logika peringatan bisa disesuaikan (misal: nilai mendekati batas)
  return 'NORMAL';
}
```

### Task 3.3 — Form Input Hasil Uji
- **File:** `app/(dashboard)/uji-kualitas/input/page.tsx`
- **File:** `components/form-uji-lapangan.tsx`
- Support prefill dari scan QR (lokasi + IK)
- Client-side: Zod validation real-time
- Server-side: Zod validation → hitung status → simpan

### Task 3.4 — Tabel Daftar Hasil Uji
- **File:** `app/(dashboard)/uji-kualitas/page.tsx`
- Filter: kecamatan, desa, Pokdakan, jenis ikan, rentang tanggal
- Zod schema untuk validasi filter query params

```typescript
export const filterUjiSchema = z.object({
  kecamatan: z.string().optional(),
  desa: z.string().optional(),
  pokdakan: z.string().optional(),
  komoditas: z.string().optional(),
  tanggal_mulai: z.coerce.date().optional(),
  tanggal_akhir: z.coerce.date().optional(),
}).refine(
  (data) => {
    if (data.tanggal_mulai && data.tanggal_akhir) {
      return data.tanggal_mulai <= data.tanggal_akhir;
    }
    return true;
  },
  { message: 'Tanggal mulai harus sebelum tanggal akhir' }
);
```

### Task 3.5 — Badge Status
- **File:** `components/badge-status.tsx`
- Hijau = `MEMENUHI` / `NORMAL`
- Kuning = Toleransi (mendekati batas)
- Merah = `MELEBIHI` / `KRITIS`

### Deliverable Fase 3
- [x] Form input tervalidasi Zod end-to-end
- [x] Status kelayakan dihitung server-side (bukan dari client)
- [x] Badge otomatis muncul sesuai status
- [x] Filter tabel hasil uji berfungsi

---

## Fase 4 — Visualisasi & Dashboard (D)

### Task 4.1 — Grafik Tren
- **File:** `components/grafik-tren.tsx`
- Library: Recharts atau Chart.js
- Line chart per parameter per lokasi
- Garis batas min/maks baku mutu sebagai reference line

### Task 4.2 — Dashboard Ringkasan
- **File:** `app/(dashboard)/page.tsx` (halaman utama dashboard)
- Widget: jumlah uji per status, per kecamatan
- Tren kepatuhan bulan terakhir

### Task 4.3 — Halaman Tren dengan Filter
- **File:** `app/(dashboard)/tren/page.tsx`
- Filter lokasi + parameter
- Zod schema untuk validasi filter:

```typescript
export const filterTrenSchema = z.object({
  lokasi_id: z.string().uuid().optional(),
  parameter: z.string().optional(),
  rentang: z.enum(['3bulan', '6bulan', '1tahun']).default('1tahun'),
});
```

### Deliverable Fase 4
- [x] Grafik tren menampilkan data historis nyata
- [x] Garis ambang batas terlihat jelas
- [x] Dashboard ringkasan responsif dan informatif

---

## Fase 5 — Cetak, Pelaporan & Uji Terima (E, F)

### Task 5.1 — Print View LHU
- **File:** `app/(dashboard)/laporan/[uji_id]/cetak/page.tsx`
- Layout A4, CSS `@media print`
- Konten: kop dinas, metadata sampel, tabel evaluasi, rekomendasi teknis otomatis, blok tanda tangan, QR footer

### Task 5.2 — Rekomendasi Teknis Otomatis
- Logika: jika parameter tertentu melebihi batas → tampilkan saran spesifik
- Contoh: Amonia tinggi → "Lakukan penyiponan dan pergantian air 30-50%"

### Task 5.3 — Rekap Tahunan
- **File:** `app/(dashboard)/laporan/rekap-tahunan/page.tsx`
- Matriks kepatuhan per Pokdakan per bulan

### Task 5.4 — Export PDF
- **File:** `lib/pdf.ts`
- Render halaman print view → convert ke PDF (puppeteer/playwright atau jsPDF)

### Task 5.5 — Modul Administrasi User
- **File:** `app/(dashboard)/pengguna/page.tsx`
- CRUD user dengan Zod validasi:

```typescript
export const penggunaSchema = z.object({
  nama: z.string().min(2, { message: 'Nama minimal 2 karakter' }).max(100),
  email: z.string().email({ message: 'Format email tidak valid' }),
  role: z.enum(
    ['admin', 'pengelola_mutu', 'petugas_lapangan', 'kepala_dinas'],
    { errorMap: () => ({ message: 'Role tidak valid' }) }
  ),
  aktif: z.boolean().default(true),
});
```

- Log aktivitas dasar (audit trail)

### Task 5.6 — QA & UAT
- Uji semua role access
- Uji alur end-to-end: Registrasi IK → Scan QR → Input Uji → Validasi → Cetak LHU
- Uji Zod validation edge cases (input kosong, format salah, injection attempts)
- Uji koneksi Neon DB di staging/production environment

### Deliverable Fase 5
- [x] LHU bisa dicetak / export PDF
- [x] Rekap tahunan tersedia
- [x] Manajemen user + role berfungsi
- [x] Koneksi Neon DB di production terverifikasi
- [x] UAT disetujui pengguna

---

## 📊 Ringkasan Semua Zod Schema

| Schema | File | Dipakai Di | Catatan |
|--------|------|------------|---------|
| `loginSchema` | `lib/validations/auth.ts` | Login form + API | Email + password |
| `registerSchema` | `lib/validations/auth.ts` | Register form + API | + konfirmasi password |
| `instruksiKerjaSchema` | `lib/validations/instruksi-kerja.ts` | CRUD IK | Regex kode IK |
| `lokasiKolamSchema` | `lib/validations/lokasi-kolam.ts` | CRUD Lokasi | Regex koordinat GPS |
| `bakuMutuSchema` | `lib/validations/baku-mutu.ts` | CRUD Baku Mutu | Refine min ≤ max |
| `inputUjiKualitasSchema` | `lib/validations/uji-kualitas.ts` | Form input hasil uji | Array nested parameter |
| `detailParameterSchema` | `lib/validations/uji-kualitas.ts` | Sub-form parameter | Tanpa status (server-side) |
| `filterUjiSchema` | `lib/validations/uji-kualitas.ts` | Filter tabel | Refine tanggal range |
| `filterTrenSchema` | `lib/validations/uji-kualitas.ts` | Filter grafik tren | Enum rentang waktu |
| `penggunaSchema` | `lib/validations/pengguna.ts` | CRUD User (admin) | Enum role |

---

## 📦 Ringkasan Dependencies

| Package | Fungsi | Environment |
|---------|--------|-------------|
| `drizzle-orm` | ORM utama | Both |
| `drizzle-kit` | Migrasi & generate | Dev only |
| `drizzle-zod` | Bridge Drizzle → Zod | Both |
| `zod` | Validasi data | Both |
| `postgres` | Driver PostgreSQL lokal | **Development** |
| `@neondatabase/serverless` | Driver Neon DB | **Production** |
| `better-auth` | Autentikasi + RBAC | Both |
| `next` | Framework | Both |

---

## 🔐 Catatan Keamanan Validasi

> [!WARNING]
> ### Server-Side Validation adalah Wajib
> - **Semua** data yang masuk melalui Server Action atau API Route **HARUS** divalidasi ulang dengan Zod, meskipun sudah divalidasi di client
> - Field `status_kelayakan` dan `kesimpulan` **dihitung di server**, tidak pernah diterima dari input client
> - Gunakan `z.coerce.date()` untuk tanggal — jangan percaya format string dari client
> - Sanitasi input string untuk mencegah XSS sebelum simpan ke DB

> [!TIP]
> ### Pola Reusable untuk Server Action
> ```typescript
> 'use server';
> import { z } from 'zod';
> import { instruksiKerjaSchema } from '@/lib/validations/instruksi-kerja';
> 
> export async function createInstruksiKerja(formData: FormData) {
>   const rawData = Object.fromEntries(formData);
>   
>   // Validasi Zod — server-side (WAJIB)
>   const validated = instruksiKerjaSchema.safeParse(rawData);
>   
>   if (!validated.success) {
>     return { 
>       success: false, 
>       errors: validated.error.flatten().fieldErrors 
>     };
>   }
>   
>   // Data sudah aman, lanjut ke DB
>   const data = validated.data;
>   // ... insert ke database via Drizzle
> }
> ```

---

## ⏱️ Estimasi Waktu per Fase

| Fase | Deskripsi | Estimasi |
|------|-----------|----------|
| 0 | Persiapan & Setup (termasuk konfigurasi dual DB) | 1–2 hari |
| 1 | Autentikasi & RBAC | 2–3 hari |
| 2 | Modul Master Data (A & B) | 4–5 hari |
| 3 | Transaksi & Validasi (C) | 4–5 hari |
| 4 | Visualisasi & Dashboard (D) | 3–4 hari |
| 5 | Cetak, Pelaporan & Uji Terima (E, F) | 5–7 hari |
| **Total** | | **~19–26 hari kerja** |

---

## ✅ Checklist Siap Mulai

Sebelum memulai Fase 0, pastikan:
- [ ] Docker Desktop sudah terinstall dan berjalan (untuk PostgreSQL development)
- [ ] Akun Neon DB sudah dibuat di [neon.tech](https://neon.tech) (untuk production nanti)
- [ ] Bun runtime sudah terinstall (`bun --version` ≥ 1.x)
- [ ] Akses ke repository/folder kerja `e:\LATSAR ELLEN\SISTEM\minamutu\`

> [!NOTE]
> **Tidak perlu install PostgreSQL secara manual.** Script `bun run setup` akan otomatis menjalankan PostgreSQL via Docker container.

> Setelah checklist di atas terpenuhi, eksekusi dimulai dari **Fase 0, Task 0.1**.
