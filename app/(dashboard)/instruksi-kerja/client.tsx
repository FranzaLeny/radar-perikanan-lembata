'use client';

import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  QrCode,
  Trash2,
  FileText,
  Loader2,
  Search,
  X,
  ExternalLink,
  Pencil,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group';
import { toFieldErrors } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Card,
} from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { instruksiKerjaSchema } from '@/lib/validations/instruksi-kerja';
import {
  createInstruksiKerjaAction,
  updateInstruksiKerjaAction,
  deleteInstruksiKerjaAction,
} from '@/lib/actions/instruksi-kerja';

interface IKItem {
  id: string;
  kode_ik: string;
  judul: string;
  kategori: string | null;
  file_path: string;
  qr_code_hash: string;
  versi: number;
  createdAt: Date;
}

export function InstruksiKerjaClient({ initialList }: { initialList: IKItem[] }) {
  const [list, setList] = useState<IKItem[]>(initialList);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State Tambah
  const [kodeIk, setKodeIk] = useState('');
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Standar Operasional In-Situ');
  const [filePath, setFilePath] = useState('');
  const [versi, setVersi] = useState('1');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Form State Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IKItem | null>(null);
  const [editJudul, setEditJudul] = useState('');
  const [editKategori, setEditKategori] = useState('');
  const [editFilePath, setEditFilePath] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOpenModal = () => {
    const nextNum = list.length + 1;
    const padded = String(nextNum).padStart(3, '0');
    setKodeIk(`IK-${padded}`);
    setJudul('');
    setFilePath(`/uploads/ik-${padded}.pdf`);
    setVersi('1');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: IKItem) => {
    setEditingItem(item);
    setEditJudul(item.judul);
    setEditKategori(item.kategori || 'Standar Operasional In-Situ');
    setEditFilePath(item.file_path);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editJudul.trim() || !editFilePath.trim()) {
      toast.error('Judul dan Tautan / File Dokumen wajib diisi.');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updateInstruksiKerjaAction(editingItem.id, {
        judul: editJudul,
        kategori: editKategori,
        file_path: editFilePath,
      });

      if (res.success && res.data) {
        setList(list.map((x) => (x.id === editingItem.id ? (res.data as IKItem) : x)));
        toast.success(res.message || 'Instruksi Kerja berhasil diperbarui.');
        setIsEditModalOpen(false);
      } else {
        toast.error(res.message || 'Gagal memperbarui Instruksi Kerja.');
      }
    } catch {
      toast.error('Gagal memperbarui Instruksi Kerja.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // 1. Validasi Zod Client-Side
    const validation = instruksiKerjaSchema.safeParse({
      kode_ik: kodeIk,
      judul,
      kategori,
      file_path: filePath,
      versi: Number(versi),
    });

    if (!validation.success) {
      setFieldErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createInstruksiKerjaAction({
        kode_ik: kodeIk,
        judul,
        kategori,
        file_path: filePath,
        versi: Number(versi),
      });

      if (res.success && res.data) {
        setList([res.data as IKItem, ...list]);
        toast.success(res.message || 'Instruksi kerja berhasil diterbitkan.');
        setIsModalOpen(false);
      } else {
        if (res.errors) {
          setFieldErrors(res.errors as Record<string, string[]>);
        }
        toast.error(res.message || 'Gagal menyimpan Instruksi Kerja.');
      }
    } catch {
      toast.error('Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, kode: string) => {
    if (!confirm(`Hapus Instruksi Kerja "${kode}"? Dokumen QR terkait tidak akan valid.`)) return;

    try {
      const res = await deleteInstruksiKerjaAction(id);
      if (res.success) {
        setList(list.filter((x) => x.id !== id));
        toast.success(res.message || 'Instruksi Kerja berhasil dihapus.');
      } else {
        toast.error(res.message || 'Gagal menghapus.');
      }
    } catch {
      toast.error('Gagal menghapus Instruksi Kerja.');
    }
  };

  const filteredList = list.filter((item) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase().trim();
    return (
      item.kode_ik.toLowerCase().includes(query) ||
      item.judul.toLowerCase().includes(query) ||
      (item.kategori && item.kategori.toLowerCase().includes(query)) ||
      item.qr_code_hash.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-primary border-primary/30 bg-primary/5 text-xs font-semibold uppercase tracking-wider">
            <FileCheck2 className="size-3" />
            <span>SOP & Penjaminan Mutu</span>
          </Badge>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Instruksi Kerja (IK) & Integrasi Label QR
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Standard Operating Procedure (SOP) pengujian mutu air dengan generator QR Code unik untuk stiker botol sampel.
          </p>
        </div>

        <Button onClick={handleOpenModal} className="gap-2 shadow-xs self-start sm:self-auto cursor-pointer">
          <Plus className="size-4" />
          <span>Tambah Dokumen IK Baru</span>
        </Button>
      </div>

      {/* Search Bar & Indikator Komparasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <InputGroup className="flex-1 max-w-md">
          <InputGroupAddon align="inline-start">
            <Search className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kode SOP, judul prosedur, atau kategori..."
          />
          {searchTerm && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                size="icon-xs"
                onClick={() => setSearchTerm('')}
                title="Hapus pencarian"
              >
                <X className="size-3.5" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          {filteredList.length < list.length ? (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs py-0.5">
                Menampilkan {filteredList.length} dari {list.length} SOP (Hasil Filter)
              </Badge>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setSearchTerm('')}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Reset
              </Button>
            </div>
          ) : (
            <span className="text-muted-foreground">
              Total: <strong className="text-foreground">{list.length}</strong> SOP terdaftar
            </span>
          )}
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold">Kode IK</TableHead>
                <TableHead className="text-xs font-semibold">Judul Prosedur SOP</TableHead>
                <TableHead className="text-xs font-semibold">Kategori</TableHead>
                <TableHead className="text-xs font-semibold">Versi</TableHead>
                <TableHead className="text-xs font-semibold">Hash QR Verifikasi</TableHead>
                <TableHead className="text-xs font-semibold text-right">Label QR & Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    {searchTerm ? (
                      <div className="space-y-1.5">
                        <p>Tidak ada SOP yang cocok dengan pencarian &ldquo;{searchTerm}&rdquo;.</p>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setSearchTerm('')}
                          className="cursor-pointer"
                        >
                          Kosongkan Pencarian
                        </Button>
                      </div>
                    ) : (
                      <p>Belum ada dokumen Instruksi Kerja yang terdaftar.</p>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredList.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono font-bold text-primary text-xs">
                      {item.kode_ik}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      <div className="space-y-0.5">
                        <a
                          href={item.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-foreground hover:text-primary hover:underline inline-flex items-center gap-1.5 transition-colors group cursor-pointer"
                          title={`Buka dokumen: ${item.file_path}`}
                        >
                          <FileText className="size-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                          <span>{item.judul}</span>
                          <ExternalLink className="size-3 text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:text-primary shrink-0" />
                        </a>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-mono">
                          <span className="truncate max-w-[240px]" title={item.file_path}>
                            {item.file_path}
                          </span>
                          {item.file_path.startsWith('http') && (
                            <Badge variant="outline" className="text-xs px-1 py-0 h-4 border-primary/30 text-primary">
                              Tautan Eksternal
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {item.kategori || 'Standar Uji'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      v{item.versi}.0
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground text-xs">
                      <span className="bg-muted px-1.5 py-0.5 rounded text-xs">
                        {item.qr_code_hash.substring(0, 10)}...
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1.5 cursor-pointer"
                          onClick={() => window.open(item.file_path, '_blank', 'noopener,noreferrer')}
                          title="Buka Dokumen SOP / Tautan Langsung"
                        >
                          <ExternalLink className="size-3.5 text-primary" />
                          <span>Buka</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1.5 cursor-pointer"
                          onClick={() => handleOpenEditModal(item)}
                          title="Edit Prosedur SOP atau Tautan Dokumen"
                        >
                          <Pencil className="size-3.5 text-muted-foreground" />
                          <span>Edit</span>
                        </Button>
                        <Link href={`/instruksi-kerja/${item.id}/cetak-label`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 cursor-pointer">
                            <QrCode className="size-3.5 text-primary" />
                            <span>Cetak QR</span>
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(item.id, item.kode_ik)}
                          title="Hapus IK"
                          className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dialog Modal Tambah IK */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck2 className="size-4 text-primary" />
              <span>Registrasi Dokumen SOP / IK Baru</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Setiap IK yang didaftarkan akan secara otomatis mendapatkan hash QR Code unik untuk validasi keabsahan di sistem SIPEKA.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field>
                <FieldLabel htmlFor="kode_ik">
                  Kode IK *
                </FieldLabel>
                <Input
                  id="kode_ik"
                  type="text"
                  value={kodeIk}
                  onChange={(e) => setKodeIk(e.target.value)}
                  placeholder="IK-001"
                  className="font-mono"
                />
                <FieldError errors={toFieldErrors(fieldErrors.kode_ik)} />
              </Field>

              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="kategori">
                  Kategori Standar
                </FieldLabel>
                <Select
                  value={kategori}
                  onValueChange={(val) => {
                    if (val) setKategori(val);
                  }}
                >
                  <SelectTrigger id="kategori">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standar Operasional In-Situ">Standar Operasional In-Situ</SelectItem>
                    <SelectItem value="Uji Kimia Laboratorium">Uji Kimia Laboratorium</SelectItem>
                    <SelectItem value="Uji Mikrobiologi Air">Uji Mikrobiologi Air</SelectItem>
                    <SelectItem value="Pengambilan Sampel Fisika">Pengambilan Sampel Fisika</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="judul">
                Judul Prosedur Instruksi Kerja *
              </FieldLabel>
              <Input
                id="judul"
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Pengambilan Sampel & Pengukuran Lapangan Suhu dan pH Kolam"
              />
              <FieldError errors={toFieldErrors(fieldErrors.judul)} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="file_path">
                  Tautan URL / Path Dokumen *
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="file_path"
                    type="text"
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                    placeholder="https://drive.google.com/... atau /uploads/ik-001.pdf"
                    className="font-mono"
                    required
                  />
                  {filePath.startsWith('http') && (
                    <InputGroupAddon align="inline-end">
                      <ExternalLink className="size-3.5 text-primary pointer-events-none" />
                    </InputGroupAddon>
                  )}
                </InputGroup>
                <FieldDescription>
                  Dapat berupa link eksternal (Google Drive, Cloud Storage) atau file lokal. Kamera ponsel langsung membuka link ini saat QR di-scan.
                </FieldDescription>
                <FieldError errors={toFieldErrors(fieldErrors.file_path)} />
              </Field>

              <Field>
                <FieldLabel htmlFor="versi">
                  Nomor Versi
                </FieldLabel>
                <Input
                  id="versi"
                  type="number"
                  value={versi}
                  onChange={(e) => setVersi(e.target.value)}
                  placeholder="1"
                  className="font-mono"
                />
              </Field>
            </div>

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
                    Menerbitkan...
                  </>
                ) : (
                  'Simpan & Terbitkan QR'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Modal Edit IK (Menjaga QR fisik tetap valid) */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="size-4 text-primary" />
              <span>Edit Dokumen SOP ({editingItem?.kode_ik})</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Perbarui judul prosedur atau tautan dokumen. Barcode QR fisik yang tertempel di kolam akan tetap aktif.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit} className="space-y-4 py-2">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-2.5 text-xs">
              <Info className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">Integritas Keabsahan Stiker QR:</span>
                <p className="text-muted-foreground mt-0.5">
                  Versi akan otomatis naik dari <strong>v{editingItem?.versi}.0</strong> ke{' '}
                  <strong>v{(editingItem?.versi || 1) + 1}.0</strong>. Kode QR fisik tidak berubah.
                </p>
              </div>
            </div>

            <Field>
              <FieldLabel htmlFor="edit_kategori">
                Kategori Standar
              </FieldLabel>
              <Select
                value={editKategori}
                onValueChange={(val) => {
                  if (val) setEditKategori(val);
                }}
              >
                <SelectTrigger id="edit_kategori">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standar Operasional In-Situ">Standar Operasional In-Situ</SelectItem>
                  <SelectItem value="Uji Kimia Laboratorium">Uji Kimia Laboratorium</SelectItem>
                  <SelectItem value="Uji Mikrobiologi Air">Uji Mikrobiologi Air</SelectItem>
                  <SelectItem value="Pengambilan Sampel Fisika">Pengambilan Sampel Fisika</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="edit_judul">
                Judul Prosedur Instruksi Kerja *
              </FieldLabel>
              <Input
                id="edit_judul"
                type="text"
                value={editJudul}
                onChange={(e) => setEditJudul(e.target.value)}
                placeholder="Judul prosedur SOP..."
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit_file_path">
                Tautan URL / Path Dokumen *
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="edit_file_path"
                  type="text"
                  value={editFilePath}
                  onChange={(e) => setEditFilePath(e.target.value)}
                  placeholder="https://drive.google.com/... atau /uploads/ik-001.pdf"
                  className="font-mono"
                  required
                />
                {editFilePath.startsWith('http') && (
                  <InputGroupAddon align="inline-end">
                    <ExternalLink className="size-3.5 text-primary pointer-events-none" />
                  </InputGroupAddon>
                )}
              </InputGroup>
              <FieldDescription>
                Tautan link eksternal (Google Drive / Cloud PDF). Kamera ponsel akan langsung membuka URL ini saat QR di-scan.
              </FieldDescription>
            </Field>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isUpdating}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1.5" />
                    Menyimpan...
                  </>
                ) : (
                  'Perbarui Dokumen SOP'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
