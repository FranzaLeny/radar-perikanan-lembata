'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileCheck2,
  Plus,
  Search,
  X,
  ExternalLink,
  QrCode,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  Loader2,
  FolderKanban,
  FileText,
  TestTube2,
  BookOpen,
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { toFieldErrors } from '@/lib/utils';
import { dokumenMutuSchema } from '@/lib/validations/dokumen-mutu';
import {
  createDokumenMutuAction,
  updateDokumenMutuAction,
  deleteDokumenMutuAction,
  toggleDokumenMutuAction,
} from '@/lib/actions/dokumen-mutu';

export interface KategoriItem {
  id: string;
  kode_kategori: string;
  nama_kategori: string;
  deskripsi?: string | null;
  urutan: number;
  aktif: boolean;
}

export interface DokumenMutuItem {
  id: string;
  kode_ik: string;
  judul: string;
  kategori: string | null;
  kategori_id?: string | null;
  kategoriDokumen?: KategoriItem | null;
  parameter_uji?: string | null;
  metode_pengujian?: string | null;
  deskripsi?: string | null;
  file_path: string;
  qr_code_hash: string;
  versi: number;
  aktif?: boolean;
  createdAt: Date | string;
}

interface DokumenMutuClientProps {
  initialList: DokumenMutuItem[];
  kategoriList: KategoriItem[];
  parameterList: string[];
}

export function DokumenMutuClient({
  initialList,
  kategoriList,
  parameterList,
}: DokumenMutuClientProps) {
  const router = useRouter();
  const [list, setList] = useState<DokumenMutuItem[]>(initialList);
  const [selectedKategoriTab, setSelectedKategoriTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State Tambah
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedKategoriId, setSelectedKategoriId] = useState<string>(
    kategoriList.find((k) => k.kode_kategori === 'IK')?.id || kategoriList[0]?.id || ''
  );
  const [kodeDokumen, setKodeDokumen] = useState('');
  const [judul, setJudul] = useState('');
  const [parameterUji, setParameterUji] = useState('');
  const [metodePengujian, setMetodePengujian] = useState('');
  const [filePath, setFilePath] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Modal State Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DokumenMutuItem | null>(null);
  const [editKategoriId, setEditKategoriId] = useState('');
  const [editJudul, setEditJudul] = useState('');
  const [editParameterUji, setEditParameterUji] = useState('');
  const [editMetodePengujian, setEditMetodePengujian] = useState('');
  const [editFilePath, setEditFilePath] = useState('');
  const [editDeskripsi, setEditDeskripsi] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Deteksi apakah kategori yang dipilih adalah Instruksi Kerja (IK)
  const isIKCategory = useMemo(() => {
    const kat = kategoriList.find((k) => k.id === selectedKategoriId);
    return kat?.kode_kategori === 'IK';
  }, [kategoriList, selectedKategoriId]);

  const isEditIKCategory = useMemo(() => {
    const kat = kategoriList.find((k) => k.id === editKategoriId);
    return kat?.kode_kategori === 'IK';
  }, [kategoriList, editKategoriId]);

  const handleOpenAdd = () => {
    const defaultIK = kategoriList.find((k) => k.kode_kategori === 'IK') || kategoriList[0];
    const katId = defaultIK?.id || '';
    setSelectedKategoriId(katId);

    const ikCount = list.filter((d) => d.kode_ik.startsWith('IK-')).length + 1;
    const padded = String(ikCount).padStart(3, '0');
    setKodeDokumen(`IK-${padded}`);
    setJudul('');
    setParameterUji(parameterList[0] || 'pH');
    setMetodePengujian('SNI 6989.11:2019 (In-situ pH Meter)');
    setFilePath(`/uploads/ik-${padded}.pdf`);
    setDeskripsi('');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleKategoriChange = (newKatId: string) => {
    setSelectedKategoriId(newKatId);
    const kat = kategoriList.find((k) => k.id === newKatId);
    const prefix = kat?.kode_kategori || 'DOC';
    const count = list.filter((d) => d.kode_ik.startsWith(`${prefix}-`)).length + 1;
    const padded = String(count).padStart(3, '0');
    setKodeDokumen(`${prefix}-${padded}`);
    setFilePath(`/uploads/${prefix.toLowerCase()}-${padded}.pdf`);
  };

  const handleOpenEdit = (item: DokumenMutuItem) => {
    setEditingItem(item);
    setEditKategoriId(item.kategori_id || kategoriList[0]?.id || '');
    setEditJudul(item.judul);
    setEditParameterUji(item.parameter_uji || '');
    setEditMetodePengujian(item.metode_pengujian || '');
    setEditFilePath(item.file_path);
    setEditDeskripsi(item.deskripsi || '');
    setIsEditModalOpen(true);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (isIKCategory && !metodePengujian.trim()) {
      setFieldErrors({ metode_pengujian: ['Nama metode pengujian resmi wajib diisi untuk Instruksi Kerja (misal: SNI XX)'] });
      return;
    }

    const payload = {
      kategori_id: selectedKategoriId,
      kode_dokumen: kodeDokumen.trim(),
      judul: judul.trim(),
      parameter_uji: isIKCategory ? parameterUji.trim() : null,
      metode_pengujian: isIKCategory ? metodePengujian.trim() : null,
      deskripsi: deskripsi.trim() || null,
      file_path: filePath.trim(),
      versi: 1,
      aktif: true,
    };

    const validation = dokumenMutuSchema.safeParse(payload);
    if (!validation.success) {
      setFieldErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createDokumenMutuAction(payload);
      if (res.success && res.data) {
        const kat = kategoriList.find((k) => k.id === selectedKategoriId);
        setList([{ ...res.data, kategoriDokumen: kat } as DokumenMutuItem, ...list]);
        toast.success(res.message);
        setIsModalOpen(false);
      } else {
        if (res.errors) setFieldErrors(res.errors as any);
        toast.error(res.message || 'Gagal menyimpan dokumen mutu.');
      }
    } catch {
      toast.error('Terjadi kesalahan sistem saat menyimpan dokumen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editJudul.trim() || !editFilePath.trim()) {
      toast.error('Judul dan File Dokumen wajib diisi.');
      return;
    }

    if (isEditIKCategory && !editMetodePengujian.trim()) {
      toast.error('Nama metode pengujian resmi wajib diisi untuk Instruksi Kerja.');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updateDokumenMutuAction(editingItem.id, {
        kategori_id: editKategoriId,
        judul: editJudul.trim(),
        parameter_uji: isEditIKCategory ? editParameterUji.trim() : null,
        metode_pengujian: isEditIKCategory ? editMetodePengujian.trim() : null,
        deskripsi: editDeskripsi.trim() || null,
        file_path: editFilePath.trim(),
      });

      if (res.success && res.data) {
        const kat = kategoriList.find((k) => k.id === editKategoriId);
        setList(
          list.map((item) =>
            item.id === editingItem.id ? ({ ...res.data, kategoriDokumen: kat } as DokumenMutuItem) : item
          )
        );
        toast.success(res.message);
        setIsEditModalOpen(false);
      } else {
        toast.error(res.message || 'Gagal memperbarui dokumen.');
      }
    } catch {
      toast.error('Terjadi kesalahan sistem.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleAktif = async (item: DokumenMutuItem) => {
    const newStatus = !(item.aktif !== false);
    try {
      const res = await toggleDokumenMutuAction(item.id, newStatus);
      if (res.success) {
        setList(list.map((d) => (d.id === item.id ? { ...d, aktif: newStatus } : d)));
        toast.success(res.message);
      } else {
        toast.error(res.message || 'Gagal mengubah status dokumen.');
      }
    } catch {
      toast.error('Gagal mengubah status dokumen.');
    }
  };

  const handleDelete = async (item: DokumenMutuItem) => {
    if (!confirm(`Hapus permanen dokumen "${item.judul}" (${item.kode_ik})? Tindakan ini tidak dapat dibatalkan.`)) return;

    try {
      const res = await deleteDokumenMutuAction(item.id);
      if (res.success) {
        setList(list.filter((d) => d.id !== item.id));
        toast.success(res.message);
      } else {
        toast.error(res.message || 'Gagal menghapus dokumen.');
      }
    } catch {
      toast.error('Gagal menghapus dokumen.');
    }
  };

  // Filter List
  const filteredList = list.filter((item) => {
    if (selectedKategoriTab !== 'all') {
      const itemKode = item.kategoriDokumen?.kode_kategori || (item.kode_ik.split('-')[0] || '');
      if (itemKode !== selectedKategoriTab && item.kategori_id !== selectedKategoriTab) {
        return false;
      }
    }

    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase().trim();
    return (
      item.kode_ik.toLowerCase().includes(query) ||
      item.judul.toLowerCase().includes(query) ||
      (item.parameter_uji && item.parameter_uji.toLowerCase().includes(query)) ||
      (item.metode_pengujian && item.metode_pengujian.toLowerCase().includes(query)) ||
      (item.kategori && item.kategori.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge
            variant="secondary"
            className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-xs font-semibold uppercase tracking-wider"
          >
            <BookOpen className="size-3" />
            <span>Sistem Manajemen Mutu</span>
          </Badge>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Dokumen Mutu & Instruksi Kerja (IK)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Katalog dokumen standarisasi mutu air budidaya: Pedoman Mutu, Prosedur Pelaksanaan, SOP, Instruksi Kerja per parameter, dan Formulir resmi.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link href="/dokumen-mutu/kategori">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs cursor-pointer">
              <FolderKanban className="size-3.5" />
              <span>Kelola Kategori</span>
            </Button>
          </Link>

          <Button onClick={handleOpenAdd} size="sm" className="gap-1.5 text-xs cursor-pointer shadow-xs">
            <Plus className="size-3.5" />
            <span>Tambah Dokumen</span>
          </Button>
        </div>
      </div>

      {/* Tabs Filter Kategori & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <Tabs value={selectedKategoriTab} onValueChange={setSelectedKategoriTab}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs gap-1.5">
              <span>Semua Dokumen</span>
              <Badge variant="secondary" className="text-[11px] px-1 py-0">
                {list.length}
              </Badge>
            </TabsTrigger>
            {kategoriList.map((kat) => {
              const count = list.filter(
                (d) =>
                  d.kategoriDokumen?.kode_kategori === kat.kode_kategori ||
                  d.kategori_id === kat.id ||
                  d.kode_ik.startsWith(`${kat.kode_kategori}-`)
              ).length;

              return (
                <TabsTrigger key={kat.id} value={kat.kode_kategori} className="text-xs gap-1.5">
                  <span>{kat.nama_kategori}</span>
                  <Badge variant="outline" className="text-[11px] px-1 py-0">
                    {count}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <InputGroup className="w-full sm:w-72">
            <InputGroupAddon align="inline-start">
              <Search className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kode, judul, metode, parameter..."
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

          {filteredList.length < list.length ? (
            <Badge variant="secondary" className="text-xs py-0.5 shrink-0">
              {filteredList.length} dari {list.length}
            </Badge>
          ) : null}
        </div>
      </div>

      {/* Table Dokumen Mutu */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold w-28">Kode Dokumen</TableHead>
                <TableHead className="text-xs font-semibold w-36">Kategori</TableHead>
                <TableHead className="text-xs font-semibold">Judul & Spesifikasi Metode</TableHead>
                <TableHead className="text-xs font-semibold text-center w-20">Versi</TableHead>
                <TableHead className="text-xs font-semibold text-center w-24">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-xs">
                    {searchTerm ? (
                      <p>Tidak ada dokumen mutu yang cocok dengan &ldquo;{searchTerm}&rdquo;.</p>
                    ) : (
                      <p>Belum ada dokumen mutu pada kategori ini.</p>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredList.map((item) => {
                  const isIK =
                    item.kategoriDokumen?.kode_kategori === 'IK' ||
                    item.kode_ik.startsWith('IK-') ||
                    Boolean(item.parameter_uji);

                  return (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono font-bold text-xs text-foreground">
                        {item.kode_ik}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            isIK
                              ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300'
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {item.kategoriDokumen?.nama_kategori || item.kategori || 'Dokumen Mutu'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="space-y-1">
                          <p className="font-medium text-foreground leading-snug">{item.judul}</p>

                          {/* Khusus IK: Tampilkan Parameter & Metode Pengujian Resmi */}
                          {isIK ? (
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                              {item.parameter_uji && (
                                <Badge
                                  variant="outline"
                                  className="text-[11px] bg-primary/5 text-primary border-primary/20 gap-1"
                                >
                                  <TestTube2 className="size-2.5" />
                                  <span>Parameter: <strong>{item.parameter_uji}</strong></span>
                                </Badge>
                              )}
                              {item.metode_pengujian && (
                                <Badge variant="secondary" className="text-[11px] font-mono">
                                  Metode: {item.metode_pengujian}
                                </Badge>
                              )}
                            </div>
                          ) : null}

                          {item.deskripsi && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1">{item.deskripsi}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs">
                        <Badge variant="outline" className="text-[11px]">
                          v{item.versi}.0
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.aktif !== false ? (
                          <Badge
                            variant="outline"
                            className="border-emerald-300 text-emerald-800 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-[11px]"
                          >
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[11px]">
                            Nonaktif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="inline-flex items-center justify-center rounded-md size-7 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors focus-visible:outline-none"
                            title="Menu Aksi"
                          >
                            <MoreVertical className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-xs">Aksi Dokumen</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => window.open(item.file_path, '_blank', 'noreferrer')} className="cursor-pointer">
                                <ExternalLink className="size-3.5 mr-2" />
                                <span>Buka / Unduh File</span>
                              </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dokumen-mutu/${item.id}/cetak-label`)} className="cursor-pointer">
                                <QrCode className="size-3.5 mr-2" />
                                <span>Cetak Label QR Botol</span>
                              </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleOpenEdit(item)}>
                              <Pencil className="size-3.5 mr-2" />
                              <span>Edit Dokumen</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleAktif(item)}>
                              {item.aktif !== false ? (
                                <>
                                  <EyeOff className="size-3.5 mr-2 text-amber-600" />
                                  <span>Nonaktifkan</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="size-3.5 mr-2 text-emerald-600" />
                                  <span>Aktifkan Kembali</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDelete(item)}
                            >
                              <Trash2 className="size-3.5 mr-2" />
                              <span>Hapus Permanen</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Modal Tambah Dokumen Mutu */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck2 className="size-4 text-primary" />
              <span>Tambah Dokumen Mutu Baru</span>
            </DialogTitle>
            <DialogDescription>
              Daftarkan dokumen standarisasi mutu. Untuk kategori Instruksi Kerja (IK), pastikan menghubungkan ke 1 parameter kualitas air beserta nama metode ujinya.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitAdd} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="kategori">Kategori Dokumen *</FieldLabel>
                <Select value={selectedKategoriId} onValueChange={(val) => handleKategoriChange(val || "")}>
                  <SelectTrigger id="kategori" className="w-full">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategoriList.map((kat) => (
                      <SelectItem key={kat.id} value={kat.id}>
                        [{kat.kode_kategori}] {kat.nama_kategori}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="kode_dokumen">Kode Dokumen *</FieldLabel>
                <Input
                  id="kode_dokumen"
                  type="text"
                  value={kodeDokumen}
                  onChange={(e) => setKodeDokumen(e.target.value)}
                  placeholder="Contoh: IK-001 / SOP-001"
                  className="font-mono"
                />
                <FieldError errors={toFieldErrors(fieldErrors.kode_dokumen)} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="judul">Judul Dokumen *</FieldLabel>
              <Input
                id="judul"
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Pengujian Derajat Keasaman (pH) Air Kolam"
              />
              <FieldError errors={toFieldErrors(fieldErrors.judul)} />
            </Field>

            {/* Bagian Khusus Kategori Instruksi Kerja (IK): 1 IK = 1 Parameter + Wajib Metode */}
            {isIKCategory ? (
              <div className="p-3 bg-muted/40 border border-border rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <TestTube2 className="size-3.5 text-primary" />
                  <span>Spesifikasi Parameter & Metode Pengujian (Wajib IK)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="parameter_uji">Parameter Kualitas Air *</FieldLabel>
                    <Select value={parameterUji} onValueChange={(val) => setParameterUji(val || "")}>
                      <SelectTrigger id="parameter_uji" className="w-full">
                        <SelectValue placeholder="Pilih 1 Parameter" />
                      </SelectTrigger>
                      <SelectContent>
                        {parameterList.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldDescription>Setiap 1 IK terhubung ke 1 parameter pengujian.</FieldDescription>
                    <FieldError errors={toFieldErrors(fieldErrors.parameter_uji)} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="metode_pengujian">Nama Metode Pengujian *</FieldLabel>
                    <Input
                      id="metode_pengujian"
                      type="text"
                      value={metodePengujian}
                      onChange={(e) => setMetodePengujian(e.target.value)}
                      placeholder="Contoh: SNI 6989.11:2019 / In-situ DO Meter"
                    />
                    <FieldDescription>Nama standar metode resmi (SNI, APHA, dll.).</FieldDescription>
                    <FieldError errors={toFieldErrors(fieldErrors.metode_pengujian)} />
                  </Field>
                </div>
              </div>
            ) : null}

            <Field>
              <FieldLabel htmlFor="file_path">File Path / Tautan Dokumen PDF *</FieldLabel>
              <Input
                id="file_path"
                type="text"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                placeholder="/uploads/ik-001.pdf atau URL Google Drive"
              />
              <FieldError errors={toFieldErrors(fieldErrors.file_path)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="deskripsi">Keterangan / Ringkasan Dokumen (Opsional)</FieldLabel>
              <Input
                id="deskripsi"
                type="text"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Catatan ruang lingkup atau petunjuk singkat pelaksanaan"
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
                ) : (
                  'Simpan Dokumen'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Dokumen Mutu */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="size-4 text-primary" />
              <span>Edit Dokumen: {editingItem?.kode_ik}</span>
            </DialogTitle>
            <DialogDescription>
              Menyimpan perubahan akan otomatis menaikkan versi dokumen (v{((editingItem?.versi || 1) + 1)}.0). QR Code fisik yang sudah tercetak tetap berfungsi normal.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitEdit} className="space-y-4 py-2">
            <Field>
              <FieldLabel htmlFor="edit_kategori">Kategori Dokumen</FieldLabel>
              <Select value={editKategoriId} onValueChange={(val) => setEditKategoriId(val || "")}>
                <SelectTrigger id="edit_kategori" className="w-full">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {kategoriList.map((kat) => (
                    <SelectItem key={kat.id} value={kat.id}>
                      [{kat.kode_kategori}] {kat.nama_kategori}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="edit_judul">Judul Dokumen *</FieldLabel>
              <Input
                id="edit_judul"
                type="text"
                value={editJudul}
                onChange={(e) => setEditJudul(e.target.value)}
              />
            </Field>

            {isEditIKCategory ? (
              <div className="p-3 bg-muted/40 border border-border rounded-lg space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="edit_param">Parameter Kualitas Air</FieldLabel>
                    <Select value={editParameterUji} onValueChange={(val) => setEditParameterUji(val || "")}>
                      <SelectTrigger id="edit_param" className="w-full">
                        <SelectValue placeholder="Pilih Parameter" />
                      </SelectTrigger>
                      <SelectContent>
                        {parameterList.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="edit_metode">Nama Metode Pengujian *</FieldLabel>
                    <Input
                      id="edit_metode"
                      type="text"
                      value={editMetodePengujian}
                      onChange={(e) => setEditMetodePengujian(e.target.value)}
                      placeholder="Contoh: SNI 6989.11:2019"
                    />
                  </Field>
                </div>
              </div>
            ) : null}

            <Field>
              <FieldLabel htmlFor="edit_file_path">File Path / Tautan Dokumen PDF *</FieldLabel>
              <Input
                id="edit_file_path"
                type="text"
                value={editFilePath}
                onChange={(e) => setEditFilePath(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit_deskripsi">Keterangan / Deskripsi</FieldLabel>
              <Input
                id="edit_deskripsi"
                type="text"
                value={editDeskripsi}
                onChange={(e) => setEditDeskripsi(e.target.value)}
              />
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
                    Memperbarui...
                  </>
                ) : (
                  'Perbarui Versi Dokumen'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
