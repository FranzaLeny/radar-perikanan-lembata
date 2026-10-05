import React from 'react';
import Image from 'next/image';
import { APP_CONFIG, APP_NAME } from '@/lib/constants';

interface LhuKopSuratProps {
  nomorSampel: string;
}

export function LhuKopSurat({ nomorSampel }: LhuKopSuratProps) {
  return (
    <>
      {/* KOP RESMI DINAS PERIKANAN KABUPATEN LEMBATA */}
      <div className="border-b-4 border-double border-slate-900 pb-3 mb-4 print:pb-2 print:mb-2.5 relative">
        <div className="flex items-center justify-between gap-3">
          {/* Logo Lambang Daerah Kabupaten Lembata */}
          <div className="w-16 sm:w-20 shrink-0 flex items-center justify-start">
            <Image
              src={APP_CONFIG.logo.kabupaten}
              alt="Logo Pemerintah Kabupaten Lembata"
              width={80}
              height={80}
              priority
              className="h-16 sm:h-20 print:h-16 w-auto object-contain shrink-0"
            />
          </div>
          <div className="text-center flex-1 px-1">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
              {APP_CONFIG.institution.government}
            </h2>
            <h1 className="text-base sm:text-xl font-extrabold uppercase tracking-tight text-slate-900 leading-snug">
              {APP_CONFIG.institution.name}
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-700 mt-0.5 font-medium">
              Jl. Trans Lembata, Kel. Lewoleba, Kec. Nubatukan, Kab. Lembata, NTT 86611
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-600">
              Aplikasi: {APP_CONFIG.fullName} ({APP_CONFIG.name}) • Email:{' '}
              {APP_CONFIG.institution.email}
            </p>
          </div>
          {/* Spacer penyeimbang simetris agar teks kop tepat di tengah kertas */}
          <div
            className="w-16 sm:w-20 shrink-0 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* JUDUL DOKUMEN */}
      <div className="text-center mb-4 print:mb-2.5">
        <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide text-slate-900 underline">
          LEMBAR HASIL UJI (LHU) KUALITAS AIR
        </h3>
        <p className="text-xs text-slate-600 font-mono mt-0.5">
          Nomor: LHU/{APP_NAME}/{nomorSampel}
        </p>
      </div>
    </>
  );
}
