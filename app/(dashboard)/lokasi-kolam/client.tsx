'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Trash2,
  Pencil,
  Compass,
  Fish,
  Loader2,
  Search,
  X,
  Eye,
  EyeOff,
  MoreHorizontal,
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
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { lokasiKolamSchema } from '@/lib/validations/lokasi-kolam';
import {
  createLokasiKolamAction,
  updateLokasiKolamAction,
  toggleLokasiKolamAction,
  deleteLokasiKolamAction,
} from '@/lib/actions/lokasi-kolam';

export interface LokasiItem {
  id: string;
  nama_pokdakan: string;
  pemilik: string;
  kecamatan: string;
  desa: string;
  titik_koordinat: string | null;
  komoditas_ikan: string | null;
  aktif: boolean;
}

export function LokasiKolamClient({ initialList }: { initialList: LokasiItem[] }) {
  const [list, setList] = useState<LokasiItem[]>(initialList);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'inactive'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LokasiItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [namaPokdakan, setNamaPokdakan] = useState('');
  const [pemilik, setPemilik] = useState('');
  const [kecamatan, setKecamatan] = useState('Nubatukan');
  const [desa, setDesa] = useState('');
  const [titikKoordinat, setTitikKoordinat] = useState('');
  const [komoditasIkan, setKomoditasIkan] = useState('Ikan Nila');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleOpenAdd = () => {
    setEditingItem(null);
    setNamaPokdakan('');
    setPemilik('');
    setKecamatan('Nubatukan');
    setDesa('');
    setTitikKoordinat('-8.36841, 123.53812');
    setKomoditasIkan('Ikan Nila');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: LokasiItem) => {
    setEditingItem(item);
    setNamaPokdakan(item.nama_pokdakan);
    setPemilik(item.pemilik);
    setKecamatan(item.kecamatan);
    setDesa(item.desa);
    setTitikKoordinat(item.titik_koordinat || '');
    setKomoditasIkan(item.komoditas_ikan || '');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // 1. Validasi Zod Client-Side
    const validation = lokasiKolamSchema.safeParse({
      nama_pokdakan: namaPokdakan,
      pemilik,
      kecamatan,
      desa,
      titik_koordinat: titikKoordinat,
      komoditas_ikan: komoditasIkan,
    });

    if (!validation.success) {
      setFieldErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        // Mode Edit
        const res = await updateLokasiKolamAction(editingItem.id, {
          nama_pokdakan: namaPokdakan,
          pemilik,
          kecamatan,
          desa,
          titik_koordinat: titikKoordinat,
          komoditas_ikan: komoditasIkan,
        });

        if (res.success && res.data) {
          const updated = res.data as LokasiItem;
          setList(list.map((x) => (x.id === editingItem.id ? { ...x, ...updated } : x)));
          toast.success(res.message || 'Lokasi kolam berhasil diperbarui.');
          setIsModalOpen(false);
        } else {
          if (res.errors) {
            setFieldErrors(res.errors as Record<string, string[]>);
          }
          toast.error(res.message || 'Gagal memperbarui lokasi kolam.');
        }
      } else {
        // Mode Tambah
        const res = await createLokasiKolamAction({
          nama_pokdakan: namaPokdakan,
          pemilik,
          kecamatan,
          desa,
          titik_koordinat: titikKoordinat,
          komoditas_ikan: komoditasIkan,
        });

        if (res.success && res.data) {
          setList([res.data as LokasiItem, ...list]);
          toast.success(res.message || 'Lokasi kolam berhasil ditambahkan.');
          setIsModalOpen(false);
        } else {
          if (res.errors) {
            setFieldErrors(res.errors as Record<string, string[]>);
          }
          toast.error(res.message || 'Gagal menyimpan lokasi kolam.');
        }
      }
    } catch {
      toast.error('Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAktif = async (item: LokasiItem) => {
    const newStatus = !item.aktif;
    try {
      const res = await toggleLokasiKolamAction(item.id, newStatus);
      if (res.success) {
        setList(list.map((x) => (x.id === item.id ? { ...x, aktif: newStatus } : x)));
        toast.success(res.message);
      } else {
        toast.error(res.message || 'Gagal mengubah status.');
      }
    } catch {
      toast.error('Gagal mengubah status lokasi kolam.');
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus lokasi kolam "${nama}"? Data yang sudah terhubung dengan pengujian tidak dapat dihapus.`)) return;

    try {
      const res = await deleteLokasiKolamAction(id);
      if (res.success) {
        setList(list.filter((x) => x.id !== id));
        toast.success(res.message || 'Lokasi kolam berhasil dihapus.');
      } else {
        toast.error(res.message || 'Gagal menghapus.');
      }
    } catch {
      toast.error('Gagal menghapus lokasi kolam.');
    }
  };

  const filtered = list.filter((item) => {
    // Filter tab
    if (filterTab === 'active' && !item.aktif) return false;
    if (filterTab === 'inactive' && item.aktif) return false;

    // Filter search
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.nama_pokdakan.toLowerCase().includes(term) ||
      item.pemilik.toLowerCase().includes(term) ||
      item.kecamatan.toLowerCase().includes(term) ||
      item.desa.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge variant="secondary" className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="size-3" />
            <span>Master Data Kolam</span>
          </Badge>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Titik Lokasi Kolam Pembudidaya (Pokdakan)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Daftar kelompok pembudidaya ikan di 9 kecamatan {APP_CONFIG.institution.regency} lengkap dengan koordinat GPS dan status aktif.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 shadow-xs self-start sm:self-auto cursor-pointer">
          <Plus className="size-4" />
          <span>Tambah Lokasi Baru</span>
        </Button>
      </div>

      {/* Tabs Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <Tabs value={filterTab} onValueChange={(val) => setFilterTab(val as 'all' | 'active' | 'inactive')}>
          <TabsList>
            <TabsTrigger value="active" className="text-xs gap-2">
              <span>Lokasi Aktif</span>
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
              <span>Semua Lokasi</span>
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
              placeholder="Cari Pokdakan, pemilik, kecamatan..."
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
                <TableHead className="text-xs font-semibold">Nama Pokdakan</TableHead>
                <TableHead className="text-xs font-semibold">Penanggung Jawab / Pemilik</TableHead>
                <TableHead className="text-xs font-semibold">Wilayah (Kecamatan & Desa)</TableHead>
                <TableHead className="text-xs font-semibold">Komoditas Budidaya</TableHead>
                <TableHead className="text-xs font-semibold">Koordinat GPS</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                    {searchTerm ? (
                      <div className="space-y-1.5">
                        <p>Tidak ada lokasi kolam yang cocok dengan pencarian &ldquo;{searchTerm}&rdquo;.</p>
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
                      <p>Belum ada data lokasi kolam dalam kategori ini.</p>
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
                      {item.nama_pokdakan}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium text-xs">
                      {item.pemilik}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="text-foreground font-medium">{item.kecamatan}</div>
                      <div className="text-xs text-muted-foreground">Desa {item.desa}</div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="secondary" className="gap-1 text-xs font-normal">
                        <Fish className="size-3 text-muted-foreground" />
                        {item.komoditas_ikan || 'Campuran'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {item.titik_koordinat ? (
                        <a
                          href={`https://maps.google.com/?q=${item.titik_koordinat}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-foreground hover:underline"
                          title="Buka di Google Maps"
                        >
                          <Compass className="size-3.5 text-muted-foreground" />
                          <span>{item.titik_koordinat}</span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground font-mono text-xs">-</span>
                      )}
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
                          <DropdownMenuItem onClick={() => handleOpenEdit(item)}>
                            <Pencil className="size-3.5 mr-2" />
                            Edit Lokasi
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
                            onClick={() => handleDelete(item.id, item.nama_pokdakan)}
                          >
                            <Trash2 className="size-3.5 mr-2" />
                            Hapus Lokasi
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

      {/* Dialog Modal Tambah / Edit Lokasi */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              <span>{editingItem ? 'Edit Lokasi Kolam' : 'Registrasi Lokasi Kolam Baru'}</span>
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? 'Perbarui informasi kelompok pembudidaya, pemilik, atau koordinat GPS.'
                : `Masukkan identitas Pokdakan, pemilik, dan koordinat GPS lokasi kolam di ${APP_CONFIG.institution.regency}.`}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <Field>
              <FieldLabel htmlFor="nama_pokdakan">
                Nama Kelompok Pembudidaya (Pokdakan) *
              </FieldLabel>
              <Input
                id="nama_pokdakan"
                type="text"
                value={namaPokdakan}
                onChange={(e) => setNamaPokdakan(e.target.value)}
                placeholder="Contoh: Pokdakan Mina Bahari"
              />
              <FieldError errors={toFieldErrors(fieldErrors.nama_pokdakan)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="pemilik">
                Nama Penanggung Jawab / Pemilik *
              </FieldLabel>
              <Input
                id="pemilik"
                type="text"
                value={pemilik}
                onChange={(e) => setPemilik(e.target.value)}
                placeholder="Contoh: Antonius Leu"
              />
              <FieldError errors={toFieldErrors(fieldErrors.pemilik)} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="kecamatan">
                  Kecamatan *
                </FieldLabel>
                <Select
                  value={kecamatan}
                  onValueChange={(val) => {
                    if (val) setKecamatan(val);
                  }}
                >
                  <SelectTrigger id="kecamatan">
                    <SelectValue placeholder="Pilih Kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nubatukan">Nubatukan</SelectItem>
                    <SelectItem value="Ile Ape">Ile Ape</SelectItem>
                    <SelectItem value="Ile Ape Timur">Ile Ape Timur</SelectItem>
                    <SelectItem value="Lebatukan">Lebatukan</SelectItem>
                    <SelectItem value="Buyasuri">Buyasuri</SelectItem>
                    <SelectItem value="Omesuri">Omesuri</SelectItem>
                    <SelectItem value="Wulandoni">Wulandoni</SelectItem>
                    <SelectItem value="Atadei">Atadei</SelectItem>
                    <SelectItem value="Nagawutung">Nagawutung</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="desa">
                  Desa / Kelurahan *
                </FieldLabel>
                <Input
                  id="desa"
                  type="text"
                  value={desa}
                  onChange={(e) => setDesa(e.target.value)}
                  placeholder="Contoh: Lewoleba Utara"
                />
                <FieldError errors={toFieldErrors(fieldErrors.desa)} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="titik_koordinat">
                  Titik Koordinat GPS
                </FieldLabel>
                <Input
                  id="titik_koordinat"
                  type="text"
                  value={titikKoordinat}
                  onChange={(e) => setTitikKoordinat(e.target.value)}
                  placeholder="-8.36841, 123.53812"
                  className="font-mono"
                />
                <FieldError errors={toFieldErrors(fieldErrors.titik_koordinat)} />
              </Field>

              <Field>
                <FieldLabel htmlFor="komoditas_ikan">
                  Komoditas Ikan
                </FieldLabel>
                <Input
                  id="komoditas_ikan"
                  type="text"
                  value={komoditasIkan}
                  onChange={(e) => setKomoditasIkan(e.target.value)}
                  placeholder="Contoh: Ikan Nila, Lele, Kerapu"
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
                    Menyimpan...
                  </>
                ) : editingItem ? (
                  'Perbarui Lokasi'
                ) : (
                  'Simpan Lokasi'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
