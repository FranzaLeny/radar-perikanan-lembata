'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Pencil,
  Loader2,
  Search,
  X,
  Eye,
  EyeOff,
  MoreHorizontal,
  Star,
  CheckCircle2,
  Shield,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
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
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { pegawaiSchema } from '@/lib/validations/pegawai-master';
import {
  type PegawaiItem,
  createPegawaiAction,
  updatePegawaiAction,
  togglePegawaiAction,
  setPenanggungJawabAction,
  deletePegawaiAction,
} from '@/lib/actions/pegawai';

export function PegawaiClient({ initialList }: { initialList: PegawaiItem[] }) {
  const [list, setList] = useState<PegawaiItem[]>(initialList);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'inactive'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PegawaiItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [nip, setNip] = useState('');
  const [nama, setNama] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [pangkatGolongan, setPangkatGolongan] = useState('');
  const [peranTandaTangan, setPeranTandaTangan] = useState<'penguji' | 'pengelola_mutu' | 'kepala_dinas'>('penguji');
  const [isPenanggungjawab, setIsPenanggungjawab] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleOpenAdd = () => {
    setEditingItem(null);
    setNip('');
    setNama('');
    setJabatan('');
    setPangkatGolongan('');
    setPeranTandaTangan('penguji');
    setIsPenanggungjawab(false);
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PegawaiItem) => {
    setEditingItem(item);
    setNip(item.nip);
    setNama(item.nama);
    setJabatan(item.jabatan);
    setPangkatGolongan(item.pangkat_golongan || '');
    setPeranTandaTangan(
      (item.peran_tanda_tangan as 'penguji' | 'pengelola_mutu' | 'kepala_dinas') || 'penguji'
    );
    setIsPenanggungjawab(item.is_penanggungjawab || false);
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const nipClean = nip.replace(/\s+/g, '');
    const validation = pegawaiSchema.safeParse({
      nip: nipClean,
      nama,
      jabatan,
      pangkat_golongan: pangkatGolongan,
      peran_tanda_tangan: peranTandaTangan,
      is_penanggungjawab: isPenanggungjawab,
    });

    if (!validation.success) {
      setFieldErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        const res = await updatePegawaiAction(editingItem.id, {
          nip: nipClean,
          nama,
          jabatan,
          pangkat_golongan: pangkatGolongan,
          peran_tanda_tangan: peranTandaTangan,
          is_penanggungjawab: isPenanggungjawab,
        });

        if (res.success && res.data) {
          const updated = res.data as PegawaiItem;
          // Update list: jika is_penanggungjawab true, yang lain di-reset false
          setList(
            list.map((x) => {
              if (x.id === editingItem.id) {
                return { ...x, ...updated };
              }
              if (isPenanggungjawab) {
                return { ...x, is_penanggungjawab: false };
              }
              return x;
            })
          );
          toast.success(res.message || 'Data pegawai berhasil diperbarui.');
          setIsModalOpen(false);
        } else {
          if (res.errors) setFieldErrors(res.errors as Record<string, string[]>);
          toast.error(res.message || 'Gagal memperbarui pegawai.');
        }
      } else {
        const res = await createPegawaiAction({
          nip: nipClean,
          nama,
          jabatan,
          pangkat_golongan: pangkatGolongan,
          peran_tanda_tangan: peranTandaTangan,
          is_penanggungjawab: isPenanggungjawab,
        });

        if (res.success && res.data) {
          const created = res.data as PegawaiItem;
          setList([
            created,
            ...list.map((x) => (isPenanggungjawab ? { ...x, is_penanggungjawab: false } : x)),
          ]);
          toast.success(res.message || 'Pegawai berhasil didaftarkan.');
          setIsModalOpen(false);
        } else {
          if (res.errors) setFieldErrors(res.errors as Record<string, string[]>);
          toast.error(res.message || 'Gagal mendaftarkan pegawai.');
        }
      }
    } catch {
      toast.error('Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAktif = async (item: PegawaiItem) => {
    const newStatus = !item.aktif;
    try {
      const res = await togglePegawaiAction(item.id, newStatus);
      if (res.success) {
        setList(list.map((x) => (x.id === item.id ? { ...x, aktif: newStatus } : x)));
        toast.success(res.message);
      } else {
        toast.error(res.message || 'Gagal mengubah status.');
      }
    } catch {
      toast.error('Gagal mengubah status pegawai.');
    }
  };

  const handleSetPenanggungJawab = async (item: PegawaiItem) => {
    try {
      const res = await setPenanggungJawabAction(item.id);
      if (res.success) {
        setList(
          list.map((x) => ({
            ...x,
            is_penanggungjawab: x.id === item.id,
          }))
        );
        toast.success(res.message);
      } else {
        toast.error(res.message || 'Gagal mengatur penanggung jawab.');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengatur penanggung jawab.');
    }
  };

  const handleDelete = async (item: PegawaiItem) => {
    if (!confirm(`Hapus data pegawai "${item.nama}"? Pegawai yang telah memiliki riwayat uji tidak dapat dihapus.`)) return;

    try {
      const res = await deletePegawaiAction(item.id);
      if (res.success) {
        setList(list.filter((x) => x.id !== item.id));
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Gagal menghapus pegawai.');
    }
  };

  const filtered = list.filter((item) => {
    if (filterTab === 'active' && !item.aktif) return false;
    if (filterTab === 'inactive' && item.aktif) return false;

    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.nama.toLowerCase().includes(term) ||
      item.nip.toLowerCase().includes(term) ||
      item.jabatan.toLowerCase().includes(term) ||
      (item.pangkat_golongan && item.pangkat_golongan.toLowerCase().includes(term))
    );
  });

  const getPeranBadge = (peran: string) => {
    switch (peran) {
      case 'kepala_dinas':
        return (
          <Badge className="bg-primary/15 text-primary border-primary/20 text-[11px] gap-1">
            <Shield className="size-3" />
            Kepala Dinas
          </Badge>
        );
      case 'pengelola_mutu':
        return (
          <Badge variant="secondary" className="text-[11px] gap-1">
            <CheckCircle2 className="size-3 text-muted-foreground" />
            Pengelola Mutu
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[11px] gap-1 text-muted-foreground">
            <UserCheck className="size-3" />
            Petugas Penguji
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge variant="secondary" className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-xs font-semibold uppercase tracking-wider">
            <Users className="size-3" />
            <span>Master Personil</span>
          </Badge>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Daftar Pegawai & Pejabat Penandatangan
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Data personil ASN Dinas Perikanan {APP_CONFIG.institution.regency} untuk petugas penguji lapangan dan pejabat penandatangan resmi Laporan Hasil Uji (LHU).
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 shadow-xs self-start sm:self-auto cursor-pointer">
          <Plus className="size-4" />
          <span>Tambah Pegawai Baru</span>
        </Button>
      </div>

      {/* Tabs Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <Tabs value={filterTab} onValueChange={(val) => setFilterTab(val as 'all' | 'active' | 'inactive')}>
          <TabsList>
            <TabsTrigger value="active" className="text-xs gap-2">
              <span>Pegawai Aktif</span>
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {list.filter((x) => x.aktif).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="text-xs gap-2">
              <span>Nonaktif</span>
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                {list.filter((x) => !x.aktif).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs gap-2">
              <span>Semua Personil</span>
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                {list.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filter Search */}
        <div className="flex items-center gap-2">
          <InputGroup className="w-full sm:w-72">
            <InputGroupAddon align="inline-start">
              <Search className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari NIP, nama, atau jabatan..."
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
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold">Nama Pegawai</TableHead>
                <TableHead className="text-xs font-semibold">NIP</TableHead>
                <TableHead className="text-xs font-semibold">Jabatan & Pangkat</TableHead>
                <TableHead className="text-xs font-semibold">Peran Tanda Tangan</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    {searchTerm ? (
                      <div className="space-y-1.5">
                        <p>Tidak ada pegawai yang cocok dengan pencarian &ldquo;{searchTerm}&rdquo;.</p>
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
                      <p>Belum ada data pegawai dalam kategori ini.</p>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow
                    key={item.id}
                    className={`hover:bg-muted/30 transition-colors ${
                      !item.aktif ? 'opacity-65 bg-muted/15' : ''
                    }`}
                  >
                    <TableCell className="font-semibold text-foreground text-xs">
                      <div className="flex items-center gap-2">
                        <span>{item.nama}</span>
                        {item.is_penanggungjawab && (
                          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] gap-1 px-1.5 py-0 font-semibold">
                            <Star className="size-2.5 fill-amber-500 text-amber-500" />
                            Default TTD
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {item.nip}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="text-foreground font-medium">{item.jabatan}</div>
                      {item.pangkat_golongan && (
                        <div className="text-[11px] text-muted-foreground">
                          {item.pangkat_golongan}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {getPeranBadge(item.peran_tanda_tangan)}
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge
                        variant={item.aktif ? 'default' : 'outline'}
                        className={`text-[10px] font-semibold ${
                          item.aktif
                            ? 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {item.aktif ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="inline-flex items-center justify-center rounded-md size-7 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors focus-visible:outline-none"
                          title="Menu Aksi"
                        >
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!item.is_penanggungjawab && item.aktif && (
                            <DropdownMenuItem onClick={() => handleSetPenanggungJawab(item)}>
                              <Star className="size-3.5 mr-2 text-amber-500" />
                              Jadikan Default Penandatangan
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleOpenEdit(item)}>
                            <Pencil className="size-3.5 mr-2" />
                            Edit Pegawai
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleAktif(item)}>
                            {item.aktif ? (
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
                            Hapus Pegawai
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dialog Modal Tambah / Edit Pegawai */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              <span>{editingItem ? 'Edit Data Pegawai' : 'Registrasi Pegawai Baru'}</span>
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? 'Perbarui NIP, nama lengkap, jabatan, atau peran penandatangan resmi LHU.'
                : 'Daftarkan personil ASN atau petugas penguji kualitas air dinas.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <Field>
              <FieldLabel htmlFor="nip">
                NIP (Nomor Induk Pegawai) *
              </FieldLabel>
              <Input
                id="nip"
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="Contoh: 198501012010011001"
                className="font-mono"
              />
              <FieldError errors={toFieldErrors(fieldErrors.nip)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="nama">
                Nama Lengkap & Gelar *
              </FieldLabel>
              <Input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Ir. Fransiskus Xaverius, M.Si"
              />
              <FieldError errors={toFieldErrors(fieldErrors.nama)} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="jabatan">
                  Jabatan Kedinasan *
                </FieldLabel>
                <Input
                  id="jabatan"
                  type="text"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="Contoh: Kepala Dinas Perikanan"
                />
                <FieldError errors={toFieldErrors(fieldErrors.jabatan)} />
              </Field>

              <Field>
                <FieldLabel htmlFor="pangkat_golongan">
                  Pangkat / Golongan Ruang
                </FieldLabel>
                <Input
                  id="pangkat_golongan"
                  type="text"
                  value={pangkatGolongan}
                  onChange={(e) => setPangkatGolongan(e.target.value)}
                  placeholder="Contoh: Pembina Utama Muda (IV/c)"
                />
                <FieldError errors={toFieldErrors(fieldErrors.pangkat_golongan)} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="peran_tanda_tangan">
                Peran Resmi di Dokumen LHU *
              </FieldLabel>
              <Select
                value={peranTandaTangan}
                onValueChange={(val) => {
                  if (val) setPeranTandaTangan(val as 'penguji' | 'pengelola_mutu' | 'kepala_dinas');
                }}
              >
                <SelectTrigger id="peran_tanda_tangan">
                  <SelectValue placeholder="Pilih Peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="penguji">Petugas Penguji Lapangan</SelectItem>
                  <SelectItem value="pengelola_mutu">Pengelola Mutu & Evaluator</SelectItem>
                  <SelectItem value="kepala_dinas">Kepala Dinas (Penandatangan Pengesahan)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="rounded-lg border border-border/70 p-3 bg-muted/20 flex items-start gap-3">
              <input
                id="is_penanggungjawab"
                type="checkbox"
                checked={isPenanggungjawab}
                onChange={(e) => setIsPenanggungjawab(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="is_penanggungjawab" className="text-xs cursor-pointer select-none">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Star className="size-3 text-amber-500 fill-amber-500 inline" />
                  Jadikan Penanggung Jawab Default Penandatangan
                </span>
                <p className="text-muted-foreground mt-0.5">
                  Pegawai ini akan otomatis dipilih sebagai default penandatangan Laporan Hasil Uji (LHU) baru. Hanya satu pegawai yang dapat menjadi default.
                </p>
              </label>
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
                    Menyimpan...
                  </>
                ) : editingItem ? (
                  'Perbarui Pegawai'
                ) : (
                  'Simpan Pegawai'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
