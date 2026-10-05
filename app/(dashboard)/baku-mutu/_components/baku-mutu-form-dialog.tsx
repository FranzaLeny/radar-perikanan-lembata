'use client';

import React, { useState, useEffect } from 'react';
import { Scale, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toFieldErrors } from '@/lib/utils';
import { toast } from 'sonner';
import { bakuMutuSchema } from '@/lib/validations/baku-mutu';
import {
  createBakuMutuAction,
  updateBakuMutuVersionedAction,
} from '@/lib/actions/baku-mutu';
import type { BakuMutuItem } from '../types';

interface BakuMutuFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isRevisionMode: boolean;
  selectedItem: BakuMutuItem | null;
  onSuccess: (result: {
    mode: 'create' | 'revision';
    data: BakuMutuItem;
    originalId?: string;
  }) => void;
}

export function BakuMutuFormDialog({
  isOpen,
  onOpenChange,
  isRevisionMode,
  selectedItem,
  onSuccess,
}: BakuMutuFormDialogProps) {
  const [parameter, setParameter] = useState('');
  const [satuan, setSatuan] = useState('');
  const [nilaiMin, setNilaiMin] = useState<string>('');
  const [nilaiMax, setNilaiMax] = useState<string>('');
  const [nomorRegulasi, setNomorRegulasi] = useState('PP No. 22/2021');
  const [dasarRegulasi, setDasarRegulasi] = useState('');
  const [tipeAmbangBatas, setTipeAmbangBatas] = useState<'tetap' | 'deviasi_suhu_lingkungan'>('tetap');
  const [deviasiToleransi, setDeviasiToleransi] = useState<string>('2.00');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (isRevisionMode && selectedItem) {
      setParameter(selectedItem.parameter);
      setSatuan(selectedItem.satuan);
      setNilaiMin(selectedItem.nilai_min !== null ? String(selectedItem.nilai_min) : '');
      setNilaiMax(selectedItem.nilai_max !== null ? String(selectedItem.nilai_max) : '');
      setNomorRegulasi(selectedItem.nomor_regulasi || 'PP No. 22/2021');
      setDasarRegulasi(selectedItem.dasar_regulasi || '');
      setTipeAmbangBatas(
        (selectedItem.tipe_ambang_batas as 'tetap' | 'deviasi_suhu_lingkungan') ||
          (selectedItem.parameter.toLowerCase().includes('suhu') ? 'deviasi_suhu_lingkungan' : 'tetap')
      );
      setDeviasiToleransi(selectedItem.deviasi_toleransi || '2.00');
    } else {
      setParameter('');
      setSatuan('');
      setNilaiMin('');
      setNilaiMax('');
      setNomorRegulasi('PP No. 22/2021');
      setDasarRegulasi('Peraturan Pemerintah No. 22 Tahun 2021 Lampiran VI (Baku Mutu Air Nasional)');
      setTipeAmbangBatas('tetap');
      setDeviasiToleransi('2.00');
    }
    setFieldErrors({});
  }, [isOpen, isRevisionMode, selectedItem]);

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
        const res = await updateBakuMutuVersionedAction(selectedItem.id, payload);

        if (res.success) {
          if (res.data) {
            onSuccess({
              mode: 'revision',
              data: res.data as BakuMutuItem,
              originalId: selectedItem.id,
            });
          }
          toast.success(res.message || 'Versi baku mutu berhasil diperbarui.');
          onOpenChange(false);
        } else {
          toast.error(res.message || 'Gagal merevisi baku mutu.');
        }
      } else {
        const res = await createBakuMutuAction(payload);

        if (res.success && res.data) {
          onSuccess({
            mode: 'create',
            data: res.data as BakuMutuItem,
          });
          toast.success(res.message || 'Parameter baru berhasil ditambahkan.');
          onOpenChange(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Nilai Min & Max konstan (pH, DO, Amonia)
                </p>
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
                Sesuai PP No. 22/2021 Lampiran VI: Ambang batas suhu air budidaya adalah Suhu Udara ±{' '}
                {deviasiToleransi || '2.00'}°C.
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
  );
}
