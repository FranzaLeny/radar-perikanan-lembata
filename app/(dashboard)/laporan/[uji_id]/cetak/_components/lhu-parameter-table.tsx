import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { DetailParameterUji } from '../types';

interface LhuParameterTableProps {
  parameters: DetailParameterUji[];
}

export function LhuParameterTable({ parameters }: LhuParameterTableProps) {
  return (
    <div className="mb-4 print:mb-2.5">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 print:mb-1">
        A. Hasil Evaluasi Parameter Kualitas Air
      </h4>
      <div className="border border-slate-300 rounded-lg min-w-fit">
        <Table className="text-xs">
          <TableHeader className="bg-slate-100 border-b border-slate-300">
            <TableRow className="border-b border-slate-300 hover:bg-slate-100">
              <TableHead className="w-8 text-center text-slate-700 font-bold uppercase text-[11px] border-r border-slate-300 py-1.5 print:py-1">
                No
              </TableHead>
              <TableHead className="text-slate-700 font-bold uppercase text-[11px] border-r border-slate-300 py-1.5 print:py-1">
                Parameter Uji
              </TableHead>
              <TableHead className="text-center text-slate-700 font-bold uppercase text-[11px] border-r border-slate-300 py-1.5 print:py-1 w-14">
                Satuan
              </TableHead>
              <TableHead className="text-center text-slate-700 font-bold uppercase text-[11px] border-r border-slate-300 py-1.5 print:py-1">
                Baku Mutu (Regulasi)
              </TableHead>
              <TableHead className="text-left text-slate-700 font-bold uppercase text-[11px] border-r border-slate-300 py-1.5 print:py-1">
                Metode Pengujian (IK)
              </TableHead>
              <TableHead className="text-center text-slate-700 font-bold uppercase text-[11px] border-r border-slate-300 py-1.5 print:py-1">
                Hasil Uji
              </TableHead>
              <TableHead className="text-center text-slate-700 font-bold uppercase text-[11px] py-1.5 print:py-1">
                Status Kelayakan
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parameters.map((dp, idx) => {
              const min =
                dp.nilai_min_terapkan !== null &&
                dp.nilai_min_terapkan !== undefined
                  ? dp.nilai_min_terapkan
                  : dp.bakuMutu?.nilai_min;
              const max =
                dp.nilai_max_terapkan !== null &&
                dp.nilai_max_terapkan !== undefined
                  ? dp.nilai_max_terapkan
                  : dp.bakuMutu?.nilai_max;

              let standardStr = '-';
              if (
                min !== null &&
                min !== undefined &&
                max !== null &&
                max !== undefined
              ) {
                standardStr = `${min} – ${max}`;
              } else if (min !== null && min !== undefined) {
                standardStr = `≥ ${min}`;
              } else if (max !== null && max !== undefined) {
                standardStr = `≤ ${max}`;
              }

              const regulasiSingkat =
                dp.nomor_regulasi ||
                dp.bakuMutu?.nomor_regulasi ||
                'PP No. 22/2021';
              const metodeUji =
                dp.metode_pengujian ||
                dp.ik?.metode_pengujian ||
                dp.ik?.judul ||
                'SNI Pengujian Mutu Air';

              const isMelebihi = dp.status_kelayakan === 'MELEBIHI';
              const isDibawah = dp.status_kelayakan === 'DIBAWAH';

              return (
                <TableRow
                  key={dp.id}
                  className="border-b border-slate-200 hover:bg-slate-50/80"
                >
                  <TableCell className="text-center font-mono text-slate-500 border-r border-slate-300 py-1.5 print:py-1">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 border-r border-slate-300 py-1.5 print:py-1">
                    {dp.bakuMutu?.parameter}
                  </TableCell>
                  <TableCell className="text-center font-mono text-slate-600 border-r border-slate-300 py-1.5 print:py-1">
                    {dp.bakuMutu?.satuan}
                  </TableCell>
                  <TableCell className="text-center font-mono text-slate-700 border-r border-slate-300 py-1.5 print:py-1">
                    <div>
                      <span className="font-bold">{standardStr}</span>
                      <span className="text-[10px] text-slate-500 block font-sans">
                        ({regulasiSingkat})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-left text-slate-800 border-r border-slate-300 py-1.5 print:py-1 text-[11px]">
                    <span className="font-medium text-slate-900">
                      {metodeUji}
                    </span>
                    {dp.ik?.kode_ik && (
                      <span className="text-[10px] text-slate-500 font-mono block">
                        [{dp.ik.kode_ik}]
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-mono font-bold text-slate-900 border-r border-slate-300 py-1.5 print:py-1">
                    {dp.nilai_hasil}
                  </TableCell>
                  <TableCell className="text-center py-1.5 print:py-1 font-bold text-xs">
                    {isMelebihi ? (
                      <span className="text-rose-700">MELEBIHI BATAS</span>
                    ) : isDibawah ? (
                      <span className="text-amber-700">DI BAWAH BATAS</span>
                    ) : (
                      <span className="text-emerald-700">MEMENUHI</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
