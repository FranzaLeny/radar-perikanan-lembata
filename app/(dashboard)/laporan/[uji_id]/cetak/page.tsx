import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { PrintButton } from '@/components/print-button';
import { Button } from '@/components/ui/button';
import { generateQrDataUrl, getVerificationUrl } from '@/lib/qr';
import {
  dapatkanRekomendasiTeknis,
  type StatusKelayakan,
} from '@/lib/validasi-baku-mutu';
import type { RekomendasiItem } from './types';
import { LhuKopSurat } from './_components/lhu-kop-surat';
import { LhuMetadataCard } from './_components/lhu-metadata-card';
import { LhuParameterTable } from './_components/lhu-parameter-table';
import { LhuKesimpulanRekomendasi } from './_components/lhu-kesimpulan-rekomendasi';
import { LhuTandaTangan } from './_components/lhu-tanda-tangan';
import { LhuFooterQr } from './_components/lhu-footer-qr';

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
      sop: true,
      pengujiPegawai: true,
      penandatanganPegawai: true,
      detailParameters: {
        with: {
          bakuMutu: true,
          ik: true,
        },
      },
    },
  });

  if (!uji) {
    notFound();
  }

  // QR Code URL: verifikasi via SOP / IK hash
  const qrHash =
    uji.sop?.qr_code_hash || uji.instruksiKerja?.qr_code_hash || 'demo-hash';
  const qrUrl = getVerificationUrl(qrHash);
  const qrDataUrl = await generateQrDataUrl(qrUrl);

  // Kumpulkan rekomendasi otomatis untuk parameter yang bermasalah
  const rekomendasiList: RekomendasiItem[] = [];
  uji.detailParameters.forEach((dp) => {
    const status = (dp.status_kelayakan || 'MEMENUHI') as StatusKelayakan;
    const paramName = dp.bakuMutu?.parameter || 'Parameter';
    if (status !== 'MEMENUHI') {
      const saran = dapatkanRekomendasiTeknis(
        paramName,
        status,
        Number(dp.nilai_hasil)
      );
      rekomendasiList.push({ parameter: paramName, saran });
    }
  });

  const formattedDate = new Date(uji.tanggal_pengambilan).toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  // Data Petugas Penguji & Pejabat Penandatangan
  const namaPenguji = uji.pengujiPegawai?.nama || uji.petugas_uji;
  const jabatanPenguji =
    uji.pengujiPegawai?.jabatan || 'Petugas Pengawas Budidaya';
  const nipPenguji = uji.pengujiPegawai?.nip
    ? `NIP. ${uji.pengujiPegawai.nip}`
    : '';

  const namaPenandatangan = uji.penandatanganPegawai?.nama;
  const jabatanPenandatangan = uji.penandatanganPegawai?.jabatan;
  const nipPenandatangan = uji.penandatanganPegawai?.nip || '';
  const pangkatPenandatangan = uji.penandatanganPegawai?.pangkat_golongan || '';

  // Data SOP Acuan
  const sopAcuan = uji.sop
    ? `[${uji.sop.kode_ik}] ${uji.sop.judul}`
    : uji.instruksiKerja
    ? `[${uji.instruksiKerja.kode_ik}] ${uji.instruksiKerja.judul}`
    : 'Standar Operasional Dinas (Umum)';

  return (
    <div className="space-y-6 print:space-y-0 print:p-0 print:m-0">
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex items-center justify-between no-print">
        <Link href="/laporan">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Kembali ke Pusat Laporan</span>
          </Button>
        </Link>

        <PrintButton label="Cetak Lembar Hasil Uji (A4)" />
      </div>

      {/* A4 Paper Document Canvas (Strict Arial Font Rule for Official LHU) */}
      <div className="flex justify-center print:m-0 print:p-0">
        <div
          className="print-area lhu-print-document bg-white text-slate-900 border border-slate-300 rounded-xl p-8 sm:p-12 w-full max-w-4xl shadow-xl print:border-none print:shadow-none print:p-0 print:max-w-none"
          style={{ fontFamily: 'Arial, var(--font-geist-sans), sans-serif' }}
        >
          <LhuKopSurat nomorSampel={uji.nomor_sampel} />

          <LhuMetadataCard
            nomorSampel={uji.nomor_sampel}
            formattedDate={formattedDate}
            namaPokdakan={uji.lokasi?.nama_pokdakan}
            pemilik={uji.lokasi?.pemilik}
            desa={uji.lokasi?.desa}
            kecamatan={uji.lokasi?.kecamatan}
            komoditasIkan={uji.lokasi?.komoditas_ikan}
            sopAcuan={sopAcuan}
            suhuLingkungan={uji.suhu_lingkungan}
          />

          <LhuParameterTable parameters={uji.detailParameters} />

          <LhuKesimpulanRekomendasi
            kesimpulan={uji.kesimpulan}
            rekomendasiList={rekomendasiList}
            kesimpulanUmum={uji.kesimpulan_umum}
            saranRekomendasiLapangan={uji.saran_rekomendasi_lapangan}
            catatanLapangan={uji.catatan_lapangan}
          />

          <LhuTandaTangan
            formattedDate={formattedDate}
            namaPenguji={namaPenguji}
            jabatanPenguji={jabatanPenguji}
            nipPenguji={nipPenguji}
            namaPenandatangan={namaPenandatangan}
            jabatanPenandatangan={jabatanPenandatangan}
            pangkatPenandatangan={pangkatPenandatangan}
            nipPenandatangan={nipPenandatangan}
          />

          <LhuFooterQr qrDataUrl={qrDataUrl} ujiId={uji.id} />
        </div>
      </div>
    </div>
  );
}
