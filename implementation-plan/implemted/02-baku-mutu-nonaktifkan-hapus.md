# Plan 02 — Baku Mutu: Fitur Nonaktifkan & Hapus (dengan Proteksi Relasi)

## Ringkasan

Modul Baku Mutu saat ini sudah mendukung **Tambah** dan **Revisi Berversi** (versi lama diarsipkan, versi baru aktif).
Belum ada fitur **Nonaktifkan manual** (tanpa membuat versi baru) dan **Hapus** (dengan proteksi agar tidak bisa dihapus jika sudah memiliki data uji terhubung).

## Status Sekarang

| Fitur                       | Status |
| --------------------------- | ------ |
| Tambah Baku Mutu            | ✅ Ada  |
| Revisi Berversi (Edit)      | ✅ Ada  |
| Nonaktifkan Manual          | ❌ Belum |
| Hapus (dengan proteksi)     | ❌ Belum |

### File Terkait
- **Schema DB**: `db/schema.ts` → tabel `masterBakuMutu` (baris 34-43), `detailUjiParameter` (baris 81-89)
- **Server Actions**: `lib/actions/baku-mutu.ts`
- **Validasi Zod**: `lib/validations/baku-mutu.ts`
- **Client Component**: `app/(dashboard)/baku-mutu/client.tsx`
- **Page SSR**: `app/(dashboard)/baku-mutu/page.tsx`

---

## Langkah Implementasi

### 1. Tambah Server Action: `toggleBakuMutuAction`

**File**: `lib/actions/baku-mutu.ts`

```typescript
export async function toggleBakuMutuAction(id: string, aktif: boolean) {
  try {
    await db
      .update(schema.masterBakuMutu)
      .set({ aktif })
      .where(eq(schema.masterBakuMutu.id, id));

    revalidatePath('/baku-mutu');
    return {
      success: true,
      message: aktif
        ? 'Parameter baku mutu diaktifkan kembali.'
        : 'Parameter baku mutu dinonaktifkan.',
    };
  } catch (error) {
    console.error('Error toggleBakuMutuAction:', error);
    return {
      success: false,
      message: 'Gagal mengubah status parameter baku mutu.',
    };
  }
}
```

### 2. Tambah Server Action: `deleteBakuMutuAction` (dengan Proteksi Relasi)

**File**: `lib/actions/baku-mutu.ts`

```typescript
import { sql } from 'drizzle-orm';

export async function deleteBakuMutuAction(id: string) {
  try {
    // 1. Cek apakah ada data pengujian yang mereferensi baku mutu ini
    const usageCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.detailUjiParameter)
      .where(eq(schema.detailUjiParameter.baku_mutu_id, id));

    const count = Number(usageCount[0]?.count || 0);

    if (count > 0) {
      return {
        success: false,
        message: `Tidak dapat dihapus: parameter ini sudah digunakan oleh ${count} data pengujian. Nonaktifkan saja jika tidak ingin dipakai lagi.`,
      };
    }

    // 2. Aman untuk dihapus (tidak ada relasi)
    await db
      .delete(schema.masterBakuMutu)
      .where(eq(schema.masterBakuMutu.id, id));

    revalidatePath('/baku-mutu');
    return {
      success: true,
      message: 'Parameter baku mutu berhasil dihapus permanen.',
    };
  } catch (error) {
    console.error('Error deleteBakuMutuAction:', error);
    return {
      success: false,
      message: 'Gagal menghapus parameter baku mutu.',
    };
  }
}
```

### 3. Update Client Component

**File**: `app/(dashboard)/baku-mutu/client.tsx`

Perubahan yang diperlukan:

1. **Import** `toggleBakuMutuAction` dan `deleteBakuMutuAction`.
2. **Tambah tombol Nonaktifkan/Aktifkan** pada setiap baris tabel:
   - Untuk item yang `aktif: true` → Tombol "Nonaktifkan" (ikon `EyeOff` / `ToggleLeft`)
   - Untuk item yang `aktif: false` → Tombol "Aktifkan" (ikon `Eye` / `ToggleRight`)
   - Handler memanggil `toggleBakuMutuAction(id, !currentAktif)`.
3. **Tambah tombol Hapus** (ikon `Trash2`) pada setiap baris tabel:
   - Tampilkan dialog konfirmasi sebelum menghapus.
   - Handler memanggil `deleteBakuMutuAction(id)`.
   - Jika gagal karena relasi → tampilkan toast error dengan pesan dari server.
4. **Gunakan Dropdown Menu** untuk aksi per baris (≥3 aksi: Revisi, Nonaktifkan, Hapus) agar UI tidak terlalu crowded:

```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, FileEdit, EyeOff, Eye, Trash2 } from 'lucide-react';

// Di dalam setiap TableRow:
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon-xs">
      <MoreHorizontal className="size-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => handleOpenRevision(item)}>
      <FileEdit className="size-3.5 mr-2" />
      Revisi Parameter
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => handleToggleAktif(item)}>
      {item.aktif ? <EyeOff className="size-3.5 mr-2" /> : <Eye className="size-3.5 mr-2" />}
      {item.aktif ? 'Nonaktifkan' : 'Aktifkan Kembali'}
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      variant="destructive"
      onClick={() => handleDelete(item)}
    >
      <Trash2 className="size-3.5 mr-2" />
      Hapus Permanen
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Catatan Penting

- Schema DB **tidak perlu diubah** — kolom `aktif` sudah ada pada `masterBakuMutu`.
- Proteksi hapus sudah ada di level database (`onDelete: 'restrict'` pada `detailUjiParameter.baku_mutu_id`), tapi kita tetap perlu **cek di application layer** agar bisa memberikan pesan error yang ramah pengguna.
- Saat menampilkan Combobox baku mutu di form uji baru, sudah ada filter `aktif` yang benar.
