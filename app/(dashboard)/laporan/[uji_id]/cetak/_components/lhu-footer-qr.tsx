import React from 'react';
import Image from 'next/image';
import { APP_CLOUD_NAME, APP_CONFIG } from '@/lib/constants';

interface LhuFooterQrProps {
  qrDataUrl: string;
  ujiId: string;
}

export function LhuFooterQr({ qrDataUrl, ujiId }: LhuFooterQrProps) {
  return (
    <div className="mt-5 pt-2.5 print:mt-2.5 print:pt-1.5 border-t border-dashed border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
      <div className="flex items-center gap-2.5">
        <Image
          src={qrDataUrl}
          alt="QR Verifikasi"
          width={40}
          height={40}
          priority
          unoptimized
          className="size-10 object-contain"
        />
        <div>
          <p className="font-bold text-slate-700">
            Verifikasi Keaslian LHU Digital
          </p>
          <p className="text-[10px] text-slate-400">
            Pindai QR untuk memverifikasi dokumen di portal {APP_CONFIG.name}{' '}
            {APP_CONFIG.institution.regency}
          </p>
        </div>
      </div>

      <div className="text-right font-mono text-[10px]">
        <span>ID: {ujiId.substring(0, 18)}</span>
        <p>Dicetak melalui {APP_CLOUD_NAME}</p>
      </div>
    </div>
  );
}
