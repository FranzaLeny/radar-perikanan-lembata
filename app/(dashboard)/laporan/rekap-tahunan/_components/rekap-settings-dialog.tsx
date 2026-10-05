'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NativeSelect } from '@/components/ui/native-select';
import {
  Settings2,
  Calendar,
  MapPin,
  UserCheck,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import type { PrintSettings, PegawaiData } from '../types';

interface RekapSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: PrintSettings;
  setSettings: React.Dispatch<React.SetStateAction<PrintSettings>>;
  allPegawai: PegawaiData[];
  currentYear: number;
  formattedTanggalTtd: string;
  onResetDefaults: () => void;
}

export function RekapSettingsDialog({
  open,
  onOpenChange,
  settings,
  setSettings,
  allPegawai,
  currentYear,
  formattedTanggalTtd,
  onResetDefaults,
}: RekapSettingsDialogProps) {
  const handlePengelolaChange = (val: string) => {
    if (val === 'custom') {
      setSettings((s) => ({
        ...s,
        pengelolaId: 'custom',
        pengelolaNama: '',
        pengelolaNip: '',
        pengelolaJabatan: 'Pengelola Mutu Air Budidaya',
      }));
    } else {
      const p = allPegawai.find((item) => item.id === val);
      if (p) {
        setSettings((s) => ({
          ...s,
          pengelolaId: p.id,
          pengelolaNama: p.nama,
          pengelolaNip: p.nip,
          pengelolaJabatan: p.jabatan,
        }));
      }
    }
  };

  const handleKadisChange = (val: string) => {
    if (val === 'custom') {
      setSettings((s) => ({
        ...s,
        kepalaDinasId: 'custom',
        kepalaDinasNama: '',
        kepalaDinasNip: '',
        kepalaDinasJabatan: 'Kepala Dinas Perikanan Kabupaten Lembata',
      }));
    } else {
      const p = allPegawai.find((item) => item.id === val);
      if (p) {
        setSettings((s) => ({
          ...s,
          kepalaDinasId: p.id,
          kepalaDinasNama: p.nama,
          kepalaDinasNip: p.nip,
          kepalaDinasJabatan: p.jabatan,
        }));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase mb-1">
            <Settings2 className="size-4" />
            <span>Pengaturan Lembar Cetak</span>
          </div>
          <DialogTitle className="text-lg">Pengaturan Cetak Rekapitulasi Tahunan</DialogTitle>
          <DialogDescription className="text-xs">
            Sesuaikan tahun anggaran, tanggal cetak, dan pejabat penandatangan sebelum mencetak dokumen resmi A4 Landscape.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* 1. Baris Tahun & Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3 rounded-lg border border-border bg-muted/30">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground" />
                Tahun Anggaran Laporan
              </Label>
              <Input
                type="number"
                value={settings.tahunAnggaran}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    tahunAnggaran: Number(e.target.value) || currentYear,
                  }))
                }
                min={2020}
                max={2099}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={settings.filterTahun}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      filterTahun: e.target.checked,
                    }))
                  }
                  className="rounded border-input text-primary focus:ring-primary size-4"
                />
                <span className="text-xs text-foreground font-medium">
                  Hanya tampilkan uji tahun {settings.tahunAnggaran}
                </span>
              </label>
              <p className="text-[11px] text-muted-foreground">
                {settings.filterTahun
                  ? 'Matriks hanya menyaring data tahun terpilih.'
                  : 'Menampilkan seluruh histori pemantauan mutu.'}
              </p>
            </div>
          </div>

          {/* 2. Tanggal dan Lokasi Tanda Tangan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3 rounded-lg border border-border bg-muted/30">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground" />
                Tanggal Tanda Tangan
              </Label>
              <Input
                type="date"
                value={settings.tanggalTtd}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    tanggalTtd: e.target.value,
                  }))
                }
                className="h-8 text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Tampil: <strong>{formattedTanggalTtd || '-'}</strong>
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <MapPin className="size-3.5 text-muted-foreground" />
                Lokasi / Kota Penandatanganan
              </Label>
              <Input
                type="text"
                value={settings.lokasiTtd}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    lokasiTtd: e.target.value,
                  }))
                }
                placeholder="Contoh: Lewoleba"
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* 3. Pejabat Pengelola Mutu Air (Tanda Tangan Kiri) */}
          <div className="p-3 rounded-lg border border-border space-y-3 bg-muted/10">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                <UserCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                Penandatangan 1 (Pengelola Mutu Air)
              </Label>
              <Badge variant="outline" className="text-[10px] py-0">
                Sisi Kiri
              </Badge>
            </div>

            <div className="space-y-2">
              <NativeSelect
                value={settings.pengelolaId}
                onChange={(e) => handlePengelolaChange(e.target.value)}
                className="w-full"
              >
                {allPegawai.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} — {p.jabatan} {p.peran_tanda_tangan === 'pengelola_mutu' ? '⭐' : ''}
                  </option>
                ))}
                <option value="custom">✏️ Kustom / Input Manual Sendiri</option>
              </NativeSelect>

              {/* Form edit detail penandatangan pengelola */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-border/60">
                <div>
                  <Label className="text-[11px] text-muted-foreground">Nama Lengkap & Gelar</Label>
                  <Input
                    type="text"
                    value={settings.pengelolaNama}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, pengelolaNama: e.target.value }))
                    }
                    className="h-7 text-xs mt-0.5"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground">NIP</Label>
                  <Input
                    type="text"
                    value={settings.pengelolaNip}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, pengelolaNip: e.target.value }))
                    }
                    placeholder="18 digit NIP..."
                    className="h-7 text-xs font-mono mt-0.5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-[11px] text-muted-foreground">Jabatan Kedinasan</Label>
                  <Input
                    type="text"
                    value={settings.pengelolaJabatan}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, pengelolaJabatan: e.target.value }))
                    }
                    className="h-7 text-xs mt-0.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Pejabat Pengesahan Kepala Dinas (Tanda Tangan Kanan) */}
          <div className="p-3 rounded-lg border border-border space-y-3 bg-muted/10">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                <CheckCircle2 className="size-3.5 text-blue-600 dark:text-blue-400" />
                Penandatangan 2 (Kepala Dinas / Pengesahan)
              </Label>
              <Badge variant="outline" className="text-[10px] py-0">
                Sisi Kanan
              </Badge>
            </div>

            <div className="space-y-2">
              <NativeSelect
                value={settings.kepalaDinasId}
                onChange={(e) => handleKadisChange(e.target.value)}
                className="w-full"
              >
                {allPegawai.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} — {p.jabatan} {p.peran_tanda_tangan === 'kepala_dinas' ? '⭐' : ''}
                  </option>
                ))}
                <option value="custom">✏️ Kustom / Input Manual Sendiri</option>
              </NativeSelect>

              {/* Form edit detail penandatangan kadis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-border/60">
                <div>
                  <Label className="text-[11px] text-muted-foreground">Nama Lengkap & Gelar</Label>
                  <Input
                    type="text"
                    value={settings.kepalaDinasNama}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, kepalaDinasNama: e.target.value }))
                    }
                    className="h-7 text-xs mt-0.5"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground">NIP</Label>
                  <Input
                    type="text"
                    value={settings.kepalaDinasNip}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, kepalaDinasNip: e.target.value }))
                    }
                    placeholder="18 digit NIP..."
                    className="h-7 text-xs font-mono mt-0.5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-[11px] text-muted-foreground">Jabatan Kedinasan</Label>
                  <Input
                    type="text"
                    value={settings.kepalaDinasJabatan}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, kepalaDinasJabatan: e.target.value }))
                    }
                    className="h-7 text-xs mt-0.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetDefaults}
            className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset ke Default DB</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <span>Terapkan Pengaturan</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
