import React from 'react';

interface LhuTandaTanganProps {
  formattedDate: string;
  namaPenguji: string;
  jabatanPenguji: string;
  nipPenguji?: string;
  namaPenandatangan?: string;
  jabatanPenandatangan?: string;
  pangkatPenandatangan?: string;
  nipPenandatangan?: string;
}

export function LhuTandaTangan({
  formattedDate,
  namaPenguji,
  jabatanPenguji,
  nipPenguji,
  namaPenandatangan,
  jabatanPenandatangan,
  pangkatPenandatangan,
  nipPenandatangan,
}: LhuTandaTanganProps) {
  return (
    <div className="grid grid-cols-2 gap-8 text-xs mt-5 pt-3 print:mt-3 print:pt-2 border-t border-slate-300">
      <div className="text-center">
        <p className="text-slate-500 mb-10 print:mb-8">
          Petugas Analis / Penguji,
        </p>
        <p className="font-bold text-slate-900 uppercase underline">
          {namaPenguji}
        </p>
        <p className="text-xs text-slate-600">{jabatanPenguji}</p>
        {nipPenguji && (
          <p className="text-xs text-slate-500 font-mono mt-0.5">{nipPenguji}</p>
        )}
      </div>

      <div className="text-center">
        <p className="text-slate-500">Lewoleba, {formattedDate}</p>
        <p className="text-slate-500 mb-9 print:mb-7">
          {jabatanPenandatangan || 'Kepala Dinas Perikanan'},
        </p>
        <p className="font-bold text-slate-900 uppercase underline">
          {namaPenandatangan || '-'}
        </p>
        <p className="text-xs text-slate-600">{pangkatPenandatangan}</p>
        {nipPenandatangan && (
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            NIP. {nipPenandatangan}
          </p>
        )}
      </div>
    </div>
  );
}
