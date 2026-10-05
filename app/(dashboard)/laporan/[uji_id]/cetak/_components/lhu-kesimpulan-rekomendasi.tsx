import React from 'react';
import type { RekomendasiItem } from '../types';

interface LhuKesimpulanRekomendasiProps {
  kesimpulan: string | null;
  rekomendasiList: RekomendasiItem[];
  kesimpulanUmum?: string | null;
  saranRekomendasiLapangan?: string | null;
  catatanLapangan?: string | null;
}

export function LhuKesimpulanRekomendasi({
  kesimpulan,
  rekomendasiList,
  kesimpulanUmum,
  saranRekomendasiLapangan,
  catatanLapangan,
}: LhuKesimpulanRekomendasiProps) {
  return (
    <>
      {/* KESIMPULAN & REKOMENDASI TEKNIS OTOMATIS */}
      <div className="mb-4 print:mb-2.5 space-y-1.5 print:space-y-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          B. Kesimpulan Evaluasi & Rekomendasi Teknis
        </h4>

        <div className="p-3 print:p-2 rounded-lg border border-slate-300 bg-slate-50 text-xs print:bg-white">
          <div className="flex items-center gap-2 mb-1.5 font-bold">
            <span>Status Kepatuhan Baku Mutu:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                kesimpulan === 'NORMAL'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : kesimpulan === 'PERINGATAN'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {kesimpulan || 'NORMAL'}
            </span>
          </div>

          {rekomendasiList.length === 0 ? (
            <p className="text-slate-700 leading-relaxed text-xs">
              Seluruh parameter kualitas air memenuhi standar baku mutu yang dipersyaratkan. Kondisi lingkungan kolam sangat mendukung pertumbuhan ikan yang optimal. Lanjutkan manajemen pakan dan aerasi rutin.
            </p>
          ) : (
            <div className="space-y-1 mt-1.5">
              <p className="font-semibold text-slate-800 text-xs">
                Rekomendasi Tindakan Korektif Lapangan:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-xs">
                {rekomendasiList.map((rec, i) => (
                  <li key={i}>
                    <strong className="text-slate-900">{rec.parameter}:</strong>{' '}
                    {rec.saran}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* TELAAH UMUM & CATATAN LAPANGAN PETUGAS */}
      {(kesimpulanUmum || saranRekomendasiLapangan || catatanLapangan) && (
        <div className="mb-4 print:mb-2.5 space-y-1.5 print:space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            C. Telaah Lapangan & Rekomendasi Terpadu
          </h4>
          <div className="p-3 print:p-2 rounded-lg border border-slate-300 bg-slate-50 text-xs space-y-1.5 print:bg-white">
            {kesimpulanUmum && (
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">
                  Kesimpulan Umum Pengujian:
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {kesimpulanUmum}
                </p>
              </div>
            )}
            {saranRekomendasiLapangan && (
              <div className="pt-1 border-t border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">
                  Saran & Rekomendasi Petugas:
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {saranRekomendasiLapangan}
                </p>
              </div>
            )}
            {catatanLapangan && (
              <div className="pt-1 border-t border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">
                  Catatan Observasi Fisik Kolam:
                </span>
                <p className="text-slate-600 leading-relaxed italic">
                  {catatanLapangan}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
