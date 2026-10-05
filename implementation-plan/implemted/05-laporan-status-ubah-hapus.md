# Plan 05 — Laporan Hasil Uji: Status Dokumen, Ubah, & Hapus

## Ringkasan

Modul Laporan Hasil Uji (LHU) saat ini hanya menampilkan daftar dan tombol **Cetak**.
Belum ada:
1. **Status dokumen** (`draft`, `final`, `arsip`) untuk mengontrol apakah dokumen masih bisa diubah/dihapus.
2. **Tombol Ubah** (edit data pengujian yang sudah tersimpan).
3. **Tombol Hapus** (dengan proteksi status: hanya `draft` yang boleh dihapus).

## Status Sekarang

| Fitur                                  | Status |
| -------------------------------------- | ------ |
| Lihat Daftar LHU                       | ✅ Ada  |
| Cetak LHU                              | ✅ Ada  |
| Kolom `status` di tabel DB             | ❌ Belum |
| Ubah Data Pengujian                    | ❌ Belum |
| Hapus Data Pengujian                   | ❌ Belum |
| Filter berdasarkan Status              | ❌ Belum |

### File Terkait
- **Schema DB**: `db/schema.ts` → `ujiKualitasAir` (baris 62-76), `detailUjiParameter` (baris 81-89)
- **Server Actions**: `lib/actions/uji-kualitas.ts`
- **Validasi Zod**: `lib/validations/uji-kualitas.ts`
- **Tabel Laporan (Client)**: `app/(dashboard)/laporan/laporan-table-client.tsx`
- **Halaman Laporan**: `app/(dashboard)/laporan/page.tsx`
- **Halaman Cetak**: `app/(dashboard)/laporan/[uji_id]/cetak/`

---

## Langkah Implementasi

### 1. Tambah Kolom `status` pada Schema DB

**File**: `db/schema.ts`

```typescript
export const ujiKualitasAir = pgTable('uji_kualitas_air', {
  id: uuid('id').defaultRandom().primaryKey(),
  nomor_sampel: varchar('nomor_sampel', { length: 50 }).notNull().unique(),
  lokasi_id: uuid('lokasi_id').references(() => lokasiKolam.id, { onDelete: 'restrict' }),
  ik_id: uuid('ik_id').references(() => instruksiKerja.id, { onDelete: 'restrict' }),
  tanggal_pengambilan: timestamp('tanggal_pengambilan', { mode: 'date' }).notNull(),
  petugas_uji: varchar('petugas_uji', { length: 100 }).notNull(),
  penguji_pegawai_id: uuid('penguji_pegawai_id').references(() => masterPegawai.id, { onDelete: 'set null' }),
  penandatangan_pegawai_id: uuid('penandatangan_pegawai_id').references(() => masterPegawai.id, { onDelete: 'set null' }),
  catatan_lapangan: text('catatan_lapangan'),
  kesimpulan: varchar('kesimpulan', { length: 20 }),
  kesimpulan_umum: text('kesimpulan_umum'),
  saran_rekomendasi_lapangan: text('saran_rekomendasi_lapangan'),
  status: varchar('status', { length: 20 }).notNull().default('draft'), // ← TAMBAHKAN INI: 'draft' | 'final' | 'arsip'
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
```

Jalankan migrasi:
```bash
bun run db:generate
bun run db:push
```

### 2. Update `submitHasilUjiAction` — Default Status `draft`

**File**: `lib/actions/uji-kualitas.ts`

Di bagian insert, pastikan `status` diset:
```typescript
const [ujiBaru] = await db
  .insert(schema.ujiKualitasAir)
  .values({
    ...existingFields,
    status: 'draft', // ← TAMBAHKAN
  })
  .returning();
```

### 3. Tambah Server Action: `updateHasilUjiAction`

**File**: `lib/actions/uji-kualitas.ts`

```typescript
export async function updateHasilUjiAction(ujiId: string, payload: unknown) {
  // 1. Cek status dokumen — hanya 'draft' yang boleh diubah
  const existing = await db.query.ujiKualitasAir.findFirst({
    where: eq(schema.ujiKualitasAir.id, ujiId),
  });

  if (!existing) {
    return { success: false, message: 'Data pengujian tidak ditemukan.' };
  }

  if (existing.status !== 'draft') {
    return {
      success: false,
      message: `Dokumen berstatus "${existing.status}" tidak dapat diubah. Hanya dokumen berstatus "draft" yang dapat diedit.`,
    };
  }

  // 2. Validasi ulang payload
  const validation = inputUjiKualitasSchema.safeParse(payload);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Data pengujian tidak valid.',
    };
  }

  // 3. Update data uji utama
  // ... (logic mirip submitHasilUjiAction tapi pakai UPDATE bukan INSERT)
  // ... termasuk: hapus detail parameter lama → insert ulang detail parameter baru
  // ... hitung ulang status_kelayakan dan kesimpulan server-side

  try {
    const { nomor_sampel, lokasi_id, tanggal_pengambilan, petugas_uji, ... } = validation.data;

    await db.update(schema.ujiKualitasAir).set({
      nomor_sampel,
      lokasi_id,
      tanggal_pengambilan,
      petugas_uji,
      // ... field lainnya
      kesimpulan: calculatedKesimpulan,
    }).where(eq(schema.ujiKualitasAir.id, ujiId));

    // Hapus detail parameter lama
    await db.delete(schema.detailUjiParameter)
      .where(eq(schema.detailUjiParameter.uji_id, ujiId));

    // Insert detail parameter baru
    for (const detail of calculatedDetails) {
      await db.insert(schema.detailUjiParameter).values({
        uji_id: ujiId,
        baku_mutu_id: detail.baku_mutu_id,
        nilai_hasil: detail.nilai_hasil,
        status_kelayakan: detail.status_kelayakan,
      });
    }

    revalidatePath('/laporan');
    revalidatePath('/dashboard');
    revalidatePath('/tren');

    return { success: true, message: 'Data pengujian berhasil diperbarui.' };
  } catch (error) {
    console.error('Error updateHasilUjiAction:', error);
    return { success: false, message: 'Gagal memperbarui data pengujian.' };
  }
}
```

### 4. Tambah Server Action: `deleteHasilUjiAction`

**File**: `lib/actions/uji-kualitas.ts`

```typescript
export async function deleteHasilUjiAction(ujiId: string) {
  try {
    const existing = await db.query.ujiKualitasAir.findFirst({
      where: eq(schema.ujiKualitasAir.id, ujiId),
    });

    if (!existing) {
      return { success: false, message: 'Data pengujian tidak ditemukan.' };
    }

    if (existing.status !== 'draft') {
      return {
        success: false,
        message: `Dokumen berstatus "${existing.status}" tidak dapat dihapus. Hanya dokumen berstatus "draft" yang dapat dihapus.`,
      };
    }

    // detail_uji_parameter sudah CASCADE delete via schema
    await db.delete(schema.ujiKualitasAir)
      .where(eq(schema.ujiKualitasAir.id, ujiId));

    revalidatePath('/laporan');
    revalidatePath('/dashboard');
    revalidatePath('/tren');

    return { success: true, message: 'Laporan hasil uji berhasil dihapus.' };
  } catch (error) {
    console.error('Error deleteHasilUjiAction:', error);
    return { success: false, message: 'Gagal menghapus data pengujian.' };
  }
}
```

### 5. Tambah Server Action: `updateStatusUjiAction`

**File**: `lib/actions/uji-kualitas.ts`

```typescript
export async function updateStatusUjiAction(ujiId: string, status: 'draft' | 'final' | 'arsip') {
  try {
    await db.update(schema.ujiKualitasAir)
      .set({ status })
      .where(eq(schema.ujiKualitasAir.id, ujiId));

    revalidatePath('/laporan');
    return {
      success: true,
      message: `Status dokumen diubah menjadi "${status}".`,
    };
  } catch (error) {
    console.error('Error updateStatusUjiAction:', error);
    return { success: false, message: 'Gagal mengubah status dokumen.' };
  }
}
```

### 6. Update Tabel Laporan (Client)

**File**: `app/(dashboard)/laporan/laporan-table-client.tsx`

Perubahan yang diperlukan:

1. **Tambahkan `status` pada interface `UjiLaporanItem`**: `status: string;`
2. **Tambah kolom Status Dokumen** pada tabel (sebelum kolom Aksi):
   ```tsx
   <TableHead className="w-[100px] text-xs">Status Dok.</TableHead>

   // Di baris:
   <TableCell>
     <Badge variant={
       u.status === 'draft' ? 'outline' :
       u.status === 'final' ? 'default' : 'secondary'
     }>
       {u.status === 'draft' ? '📝 Draft' :
        u.status === 'final' ? '✅ Final' : '📦 Arsip'}
     </Badge>
   </TableCell>
   ```
3. **Ganti tombol "Cetak LHU" menjadi Dropdown Menu** dengan aksi:
   - **Cetak LHU** (selalu tersedia)
   - **Edit** (hanya jika `status === 'draft'`) → navigasi ke `/uji-kualitas/edit/[id]` atau buka dialog
   - **Finalkan** (hanya jika `status === 'draft'`) → ubah status jadi `final`
   - **Arsipkan** (hanya jika `status === 'final'`) → ubah status jadi `arsip`
   - **Kembalikan ke Draft** (hanya jika `status === 'final'`) → ubah status kembali ke `draft`
   - **Hapus** (hanya jika `status === 'draft'`) → hapus dengan konfirmasi

4. **Tambah Tab Filter Status** di atas tabel: Semua / Draft / Final / Arsip

### 7. (Opsional) Buat Halaman Edit Pengujian

**File baru**: `app/(dashboard)/uji-kualitas/edit/[id]/page.tsx`

Halaman ini memuat kembali `FormUjiLapangan` yang sama seperti halaman baru, tetapi:
- Pre-fill semua field dari data pengujian yang ada.
- Submit mengarah ke `updateHasilUjiAction` bukan `submitHasilUjiAction`.
- Tambahkan prop `mode: 'edit'` dan `existingUjiId: string` pada `FormUjiLapangan`.

---

## Catatan Penting

### Aturan Status Dokumen

```
┌─────────┐     Finalkan      ┌─────────┐     Arsipkan     ┌─────────┐
│  DRAFT  │ ───────────────→  │  FINAL  │ ──────────────→  │  ARSIP  │
│ (bisa   │ ←───────────────  │ (tidak  │                  │ (tidak  │
│  edit &  │  Kembalikan ke    │  bisa   │                  │  bisa   │
│  hapus)  │      Draft        │  edit)  │                  │  apa2)  │
└─────────┘                   └─────────┘                  └─────────┘
```

- **Draft**: Boleh edit, hapus, finalkan.
- **Final**: Tidak boleh edit/hapus. Boleh arsipkan atau kembalikan ke draft.
- **Arsip**: Tidak boleh apa-apa (read-only permanent).

### Default Status
- Semua pengujian baru otomatis berstatus **`draft`**.
