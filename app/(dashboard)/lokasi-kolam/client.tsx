'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Trash2,
  Compass,
  Fish,
  Loader2,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { lokasiKolamSchema } from '@/lib/validations/lokasi-kolam';
import {
  createLokasiKolamAction,
  deleteLokasiKolamAction,
} from '@/lib/actions/lokasi-kolam';

interface LokasiItem {
  id: string;
  nama_pokdakan: string;
  pemilik: string;
  kecamatan: string;
  desa: string;
  titik_koordinat: string | null;
  komoditas_ikan: string | null;
}

export function LokasiKolamClient({ initialList }: { initialList: LokasiItem[] }) {
  const [list, setList] = useState<LokasiItem[]>(initialList);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setNamaPokdakan('');
    setPemilik('');
    setKecamatan('Nubatukan');
    setDesa('');
    setTitikKoordinat('-8.36841, 123.53812');
    setKomoditasIkan('Ikan Nila');
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
    } catch {
      toast.error('Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus lokasi kolam "${nama}"?`)) return;

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

  const filtered = list.filter(
    (item) =>
      item.nama_pokdakan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pemilik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kecamatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-primary border-primary/30 bg-primary/5 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="size-3" />
            <span>Master Data Kolam</span>
          </Badge>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Titik Lokasi Kolam Pembudidaya (Pokdakan)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Daftar kelompok pembudidaya ikan di 9 kecamatan Kabupaten Lembata lengkap dengan koordinat GPS dan komoditas.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 shadow-xs self-start sm:self-auto">
          <Plus className="size-4" />
          <span>Tambah Lokasi Baru</span>
        </Button>
      </div>

      {/* Filter Search & Indikator Komparasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <InputGroup className="flex-1 max-w-md">
          <InputGroupAddon align="inline-start">
            <Search className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari Pokdakan, pemilik, kecamatan, atau desa..."
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
          {filtered.length < list.length ? (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs py-0.5">
                Menampilkan {filtered.length} dari {list.length} lokasi (Hasil Filter)
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
              Total: <strong className="text-foreground">{list.length}</strong> lokasi terdaftar
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
                <TableHead className="text-xs font-semibold">Nama Pokdakan</TableHead>
                <TableHead className="text-xs font-semibold">Penanggung Jawab / Pemilik</TableHead>
                <TableHead className="text-xs font-semibold">Wilayah (Kecamatan & Desa)</TableHead>
                <TableHead className="text-xs font-semibold">Komoditas Budidaya</TableHead>
                <TableHead className="text-xs font-semibold">Koordinat GPS</TableHead>
                <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
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
                      <p>Belum ada data lokasi kolam yang terdaftar.</p>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-semibold text-foreground text-xs">
                      {item.nama_pokdakan}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium text-xs">
                      {item.pemilik}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="text-primary font-medium">{item.kecamatan}</div>
                      <div className="text-xs text-muted-foreground">Desa {item.desa}</div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="secondary" className="gap-1 text-xs font-normal">
                        <Fish className="size-3 text-primary" />
                        {item.komoditas_ikan || 'Campuran'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {item.titik_koordinat ? (
                        <a
                          href={`https://maps.google.com/?q=${item.titik_koordinat}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                          title="Buka di Google Maps"
                        >
                          <Compass className="size-3.5" />
                          <span>{item.titik_koordinat}</span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground font-mono text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(item.id, item.nama_pokdakan)}
                        title="Hapus Lokasi"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 size-7"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dialog Modal Tambah Lokasi */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <span>Registrasi Lokasi Kolam Baru</span>
            </DialogTitle>
            <DialogDescription>
              Masukkan identitas Pokdakan, pemilik, dan koordinat GPS lokasi kolam di Kabupaten Lembata.
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
