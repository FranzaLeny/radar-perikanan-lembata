'use client';

import React, { useState, useEffect } from 'react';
import { Users, Loader2, Star } from 'lucide-react';
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
import { pegawaiSchema } from '@/lib/validations/pegawai-master';
import {
  createPegawaiAction,
  updatePegawaiAction,
} from '@/lib/actions/pegawai';
import type { PegawaiItem, PeranTandaTangan } from '../types';

interface PegawaiFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: PegawaiItem | null;
  onSuccess: (result: { mode: 'create' | 'edit'; data: PegawaiItem; isPenanggungjawab: boolean }) => void;
}

export function PegawaiFormDialog({
  isOpen,
  onOpenChange,
  editingItem,
  onSuccess,
}: PegawaiFormDialogProps) {
  const [nip, setNip] = useState('');
  const [nama, setNama] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [pangkatGolongan, setPangkatGolongan] = useState('');
  const [peranTandaTangan, setPeranTandaTangan] = useState<PeranTandaTangan>('penguji');
  const [isPenanggungjawab, setIsPenanggungjawab] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (editingItem) {
      setNip(editingItem.nip);
      setNama(editingItem.nama);
      setJabatan(editingItem.jabatan);
      setPangkatGolongan(editingItem.pangkat_golongan || '');
      setPeranTandaTangan(
        (editingItem.peran_tanda_tangan as PeranTandaTangan) || 'penguji'
      );
      setIsPenanggungjawab(editingItem.is_penanggungjawab || false);
    } else {
      setNip('');
      setNama('');
      setJabatan('');
      setPangkatGolongan('');
      setPeranTandaTangan('penguji');
      setIsPenanggungjawab(false);
    }
    setFieldErrors({});
  }, [isOpen, editingItem]);

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
          onSuccess({
            mode: 'edit',
            data: res.data as PegawaiItem,
            isPenanggungjawab,
          });
          toast.success(res.message || 'Data pegawai berhasil diperbarui.');
          onOpenChange(false);
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
          onSuccess({
            mode: 'create',
            data: res.data as PegawaiItem,
            isPenanggungjawab,
          });
          toast.success(res.message || 'Pegawai berhasil didaftarkan.');
          onOpenChange(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            <FieldLabel htmlFor="nip">NIP (Nomor Induk Pegawai) *</FieldLabel>
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
            <FieldLabel htmlFor="nama">Nama Lengkap & Gelar *</FieldLabel>
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
              <FieldLabel htmlFor="jabatan">Jabatan Kedinasan *</FieldLabel>
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
              <FieldLabel htmlFor="pangkat_golongan">Pangkat / Golongan Ruang</FieldLabel>
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
            <FieldLabel htmlFor="peran_tanda_tangan">Peran Resmi di Dokumen LHU *</FieldLabel>
            <Select
              value={peranTandaTangan}
              onValueChange={(val) => {
                if (val) setPeranTandaTangan(val as PeranTandaTangan);
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
                'Perbarui Pegawai'
              ) : (
                'Simpan Pegawai'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
