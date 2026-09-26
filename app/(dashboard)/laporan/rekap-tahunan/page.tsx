import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { PrintButton } from '@/components/print-button';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { ArrowLeft, Droplets } from 'lucide-react';
import Link from 'next/link';

export default async function RekapTahunanPage() {
  const [allPokdakan, allUji] = await Promise.all([
    db.query.lokasiKolam.findMany({
      orderBy: [schema.lokasiKolam.kecamatan, schema.lokasiKolam.nama_pokdakan],
    }),
    db.query.ujiKualitasAir.findMany({
      with: {
        lokasi: true,
      },
    }),
  ]);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  // Matriks Pokdakan x Bulan
  // pokdakanId -> monthIndex -> worst status
  const matrix: Record<string, Record<number, string>> = {};

  allPokdakan.forEach((p) => {
    matrix[p.id] = {};
  });

  allUji.forEach((u) => {
    if (!u.lokasi_id || !matrix[u.lokasi_id]) return;
    const date = new Date(u.tanggal_pengambilan);
    const m = date.getMonth();
    const current = matrix[u.lokasi_id][m];
    const incoming = u.kesimpulan || 'NORMAL';

    if (!current) {
      matrix[u.lokasi_id][m] = incoming;
    } else if (incoming === 'KRITIS') {
      matrix[u.lokasi_id][m] = 'KRITIS';
    } else if (incoming === 'PERINGATAN' && current === 'NORMAL') {
      matrix[u.lokasi_id][m] = 'PERINGATAN';
    }
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between no-print">
        <Link href="/laporan">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            <span>Kembali ke Pusat Laporan</span>
          </Button>
        </Link>

        <PrintButton label="Cetak Matriks Rekap Tahunan (A4 Landscape)" />
      </div>

      {/* Printable Annual Recap Document */}
      <div className="flex justify-center">
        <div className="print-area bg-white text-slate-900 border border-slate-300 rounded-xl p-8 sm:p-10 w-full max-w-5xl shadow-2xl font-sans">
          {/* Header Dinas */}
          <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="size-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Droplets className="size-7 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                  PEMERINTAH KABUPATEN LEMBATA
                </h3>
                <h1 className="text-base sm:text-xl font-extrabold uppercase tracking-tight text-slate-900">
                  DINAS PERIKANAN — SISTEM SIPEKA
                </h1>
                <p className="text-xs text-slate-600">
                  Laporan Rekapitulasi Tahunan Evaluasi Mutu Air Budidaya Ikan Perikanan Tahun 2026
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-sm sm:text-base font-extrabold uppercase text-slate-900 underline">
              MATRIKS TAHUNAN KEPATUHAN MUTU AIR PER KELOMPOK PEMBUDIDAYA
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Tahun Anggaran 2026 • Wilayah Monitoring Kabupaten Lembata
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold mb-4 p-2.5 bg-slate-100 rounded-lg border border-slate-200">
            <span className="text-slate-600">Keterangan Status:</span>
            <Badge variant="outline" className="gap-1.5 border-emerald-300 bg-emerald-50 text-emerald-800 text-xs py-0.5">
              <span className="size-2 rounded-full bg-emerald-600" />
              <span>Memenuhi Baku Mutu (Normal)</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 border-amber-300 bg-amber-50 text-amber-800 text-xs py-0.5">
              <span className="size-2 rounded-full bg-amber-500" />
              <span>Peringatan (Mendekati Batas)</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 border-rose-300 bg-rose-50 text-rose-800 text-xs py-0.5">
              <span className="size-2 rounded-full bg-rose-600" />
              <span>Kritis (Melebihi/Kurang)</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 border-slate-300 bg-slate-50 text-slate-500 text-xs py-0.5">
              <span className="size-2 rounded-full bg-slate-300" />
              <span>- (Belum Ada Uji)</span>
            </Badge>
          </div>

          {/* Matriks Table using Shadcn Table */}
          <div className="overflow-x-auto mb-8 border border-slate-300 rounded-lg">
            <Table className="text-xs">
              <TableHeader className="bg-slate-200 border-b border-slate-300">
                <TableRow className="border-b border-slate-300 hover:bg-slate-200">
                  <TableHead className="w-8 text-center text-slate-800 font-bold uppercase text-xs border-r border-slate-300">No</TableHead>
                  <TableHead className="text-slate-800 font-bold uppercase text-xs border-r border-slate-300 min-w-[180px]">Nama Pokdakan</TableHead>
                  <TableHead className="text-slate-800 font-bold uppercase text-xs border-r border-slate-300 min-w-[110px]">Kecamatan</TableHead>
                  {months.map((m) => (
                    <TableHead key={m} className="text-center text-slate-800 font-bold uppercase text-xs border-r border-slate-300 w-10 px-1">
                      {m}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPokdakan.map((p, idx) => (
                  <TableRow key={p.id} className="border-b border-slate-200 hover:bg-slate-50/80">
                    <TableCell className="text-center font-mono text-slate-500 border-r border-slate-200 py-2">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900 border-r border-slate-200 py-2">
                      <div>{p.nama_pokdakan}</div>
                      <div className="text-xs text-slate-500 font-normal">{p.pemilik}</div>
                    </TableCell>
                    <TableCell className="text-slate-700 border-r border-slate-200 py-2">
                      {p.kecamatan}
                    </TableCell>
                    {months.map((_, mIdx) => {
                      const stat = matrix[p.id]?.[mIdx];
                      let cellContent = <span className="text-slate-300 font-mono">-</span>;

                      if (stat === 'NORMAL') {
                        cellContent = (
                          <span className="inline-flex items-center justify-center size-4 rounded-full bg-emerald-500 text-white font-bold text-xs">
                            ✓
                          </span>
                        );
                      } else if (stat === 'PERINGATAN') {
                        cellContent = (
                          <span className="inline-flex items-center justify-center size-4 rounded-full bg-amber-500 text-white font-bold text-xs">
                            !
                          </span>
                        );
                      } else if (stat === 'KRITIS') {
                        cellContent = (
                          <span className="inline-flex items-center justify-center size-4 rounded-full bg-rose-600 text-white font-bold text-xs">
                            ✕
                          </span>
                        );
                      }

                      return (
                        <TableCell
                          key={mIdx}
                          className="text-center border-r border-slate-200 py-2 px-1"
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
              <p className="text-slate-500 mb-16">Pengelola Pengawasan Mutu Air,</p>
              <p className="font-bold text-slate-900 uppercase underline">Ellen Veronika Maran, S.Pi</p>
              <p className="text-xs text-slate-500 font-mono">NIP. 19890815 201503 2 004</p>
            </div>

            <div className="text-center">
              <p className="text-slate-500">Lewoleba, 25 September 2026</p>
              <p className="text-slate-500 mb-14">Mengetahui, Kepala Dinas Perikanan Kabupaten Lembata,</p>
              <p className="font-bold text-slate-900 uppercase underline">
                Ir. Hadi Mahmud, M.Si
              </p>
              <p className="text-xs text-slate-500 font-mono">NIP. 19740512 200003 1 005</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
