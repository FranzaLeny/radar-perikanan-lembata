# Plan 04 — Integrasi Modul Pelaporan × Pegawai + Field `is_penanggungjawab`

## Ringkasan

Saat ini form uji lapangan sudah memiliki Combobox pegawai untuk memilih **Penguji** dan **Penandatangan**, tetapi:
1. Belum ada field `is_penanggungjawab` yang menandai pegawai default penandatangan semua jenis dokumen.
2. Perlu dipastikan integrasi berjalan konsisten antara modul pelaporan dan modul pegawai.

## Status Sekarang

| Fitur                                   | Status |
| --------------------------------------- | ------ |
| Combobox pilih pegawai penguji          | ✅ Ada  |
| Combobox pilih pegawai penandatangan    | ✅ Ada  |
| Field `is_penanggungjawab` di DB        | ❌ Belum |
| Auto-default penandatangan              | ⚠️ Parsial (pakai `peran_tanda_tangan === 'kepala_dinas'`) |

### File Terkait
- **Schema DB**: `db/schema.ts` → `masterPegawai` (baris 48-57)
- **Form Uji**: `components/form-uji-lapangan.tsx` (baris ~143-148)
- **Server Actions Pegawai**: `lib/actions/pegawai.ts`
- **Halaman Cetak LHU**: `app/(dashboard)/laporan/[uji_id]/cetak/`

---

## Langkah Implementasi

### 1. Tambah Kolom `is_penanggungjawab` pada Schema DB

**File**: `db/schema.ts`

```typescript
export const masterPegawai = pgTable('master_pegawai', {
  id: uuid('id').defaultRandom().primaryKey(),
  nip: varchar('nip', { length: 30 }).notNull().unique(),
  nama: varchar('nama', { length: 150 }).notNull(),
  jabatan: varchar('jabatan', { length: 150 }).notNull(),
  pangkat_golongan: varchar('pangkat_golongan', { length: 100 }),
  aktif: boolean('aktif').notNull().default(true),
  peran_tanda_tangan: varchar('peran_tanda_tangan', { length: 50 }).notNull().default('penguji'),
  is_penanggungjawab: boolean('is_penanggungjawab').notNull().default(false), // ← TAMBAHKAN INI
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
```

Jalankan migrasi:
```bash
bun run db:generate
bun run db:push
```

### 2. Buat Logic Unik: Hanya 1 Penanggung Jawab Aktif

**File**: `lib/actions/pegawai.ts`

Tambahkan fungsi helper dan action:

```typescript
/**
 * Set seorang pegawai sebagai penanggung jawab default.
 * Otomatis menghapus flag dari pegawai lain (hanya 1 yang boleh aktif).
 */
export async function setPenanggungJawabAction(pegawaiId: string) {
  try {
    // 1. Reset semua pegawai yang sebelumnya is_penanggungjawab
    await db
      .update(masterPegawai)
      .set({ is_penanggungjawab: false })
      .where(eq(masterPegawai.is_penanggungjawab, true));

    // 2. Set pegawai yang dipilih
    await db
      .update(masterPegawai)
      .set({ is_penanggungjawab: true })
      .where(eq(masterPegawai.id, pegawaiId));

    revalidatePath('/pegawai');
    revalidatePath('/uji-kualitas/baru');
    return { success: true, message: 'Penanggung jawab default berhasil diatur.' };
  } catch (err) {
    console.error('[setPenanggungJawabAction] Error:', err);
    return { success: false, message: 'Gagal mengatur penanggung jawab.' };
  }
}
```

### 3. Update Logika Default di Form Uji Lapangan

**File**: `components/form-uji-lapangan.tsx`

Saat ini logika default penandatangan adalah:
```typescript
const kadisPegawai = pegawaiList.find((p) => p.peran_tanda_tangan === 'kepala_dinas') || pegawaiList[0];
```

Ubah menjadi prioritas `is_penanggungjawab`:
```typescript
const defaultPenandatangan =
  pegawaiList.find((p) => p.is_penanggungjawab) ||
  pegawaiList.find((p) => p.peran_tanda_tangan === 'kepala_dinas') ||
  pegawaiList[0];
```

Pastikan juga interface `PegawaiItem` di file ini memiliki field:
```typescript
export interface PegawaiItem {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  pangkat_golongan?: string | null;
  aktif: boolean;
  peran_tanda_tangan: string;
  is_penanggungjawab: boolean; // ← TAMBAHKAN
}
```

### 4. Update UI Halaman Pegawai

**File**: `app/(dashboard)/pegawai/client.tsx` (dari Plan 03)

Tambahkan pada setiap baris tabel:
- Badge khusus "⭐ Penanggung Jawab" jika `is_penanggungjawab === true`.
- Di Dropdown Menu aksi, tambahkan item:
  ```tsx
  <DropdownMenuItem onClick={() => handleSetPenanggungJawab(item.id)}>
    <Star className="size-3.5 mr-2" />
    Jadikan Penanggung Jawab Default
  </DropdownMenuItem>
  ```

### 5. Update Halaman Cetak LHU (jika ada tampilan nama penandatangan)

Pastikan query data laporan di `app/(dashboard)/laporan/[uji_id]/cetak/page.tsx` juga mengambil relasi pegawai:

```typescript
const uji = await db.query.ujiKualitasAir.findFirst({
  where: eq(schema.ujiKualitasAir.id, ujiId),
  with: {
    lokasi: true,
    instruksiKerja: true,
    pengujiPegawai: true,        // ← relasi pegawai penguji
    penandatanganPegawai: true,  // ← relasi pegawai penandatangan
    detailParameters: { with: { bakuMutu: true } },
  },
});
```

---

## Catatan Penting

- `is_penanggungjawab` bersifat **singleton**: hanya boleh 1 pegawai yang memiliki flag ini. Logic di server action harus reset semua sebelum set yang baru.
- Field `peran_tanda_tangan` tetap dipertahankan sebagai metadata peran umum; `is_penanggungjawab` adalah flag spesifik untuk default penandatangan dokumen.
- Saat membuat pengujian baru, `penandatangan_pegawai_id` otomatis terisi pegawai yang `is_penanggungjawab === true`.
