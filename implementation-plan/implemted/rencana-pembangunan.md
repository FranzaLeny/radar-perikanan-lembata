# Rencana Pembangunan MINAMUTU (Sistem Informasi Mutu Air Budidaya)
**Dinas Perikanan Kabupaten Lembata**

Dokumen ini adalah spesifikasi teknis untuk dikerjakan oleh AI coding agent secara bertahap per fase. Setiap fase punya deliverable dan kriteria selesai yang jelas — kerjakan berurutan, jangan lompat fase sebelum kriteria selesai fase sebelumnya terpenuhi.

---

## 0. Tumpukan Teknologi (Tech Stack)

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| Komponen UI | shadcn/ui + Base UI |
| ORM | Drizzle ORM |
| Database | PostgreSQL |
| Autentikasi | Better Auth |

**Peran pengguna (RBAC):**
- `admin` — akses penuh, manajemen pengguna
- `pengelola_mutu` — kelola IK, baku mutu, lokasi kolam
- `petugas_lapangan` — input hasil uji, scan QR
- `kepala_dinas` — lihat dashboard, tanda tangan/approve laporan
- publik (tanpa login) — hanya akses halaman verifikasi QR

---

## 1. Skema Basis Data

> Catatan: skema asli dari dokumen sumber punya syntax error (koma hilang, kolom `kesimpulan` tanpa tipe data). Skema di bawah sudah diperbaiki dan siap dipakai sebagai acuan Drizzle schema.

```sql
-- 1. Master Instruksi Kerja
CREATE TABLE instruksi_kerja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_ik VARCHAR(50) UNIQUE NOT NULL,
    judul VARCHAR(255) NOT NULL,
    kategori VARCHAR(100),
    file_path VARCHAR(255) NOT NULL,
    qr_code_hash VARCHAR(255) UNIQUE NOT NULL,
    versi INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master Lokasi Kolam
CREATE TABLE lokasi_kolam (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_pokdakan VARCHAR(150) NOT NULL,
    pemilik VARCHAR(100) NOT NULL,
    kecamatan VARCHAR(100) NOT NULL,
    desa VARCHAR(100) NOT NULL,
    titik_koordinat VARCHAR(100),
    komoditas_ikan VARCHAR(50)
);

-- 3. Master Baku Mutu (versioned agar perubahan regulasi tidak menimpa data historis)
CREATE TABLE master_baku_mutu (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parameter VARCHAR(50) NOT NULL,
    satuan VARCHAR(20) NOT NULL,
    nilai_min NUMERIC(8,2),
    nilai_max NUMERIC(8,2),
    dasar_regulasi VARCHAR(100),
    aktif BOOLEAN NOT NULL DEFAULT true,
    berlaku_sejak DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 4. Pengujian & Log Kualitas Air
CREATE TABLE uji_kualitas_air (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nomor_sampel VARCHAR(50) UNIQUE NOT NULL,
    lokasi_id UUID REFERENCES lokasi_kolam(id),
    ik_id UUID REFERENCES instruksi_kerja(id),
    tanggal_pengambilan TIMESTAMP NOT NULL,
    petugas_uji VARCHAR(100) NOT NULL,
    catatan_lapangan TEXT,
    kesimpulan VARCHAR(20), -- 'NORMAL', 'PERINGATAN', 'KRITIS'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Detail Parameter per Pengujian
CREATE TABLE detail_uji_parameter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uji_id UUID REFERENCES uji_kualitas_air(id) ON DELETE CASCADE,
    baku_mutu_id UUID REFERENCES master_baku_mutu(id),
    nilai_hasil NUMERIC(8,2) NOT NULL,
    status_kelayakan VARCHAR(20) -- 'MEMENUHI', 'MELEBIHI', 'DIBAWAH'
);
```

**Baku mutu default (seed data), acuan PP No. 22 Tahun 2021 Lampiran VI Kelas II/III / SNI Budidaya:**

| Parameter | Satuan | Ambang Batas | Metode |
|---|---|---|---|
| Suhu | °C | 28–32 | In-situ (Thermometer) |
| pH | - | 6.5–8.5 | In-situ (pH Meter) |
| DO (Oksigen Terlarut) | mg/L | ≥ 3–5 | In-situ (DO Meter) |
| Amonia (NH₃-N) | mg/L | ≤ 0.02 | Spektrofotometri Lab |
| Nitrit (NO₂-N) | mg/L | ≤ 0.06 | Spektrofotometri Lab |
| Kecerahan/Turbiditas | cm / NTU | ≥ 30 cm / ≤ 25 NTU | Secchi Disk / Turbidimeter |

---

## 2. Struktur Proyek

```
minamutu/
├─ app/
│  ├─ (auth)/
│  │  ├─ login/
│  │  └─ layout.tsx
│  ├─ (dashboard)/
│  │  ├─ layout.tsx                 -> shell dashboard + nav per role
│  │  ├─ instruksi-kerja/           -> modul A
│  │  │  ├─ page.tsx
│  │  │  ├─ [id]/page.tsx
│  │  │  └─ [id]/cetak-label/page.tsx
│  │  ├─ baku-mutu/                 -> modul B
│  │  ├─ lokasi-kolam/              -> modul B
│  │  ├─ uji-kualitas/              -> modul C
│  │  │  ├─ page.tsx                -> tabel + filter
│  │  │  └─ input/page.tsx          -> form input (dipicu dari scan QR)
│  │  ├─ tren/                      -> modul D
│  │  ├─ laporan/                   -> modul E
│  │  │  ├─ [uji_id]/cetak/page.tsx -> print view LHU (@media print)
│  │  │  └─ rekap-tahunan/page.tsx
│  │  └─ pengguna/                  -> modul F (admin only)
│  ├─ verifikasi/[hash]/page.tsx    -> halaman publik verifikasi QR (no auth)
│  └─ api/
│     ├─ auth/[...all]/route.ts     -> Better Auth handler
│     └─ uji-kualitas/route.ts      -> dst, per domain
├─ db/
│  ├─ schema.ts                     -> skema Drizzle (dari bagian 1)
│  ├─ seed.ts                       -> seed baku mutu default
│  └─ migrations/
├─ lib/
│  ├─ auth.ts                       -> konfigurasi Better Auth + RBAC
│  ├─ auth-client.ts
│  ├─ validasi-baku-mutu.ts         -> fungsi bandingkan nilai vs ambang batas -> status
│  ├─ qr.ts                         -> generate hash unik + URL verifikasi
│  └─ pdf.ts                        -> util generate PDF dari print view
├─ components/
│  ├─ ui/                           -> shadcn/ui + Base UI primitives
│  ├─ badge-status.tsx              -> badge Normal/Peringatan/Kritis (hijau/kuning/merah)
│  ├─ grafik-tren.tsx               -> chart deret waktu + garis ambang batas
│  └─ form-uji-lapangan.tsx
└─ drizzle.config.ts
```

---

## 3. Rencana Fase (kerjakan berurutan)

### Fase 0 — Persiapan & Setup
**Tugas:**
- [ ] Init proyek Next.js 16 (App Router, TypeScript)
- [ ] Setup Tailwind CSS 4 + install shadcn/ui + Base UI
- [ ] Setup Drizzle ORM + koneksi PostgreSQL, buat `drizzle.config.ts`
- [ ] Tulis `db/schema.ts` berdasarkan skema bagian 1
- [ ] Jalankan migrasi awal, buat `db/seed.ts` untuk seed baku mutu default

**Kriteria selesai:** `pnpm dev` berjalan, koneksi DB sukses, tabel ter-migrasi, data baku mutu default ter-seed.

---

### Fase 1 — Fondasi & Autentikasi
**Tugas:**
- [ ] Konfigurasi Better Auth (`lib/auth.ts`), tabel user/session
- [ ] Implementasi 5 role (lihat bagian 0) dengan middleware proteksi route per role
- [ ] Halaman login (`app/(auth)/login`)
- [ ] Layout dashboard dasar (`app/(dashboard)/layout.tsx`) dengan navigasi yang berubah sesuai role login

**Kriteria selesai:** User bisa login/logout; user dengan role `petugas_lapangan` tidak bisa mengakses halaman admin (redirect/403).

---

### Fase 2 — Modul Master Data (A & B)
**Tugas:**
- [ ] CRUD Instruksi Kerja: form input (kode IK, judul, kategori, upload PDF), tabel daftar, halaman detail
- [ ] Generator QR: fungsi `lib/qr.ts` menghasilkan hash unik + URL `/verifikasi/[hash]`, simpan ke `qr_code_hash`
- [ ] Halaman cetak label QR (ukuran A6/A7, `@media print`)
- [ ] CRUD Master Baku Mutu (parameter, satuan, ambang batas, dasar regulasi, status aktif)
- [ ] CRUD Master Lokasi Kolam (Pokdakan, pemilik, kecamatan, desa, koordinat, komoditas)
- [ ] Halaman publik `app/verifikasi/[hash]/page.tsx` — tampilkan info IK tanpa perlu login

**Kriteria selesai:** IK baru otomatis punya QR valid; scan/klik QR membuka halaman verifikasi publik yang menampilkan data IK terkait.

---

### Fase 3 — Modul Transaksi & Validasi (C)
**Tugas:**
- [ ] Form input hasil uji (`uji-kualitas/input`) — bisa diawali dari scan QR (prefill lokasi & IK)
- [ ] Fungsi `lib/validasi-baku-mutu.ts`: terima nilai + parameter, bandingkan dengan baku mutu aktif, kembalikan status (`MEMENUHI`/`MELEBIHI`/`DIBAWAH`) dan level (`NORMAL`/`PERINGATAN`/`KRITIS`)
- [ ] Simpan hasil ke `uji_kualitas_air` + `detail_uji_parameter`, set `kesimpulan` otomatis
- [ ] Tabel daftar hasil uji dengan filter: kecamatan, desa, Pokdakan, jenis ikan, rentang tanggal
- [ ] Komponen `badge-status.tsx` (hijau=Aman, kuning=Toleransi, merah=Melebihi)

**Kriteria selesai:** Input nilai di luar ambang batas otomatis menghasilkan badge merah/kuning tanpa aksi manual tambahan.

---

### Fase 4 — Visualisasi & Dashboard (D)
**Tugas:**
- [ ] Komponen `grafik-tren.tsx`: line chart per parameter per lokasi, rentang 1 tahun, dengan garis batas min/maks baku mutu
- [ ] Dashboard ringkasan: jumlah uji per status, per kecamatan, tren kepatuhan
- [ ] Halaman `tren/` dengan filter lokasi + parameter

**Kriteria selesai:** Grafik menampilkan data historis nyata dari `detail_uji_parameter`, garis ambang batas terlihat jelas terhadap fluktuasi data.

---

### Fase 5 — Cetak, Pelaporan & Uji Terima (E, F)
**Tugas:**
- [ ] Print view A4 (`@media print`, tanpa chrome browser) untuk LHU: kop dinas, metadata sampel, tabel evaluasi mutu, rekomendasi teknis otomatis (mis. jika amonia tinggi → saran penyiponan), blok tanda tangan elektronik, QR verifikasi di footer
- [ ] Halaman Rekap Tahunan: matriks kepatuhan per Pokdakan per bulan
- [ ] Export ke PDF (`lib/pdf.ts`)
- [ ] Modul Administrasi (F): manajemen pengguna & role (admin only), log aktivitas dasar
- [ ] QA menyeluruh: uji semua role, uji alur QR → input → validasi → cetak end-to-end
- [ ] User Acceptance Testing bersama petugas dan Kepala Dinas
- [ ] Deployment ke production + pelatihan pengguna

**Kriteria selesai:** LHU bisa dicetak/diekspor PDF sesuai format standar dinas; alur lengkap dari registrasi IK sampai laporan tercetak berjalan tanpa error; UAT disetujui pengguna.

---

## 4. Catatan Implementasi Penting untuk Agent

- **Validasi baku mutu harus server-side**, bukan hanya di form — status kelayakan dihitung ulang saat data disimpan, bukan dipercaya dari input client.
- **`master_baku_mutu` bersifat versioned** (`aktif`, `berlaku_sejak`): jangan update baris lama saat regulasi berubah, buat baris baru dan nonaktifkan yang lama, agar data historis tetap merujuk ke baku mutu yang berlaku saat itu.
- **Halaman verifikasi QR (`/verifikasi/[hash]`) wajib publik**, tidak boleh ikut middleware auth.
- **Print view pakai `@media print` CSS**, bukan generate PDF terpisah dari nol jika memungkinkan — render halaman HTML lalu convert ke PDF agar konsisten dengan tampilan di layar.
- Ikuti urutan fase di atas; jangan bangun modul E sebelum modul C (butuh data uji) dan modul B (butuh baku mutu) selesai.
