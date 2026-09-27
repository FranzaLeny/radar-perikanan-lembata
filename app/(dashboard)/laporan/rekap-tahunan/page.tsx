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
import { generateQrDataUrl } from '@/lib/qr';
import { APP_CONFIG, APP_CLOUD_NAME, APP_OFFICIALS } from '@/lib/constants';

export default async function RekapTahunanPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const qrDataUrl = await generateQrDataUrl(`${baseUrl}/laporan/rekap-tahunan`);

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
          <div className="border-b-4 border-double border-slate-900 pb-4 mb-6">
            <div className="flex items-center justify-between gap-4">
              <img
                src={APP_CONFIG.logo.kabupaten}
                alt="Logo Pemerintah Kabupaten Lembata"
                className="w-16 h-20 object-contain shrink-0"
              />
              <div className="text-center flex-1 px-2">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                  {APP_CONFIG.institution.government}
                </h3>
                <h1 className="text-base sm:text-xl font-extrabold uppercase tracking-tight text-slate-900">
                  {APP_CONFIG.institution.name.toUpperCase()} — SISTEM {APP_CONFIG.name}
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Laporan Rekapitulasi Tahunan Evaluasi Mutu Air Budidaya Ikan Perikanan Tahun {APP_CONFIG.author.copyrightYear}
                </p>
              </div>
              <img
                src={APP_CONFIG.logo.app}
                alt={`Logo ${APP_CONFIG.name}`}
                className="w-16 h-16 object-contain shrink-0"
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-sm sm:text-base font-extrabold uppercase text-slate-900 underline">
              MATRIKS TAHUNAN KEPATUHAN MUTU AIR PER KELOMPOK PEMBUDIDAYA
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Tahun Anggaran {APP_CONFIG.author.copyrightYear} • Wilayah Monitoring {APP_CONFIG.institution.regency}
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

          {/* Matriks Table - table-fixed agar pas 100% dan bebas dari scrollbar horizontal */}
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
                  <TableRow key={p.id} className="border-b border-slate-200 hover:bg-slate-50/80">
                    <TableCell className="text-center font-mono text-slate-500 border-r border-slate-200 py-1.5 px-0.5 text-xs">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900 border-r border-slate-200 py-1.5 px-2 text-xs truncate">
                      <div className="truncate font-semibold text-slate-900" title={p.nama_pokdakan}>
                        {p.nama_pokdakan}
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal truncate" title={p.pemilik}>
                        {p.pemilik}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700 border-r border-slate-200 py-1.5 px-2 text-xs truncate">
                      <div className="truncate" title={p.kecamatan}>{p.kecamatan}</div>
                    </TableCell>
                    {months.map((_, mIdx) => {
                      const stat = matrix[p.id]?.[mIdx];
                      let cellContent = <span className="text-slate-300 font-mono text-xs">-</span>;

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
              <p className="text-slate-500 mb-16">{APP_OFFICIALS.pengelola.jabatan},</p>
              <p className="font-bold text-slate-900 uppercase underline">{APP_OFFICIALS.pengelola.name}</p>
              <p className="text-xs text-slate-500 font-mono">NIP. {APP_OFFICIALS.pengelola.nip}</p>
            </div>

            <div className="text-center">
              <p className="text-slate-500">{APP_OFFICIALS.kepalaDinas.lokasiTtd}, 25 September {APP_CONFIG.author.copyrightYear}</p>
              <p className="text-slate-500 mb-14">Mengetahui, {APP_OFFICIALS.kepalaDinas.jabatan},</p>
              <p className="font-bold text-slate-900 uppercase underline">
                {APP_OFFICIALS.kepalaDinas.name}
              </p>
              <p className="text-xs text-slate-500 font-mono">NIP. {APP_OFFICIALS.kepalaDinas.nip}</p>
            </div>
          </div>

          {/* Footer & QR Verifikasi Keaslian */}
          <div className="mt-8 pt-4 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="QR Verifikasi" className="size-12 object-contain" />
              <div>
                <p className="font-bold text-slate-700">Verifikasi Dokumen Resmi Digital</p>
                <p className="text-xs text-slate-400">Pindai QR untuk memverifikasi keaslian dokumen di portal {APP_CONFIG.name} {APP_CONFIG.institution.regency}</p>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="block text-slate-400">DOKUMEN REKAPITULASI TAHUNAN</span>
              <p>Dicetak melalui {APP_CLOUD_NAME}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
