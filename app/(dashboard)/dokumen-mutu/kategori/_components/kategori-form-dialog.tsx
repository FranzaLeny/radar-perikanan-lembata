import React from 'react';
import { FolderKanban, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/components/ui/field';
import { toFieldErrors } from '@/lib/utils';
import type { KategoriItem } from '../../client';

interface KategoriFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  selectedItem: KategoriItem | null;
  kodeKategori: string;
  setKodeKategori: (val: string) => void;
  namaKategori: string;
  setNamaKategori: (val: string) => void;
  deskripsi: string;
  setDeskripsi: (val: string) => void;
  urutan: string;
  setUrutan: (val: string) => void;
  fieldErrors: Record<string, string[]>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function KategoriFormDialog({
  open,
  onOpenChange,
  isEditing,
  selectedItem,
  kodeKategori,
  setKodeKategori,
  namaKategori,
  setNamaKategori,
  deskripsi,
  setDeskripsi,
  urutan,
  setUrutan,
  fieldErrors,
  isSubmitting,
  onSubmit,
}: KategoriFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderKanban className="size-4 text-primary" />
            <span>
              {isEditing
                ? `Edit Kategori: ${selectedItem?.nama_kategori}`
                : 'Tambah Kategori Dokumen'}
            </span>
          </DialogTitle>
          <DialogDescription>
            Kelola kategori dokumen standarisasi mutu laboratorium perikanan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <Field>
            <FieldLabel htmlFor="kode_kategori">
              Kode Singkatan Kategori *
            </FieldLabel>
            <Input
              id="kode_kategori"
              type="text"
              value={kodeKategori}
              onChange={(e) => setKodeKategori(e.target.value.toUpperCase())}
              placeholder="Contoh: PM, PP, SOP, IK, FR"
              className="font-mono uppercase"
              disabled={isEditing}
            />
            <FieldDescription>
              Akronim resmi kategori (maksimal 20 karakter).
            </FieldDescription>
            <FieldError errors={toFieldErrors(fieldErrors.kode_kategori)} />
          </Field>

          <Field>
            <FieldLabel htmlFor="nama_kategori">
              Nama Kategori Dokumen *
            </FieldLabel>
            <Input
              id="nama_kategori"
              type="text"
              value={namaKategori}
              onChange={(e) => setNamaKategori(e.target.value)}
              placeholder="Contoh: Instruksi Kerja"
            />
            <FieldError errors={toFieldErrors(fieldErrors.nama_kategori)} />
          </Field>

          <Field>
            <FieldLabel htmlFor="deskripsi">Deskripsi / Ruang Lingkup</FieldLabel>
            <Input
              id="deskripsi"
              type="text"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Penjelasan fungsi kategori dokumen"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="urutan">Nomor Urutan Tampilan</FieldLabel>
            <Input
              id="urutan"
              type="number"
              value={urutan}
              onChange={(e) => setUrutan(e.target.value)}
              placeholder="1"
              className="font-mono"
            />
          </Field>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Menyimpan...
                </>
              ) : isEditing ? (
                'Simpan Perubahan'
              ) : (
                'Tambah Kategori'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
