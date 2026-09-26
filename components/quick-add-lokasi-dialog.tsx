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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { createLokasiKolamAction } from '@/lib/actions/lokasi-kolam';
import { MapPin, Loader2 } from 'lucide-react';

export interface LokasiItem {
  id: string;
  nama_pokdakan: string;
  pemilik: string;
  kecamatan: string;
  desa: string;
  titik_koordinat: string | null;
  komoditas_ikan: string | null;
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
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-0.5">
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

          <div className="space-y-3 py-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Nama Kelompok Pembudidaya (Pokdakan) *</Label>
              <Input
                value={namaPokdakan}
                onChange={(e) => setNamaPokdakan(e.target.value)}
                placeholder="Contoh: Pokdakan Mina Segara Lembata"
                autoFocus
              />
              {fieldErrors.nama_pokdakan && (
                <p className="text-xs text-destructive">{fieldErrors.nama_pokdakan[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Penanggung Jawab / Pemilik *</Label>
                <Input
                  value={pemilik}
                  onChange={(e) => setPemilik(e.target.value)}
                  placeholder="Nama ketua/pemilik"
                />
                {fieldErrors.pemilik && (
                  <p className="text-xs text-destructive">{fieldErrors.pemilik[0]}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Komoditas Ikan</Label>
                <Input
                  value={komoditasIkan}
                  onChange={(e) => setKomoditasIkan(e.target.value)}
                  placeholder="Bandeng, Nila, Kerapu..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Kecamatan *</Label>
                <Select value={kecamatan} onValueChange={(val) => setKecamatan(val || 'Nubatukan')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {KECAMATAN_LEMBATA.map((kec) => (
                      <SelectItem key={kec} value={kec} className="text-xs">
                        {kec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Desa / Kelurahan *</Label>
                <Input
                  value={desa}
                  onChange={(e) => setDesa(e.target.value)}
                  placeholder="Nama desa"
                />
                {fieldErrors.desa && (
                  <p className="text-xs text-destructive">{fieldErrors.desa[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Koordinat GPS (Opsional)</Label>
              <Input
                value={titikKoordinat}
                onChange={(e) => setTitikKoordinat(e.target.value)}
                placeholder="-8.3692, 123.5512"
              />
            </div>
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
