'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { createLokasiKolamAction } from '@/lib/actions/lokasi-kolam';
import { toFieldErrors } from '@/lib/utils';
import { MapPin, Loader2 } from 'lucide-react';

export interface LokasiItem {
  id: string;
  nama_pokdakan: string;
  pemilik: string;
  kecamatan: string;
  desa: string;
  titik_koordinat: string | null;
  komoditas_ikan: string | null;
  aktif?: boolean;
}

const KECAMATAN_LEMBATA = [
  'Nubatukan',
  'Ile Ape',
  'Ile Ape Timur',
  'Lebatukan',
  'Buyasuri',
  'Omesuri',
  'Wulandoni',
  'Atadei',
  'Nagawutung',
];

interface QuickAddLokasiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newLokasi: LokasiItem) => void;
}

export function QuickAddLokasiDialog({
  open,
  onOpenChange,
  onSuccess,
}: QuickAddLokasiDialogProps) {
  const [namaPokdakan, setNamaPokdakan] = useState('');
  const [pemilik, setPemilik] = useState('');
  const [kecamatan, setKecamatan] = useState('Nubatukan');
  const [desa, setDesa] = useState('');
  const [titikKoordinat, setTitikKoordinat] = useState('');
  const [komoditasIkan, setKomoditasIkan] = useState('Ikan Bandeng');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!namaPokdakan.trim()) {
      setFieldErrors({ nama_pokdakan: ['Nama Pokdakan wajib diisi.'] });
      return;
    }
    if (!pemilik.trim()) {
      setFieldErrors({ pemilik: ['Nama penanggung jawab wajib diisi.'] });
      return;
    }
    if (!desa.trim()) {
      setFieldErrors({ desa: ['Desa/kelurahan wajib diisi.'] });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createLokasiKolamAction({
        nama_pokdakan: namaPokdakan.trim(),
        pemilik: pemilik.trim(),
        kecamatan,
        desa: desa.trim(),
        titik_koordinat: titikKoordinat.trim() || undefined,
        komoditas_ikan: komoditasIkan.trim() || undefined,
      });

      if (res.success && res.data) {
        toast.success(`Lokasi kolam "${namaPokdakan}" berhasil ditambahkan.`);
        onSuccess(res.data as LokasiItem);
        // Reset form
        setNamaPokdakan('');
        setPemilik('');
        setDesa('');
        setTitikKoordinat('');
        setKomoditasIkan('Ikan Bandeng');
        onOpenChange(false);
      } else {
        if (res.errors) {
          setFieldErrors(res.errors as Record<string, string[]>);
        }
        toast.error(res.message || 'Gagal menambahkan lokasi kolam.');
      }
    } catch {
      toast.error('Terjadi kesalahan sistem saat menyimpan lokasi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-0.5">
              <MapPin className="size-3.5" />
              <span>Tambah Lokasi Cepat</span>
            </div>
            <DialogTitle className="text-base font-heading">
              Daftarkan Titik Kolam Baru
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tambahkan data kolam Pokdakan baru langsung ke sistem tanpa me-reset lembar pengujian.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <Field>
              <FieldLabel htmlFor="quickNamaPokdakan">
                Nama Kelompok Pembudidaya (Pokdakan) *
              </FieldLabel>
              <Input
                id="quickNamaPokdakan"
                value={namaPokdakan}
                onChange={(e) => setNamaPokdakan(e.target.value)}
                placeholder="Contoh: Pokdakan Mina Segara Lembata"
                autoFocus
              />
              <FieldError errors={toFieldErrors(fieldErrors.nama_pokdakan)} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="quickPemilik">Penanggung Jawab / Pemilik *</FieldLabel>
                <Input
                  id="quickPemilik"
                  value={pemilik}
                  onChange={(e) => setPemilik(e.target.value)}
                  placeholder="Nama ketua/pemilik"
                />
                <FieldError errors={toFieldErrors(fieldErrors.pemilik)} />
              </Field>

              <Field>
                <FieldLabel htmlFor="quickKomoditas">Komoditas Ikan</FieldLabel>
                <Input
                  id="quickKomoditas"
                  value={komoditasIkan}
                  onChange={(e) => setKomoditasIkan(e.target.value)}
                  placeholder="Bandeng, Nila, Kerapu..."
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Kecamatan *</FieldLabel>
                <Select value={kecamatan} onValueChange={(val) => setKecamatan(val || 'Nubatukan')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {KECAMATAN_LEMBATA.map((kec) => (
                      <SelectItem key={kec} value={kec}>
                        {kec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="quickDesa">Desa / Kelurahan *</FieldLabel>
                <Input
                  id="quickDesa"
                  value={desa}
                  onChange={(e) => setDesa(e.target.value)}
                  placeholder="Nama desa"
                />
                <FieldError errors={toFieldErrors(fieldErrors.desa)} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="quickKoordinat">Koordinat GPS (Opsional)</FieldLabel>
              <Input
                id="quickKoordinat"
                value={titikKoordinat}
                onChange={(e) => setTitikKoordinat(e.target.value)}
                placeholder="-8.3692, 123.5512"
              />
            </Field>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting && <Loader2 className="size-3 animate-spin" />}
              <span>Simpan & Pilih Lokasi</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
