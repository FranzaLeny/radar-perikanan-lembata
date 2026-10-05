'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  FileCheck2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/components/ui/field';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { toFieldErrors } from '@/lib/utils';
import { kategoriDokumenSchema } from '@/lib/validations/dokumen-mutu';
import {
  createKategoriDokumenAction,
  updateKategoriDokumenAction,
  deleteKategoriDokumenAction,
  toggleKategoriDokumenAction,
} from '@/lib/actions/dokumen-mutu';
import type { KategoriItem } from '../client';

export function KategoriDokumenClient({
  initialList,
}: {
  initialList: (KategoriItem & { documentCount?: number })[];
}) {
  const [list, setList] = useState(initialList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KategoriItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [kodeKategori, setKodeKategori] = useState('');
  const [namaKategori, setNamaKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [urutan, setUrutan] = useState('0');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedItem(null);
    setKodeKategori('');
    setNamaKategori('');
    setDeskripsi('');
    setUrutan(String(list.length + 1));
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: KategoriItem) => {
    setIsEditing(true);
    setSelectedItem(item);
    setKodeKategori(item.kode_kategori);
    setNamaKategori(item.nama_kategori);
    setDeskripsi(item.deskripsi || '');
    setUrutan(String(item.urutan || 0));
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const payload = {
      kode_kategori: kodeKategori.trim().toUpperCase(),
      nama_kategori: namaKategori.trim(),
      deskripsi: deskripsi.trim() || null,
      urutan: Number(urutan) || 0,
      aktif: true,
    };

    const validation = kategoriDokumenSchema.safeParse(payload);
    if (!validation.success) {
      setFieldErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && selectedItem) {
        const res = await updateKategoriDokumenAction(selectedItem.id, payload);
        if (res.success && res.data) {
          setList(
            list.map((k) =>
              k.id === selectedItem.id ? { ...k, ...res.data } : k
            )
          );
          toast.success(res.message);
          setIsModalOpen(false);
        } else {
          toast.error(res.message || 'Gagal memperbarui kategori.');
        }
      } else {
        const res = await createKategoriDokumenAction(payload);
        if (res.success && res.data) {
          setList([...list, { ...res.data, documentCount: 0 }]);
          toast.success(res.message);
          setIsModalOpen(false);
        } else {
          if (res.errors) setFieldErrors(res.errors as any);
          toast.error(res.message || 'Gagal menyimpan kategori.');
        }
      }
    } catch {
      toast.error('Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAktif = async (item: KategoriItem) => {
    const newStatus = !item.aktif;
    try {
      const res = await toggleKategoriDokumenAction(item.id, newStatus);
      if (res.success) {
        setList(list.map((k) => (k.id === item.id ? { ...k, aktif: newStatus } : k)));
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Gagal mengubah status kategori.');
    }
  };

  const handleDelete = async (item: KategoriItem) => {
    if (!confirm(`Hapus permanen kategori "${item.nama_kategori}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    try {
      const res = await deleteKategoriDokumenAction(item.id);
      if (res.success) {
        setList(list.filter((k) => k.id !== item.id));
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Gagal menghapus kategori.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/dokumen-mutu">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1 cursor-pointer">
              <ArrowLeft className="size-3.5" />
              <span>Kembali ke Katalog Dokumen Mutu</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground flex items-center gap-2">
            <FolderKanban className="size-6 text-primary" />
            <span>Manajemen Kategori Dokumen Mutu</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Atur struktur kategori standarisasi mutu seperti Pedoman Mutu (PM), Prosedur Pelaksanaan (PP), Standar Operasional Prosedur (SOP), Instruksi Kerja (IK), dan Formulir (FR).
          </p>
        </div>

        <Button onClick={handleOpenAdd} size="sm" className="gap-1.5 text-xs cursor-pointer shadow-xs self-start sm:self-auto">
          <Plus className="size-3.5" />
          <span>Tambah Kategori Baru</span>
        </Button>
      </div>

      {/* Table Card */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold w-24">Kode</TableHead>
              <TableHead className="text-xs font-semibold">Nama Kategori Dokumen</TableHead>
              <TableHead className="text-xs font-semibold">Deskripsi / Ruang Lingkup</TableHead>
              <TableHead className="text-xs font-semibold text-center w-24">Urutan</TableHead>
              <TableHead className="text-xs font-semibold text-center w-24">Status</TableHead>
              <TableHead className="text-xs font-semibold text-right w-28">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-bold text-xs">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {item.kode_kategori}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-foreground text-xs">
                  {item.nama_kategori}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {item.deskripsi || '-'}
                </TableCell>
                <TableCell className="text-center font-mono text-xs text-muted-foreground">
                  {item.urutan}
                </TableCell>
                <TableCell className="text-center">
                  {item.aktif ? (
                    <Badge variant="outline" className="border-emerald-300 text-emerald-800 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-[11px]">
                      Aktif
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[11px]">
                      Nonaktif
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleOpenEdit(item)}
                      title="Edit Kategori"
                      className="cursor-pointer"
                    >
                      <Pencil className="size-3.5 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleToggleAktif(item)}
                      title={item.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                      className="cursor-pointer"
                    >
                      {item.aktif ? (
                        <EyeOff className="size-3.5 text-amber-600" />
                      ) : (
                        <Eye className="size-3.5 text-emerald-600" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDelete(item)}
                      title="Hapus Kategori"
                      className="cursor-pointer text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modal Tambah / Edit Kategori */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderKanban className="size-4 text-primary" />
              <span>{isEditing ? `Edit Kategori: ${selectedItem?.nama_kategori}` : 'Tambah Kategori Dokumen'}</span>
            </DialogTitle>
            <DialogDescription>
              Kelola kategori dokumen standarisasi mutu laboratorium perikanan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <Field>
              <FieldLabel htmlFor="kode_kategori">Kode Singkatan Kategori *</FieldLabel>
              <Input
                id="kode_kategori"
                type="text"
                value={kodeKategori}
                onChange={(e) => setKodeKategori(e.target.value.toUpperCase())}
                placeholder="Contoh: PM, PP, SOP, IK, FR"
                className="font-mono uppercase"
                disabled={isEditing}
              />
              <FieldDescription>Akronim resmi kategori (maksimal 20 karakter).</FieldDescription>
              <FieldError errors={toFieldErrors(fieldErrors.kode_kategori)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="nama_kategori">Nama Kategori Dokumen *</FieldLabel>
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
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
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
    </div>
  );
}
