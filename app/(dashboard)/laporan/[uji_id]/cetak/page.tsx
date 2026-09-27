import { PrintButton } from '@/components/print-button';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { APP_CLOUD_NAME, APP_CONFIG, APP_NAME } from '@/lib/constants';
import {
  generateQrDataUrl,
  getVerificationUrl,
} from '@/lib/qr';
import {
  dapatkanRekomendasiTeknis,
  type StatusKelayakan,
} from '@/lib/validasi-baku-mutu';
import { eq } from 'drizzle-orm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

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
                  Aplikasi: {APP_CONFIG.fullName} ({APP_CONFIG.name}) • Email: {APP_CONFIG.institution.email}
                </p>
              </div>
              {/* Spacer penyeimbang simetris agar teks kop tepat di tengah kertas */}
              <div className="w-16 sm:w-20 shrink-0 pointer-events-none" aria-hidden="true" />
            </div>
          </div>

          {/* JUDUL DOKUMEN */}
          <div className="text-center mb-4 print:mb-2.5">
            <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide text-slate-900 underline">
              LEMBAR HASIL UJI (LHU) KUALITAS AIR BUDIDAYA
            </h3>
            <p className="text-xs text-slate-600 font-mono mt-0.5">
              Nomor Dokumen: LHU/{APP_NAME}/{uji.nomor_sampel}
            </p>
          </div>

          {/* METADATA SAMPEL */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs mb-4 print:mb-2.5 border border-slate-200 rounded-lg p-3 print:p-2 bg-slate-50/70 print:bg-white print:border-slate-300">
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
          <div className="mb-4 print:mb-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 print:mb-1">
              A. Hasil Evaluasi Parameter Kualitas Air
            </h4>
            <div className="border border-slate-300 rounded-lg">
              <Table className="text-xs">
                <TableHeader className="bg-slate-100 border-b border-slate-300">
                  <TableRow className="border-b border-slate-300 hover:bg-slate-100">
                    <TableHead className="w-8 text-center text-slate-700 font-bold uppercase text-[11px] border-r border-slate-300 py-1.5 print:py-1">No</TableHead>
                    <TableHead className="text-slate-700 font-bold uppercase text-[11px] border-r border-slate-300 py-1.5 print:py-1">Parameter Uji</TableHead>
                    <TableHead className="text-center text-slate-700 font-bold uppercase text-[11px] border-r border-slate-300 py-1.5 print:py-1">Satuan</TableHead>
                    <TableHead className="text-center text-slate-700 font-bold uppercase text-[11px] border-r border-slate-300 py-1.5 print:py-1">Baku Mutu (PP 22/2021)</TableHead>
                    <TableHead className="text-center text-slate-700 font-bold uppercase text-[11px] border-r border-slate-300 py-1.5 print:py-1">Hasil Uji</TableHead>
                    <TableHead className="text-center text-slate-700 font-bold uppercase text-[11px] py-1.5 print:py-1">Status Kelayakan</TableHead>
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
                          {standardStr}
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

          {/* KESIMPULAN & REKOMENDASI TEKNIS OTOMATIS */}
          <div className="mb-4 print:mb-2.5 space-y-1.5 print:space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              B. Kesimpulan Evaluasi & Rekomendasi Teknis
            </h4>

            <div className="p-3 print:p-2 rounded-lg border border-slate-300 bg-slate-50 text-xs print:bg-white">
              <div className="flex items-center gap-2 mb-1.5 font-bold">
                <span>Status Kepatuhan Baku Mutu:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${uji.kesimpulan === 'NORMAL'
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
                <div className="space-y-1 mt-1.5">
                  <p className="font-semibold text-slate-800 text-xs">
                    Rekomendasi Tindakan Korektif Lapangan:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-xs">
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
            <div className="mb-4 print:mb-2.5 space-y-1.5 print:space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                C. Telaah Lapangan & Rekomendasi Terpadu
              </h4>
              <div className="p-3 print:p-2 rounded-lg border border-slate-300 bg-slate-50 text-xs space-y-1.5 print:bg-white">
                {uji.kesimpulan_umum && (
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Kesimpulan Umum Pengujian:</span>
                    <p className="text-slate-700 leading-relaxed">{uji.kesimpulan_umum}</p>
                  </div>
                )}
                {uji.saran_rekomendasi_lapangan && (
                  <div className="pt-1 border-t border-slate-200">
                    <span className="font-bold text-slate-900 block mb-0.5">Saran & Rekomendasi Petugas:</span>
                    <p className="text-slate-700 leading-relaxed">{uji.saran_rekomendasi_lapangan}</p>
                  </div>
                )}
                {uji.catatan_lapangan && (
                  <div className="pt-1 border-t border-slate-200">
                    <span className="font-bold text-slate-900 block mb-0.5">Catatan Observasi Fisik Kolam:</span>
                    <p className="text-slate-600 leading-relaxed italic">{uji.catatan_lapangan}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BLOK TANDA TANGAN PEJABAT & PETUGAS */}
          <div className="grid grid-cols-2 gap-8 text-xs mt-5 pt-3 print:mt-3 print:pt-2 border-t border-slate-300">
            <div className="text-center">
              <p className="text-slate-500 mb-10 print:mb-8">Petugas Analis / Penguji,</p>
              <p className="font-bold text-slate-900 uppercase underline">{namaPenguji}</p>
              <p className="text-xs text-slate-600">{jabatanPenguji}</p>
              {nipPenguji && <p className="text-xs text-slate-500 font-mono mt-0.5">{nipPenguji}</p>}
            </div>

            <div className="text-center">
              <p className="text-slate-500">Lewoleba, {formattedDate}</p>
              <p className="text-slate-500 mb-9 print:mb-7">{jabatanPenandatangan},</p>
              <p className="font-bold text-slate-900 uppercase underline">
                {namaPenandatangan}
              </p>
              <p className="text-xs text-slate-600">{pangkatPenandatangan}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{nipPenandatangan}</p>
            </div>
          </div>

          {/* FOOTER & QR VERIFIKASI KEASLIAN */}
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
                <p className="font-bold text-slate-700">Verifikasi Keaslian LHU Digital</p>
                <p className="text-[10px] text-slate-400">Pindai QR untuk memverifikasi dokumen di portal {APP_CONFIG.name} {APP_CONFIG.institution.regency}</p>
              </div>
            </div>

            <div className="text-right font-mono text-[10px]">
              <span>ID: {uji.id.substring(0, 18)}</span>
              <p>Dicetak melalui {APP_CLOUD_NAME}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

