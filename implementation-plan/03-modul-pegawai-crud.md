# Plan 03 — Modul Pegawai: Halaman CRUD Daftar Pegawai

## Ringkasan

Saat ini data pegawai (`masterPegawai`) sudah memiliki schema DB dan server action `createPegawaiAction` + `getPegawaiListAction`.
Namun **belum ada halaman UI khusus** untuk mengelola daftar pegawai — pegawai saat ini hanya bisa ditambahkan via seed atau secara implisit.
Perlu dibuatkan halaman `/pegawai` lengkap dengan kemampuan: **Lihat Daftar**, **Tambah**, **Edit**, dan **Nonaktifkan**.

## Status Sekarang

| Fitur                    | Status |
| ------------------------ | ------ |
| Schema DB `masterPegawai`| ✅ Ada  |
| `createPegawaiAction`   | ✅ Ada (tanpa validasi Zod)  |
| `getPegawaiListAction`  | ✅ Ada (hanya aktif)  |
| `getAllPegawaiAction`    | ✅ Ada  |
| Halaman UI `/pegawai`    | ❌ Belum |
| Edit Pegawai             | ❌ Belum |
| Nonaktifkan Pegawai      | ❌ Belum |

### File Terkait
- **Schema DB**: `db/schema.ts` → tabel `masterPegawai` (baris 48-57)
- **Server Actions**: `lib/actions/pegawai.ts`
- **Sidebar/Navigation**: `app/(dashboard)/layout.tsx`

---

## Langkah Implementasi

### 1. Buat Validasi Zod untuk Pegawai

**File baru**: `lib/validations/pegawai-master.ts`

```typescript
import { z } from 'zod';

export const pegawaiSchema = z.object({
  nip: z.string()
    .min(1, { message: 'NIP wajib diisi' })
    .max(30, { message: 'NIP maksimal 30 karakter' })
    .transform((v) => v.replace(/\s+/g, '')),
  nama: z.string()
    .min(1, { message: 'Nama pegawai wajib diisi' })
    .max(150, { message: 'Nama maksimal 150 karakter' }),
  jabatan: z.string()
    .min(1, { message: 'Jabatan wajib diisi' })
    .max(150, { message: 'Jabatan maksimal 150 karakter' }),
  pangkat_golongan: z.string().max(100).optional().or(z.literal('')),
  peran_tanda_tangan: z.enum(['penguji', 'pengelola_mutu', 'kepala_dinas']).default('penguji'),
});

export type PegawaiInput = z.infer<typeof pegawaiSchema>;
```

### 2. Tambah Server Actions

**File**: `lib/actions/pegawai.ts`

Tambahkan fungsi-fungsi berikut:

```typescript
// UPDATE PEGAWAI
export async function updatePegawaiAction(
  id: string,
  formData: {
    nip: string;
    nama: string;
    jabatan: string;
    pangkat_golongan?: string;
    peran_tanda_tangan?: string;
  }
) {
  try {
    const nipClean = formData.nip.replace(/\s+/g, '');
    if (!nipClean || !formData.nama || !formData.jabatan) {
      return { success: false, message: 'NIP, Nama, dan Jabatan wajib diisi.' };
    }

    const [updated] = await db
      .update(masterPegawai)
      .set({
        nip: nipClean,
        nama: formData.nama.trim(),
        jabatan: formData.jabatan.trim(),
        pangkat_golongan: formData.pangkat_golongan?.trim() || null,
        peran_tanda_tangan: formData.peran_tanda_tangan || 'penguji',
      })
      .where(eq(masterPegawai.id, id))
      .returning();

    revalidatePath('/pegawai');
    revalidatePath('/uji-kualitas/baru');
    revalidatePath('/laporan');
    return { success: true, data: updated, message: 'Data pegawai berhasil diperbarui.' };
  } catch (err) {
    console.error('[updatePegawaiAction] Error:', err);
    return { success: false, message: 'Gagal memperbarui data pegawai. Pastikan NIP unik.' };
  }
}

// TOGGLE AKTIF PEGAWAI
export async function togglePegawaiAction(id: string, aktif: boolean) {
  try {
    await db
      .update(masterPegawai)
      .set({ aktif })
      .where(eq(masterPegawai.id, id));

    revalidatePath('/pegawai');
    revalidatePath('/uji-kualitas/baru');
    return {
      success: true,
      message: aktif ? 'Pegawai diaktifkan kembali.' : 'Pegawai dinonaktifkan.',
    };
  } catch (err) {
    console.error('[togglePegawaiAction] Error:', err);
    return { success: false, message: 'Gagal mengubah status pegawai.' };
  }
}
```

### 3. Buat Halaman & Route

#### 3a. Halaman SSR

**File baru**: `app/(dashboard)/pegawai/page.tsx`

```typescript
import React from 'react';
import { db } from '@/db';
import { masterPegawai } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { PegawaiClient } from './client';

export default async function PegawaiPage() {
  const pegawaiList = await db
    .select()
    .from(masterPegawai)
    .orderBy(desc(masterPegawai.createdAt));

  return <PegawaiClient initialList={pegawaiList} />;
}
```

#### 3b. Client Component

**File baru**: `app/(dashboard)/pegawai/client.tsx`

Komponen ini harus memiliki:

1. **Header halaman**: Ikon `Users`, judul "Daftar Pegawai Dinas Perikanan", deskripsi.
2. **Search Bar**: Filter berdasarkan NIP, nama, jabatan.
3. **Tab filter**: Semua / Aktif / Nonaktif.
4. **Tombol "+ Tambah Pegawai"**: Membuka dialog form.
5. **Tabel data** dengan kolom:
   - NIP
   - Nama Pegawai
   - Jabatan
   - Pangkat/Golongan
   - Peran Tanda Tangan (badge: `penguji`, `pengelola_mutu`, `kepala_dinas`)
   - Status (badge Aktif/Nonaktif)
   - Aksi (Dropdown: Edit, Nonaktifkan/Aktifkan)
6. **Dialog Form Tambah/Edit** (reuse dialog yang sama):
   - Field: NIP, Nama, Jabatan, Pangkat/Golongan (opsional), Peran Tanda Tangan (Select dropdown)
   - Pre-fill saat mode Edit.
7. **Peran Tanda Tangan**: Gunakan `Select` dropdown dengan opsi:
   - `penguji` → "Petugas Penguji Lapangan"
   - `pengelola_mutu` → "Pengelola Mutu"
   - `kepala_dinas` → "Kepala Dinas (Penandatangan Resmi)"

### 4. Tambahkan Link Navigasi di Sidebar

**File**: `app/(dashboard)/layout.tsx`

Tambahkan item navigasi baru ke sidebar:

```tsx
import { Users } from 'lucide-react';

// Di dalam array menu items:
{ href: '/pegawai', label: 'Pegawai', icon: Users },
```

**Posisikan** di bawah "Pengguna" atau di kelompok "Master Data" bersama Lokasi Kolam, Baku Mutu, dan Instruksi Kerja.

---

## Catatan Penting

- **Jangan bingungkan modul Pegawai dengan modul Pengguna**: Pengguna = akun login BetterAuth (user authentication), Pegawai = data ASN/personil dinas (master data teknis).
- Schema DB `masterPegawai` **tidak perlu diubah** — sudah memiliki semua kolom yang diperlukan termasuk `aktif`, `peran_tanda_tangan`, dll.
- Pegawai yang `aktif: false` **tidak boleh muncul** di Combobox form uji baru (sudah difilter di `getPegawaiListAction`).
