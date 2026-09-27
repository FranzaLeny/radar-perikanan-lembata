# Rencana Implementasi Fitur — SIPEKA / Minamutu

> Dokumen perencanaan ini dibuat untuk dikerjakan oleh model AI yang lebih murah.
> Setiap file plan bersifat **self-contained** dan bisa dikerjakan secara mandiri per-file.

## Urutan Pengerjaan (Rekomendasi)

| # | Plan | Deskripsi | Prioritas | Dependensi |
|---|------|-----------|-----------|------------|
| 1 | [01-lokasi-kolam-edit-nonaktifkan.md](./01-lokasi-kolam-edit-nonaktifkan.md) | Edit & Nonaktifkan Lokasi Kolam | 🔴 Tinggi | — |
| 2 | [02-baku-mutu-nonaktifkan-hapus.md](./02-baku-mutu-nonaktifkan-hapus.md) | Nonaktifkan & Hapus Baku Mutu (proteksi relasi) | 🔴 Tinggi | — |
| 3 | [03-modul-pegawai-crud.md](./03-modul-pegawai-crud.md) | Halaman CRUD Daftar Pegawai | 🔴 Tinggi | — |
| 4 | [04-integrasi-pelaporan-pegawai.md](./04-integrasi-pelaporan-pegawai.md) | `is_penanggungjawab` + integrasi pelaporan × pegawai | 🟡 Sedang | Plan 03 |
| 5 | [05-laporan-status-ubah-hapus.md](./05-laporan-status-ubah-hapus.md) | Status dokumen (draft/final/arsip), ubah, hapus LHU | 🔴 Tinggi | — |

## Aturan Umum untuk Pelaksana

1. **Selalu jalankan `bun run db:generate` dan `bun run db:push`** setelah mengubah schema DB.
2. **Validasi Zod** harus ada di client-side DAN server-side (dual validation).
3. **Gunakan `revalidatePath()`** setelah setiap mutasi data.
4. **Ikuti pola UI** yang sudah ada di modul lain (contoh: Baku Mutu untuk tab filter, Lokasi Kolam untuk dialog form).
5. **Jangan lupa `'use server'`** di file server actions dan `'use client'` di file client components.
6. **Import komponen UI** dari `@/components/ui/*` — jangan buat komponen baru tanpa mengecek yang sudah ada.
7. **TypeScript strict** — jangan gunakan `any` kecuali terpaksa.
