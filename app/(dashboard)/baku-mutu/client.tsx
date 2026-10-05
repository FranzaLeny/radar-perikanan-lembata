'use client';

import React, { useState } from 'react';
import {
  Scale,
  Plus,
  History,
  FileEdit,
  Loader2,
  Search,
  X,
  Eye,
  EyeOff,
  Trash2,
  MoreHorizontal,
  Thermometer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { bakuMutuSchema } from '@/lib/validations/baku-mutu';
import {
  createBakuMutuAction,
  updateBakuMutuVersionedAction,
  toggleBakuMutuAction,
  deleteBakuMutuAction,
} from '@/lib/actions/baku-mutu';

export interface BakuMutuItem {
  id: string;
  parameter: string;
  satuan: string;
  nilai_min: string | null;
  nilai_max: string | null;
  nomor_regulasi: string;
  dasar_regulasi: string | null;
  tipe_ambang_batas: string;
  deviasi_toleransi: string | null;
  aktif: boolean;
  berlaku_sejak: string;
}

export function BakuMutuClient({ initialList }: { initialList: BakuMutuItem[] }) {
  const [list, setList] = useState<BakuMutuItem[]>(initialList);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'archived'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BakuMutuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [parameter, setParameter] = useState('');
  const [satuan, setSatuan] = useState('');
  const [nilaiMin, setNilaiMin] = useState<string>('');
  const [nilaiMax, setNilaiMax] = useState<string>('');
  const [nomorRegulasi, setNomorRegulasi] = useState('PP No. 22/2021');
  const [dasarRegulasi, setDasarRegulasi] = useState('');
  const [tipeAmbangBatas, setTipeAmbangBatas] = useState<'tetap' | 'deviasi_suhu_lingkungan'>('tetap');
  const [deviasiToleransi, setDeviasiToleransi] = useState<string>('2.00');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleOpenAdd = () => {
    setIsRevisionMode(false);
    setSelectedItem(null);
    setParameter('');
    setSatuan('');
    setNilaiMin('');
    setNilaiMax('');
    setNomorRegulasi('PP No. 22/2021');
    setDasarRegulasi('Peraturan Pemerintah No. 22 Tahun 2021 Lampiran VI (Baku Mutu Air Nasional)');
    setTipeAmbangBatas('tetap');
    setDeviasiToleransi('2.00');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleOpenRevision = (item: BakuMutuItem) => {
    setIsRevisionMode(true);
    setSelectedItem(item);
    setParameter(item.parameter);
    setSatuan(item.satuan);
    setNilaiMin(item.nilai_min !== null ? item.nilai_min : '');
    setNilaiMax(item.nilai_max !== null ? item.nilai_max : '');
    setNomorRegulasi(item.nomor_regulasi || 'PP No. 22/2021');
    setDasarRegulasi(item.dasar_regulasi || '');
    setTipeAmbangBatas(
      (item.tipe_ambang_batas as 'tetap' | 'deviasi_suhu_lingkungan') ||
        (item.parameter.toLowerCase().includes('suhu') ? 'deviasi_suhu_lingkungan' : 'tetap')
    );
    setDeviasiToleransi(item.deviasi_toleransi || '2.00');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const payload = {
      parameter,
      satuan,
      nilai_min: nilaiMin === '' ? null : Number(nilaiMin),
      nilai_max: nilaiMax === '' ? null : Number(nilaiMax),
      nomor_regulasi: nomorRegulasi,
      dasar_regulasi: dasarRegulasi,
      tipe_ambang_batas: tipeAmbangBatas,
      deviasi_toleransi: tipeAmbangBatas === 'deviasi_suhu_lingkungan' ? Number(deviasiToleransi) : null,
      aktif: true,
      berlaku_sejak: new Date().toISOString().split('T')[0],
    };

    // 1. Validasi Zod Client-Side
    const validation = bakuMutuSchema.safeParse(payload);
    if (!validation.success) {
      setFieldErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRevisionMode && selectedItem) {
        // Pembaruan Berversi (dengan pencegahan duplikasi idempoten)
        const res = await updateBakuMutuVersionedAction(selectedItem.id, payload);

        if (res.success) {
          if (res.data) {
            const isReactivated = (res.data as any).id === selectedItem.id;
            if (isReactivated) {
              setList(list.map((item) => (item.id === selectedItem.id ? (res.data as BakuMutuItem) : item)));
            } else {
              const updated = list.map((item) =>
                item.id === selectedItem.id ? { ...item, aktif: false } : item
              );
              setList([res.data as BakuMutuItem, ...updated]);
            }
          }
          toast.success(res.message || 'Versi baku mutu berhasil diperbarui.');
          setIsModalOpen(false);
        } else {
          // Gagal atau tidak ada perubahan
          toast.error(res.message || 'Gagal merevisi baku mutu.');
        }
      } else {
        // Tambah Baru
        const res = await createBakuMutuAction(payload);

        if (res.success && res.data) {
          setList([res.data as BakuMutuItem, ...list]);
          toast.success(res.message || 'Parameter baru berhasil ditambahkan.');
          setIsModalOpen(false);
        } else {
          toast.error(res.message || 'Gagal menyimpan parameter.');
        }
      }
    } catch {
      toast.error('Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAktif = async (item: BakuMutuItem) => {
    const newStatus = !item.aktif;
    try {
      const res = await toggleBakuMutuAction(item.id, newStatus);
      if (res.success) {
        setList(list.map((x) => (x.id === item.id ? { ...x, aktif: newStatus } : x)));
        toast.success(res.message);
      } else {
        toast.error(res.message || 'Gagal mengubah status parameter.');
      }
    } catch {
      toast.error('Gagal mengubah status parameter.');
    }
  };

  const handleDelete = async (item: BakuMutuItem) => {
    if (!confirm(`Hapus permanen parameter "${item.parameter}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    try {
      const res = await deleteBakuMutuAction(item.id);
      if (res.success) {
        setList(list.filter((x) => x.id !== item.id));
        toast.success(res.message || 'Parameter berhasil dihapus.');
      } else {
        toast.error(res.message || 'Gagal menghapus parameter.');
      }
    } catch {
      toast.error('Gagal menghapus parameter.');
    }
  };

  const filteredList = list.filter((item) => {
    const matchesTab =
      filterTab === 'active' ? item.aktif : filterTab === 'archived' ? !item.aktif : true;

    if (!matchesTab) return false;
    if (!searchTerm.trim()) return true;

    const query = searchTerm.toLowerCase().trim();
    return (
      item.parameter.toLowerCase().includes(query) ||
      item.satuan.toLowerCase().includes(query) ||
      item.nomor_regulasi.toLowerCase().includes(query) ||
      (item.dasar_regulasi && item.dasar_regulasi.toLowerCase().includes(query))
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
            <Scale className="size-3" />
            <span>Master Regulasi</span>
          </Badge>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Master Baku Mutu Air (Berversi)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Standar acuan ambang batas kualitas air budidaya. Mendukung ambang dinamis deviasi suhu lingkungan, pemisahan nomor regulasi singkat vs lengkap, serta metode uji diatur terpisah pada Instruksi Kerja.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 shadow-xs self-start sm:self-auto cursor-pointer">
          <Plus className="size-4" />
          <span>Tambah Parameter Baru</span>
        </Button>
      </div>

      {/* Tabs Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <Tabs value={filterTab} onValueChange={(val) => setFilterTab(val as any)}>
          <TabsList>
            <TabsTrigger value="active" className="text-xs gap-2">
              <span>Standar Aktif</span>
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {list.filter((x) => x.aktif).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="archived" className="text-xs gap-2">
              <span>Arsip Versi Lama</span>
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                {list.filter((x) => !x.aktif).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs gap-2">
              <span>Semua Riwayat</span>
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                {list.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Input */}
        <div className="flex items-center gap-2">
          <InputGroup className="w-full sm:w-72">
            <InputGroupAddon align="inline-start">
              <Search className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari parameter, nomor regulasi..."
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
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge variant="secondary" className="text-xs py-0.5">
                {filteredList.length} dari {list.length}
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
            <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline">
              Total: <strong className="text-foreground">{list.length}</strong>
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
                <TableHead className="text-xs font-semibold">Parameter Uji</TableHead>
                <TableHead className="text-xs font-semibold">Satuan</TableHead>
                <TableHead className="text-xs font-semibold">Ambang Batas Baku Mutu</TableHead>
                <TableHead className="text-xs font-semibold">Nomor Regulasi (LHU)</TableHead>
                <TableHead className="text-xs font-semibold">Dasar Regulasi Lengkap</TableHead>
                <TableHead className="text-xs font-semibold">Status Versi</TableHead>
                <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                    {searchTerm ? (
                      <div className="space-y-1.5">
                        <p>Tidak ada parameter yang cocok dengan pencarian &ldquo;{searchTerm}&rdquo;.</p>
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
                      <p>Tidak ada parameter pada kategori ini.</p>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredList.map((item) => {
                  const isDinamisSuhu = item.tipe_ambang_batas === 'deviasi_suhu_lingkungan';

                  return (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="font-semibold text-foreground text-xs">
                        {item.parameter}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {item.satuan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {isDinamisSuhu ? (
                          <div className="space-y-1">
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 text-[11px] gap-1"
                            >
                              <Thermometer className="size-3" />
                              <span>Deviasi ±{item.deviasi_toleransi || '2.00'}°C dari Suhu Udara</span>
                            </Badge>
                            {item.nilai_min && item.nilai_max && (
                              <p className="text-[11px] text-muted-foreground font-mono">
                                Acuan kisaran: {item.nilai_min} – {item.nilai_max} {item.satuan}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="font-mono font-medium text-foreground">
                            {item.nilai_min !== null && item.nilai_max !== null
                              ? `${item.nilai_min} – ${item.nilai_max}`
                              : item.nilai_min !== null
                              ? `≥ ${item.nilai_min}`
                              : item.nilai_max !== null
                              ? `≤ ${item.nilai_max}`
                              : '-'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="secondary" className="font-semibold text-xs">
                          {item.nomor_regulasi || 'PP No. 22/2021'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs truncate" title={item.dasar_regulasi || ''}>
                        {item.dasar_regulasi || '-'}
                      </TableCell>
                      <TableCell>
                        {item.aktif ? (
                          <Badge
                            variant="outline"
                            className="border-emerald-300 text-emerald-800 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs gap-1"
                          >
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            <span>Berlaku</span>
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <History className="size-3 text-muted-foreground" />
                            <span>Arsip</span>
                          </Badge>
                        )}
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
                            {item.aktif && (
                              <DropdownMenuItem onClick={() => handleOpenRevision(item)}>
                                <FileEdit className="size-3.5 mr-2" />
                                Revisi Versi Baru
                              </DropdownMenuItem>
                            )}
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
                            <DropdownMenuItem variant="destructive" onClick={() => handleDelete(item)}>
                              <Trash2 className="size-3.5 mr-2" />
                              Hapus Permanen
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

      {/* Dialog Modal Tambah / Revisi */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="size-4 text-muted-foreground" />
              <span>
                {isRevisionMode ? `Revisi Ambang: ${selectedItem?.parameter}` : 'Tambah Parameter Baku Mutu'}
              </span>
            </DialogTitle>
            <DialogDescription>
              {isRevisionMode
                ? 'Jika ada perubahan nilai ambang batas atau regulasi, versi baru akan diterbitkan. Jika tidak ada perubahan, sistem akan membatalkan pembuatan versi duplikat.'
                : 'Daftarkan parameter baku mutu air baru beserta acuan regulasi dasarnya.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="parameter">Nama Parameter *</FieldLabel>
                <Input
                  id="parameter"
                  type="text"
                  value={parameter}
                  onChange={(e) => setParameter(e.target.value)}
                  placeholder="Contoh: Suhu / pH"
                  disabled={isRevisionMode}
                />
                <FieldError errors={toFieldErrors(fieldErrors.parameter)} />
              </Field>

              <Field>
                <FieldLabel htmlFor="satuan">Satuan Pengukuran *</FieldLabel>
                <Input
                  id="satuan"
                  type="text"
                  value={satuan}
                  onChange={(e) => setSatuan(e.target.value)}
                  placeholder="Contoh: mg/L, °C, -"
                  disabled={isRevisionMode}
                />
                <FieldError errors={toFieldErrors(fieldErrors.satuan)} />
              </Field>
            </div>

            {/* Pilihan Tipe Ambang Batas: Tetap vs Deviasi Suhu */}
            <Field>
              <FieldLabel>Tipe Karakteristik Ambang Batas</FieldLabel>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setTipeAmbangBatas('tetap')}
                  className={`p-2.5 text-left border rounded-lg text-xs cursor-pointer transition-colors ${
                    tipeAmbangBatas === 'tetap'
                      ? 'border-primary bg-primary/5 text-primary font-semibold'
                      : 'border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="font-medium text-foreground">Batas Statis / Tetap</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Nilai Min & Max konstan (pH, DO, Amonia)</p>
                </button>
                <button
                  type="button"
                  onClick={() => setTipeAmbangBatas('deviasi_suhu_lingkungan')}
                  className={`p-2.5 text-left border rounded-lg text-xs cursor-pointer transition-colors ${
                    tipeAmbangBatas === 'deviasi_suhu_lingkungan'
                      ? 'border-amber-600 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold'
                      : 'border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="font-medium text-foreground">Deviasi Suhu Lingkungan</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Bergantung suhu udara alami (Suhu Air)
                  </p>
                </button>
              </div>
            </Field>

            {tipeAmbangBatas === 'deviasi_suhu_lingkungan' ? (
              <Field>
                <FieldLabel htmlFor="deviasi_toleransi">
                  Toleransi Deviasi Terhadap Suhu Udara (°C) *
                </FieldLabel>
                <Input
                  id="deviasi_toleransi"
                  type="number"
                  step="0.1"
                  value={deviasiToleransi}
                  onChange={(e) => setDeviasiToleransi(e.target.value)}
                  placeholder="2.0"
                  className="font-mono"
                />
                <FieldDescription>
                  Sesuai PP No. 22/2021 Lampiran VI: Ambang batas suhu air budidaya adalah Suhu Udara ± {deviasiToleransi || '2.00'}°C.
                </FieldDescription>
                <FieldError errors={toFieldErrors(fieldErrors.deviasi_toleransi)} />
              </Field>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="nilai_min">
                  {tipeAmbangBatas === 'deviasi_suhu_lingkungan'
                    ? 'Acuan Nilai Min Default (°C)'
                    : 'Batas Nilai Min (Boleh Kosong)'}
                </FieldLabel>
                <Input
                  id="nilai_min"
                  type="number"
                  step="any"
                  value={nilaiMin}
                  onChange={(e) => setNilaiMin(e.target.value)}
                  placeholder="Contoh: 6.5"
                  className="font-mono"
                />
                <FieldError errors={toFieldErrors(fieldErrors.nilai_min)} />
              </Field>

              <Field>
                <FieldLabel htmlFor="nilai_max">
                  {tipeAmbangBatas === 'deviasi_suhu_lingkungan'
                    ? 'Acuan Nilai Max Default (°C)'
                    : 'Batas Nilai Max (Boleh Kosong)'}
                </FieldLabel>
                <Input
                  id="nilai_max"
                  type="number"
                  step="any"
                  value={nilaiMax}
                  onChange={(e) => setNilaiMax(e.target.value)}
                  placeholder="Contoh: 8.5"
                  className="font-mono"
                />
                <FieldError errors={toFieldErrors(fieldErrors.nilai_max)} />
              </Field>
            </div>

            {/* Regulasi Singkat (untuk tabel LHU) & Regulasi Lengkap */}
            <div className="space-y-3 pt-1 border-t border-border">
              <Field>
                <FieldLabel htmlFor="nomor_regulasi">
                  Nomor / Singkatan Regulasi (Ditampilkan di Tabel LHU) *
                </FieldLabel>
                <Input
                  id="nomor_regulasi"
                  type="text"
                  value={nomorRegulasi}
                  onChange={(e) => setNomorRegulasi(e.target.value)}
                  placeholder="Contoh: PP No. 22/2021 atau SNI Budidaya"
                />
                <FieldDescription>
                  Format singkat dan padat untuk kolom tabel LHU (contoh: <code>PP No. 22/2021</code>).
                </FieldDescription>
                <FieldError errors={toFieldErrors(fieldErrors.nomor_regulasi)} />
              </Field>

              <Field>
                <FieldLabel htmlFor="dasar_regulasi">
                  Nama Lengkap Peraturan / Dasar Regulasi
                </FieldLabel>
                <Input
                  id="dasar_regulasi"
                  type="text"
                  value={dasarRegulasi}
                  onChange={(e) => setDasarRegulasi(e.target.value)}
                  placeholder="Contoh: Peraturan Pemerintah No. 22 Tahun 2021 Lampiran VI"
                />
                <FieldError errors={toFieldErrors(fieldErrors.dasar_regulasi)} />
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
                ) : isRevisionMode ? (
                  'Terbitkan Versi Baru'
                ) : (
                  'Simpan Parameter'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
