'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toFieldErrors } from '@/lib/utils';
import { toast } from 'sonner';
import { lokasiKolamSchema } from '@/lib/validations/lokasi-kolam';
import {
  createLokasiKolamAction,
  updateLokasiKolamAction,
} from '@/lib/actions/lokasi-kolam';
import { KECAMATAN_LEMBATA, type LokasiItem } from '../types';

interface LokasiFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: LokasiItem | null;
  onSuccess: (result: { mode: 'create' | 'edit'; data: LokasiItem }) => void;
}

export function LokasiFormDialog({
  isOpen,
  onOpenChange,
  editingItem,
  onSuccess,
}: LokasiFormDialogProps) {
  const [namaPokdakan, setNamaPokdakan] = useState('');
  const [pemilik, setPemilik] = useState('');
  const [kecamatan, setKecamatan] = useState('Nubatukan');
  const [desa, setDesa] = useState('');
  const [titikKoordinat, setTitikKoordinat] = useState('');
  const [komoditasIkan, setKomoditasIkan] = useState('Ikan Nila');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (editingItem) {
      setNamaPokdakan(editingItem.nama_pokdakan);
      setPemilik(editingItem.pemilik);
      setKecamatan(editingItem.kecamatan);
      setDesa(editingItem.desa);
      setTitikKoordinat(editingItem.titik_koordinat || '');
      setKomoditasIkan(editingItem.komoditas_ikan || '');
    } else {
      setNamaPokdakan('');
      setPemilik('');
      setKecamatan('Nubatukan');
      setDesa('');
      setTitikKoordinat('-8.36841, 123.53812');
      setKomoditasIkan('Ikan Nila');
    }
    setFieldErrors({});
  }, [isOpen, editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const payload = {
      nama_pokdakan: namaPokdakan,
      pemilik,
      kecamatan,
      desa,
      titik_koordinat: titikKoordinat,
      komoditas_ikan: komoditasIkan,
    };

    const validation = lokasiKolamSchema.safeParse(payload);
    if (!validation.success) {
      setFieldErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        const res = await updateLokasiKolamAction(editingItem.id, payload);

        if (res.success && res.data) {
          onSuccess({ mode: 'edit', data: res.data as LokasiItem });
          toast.success(res.message || 'Lokasi kolam berhasil diperbarui.');
          onOpenChange(false);
        } else {
          if (res.errors) {
            setFieldErrors(res.errors as Record<string, string[]>);
          }
          toast.error(res.message || 'Gagal memperbarui lokasi kolam.');
        }
      } else {
        const res = await createLokasiKolamAction(payload);

        if (res.success && res.data) {
          onSuccess({ mode: 'create', data: res.data as LokasiItem });
          toast.success(res.message || 'Lokasi kolam berhasil ditambahkan.');
          onOpenChange(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" />
            <span>{editingItem ? 'Edit Lokasi Kolam' : 'Tambah Lokasi Kolam Pembudidaya'}</span>
          </DialogTitle>
          <DialogDescription>
            {editingItem
              ? 'Perbarui detail titik kolam, pemilik, atau komoditas budidaya.'
              : 'Daftarkan titik lokasi kelompok pembudidaya baru sebagai rujukan sampel.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <Field>
            <FieldLabel htmlFor="nama_pokdakan">Nama Pokdakan / Kelompok *</FieldLabel>
            <Input
              id="nama_pokdakan"
              value={namaPokdakan}
              onChange={(e) => setNamaPokdakan(e.target.value)}
              placeholder="Contoh: Pokdakan Mina Barokah"
            />
            <FieldError errors={toFieldErrors(fieldErrors.nama_pokdakan)} />
          </Field>

          <Field>
            <FieldLabel htmlFor="pemilik">Nama Pemilik / Kontak Person *</FieldLabel>
            <Input
              id="pemilik"
              value={pemilik}
              onChange={(e) => setPemilik(e.target.value)}
              placeholder="Contoh: Bpk. Yohanes Bala"
            />
            <FieldError errors={toFieldErrors(fieldErrors.pemilik)} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="kecamatan">Kecamatan *</FieldLabel>
              <Select value={kecamatan} onValueChange={(val) => val && setKecamatan(val)}>
                <SelectTrigger id="kecamatan">
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
              <FieldError errors={toFieldErrors(fieldErrors.kecamatan)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="desa">Desa / Kelurahan *</FieldLabel>
              <Input
                id="desa"
                value={desa}
                onChange={(e) => setDesa(e.target.value)}
                placeholder="Contoh: Lewoleba Timur"
              />
              <FieldError errors={toFieldErrors(fieldErrors.desa)} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="titik_koordinat">Titik Koordinat (Latitude, Longitude)</FieldLabel>
            <Input
              id="titik_koordinat"
              value={titikKoordinat}
              onChange={(e) => setTitikKoordinat(e.target.value)}
              placeholder="-8.36841, 123.53812"
              className="font-mono"
            />
            <FieldError errors={toFieldErrors(fieldErrors.titik_koordinat)} />
          </Field>

          <Field>
            <FieldLabel htmlFor="komoditas_ikan">Komoditas Ikan yang Dibudidaya</FieldLabel>
            <Input
              id="komoditas_ikan"
              value={komoditasIkan}
              onChange={(e) => setKomoditasIkan(e.target.value)}
              placeholder="Contoh: Ikan Nila, Lele, Bandeng"
            />
            <FieldError errors={toFieldErrors(fieldErrors.komoditas_ikan)} />
          </Field>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
  );
}
