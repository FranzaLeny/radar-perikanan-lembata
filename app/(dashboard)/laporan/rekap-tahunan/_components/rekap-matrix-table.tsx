import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { APP_CLOUD_NAME, APP_CONFIG } from '@/lib/constants';
import type { PokdakanData, PrintSettings } from '../types';

interface RekapMatrixTableProps {
  allPokdakan: PokdakanData[];
  matrix: Record<string, Record<number, string>>;
  months: string[];
  settings: PrintSettings;
  formattedTanggalTtd: string;
  qrDataUrl: string;
}

export function RekapMatrixTable({
  allPokdakan,
  matrix,
  months,
  settings,
  formattedTanggalTtd,
  qrDataUrl,
}: RekapMatrixTableProps) {
  return (
    <div className="bg-white text-slate-900 border border-slate-300 rounded-xl shadow-xs print:border-none print:shadow-none print:m-0 overflow-x-auto">
      <div className="min-w-[960px] p-8 print:p-0 print:min-w-0">
        {/* Kop Surat Resmi Dinas Perikanan Kabupaten Lembata */}
        <div className="border-b-2 border-slate-900 pb-3 mb-6">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Logo Lembata"
              width={64}
              height={76}
              priority
              className="w-14 h-auto object-contain shrink-0"
            />
            <div className="flex-1 text-center pr-14">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700">
                {APP_CONFIG.institution.government}
              </h3>
              <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-900 leading-tight">
                {APP_CONFIG.institution.name}
              </h2>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                Jl. Trans Lembata, Lewoleba, Kab. Lembata, Nusa Tenggara Timur
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Email: {APP_CONFIG.institution.email} | Portal:{' '}
                {APP_CONFIG.institution.emailDomain}
              </p>
            </div>
          </div>
        </div>

        {/* Judul Dokumen */}
        <div className="text-center mb-6">
          <h1 className="text-sm font-bold uppercase tracking-wide text-slate-900">
            Rekapitulasi Pemantauan Kualitas Air Kolam Pembudidaya (Pokdakan)
          </h1>
          <p className="text-xs font-semibold uppercase text-slate-600 font-mono mt-0.5">
            Tahun Anggaran {settings.tahunAnggaran}
          </p>
        </div>

        {/* Legend Status Indikator Mutu */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-4 text-xs font-medium">
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
                      <span className="text-slate-300 font-mono text-xs">-</span>
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
            <p className="text-slate-500 mb-16">{settings.pengelolaJabatan},</p>
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
              <p className="font-bold text-slate-700">Verifikasi Dokumen Resmi Digital</p>
              <p className="text-xs text-slate-400">
                Pindai QR untuk memverifikasi keaslian dokumen di portal {APP_CONFIG.name}{' '}
                {APP_CONFIG.institution.regency}
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="block text-slate-400">DOKUMEN REKAPITULASI TAHUNAN</span>
            <p>Dicetak melalui {APP_CLOUD_NAME}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
