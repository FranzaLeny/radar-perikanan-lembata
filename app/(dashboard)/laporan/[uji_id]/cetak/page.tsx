import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import {
  generateQrDataUrl,
  getVerificationUrl,
} from '@/lib/qr';
import {
  dapatkanRekomendasiTeknis,
  type StatusKelayakan,
} from '@/lib/validasi-baku-mutu';
import { PrintButton } from '@/components/print-button';
import { Button } from '@/components/ui/button';
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
import { APP_CONFIG, APP_NAME, APP_CLOUD_NAME } from '@/lib/constants';

export default async function CetakLhuPage({
  params,
}: {
  params: Promise<{ uji_id: string }>;
}) {
  const { uji_id } = await params;

  const uji = await db.query.ujiKualitasAir.findFirst({
    where: eq(schema.ujiKualitasAir.id, uji_id),
    with: {
      lokasi: true,
      instruksiKerja: true,
      pengujiPegawai: true,
      penandatanganPegawai: true,
      detailParameters: {
        with: {
          bakuMutu: true,
        },
      },
    },
  });

  if (!uji) {
    notFound();
  }

  // QR Code URL: verifikasi via IK hash
  const qrHash = uji.instruksiKerja?.qr_code_hash || 'demo-hash';
  const qrUrl = getVerificationUrl(qrHash);
  const qrDataUrl = await generateQrDataUrl(qrUrl);

  // Kumpulkan rekomendasi otomatis untuk parameter yang bermasalah
  const rekomendasiList: { parameter: string; saran: string }[] = [];
  uji.detailParameters.forEach((dp) => {
    const status = (dp.status_kelayakan || 'MEMENUHI') as StatusKelayakan;
    const paramName = dp.bakuMutu?.parameter || 'Parameter';
    if (status !== 'MEMENUHI') {
      const saran = dapatkanRekomendasiTeknis(paramName, status, Number(dp.nilai_hasil));
      rekomendasiList.push({ parameter: paramName, saran });
    }
  });

  const formattedDate = new Date(uji.tanggal_pengambilan).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Data Petugas Penguji & Pejabat Penandatangan
  const namaPenguji = uji.pengujiPegawai?.nama || uji.petugas_uji;
  const jabatanPenguji = uji.pengujiPegawai?.jabatan || 'Petugas Pengawas Budidaya';
  const nipPenguji = uji.pengujiPegawai?.nip ? `NIP. ${uji.pengujiPegawai.nip}` : '';

  const namaPenandatangan = uji.penandatanganPegawai?.nama || APP_CONFIG.officials.kepalaDinas.name;
  const jabatanPenandatangan = uji.penandatanganPegawai?.jabatan || APP_CONFIG.officials.kepalaDinas.jabatan;
  const nipPenandatangan = uji.penandatanganPegawai?.nip
    ? `NIP. ${uji.penandatanganPegawai.nip}`
    : `NIP. ${APP_CONFIG.officials.kepalaDinas.nip}`;
  const pangkatPenandatangan = uji.penandatanganPegawai?.pangkat_golongan || APP_CONFIG.officials.kepalaDinas.pangkat;

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex items-center justify-between no-print">
        <Link href="/laporan">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            <span>Kembali ke Pusat Laporan</span>
          </Button>
        </Link>

        <PrintButton label="Cetak Lembar Hasil Uji (A4)" />
      </div>

      {/* A4 Paper Document Canvas (Strict Arial Font Rule for Official LHU) */}
      <div className="flex justify-center print:m-0 print:p-0">
        <div
          className="print-area lhu-print-document bg-white text-slate-900 border border-slate-300 rounded-xl p-8 sm:p-12 w-full max-w-3xl shadow-xl print:border-none print:shadow-none print:p-0 print:max-w-none"
          style={{ fontFamily: 'Arial, var(--font-geist-sans), sans-serif' }}
        >
          {/* KOP RESMI DINAS PERIKANAN KABUPATEN LEMBATA */}
          <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center relative">
            <div className="flex items-center justify-center gap-4">
              <div className="size-14 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 print:border print:border-slate-800">
                <Droplets className="size-8 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900">
                  {APP_CONFIG.institution.government}
                </h2>
                <h1 className="text-lg sm:text-2xl font-extrabold uppercase tracking-tight text-slate-900">
                  {APP_CONFIG.institution.name}
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Jl. Trans Lembata, Kel. Lewoleba, Kec. Nubatukan, Kab. Lembata, NTT 86611
                </p>
                <p className="text-xs text-slate-500">
                  {APP_CONFIG.fullName} ({APP_CONFIG.name}) • Email: {APP_CONFIG.institution.email}
                </p>
              </div>
            </div>
          </div>

          {/* JUDUL DOKUMEN */}
          <div className="text-center mb-6">
            <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide text-slate-900 underline">
              LEMBAR HASIL UJI (LHU) KUALITAS AIR BUDIDAYA
            </h3>
            <p className="text-xs text-slate-600 font-mono mt-1">
              Nomor Dokumen: LHU/{APP_NAME}/{uji.nomor_sampel}
            </p>
          </div>

          {/* METADATA SAMPEL */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs mb-6 border border-slate-200 rounded-lg p-3.5 bg-slate-50/70 print:bg-white print:border-slate-300">
            <div>
              <span className="text-slate-500 block text-xs">Nomor Sampel:</span>
              <span className="font-bold font-mono text-slate-900">{uji.nomor_sampel}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Tanggal Pengambilan:</span>
              <span className="font-semibold text-slate-900">{formattedDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Kelompok Pembudidaya (Pokdakan):</span>
              <span className="font-semibold text-slate-900">
                {uji.lokasi?.nama_pokdakan} ({uji.lokasi?.pemilik})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Wilayah Kolam:</span>
              <span className="font-semibold text-slate-900">
                Desa {uji.lokasi?.desa}, Kec. {uji.lokasi?.kecamatan}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Komoditas Budidaya:</span>
              <span className="font-semibold text-slate-900">{uji.lokasi?.komoditas_ikan || 'Ikan Air Tawar/Payau'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">SOP Instruksi Kerja (IK):</span>
              <span className="font-semibold text-slate-900">
                [{uji.instruksiKerja?.kode_ik}] {uji.instruksiKerja?.judul}
              </span>
            </div>
          </div>

          {/* TABEL HASIL PARAMETER (Tanpa pembungkus overflow-auto untuk cetak sempurna) */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              A. Hasil Evaluasi Parameter Kualitas Air
            </h4>
            <div className="border border-slate-300 rounded-lg">
              <Table className="text-xs">
                <TableHeader className="bg-slate-100 border-b border-slate-300">
                  <TableRow className="border-b border-slate-300 hover:bg-slate-100">
                    <TableHead className="w-8 text-center text-slate-700 font-bold uppercase text-xs border-r border-slate-300">No</TableHead>
                    <TableHead className="text-slate-700 font-bold uppercase text-xs border-r border-slate-300">Parameter Uji</TableHead>
                    <TableHead className="text-center text-slate-700 font-bold uppercase text-xs border-r border-slate-300">Satuan</TableHead>
                    <TableHead className="text-center text-slate-700 font-bold uppercase text-xs border-r border-slate-300">Baku Mutu (PP 22/2021)</TableHead>
                    <TableHead className="text-center text-slate-700 font-bold uppercase text-xs border-r border-slate-300">Hasil Uji</TableHead>
                    <TableHead className="text-center text-slate-700 font-bold uppercase text-xs">Status Kelayakan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uji.detailParameters.map((dp, idx) => {
                    const min = dp.bakuMutu?.nilai_min;
                    const max = dp.bakuMutu?.nilai_max;
                    let standardStr = '-';
                    if (min !== null && min !== undefined && max !== null && max !== undefined) {
                      standardStr = `${min} – ${max}`;
                    } else if (min !== null && min !== undefined) {
                      standardStr = `≥ ${min}`;
                    } else if (max !== null && max !== undefined) {
                      standardStr = `≤ ${max}`;
                    }

                    const isMelebihi = dp.status_kelayakan === 'MELEBIHI';
                    const isDibawah = dp.status_kelayakan === 'DIBAWAH';

                    return (
                      <TableRow key={dp.id} className="border-b border-slate-200 hover:bg-slate-50/80">
                        <TableCell className="text-center font-mono text-slate-500 border-r border-slate-300 py-2">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-medium text-slate-900 border-r border-slate-300 py-2">
                          {dp.bakuMutu?.parameter}
                        </TableCell>
                        <TableCell className="text-center font-mono text-slate-600 border-r border-slate-300 py-2">
                          {dp.bakuMutu?.satuan}
                        </TableCell>
                        <TableCell className="text-center font-mono text-slate-700 border-r border-slate-300 py-2">
                          {standardStr}
                        </TableCell>
                        <TableCell className="text-center font-mono font-bold text-slate-900 border-r border-slate-300 py-2">
                          {dp.nilai_hasil}
                        </TableCell>
                        <TableCell className="text-center py-2 font-bold text-xs">
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

          {/* KESIMPULAN & REKOMENDASI TEKNIS OTOMATIS */}
          <div className="mb-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              B. Kesimpulan Evaluasi & Rekomendasi Teknis
            </h4>

            <div className="p-3.5 rounded-lg border border-slate-300 bg-slate-50 text-xs print:bg-white">
              <div className="flex items-center gap-2 mb-2 font-bold">
                <span>Status Kepatuhan Baku Mutu:</span>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-extrabold ${
                    uji.kesimpulan === 'NORMAL'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : uji.kesimpulan === 'PERINGATAN'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {uji.kesimpulan || 'NORMAL'}
                </span>
              </div>

              {rekomendasiList.length === 0 ? (
                <p className="text-slate-700 leading-relaxed text-xs">
                  Seluruh parameter kualitas air memenuhi standar baku mutu yang dipersyaratkan. Kondisi lingkungan kolam sangat mendukung pertumbuhan ikan yang optimal. Lanjutkan manajemen pakan dan aerasi rutin.
                </p>
              ) : (
                <div className="space-y-1.5 mt-2">
                  <p className="font-semibold text-slate-800 text-xs">
                    Rekomendasi Tindakan Korektif Lapangan:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                    {rekomendasiList.map((rec, i) => (
                      <li key={i}>
                        <strong className="text-slate-900">{rec.parameter}:</strong> {rec.saran}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* TELAAH UMUM & CATATAN LAPANGAN PETUGAS */}
          {(uji.kesimpulan_umum || uji.saran_rekomendasi_lapangan || uji.catatan_lapangan) && (
            <div className="mb-6 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                C. Telaah Lapangan & Rekomendasi Terpadu
              </h4>
              <div className="p-3.5 rounded-lg border border-slate-300 bg-slate-50 text-xs space-y-2 print:bg-white">
                {uji.kesimpulan_umum && (
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Kesimpulan Umum Pengujian:</span>
                    <p className="text-slate-700 leading-relaxed">{uji.kesimpulan_umum}</p>
                  </div>
                )}
                {uji.saran_rekomendasi_lapangan && (
                  <div className="pt-1.5 border-t border-slate-200">
                    <span className="font-bold text-slate-900 block mb-0.5">Saran & Rekomendasi Petugas:</span>
                    <p className="text-slate-700 leading-relaxed">{uji.saran_rekomendasi_lapangan}</p>
                  </div>
                )}
                {uji.catatan_lapangan && (
                  <div className="pt-1.5 border-t border-slate-200">
                    <span className="font-bold text-slate-900 block mb-0.5">Catatan Observasi Fisik Kolam:</span>
                    <p className="text-slate-600 leading-relaxed italic">{uji.catatan_lapangan}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BLOK TANDA TANGAN PEJABAT & PETUGAS */}
          <div className="grid grid-cols-2 gap-8 text-xs mt-8 pt-4 border-t border-slate-300">
            <div className="text-center">
              <p className="text-slate-500 mb-16">Petugas Analis / Penguji,</p>
              <p className="font-bold text-slate-900 uppercase underline">{namaPenguji}</p>
              <p className="text-xs text-slate-600">{jabatanPenguji}</p>
              {nipPenguji && <p className="text-xs text-slate-500 font-mono mt-0.5">{nipPenguji}</p>}
            </div>

            <div className="text-center">
              <p className="text-slate-500">Lewoleba, {formattedDate}</p>
              <p className="text-slate-500 mb-14">{jabatanPenandatangan},</p>
              <p className="font-bold text-slate-900 uppercase underline">
                {namaPenandatangan}
              </p>
              <p className="text-xs text-slate-600">{pangkatPenandatangan}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{nipPenandatangan}</p>
            </div>
          </div>

          {/* FOOTER & QR VERIFIKASI KEASLIAN */}
          <div className="mt-8 pt-4 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="QR Verifikasi" className="size-12 object-contain" />
              <div>
                <p className="font-bold text-slate-700">Verifikasi Keaslian LHU Digital</p>
                <p className="text-xs text-slate-400">Pindai QR untuk memverifikasi dokumen di portal {APP_CONFIG.name} {APP_CONFIG.institution.regency}</p>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <span>ID: {uji.id.substring(0, 18)}</span>
              <p>Dicetak melalui {APP_CLOUD_NAME}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

