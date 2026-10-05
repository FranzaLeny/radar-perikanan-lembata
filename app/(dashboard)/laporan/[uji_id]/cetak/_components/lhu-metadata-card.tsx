import React from 'react';

interface LhuMetadataCardProps {
  nomorSampel: string;
  formattedDate: string;
  namaPokdakan?: string;
  pemilik?: string;
  desa?: string;
  kecamatan?: string;
  komoditasIkan?: string | null;
  sopAcuan: string;
  suhuLingkungan?: string | null;
}

export function LhuMetadataCard({
  nomorSampel,
  formattedDate,
  namaPokdakan,
  pemilik,
  desa,
  kecamatan,
  komoditasIkan,
  sopAcuan,
  suhuLingkungan,
}: LhuMetadataCardProps) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs mb-4 print:mb-2.5 border border-slate-200 rounded-lg p-3 print:p-2 bg-slate-50/70 print:bg-white print:border-slate-300">
      <div>
        <span className="text-slate-500 block text-xs">Nomor Sampel:</span>
        <span className="font-bold font-mono text-slate-900">
          {nomorSampel}
        </span>
      </div>
      <div>
        <span className="text-slate-500 block text-xs">Tanggal Pengambilan:</span>
        <span className="font-semibold text-slate-900">{formattedDate}</span>
      </div>
      <div>
        <span className="text-slate-500 block text-xs">
          Kelompok Pembudidaya (Pokdakan):
        </span>
        <span className="font-semibold text-slate-900">
          {namaPokdakan || '-'} {pemilik ? `(${pemilik})` : ''}
        </span>
      </div>
      <div>
        <span className="text-slate-500 block text-xs">Wilayah Kolam:</span>
        <span className="font-semibold text-slate-900">
          Desa {desa || '-'}, Kec. {kecamatan || '-'}
        </span>
      </div>
      <div>
        <span className="text-slate-500 block text-xs">Komoditas Budidaya:</span>
        <span className="font-semibold text-slate-900">
          {komoditasIkan || 'Ikan Air Tawar/Payau'}
        </span>
      </div>
      <div>
        <span className="text-slate-500 block text-xs">SOP Acuan Pelaksanaan:</span>
        <span className="font-semibold text-slate-900">{sopAcuan}</span>
      </div>
      {suhuLingkungan && (
        <div>
          <span className="text-slate-500 block text-xs">
            Suhu Udara / Lingkungan:
          </span>
          <span className="font-semibold font-mono text-slate-900">
            {suhuLingkungan} °C
          </span>
        </div>
      )}
    </div>
  );
}
