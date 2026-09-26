import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { generateQrDataUrl, generateQrSvg, getVerificationUrl } from '@/lib/qr';
import { ArrowLeft, ShieldCheck, Droplets } from 'lucide-react';
import { PrintButton } from '@/components/print-button';
import { QrDownloadButton } from '@/components/qr-download-button';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default async function CetakLabelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ik = await db.query.instruksiKerja.findFirst({
    where: eq(schema.instruksiKerja.id, id),
  });

  if (!ik) {
    notFound();
  }

  const verificationUrl = getVerificationUrl(ik.qr_code_hash);
  const [qrDataUrl, qrSvgString] = await Promise.all([
    generateQrDataUrl(verificationUrl),
    generateQrSvg(verificationUrl),
  ]);

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <Link href="/instruksi-kerja">
          <Button variant="ghost" size="sm" className="gap-2 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            <span>Kembali ke Daftar Instruksi Kerja</span>
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <QrDownloadButton
            qrDataUrl={qrDataUrl}
            qrSvgString={qrSvgString}
            fileNamePrefix={ik.kode_ik}
            label="Unduh File QR (PNG/SVG)"
          />
          <PrintButton label="Cetak Stiker Label (A6 / A7)" />
        </div>
      </div>

      {/* Label Container for Print */}
      <div className="flex justify-center print:m-0 print:p-0">
        <div className="print-area bg-white text-slate-900 border-2 border-slate-900 rounded-2xl p-6 w-full max-w-md shadow-lg flex flex-col items-center text-center print:border-none print:shadow-none print:p-0">
          {/* Header Dinas */}
          <div className="w-full border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-cyan-800 text-white flex items-center justify-center">
                <Droplets className="size-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs uppercase tracking-tight text-slate-900">
                  PEMERINTAH KABUPATEN LEMBATA
                </h3>
                <p className="text-xs font-bold text-cyan-800 uppercase">
                  DINAS PERIKANAN
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-xs font-mono font-bold text-slate-900 border-slate-400">
                SIPEKA
              </Badge>
            </div>
          </div>

          {/* Badge & Title */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-900 font-mono font-bold text-sm rounded-lg border border-cyan-300 mb-2">
              {ik.kode_ik} • v{ik.versi}.0
            </span>
            <h2 className="text-base font-extrabold text-slate-900 leading-snug px-2">
              {ik.judul}
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Kategori: {ik.kategori || 'Standar Operasional Prosedur'}
            </p>
          </div>

          {/* QR Code */}
          <div className="p-3 bg-slate-50 border-2 border-dashed border-cyan-800/40 rounded-2xl my-2 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt={`QR Code ${ik.kode_ik}`}
              className="w-48 h-48 object-contain"
            />
          </div>

          {/* Scan Instructions */}
          <div className="mt-3 text-xs text-slate-700 max-w-xs">
            <p className="font-bold flex items-center justify-center gap-1.5 text-cyan-900">
              <ShieldCheck className="size-4 text-emerald-600" />
              {ik.file_path && ik.file_path.startsWith('http')
                ? 'Scan Langsung ke Dokumen SOP'
                : 'Verifikasi Mutu & Input Uji'}
            </p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {ik.file_path && ik.file_path.startsWith('http')
                ? 'Pindai QR ini menggunakan kamera ponsel untuk langsung membuka tautan dokumen SOP resmi.'
                : 'Pindai QR ini menggunakan kamera ponsel untuk memverifikasi keabsahan SOP atau melakukan input hasil uji lapangan secara langsung.'}
            </p>
            {ik.file_path && (
              <p className="text-xs text-cyan-800 font-mono mt-1.5 truncate max-w-[280px] mx-auto bg-cyan-50/80 px-2 py-0.5 rounded border border-cyan-200">
                {ik.file_path}
              </p>
            )}
          </div>

          {/* Footer Metadata */}
          <div className="w-full mt-4 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>HASH: {ik.qr_code_hash.substring(0, 16)}...</span>
            <span>SIPEKA-LEMBATA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
