# Plan 01 — Lokasi Kolam: Fitur Edit & Nonaktifkan

## Ringkasan

Modul Lokasi Kolam saat ini hanya mendukung **Tambah** dan **Hapus**.
Perlu ditambahkan kemampuan **Edit** (ubah data lokasi) dan **Nonaktifkan** (soft-delete agar data historis tetap utuh).

## Status Sekarang

| Fitur                | Status |
| -------------------- | ------ |
| Tambah Lokasi        | ✅ Ada  |
| Hapus Lokasi         | ✅ Ada  |
| Edit Lokasi          | ❌ Belum |
| Nonaktifkan Lokasi   | ❌ Belum |

### File Terkait
- **Schema DB**: `db/schema.ts` → tabel `lokasiKolam` (baris 21-29)
- **Server Actions**: `lib/actions/lokasi-kolam.ts`
- **Validasi Zod**: `lib/validations/lokasi-kolam.ts`
- **Client Component**: `app/(dashboard)/lokasi-kolam/client.tsx`
- **Page SSR**: `app/(dashboard)/lokasi-kolam/page.tsx`
- **Quick-Add Dialog** (form uji): `components/quick-add-lokasi-dialog.tsx`

---

## Langkah Implementasi

### 1. Tambah Kolom `aktif` pada Schema DB

**File**: `db/schema.ts`

Tambahkan field `aktif` pada tabel `lokasiKolam`:

```typescript
export const lokasiKolam = pgTable('lokasi_kolam', {
  id: uuid('id').defaultRandom().primaryKey(),
  nama_pokdakan: varchar('nama_pokdakan', { length: 150 }).notNull(),
  pemilik: varchar('pemilik', { length: 100 }).notNull(),
  kecamatan: varchar('kecamatan', { length: 100 }).notNull(),
  desa: varchar('desa', { length: 100 }).notNull(),
  titik_koordinat: varchar('titik_koordinat', { length: 100 }),
  komoditas_ikan: varchar('komoditas_ikan', { length: 50 }),
  aktif: boolean('aktif').notNull().default(true),  // ← TAMBAHKAN INI
});
```

Kemudian jalankan:
```bash
bun run db:generate
bun run db:push
```

### 2. Tambah Server Action: `updateLokasiKolamAction`

**File**: `lib/actions/lokasi-kolam.ts`

Tambahkan fungsi baru:

```typescript
export async function updateLokasiKolamAction(
  id: string,
  formData: FormData | Record<string, unknown>
) {
  const rawData = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

  const validation = lokasiKolamSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Data lokasi kolam tidak valid.',
    };
  }

  const data = validation.data;

  try {
    const [updated] = await db
      .update(schema.lokasiKolam)
      .set({
        nama_pokdakan: data.nama_pokdakan,
        pemilik: data.pemilik,
        kecamatan: data.kecamatan,
        desa: data.desa,
        titik_koordinat: data.titik_koordinat || null,
        komoditas_ikan: data.komoditas_ikan || null,
      })
      .where(eq(schema.lokasiKolam.id, id))
      .returning();

    revalidatePath('/lokasi-kolam');
    return {
      success: true,
      data: updated,
      message: 'Lokasi kolam berhasil diperbarui.',
    };
  } catch (error) {
    console.error('Error updateLokasiKolamAction:', error);
    return {
      success: false,
      message: 'Gagal memperbarui lokasi kolam.',
    };
  }
}
```

### 3. Tambah Server Action: `toggleLokasiKolamAction`

**File**: `lib/actions/lokasi-kolam.ts`

```typescript
export async function toggleLokasiKolamAction(id: string, aktif: boolean) {
  try {
    await db
      .update(schema.lokasiKolam)
      .set({ aktif })
      .where(eq(schema.lokasiKolam.id, id));

    revalidatePath('/lokasi-kolam');
    return {
      success: true,
      message: aktif ? 'Lokasi kolam diaktifkan kembali.' : 'Lokasi kolam dinonaktifkan.',
    };
  } catch (error) {
    console.error('Error toggleLokasiKolamAction:', error);
    return {
      success: false,
      message: 'Gagal mengubah status lokasi kolam.',
    };
  }
}
```

### 4. Update Client Component

**File**: `app/(dashboard)/lokasi-kolam/client.tsx`

Perubahan yang diperlukan:

1. **Import** `updateLokasiKolamAction` dan `toggleLokasiKolamAction` dari `lib/actions/lokasi-kolam.ts`.
2. **Tambahkan `aktif` pada interface `LokasiItem`**: `aktif: boolean;`
3. **Tambah state**: `editingItem` (untuk menyimpan item yang sedang diedit, `null` = mode tambah).
4. **Ubah Dialog**: Gunakan dialog yang sama untuk Tambah dan Edit.
   - Saat Edit: pre-fill form dari `editingItem`, panggil `updateLokasiKolamAction`.
   - Saat Tambah: tetap seperti sekarang, panggil `createLokasiKolamAction`.
5. **Tambah tombol Edit** (ikon `Pencil`) di setiap baris tabel, di samping tombol Hapus.
6. **Tambah tombol Nonaktifkan / Aktifkan** (ikon `ToggleLeft`/`ToggleRight`) di setiap baris.
7. **Tambah filter tab** (Semua / Aktif / Nonaktif) di atas tabel seperti di modul Baku Mutu.
8. **Baris yang nonaktif**: Tampilkan dengan opacity lebih rendah dan badge "Nonaktif".

### 5. Update Page SSR

**File**: `app/(dashboard)/lokasi-kolam/page.tsx`

Pastikan query mengambil SEMUA lokasi (termasuk yang nonaktif):

```typescript
const lokasiList = await db.query.lokasiKolam.findMany({
  orderBy: [desc(schema.lokasiKolam.nama_pokdakan)],
});
```

### 6. Update Combobox di Form Uji Lapangan

**File**: `components/form-uji-lapangan.tsx`

Filter combobox agar hanya menampilkan lokasi yang `aktif === true`:

```typescript
const lokasiOptions: OptionItem[] = useMemo(() => {
  return lokasiListState
    .filter((l) => l.aktif) // ← TAMBAH FILTER INI
    .map((l) => ({
      value: l.id,
      label: `${l.nama_pokdakan} (${l.pemilik})`,
      sublabel: `Kec. ${l.kecamatan}, Desa ${l.desa}...`,
    }));
}, [lokasiListState]);
```

---

## Catatan Penting

- Skema validasi Zod (`lokasiKolamSchema`) **tidak perlu berubah** — field yang sama dipakai untuk tambah dan edit.
- Tombol **Hapus tetap dipertahankan** tetapi gagal jika ada data uji terhubung (sudah ada `onDelete: 'restrict'` di schema).
- Saat menampilkan Combobox lokasi di form uji baru, **hanya tampilkan lokasi yang `aktif: true`**.
