'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { APP_CLOUD_NAME, APP_CONFIG } from '@/lib/constants';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  MapPin,
  Printer,
  RotateCcw,
  Settings2,
  UserCheck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export interface PokdakanData {
  id: string;
  nama_pokdakan: string;
  pemilik: string;
  kecamatan: string;
  desa: string;
  titik_koordinat?: string | null;
  komoditas_ikan?: string | null;
  aktif?: boolean;
}

export interface UjiData {
  id: string;
  lokasi_id: string | null;
  tanggal_pengambilan: Date | string;
  kesimpulan: string | null;
}

export interface PegawaiData {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  pangkat_golongan: string | null;
  peran_tanda_tangan: string;
  aktif: boolean;
}

interface RekapTahunanClientProps {
  allPokdakan: PokdakanData[];
  allUji: UjiData[];
  allPegawai: PegawaiData[];
  qrDataUrl: string;
}

interface PrintSettings {
  tahunAnggaran: number;
  filterTahun: boolean;
  tanggalTtd: string; // YYYY-MM-DD
  lokasiTtd: string;
  pengelolaId: string; // Pegawai ID or 'default' or 'custom'
  pengelolaNama: string;
  pengelolaNip: string;
  pengelolaJabatan: string;
  kepalaDinasId: string; // Pegawai ID or 'default' or 'custom'
  kepalaDinasNama: string;
  kepalaDinasNip: string;
  kepalaDinasJabatan: string;
}

export function RekapTahunanClient({
  allPokdakan,
  allUji,
  allPegawai,
  qrDataUrl,
}: RekapTahunanClientProps) {
  const currentYear = new Date().getFullYear();
  const todayStr = new Date().toISOString().split('T')[0];

  // Helper untuk mencari pegawai default di DB jika ada
  const dbPengelola = allPegawai.find(
    (p) => p.peran_tanda_tangan === 'pengelola_mutu'
  );
  const dbKadis = allPegawai.find(
    (p) => p.peran_tanda_tangan === 'kepala_dinas'
  );

  const initialPengelolaId = dbPengelola ? dbPengelola.id : 'default';
  const initialKadisId = dbKadis ? dbKadis.id : 'default';

  const [dialogOpen, setDialogOpen] = useState(false);
  const [settings, setSettings] = useState<PrintSettings>({
    tahunAnggaran: currentYear,
    filterTahun: false,
    tanggalTtd: todayStr,
    lokasiTtd: 'Lewoleba',
    pengelolaId: initialPengelolaId,
    pengelolaNama: dbPengelola ? dbPengelola.nama : '',
    pengelolaNip: dbPengelola ? dbPengelola.nip : '',
    pengelolaJabatan: dbPengelola
      ? dbPengelola.jabatan
      : '',
    kepalaDinasId: initialKadisId,
    kepalaDinasNama: dbKadis ? dbKadis.nama : '',
    kepalaDinasNip: dbKadis ? dbKadis.nip : '',
    kepalaDinasJabatan: dbKadis
      ? dbKadis.jabatan
      : '',
  });

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  // Matriks Pokdakan x Bulan
  const matrix = useMemo(() => {
    const mat: Record<string, Record<number, string>> = {};

    allPokdakan.forEach((p) => {
      mat[p.id] = {};
    });

    allUji.forEach((u) => {
      if (!u.lokasi_id || !mat[u.lokasi_id]) return;
      const date = new Date(u.tanggal_pengambilan);

      // Filter tahun jika diaktifkan
      if (settings.filterTahun && date.getFullYear() !== settings.tahunAnggaran) {
        return;
      }

      const m = date.getMonth();
      const current = mat[u.lokasi_id][m];
      const incoming = u.kesimpulan || 'NORMAL';

      if (!current) {
        mat[u.lokasi_id][m] = incoming;
      } else if (incoming === 'KRITIS') {
        mat[u.lokasi_id][m] = 'KRITIS';
      } else if (incoming === 'PERINGATAN' && current === 'NORMAL') {
        mat[u.lokasi_id][m] = 'PERINGATAN';
      }
    });

    return mat;
  }, [allPokdakan, allUji, settings.filterTahun, settings.tahunAnggaran]);

  // Format tanggal tanda tangan ke bahasa Indonesia
  const formattedTanggalTtd = useMemo(() => {
    try {
      if (!settings.tanggalTtd) return '';
      const [y, m, d] = settings.tanggalTtd.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return settings.tanggalTtd;
    }
  }, [settings.tanggalTtd]);

  // Handler pergantian pilihan Pengelola
  const handlePengelolaChange = (val: string) => {
    if (val === 'custom') {
      setSettings((s) => ({
        ...s,
        pengelolaId: 'custom',
      }));
    } else {
      const selected = allPegawai.find((p) => p.id === val);
      if (selected) {
        setSettings((s) => ({
          ...s,
          pengelolaId: val,
          pengelolaNama: selected.nama,
          pengelolaNip: selected.nip,
          pengelolaJabatan: selected.jabatan,
        }));
      }
    }
  };

  // Handler pergantian pilihan Kepala Dinas
  const handleKepalaDinasChange = (val: string) => {
    if (val === 'custom') {
      setSettings((s) => ({
        ...s,
        kepalaDinasId: 'custom',
      }));
    } else {
      const selected = allPegawai.find((p) => p.id === val);
      if (selected) {
        setSettings((s) => ({
          ...s,
          kepalaDinasId: val,
          kepalaDinasNama: selected.nama,
          kepalaDinasNip: selected.nip,
          kepalaDinasJabatan: selected.jabatan,
        }));
      }
    }
  };

  // Reset setting ke default
  const handleResetSettings = () => {
    setSettings({
      tahunAnggaran: currentYear,
      filterTahun: false,
      tanggalTtd: todayStr,
      lokasiTtd: 'Lewoleba',
      pengelolaId: initialPengelolaId,
      pengelolaNama: dbPengelola ? dbPengelola.nama : '',
      pengelolaNip: dbPengelola ? dbPengelola.nip : '',
      pengelolaJabatan: dbPengelola
        ? dbPengelola.jabatan
        : '',
      kepalaDinasId: initialKadisId,
      kepalaDinasNama: dbKadis ? dbKadis.nama : '',
      kepalaDinasNip: dbKadis ? dbKadis.nip : '',
      kepalaDinasJabatan: dbKadis
        ? dbKadis.jabatan
        : '',
    });
  };

  // Cetak dokumen
  const handlePrint = () => {
    setDialogOpen(false);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
        <Link href="/laporan">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Kembali ke Pusat Laporan</span>
          </Button>
        </Link>

        {/* Action Buttons: Terpisah antara Tombol Pengaturan (Toggle) dan Tombol Cetak */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* 1. Tombol Toggle Settings Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 shadow-xs cursor-pointer font-medium text-xs flex-1 sm:flex-initial"
                />
              }
            >
              <Settings2 className="size-4 text-primary" />
              <span>Pengaturan Cetak</span>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase mb-1">
                  <Settings2 className="size-4" />
                  <span>Pengaturan Lembar Cetak</span>
                </div>
                <DialogTitle className="text-lg">
                  Pengaturan Cetak Rekapitulasi Tahunan
                </DialogTitle>
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
                          className="h-7 text-xs mt-0.5"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-[11px] text-muted-foreground">Jabatan</Label>
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

                {/* 4. Pejabat Mengetahui / Kepala Dinas (Tanda Tangan Kanan) */}
                <div className="p-3 rounded-lg border border-border space-y-3 bg-muted/10">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                      <UserCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
                      Penandatangan 2 (Mengetahui / Kepala Dinas)
                    </Label>
                    <Badge variant="outline" className="text-[10px] py-0">
                      Sisi Kanan
                    </Badge>
                  </div>


                  <div className="space-y-2">
                    <NativeSelect
                      value={settings.kepalaDinasId}
                      onChange={(e) => handleKepalaDinasChange(e.target.value)}
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
                          className="h-7 text-xs mt-0.5"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-[11px] text-muted-foreground">Jabatan</Label>
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

              <DialogFooter className="flex-row items-center justify-between gap-2 border-t pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetSettings}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset Default</span>
                </Button>

                <div className="flex items-center gap-2">
                  <DialogClose
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="cursor-pointer text-xs"
                      />
                    }
                  >
                    Tutup
                  </DialogClose>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setDialogOpen(false);
                      toast.success('Pengaturan lembar cetak berhasil disimpan.');
                    }}
                    className="gap-1.5 text-xs cursor-pointer font-medium"
                  >
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>Terapkan</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handlePrint}
                    className="gap-1.5 text-xs cursor-pointer font-medium"
                  >
                    <Printer className="size-3.5" />
                    <span>Cetak Sekarang</span>
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 2. Tombol Cetak Langsung (Direct Print) */}
          <Button
            variant="default"
            size="sm"
            onClick={() => window.print()}
            className="gap-2 shadow-xs cursor-pointer font-medium text-xs flex-1 sm:flex-initial"
          >
            <Printer className="size-4" />
            <span>Cetak Matriks Rekap</span>
          </Button>
        </div>
      </div>

      {/* Printable Annual Recap Document Canvas */}
      <div className="flex justify-center">
        <div className="print-area bg-white text-slate-900 border border-slate-300 rounded-xl p-8 sm:p-10 w-full max-w-5xl shadow-2xl font-sans">
          {/* Header Dinas */}
          <div className="border-b-4 border-double border-slate-900 pb-4 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="w-16 sm:w-20 shrink-0 flex items-center justify-start">
                <Image
                  src={APP_CONFIG.logo.kabupaten}
                  alt="Logo Pemerintah Kabupaten Lembata"
                  width={80}
                  height={80}
                  priority
                  className="h-16 sm:h-20 w-auto object-contain shrink-0"
                />
              </div>
              <div className="text-center flex-1 px-2">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                  {APP_CONFIG.institution.government}
                </h3>
                <h1 className="text-base sm:text-xl font-extrabold uppercase tracking-tight text-slate-900">
                  {APP_CONFIG.institution.name.toUpperCase()}
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Laporan Rekapitulasi Tahunan Evaluasi Mutu Air Budidaya Ikan Perikanan Tahun {settings.tahunAnggaran}
                </p>
              </div>
              {/* Spacer penyeimbang simetris agar teks kop tepat di tengah */}
              <div className="w-16 sm:w-20 shrink-0 pointer-events-none" aria-hidden="true" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-sm sm:text-base font-extrabold uppercase text-slate-900 underline">
              MATRIKS TAHUNAN KEPATUHAN MUTU AIR PER KELOMPOK PEMBUDIDAYA
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Tahun Anggaran {settings.tahunAnggaran} • Wilayah Monitoring {APP_CONFIG.institution.regency}
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold mb-4 p-2.5 bg-slate-100 rounded-lg border border-slate-200">
            <span className="text-slate-600">Keterangan Status:</span>
            <Badge
              variant="outline"
              className="gap-1.5 border-emerald-300 bg-emerald-50 text-emerald-800 text-xs py-0.5"
            >
              <span className="size-2 rounded-full bg-emerald-600" />
              <span>Memenuhi Baku Mutu (Normal)</span>
            </Badge>
            <Badge
              variant="outline"
              className="gap-1.5 border-amber-300 bg-amber-50 text-amber-800 text-xs py-0.5"
            >
              <span className="size-2 rounded-full bg-amber-500" />
              <span>Peringatan (Mendekati Batas)</span>
            </Badge>
            <Badge
              variant="outline"
              className="gap-1.5 border-rose-300 bg-rose-50 text-rose-800 text-xs py-0.5"
            >
              <span className="size-2 rounded-full bg-rose-600" />
              <span>Kritis (Melebihi/Kurang)</span>
            </Badge>
            <Badge
              variant="outline"
              className="gap-1.5 border-slate-300 bg-slate-50 text-slate-500 text-xs py-0.5"
            >
              <span className="size-2 rounded-full bg-slate-300" />
              <span>- (Belum Ada Uji)</span>
            </Badge>
          </div>

          {/* Matriks Table */}
          <div className="mb-8 border border-slate-300 rounded-lg overflow-hidden [&_[data-slot=table-container]]:overflow-visible print:border-slate-400">
            <Table className="text-xs table-fixed w-full">
              <TableHeader className="bg-slate-200 border-b border-slate-300">
                <TableRow className="border-b border-slate-300 hover:bg-slate-200">
                  <TableHead className="w-[4%] text-center text-slate-800 font-bold uppercase text-[11px] border-r border-slate-300 px-0.5">
                    No
                  </TableHead>
                  <TableHead className="w-[28%] text-slate-800 font-bold uppercase text-[11px] border-r border-slate-300 px-2">
                    Nama Pokdakan
                  </TableHead>
                  <TableHead className="w-[14%] text-slate-800 font-bold uppercase text-[11px] border-r border-slate-300 px-2">
                    Kecamatan
                  </TableHead>
                  {months.map((m) => (
                    <TableHead
                      key={m}
                      className="w-[4.5%] text-center text-slate-800 font-bold uppercase text-[11px] border-r border-slate-300 px-0.5 last:border-r-0"
                    >
                      {m}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPokdakan.map((p, idx) => (
                  <TableRow
                    key={p.id}
                    className="border-b border-slate-200 hover:bg-slate-50/80"
                  >
                    <TableCell className="text-center font-mono text-slate-500 border-r border-slate-200 py-1.5 px-0.5 text-xs">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900 border-r border-slate-200 py-1.5 px-2 text-xs truncate">
                      <div
                        className="truncate font-semibold text-slate-900"
                        title={p.nama_pokdakan}
                      >
                        {p.nama_pokdakan}
                      </div>
                      <div
                        className="text-[11px] text-slate-500 font-normal truncate"
                        title={p.pemilik}
                      >
                        {p.pemilik}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700 border-r border-slate-200 py-1.5 px-2 text-xs truncate">
                      <div className="truncate" title={p.kecamatan}>
                        {p.kecamatan}
                      </div>
                    </TableCell>
                    {months.map((_, mIdx) => {
                      const stat = matrix[p.id]?.[mIdx];
                      let cellContent = (
                        <span className="text-slate-300 font-mono text-xs">
                          -
                        </span>
                      );

                      if (stat === 'NORMAL') {
                        cellContent = (
                          <span
                            className="inline-flex items-center justify-center size-3.5 rounded-full bg-emerald-500 text-white font-bold text-[10px]"
                            title="Normal"
                          >
                            ✓
                          </span>
                        );
                      } else if (stat === 'PERINGATAN') {
                        cellContent = (
                          <span
                            className="inline-flex items-center justify-center size-3.5 rounded-full bg-amber-500 text-white font-bold text-[10px]"
                            title="Peringatan"
                          >
                            !
                          </span>
                        );
                      } else if (stat === 'KRITIS') {
                        cellContent = (
                          <span
                            className="inline-flex items-center justify-center size-3.5 rounded-full bg-rose-600 text-white font-bold text-[10px]"
                            title="Kritis"
                          >
                            ✕
                          </span>
                        );
                      }

                      return (
                        <TableCell
                          key={mIdx}
                          className="text-center border-r border-slate-200 py-1.5 px-0.5 text-xs last:border-r-0"
                        >
                          {cellContent}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Signature Block */}
          <div className="grid grid-cols-2 gap-8 text-xs mt-6 pt-4 border-t border-slate-300">
            <div className="text-center">
              <p className="text-slate-500 mb-16">
                {settings.pengelolaJabatan},
              </p>
              <p className="font-bold text-slate-900 uppercase underline">
                {settings.pengelolaNama}
              </p>
              {settings.pengelolaNip && (
                <p className="text-xs text-slate-500 font-mono">
                  NIP. {settings.pengelolaNip}
                </p>
              )}
            </div>

            <div className="text-center">
              <p className="text-slate-500">
                {settings.lokasiTtd}, {formattedTanggalTtd}
              </p>
              <p className="text-slate-500 mb-14">
                Mengetahui, {settings.kepalaDinasJabatan},
              </p>
              <p className="font-bold text-slate-900 uppercase underline">
                {settings.kepalaDinasNama}
              </p>
              {settings.kepalaDinasNip && (
                <p className="text-xs text-slate-500 font-mono">
                  NIP. {settings.kepalaDinasNip}
                </p>
              )}
            </div>
          </div>

          {/* Footer & QR Verifikasi Keaslian */}
          <div className="mt-8 pt-4 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <Image
                src={qrDataUrl}
                alt="QR Verifikasi"
                width={48}
                height={48}
                priority
                unoptimized
                className="size-12 object-contain"
              />
              <div>
                <p className="font-bold text-slate-700">
                  Verifikasi Dokumen Resmi Digital
                </p>
                <p className="text-xs text-slate-400">
                  Pindai QR untuk memverifikasi keaslian dokumen di portal{' '}
                  {APP_CONFIG.name} {APP_CONFIG.institution.regency}
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="block text-slate-400">
                DOKUMEN REKAPITULASI TAHUNAN
              </span>
              <p>Dicetak melalui {APP_CLOUD_NAME}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
