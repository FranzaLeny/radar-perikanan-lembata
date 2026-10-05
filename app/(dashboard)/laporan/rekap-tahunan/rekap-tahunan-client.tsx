'use client';

import React, { useMemo, useState } from 'react';
import type { RekapTahunanClientProps, PrintSettings } from './types';
import { RekapActionBar } from './_components/rekap-action-bar';
import { RekapSettingsDialog } from './_components/rekap-settings-dialog';
import { RekapMatrixTable } from './_components/rekap-matrix-table';

export * from './types';

const MONTHS = [
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

export function RekapTahunanClient({
  allPokdakan,
  allUji,
  allPegawai,
  qrDataUrl,
}: RekapTahunanClientProps) {
  const currentYear = new Date().getFullYear();
  const todayStr = new Date().toISOString().split('T')[0];

  // Cari pejabat default dari database
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
    pengelolaJabatan: dbPengelola ? dbPengelola.jabatan : '',
    kepalaDinasId: initialKadisId,
    kepalaDinasNama: dbKadis ? dbKadis.nama : '',
    kepalaDinasNip: dbKadis ? dbKadis.nip : '',
    kepalaDinasJabatan: dbKadis ? dbKadis.jabatan : '',
  });

  // Matriks Pokdakan x Bulan
  const matrix = useMemo(() => {
    const mat: Record<string, Record<number, string>> = {};

    allPokdakan.forEach((p) => {
      mat[p.id] = {};
    });

    allUji.forEach((u) => {
      if (!u.lokasi_id || !mat[u.lokasi_id]) return;
      const date = new Date(u.tanggal_pengambilan);

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
      pengelolaJabatan: dbPengelola ? dbPengelola.jabatan : '',
      kepalaDinasId: initialKadisId,
      kepalaDinasNama: dbKadis ? dbKadis.nama : '',
      kepalaDinasNip: dbKadis ? dbKadis.nip : '',
      kepalaDinasJabatan: dbKadis ? dbKadis.jabatan : '',
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
    <div className="space-y-6 print:space-y-0 print:p-0 print:m-0">
      <RekapActionBar
        tahunAnggaran={settings.tahunAnggaran}
        filterTahun={settings.filterTahun}
        onOpenSettings={() => setDialogOpen(true)}
        onPrint={handlePrint}
      />

      <RekapSettingsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        settings={settings}
        setSettings={setSettings}
        allPegawai={allPegawai}
        currentYear={currentYear}
        formattedTanggalTtd={formattedTanggalTtd}
        onResetDefaults={handleResetSettings}
      />

      <RekapMatrixTable
        allPokdakan={allPokdakan}
        matrix={matrix}
        months={MONTHS}
        settings={settings}
        formattedTanggalTtd={formattedTanggalTtd}
        qrDataUrl={qrDataUrl}
      />
    </div>
  );
}
