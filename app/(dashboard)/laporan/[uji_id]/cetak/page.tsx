import { eq } from 'drizzle-orm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PrintButton } from '@/components/print-button';
import { Button } from '@/components/shadcn/button';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { generateQrDataUrl, getVerificationUrl } from '@/lib/qr';
import { dapatkanRekomendasiTeknis, type StatusKelayakan } from '@/lib/validasi-baku-mutu';
import { LhuFooterQr } from './_components/lhu-footer-qr';
import { LhuKesimpulanRekomendasi } from './_components/lhu-kesimpulan-rekomendasi';
import { LhuKopSurat } from './_components/lhu-kop-surat';
import { LhuMetadataCard } from './_components/lhu-metadata-card';
import { LhuParameterTable } from './_components/lhu-parameter-table';
import { LhuTandaTangan } from './_components/lhu-tanda-tangan';
import type { RekomendasiItem } from './types';

export default async function CetakLhuPage({ params }: { params: Promise<{ uji_id: string }> }) {
	const { uji_id } = await params;

	const uji = await db.query.ujiKualitasAir.findFirst({
		where: eq(schema.ujiKualitasAir.id, uji_id),
		with: {
			lokasi: true,
			instruksiKerja: true,
			sop: true,
			pengujiPegawai: true,
			penandatanganPegawai: true,
			detailParameters: { with: { bakuMutu: true, ik: true } }
		}
	});

	if (!uji) {
		notFound();
	}

	// QR Code URL: verifikasi via SOP / IK hash
	const qrHash = uji.sop?.qr_code_hash || uji.instruksiKerja?.qr_code_hash || 'demo-hash';
	const qrUrl = getVerificationUrl(qrHash);
	const qrDataUrl = await generateQrDataUrl(qrUrl);

	// Kumpulkan rekomendasi otomatis untuk parameter yang bermasalah
	const rekomendasiList: RekomendasiItem[] = [];
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
		year: 'numeric'
	});

	// Data Petugas Penguji & Pejabat Penandatangan
	const namaPenguji = uji.pengujiPegawai?.nama || uji.petugas_uji;
	const jabatanPenguji = uji.pengujiPegawai?.jabatan || 'Petugas Pengawas Budidaya';
	const nipPenguji = uji.pengujiPegawai?.nip ? `NIP. ${uji.pengujiPegawai.nip}` : '';

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
		<div className='space-y-6 print:m-0 print:space-y-0 print:p-0'>
			{/* Top Action Bar (hidden when printing) */}
			<div className='no-print flex items-center justify-between'>
				<Link href='/laporan'>
					<Button
						className='cursor-pointer gap-1.5 text-muted-foreground text-xs hover:text-foreground'
						size='sm'
						variant='ghost'
					>
						<ArrowLeft className='size-4' />
						<span>Kembali ke Pusat Laporan</span>
					</Button>
				</Link>

				<PrintButton label='Cetak Lembar Hasil Uji (A4)' />
			</div>

			{/* A4 Paper Document Canvas (Strict Arial Font Rule for Official LHU) */}
			<div className='flex justify-center print:m-0 print:p-0'>
				<div
					className='print-area lhu-print-document w-full max-w-4xl rounded-xl border border-slate-300 bg-white p-8 text-slate-900 shadow-xl sm:p-12 print:max-w-none print:border-none print:p-0 print:shadow-none'
					style={{ fontFamily: 'Arial, var(--font-geist-sans), sans-serif' }}
				>
					<LhuKopSurat nomorSampel={uji.nomor_sampel} />

					<LhuMetadataCard
						desa={uji.lokasi?.desa}
						formattedDate={formattedDate}
						kecamatan={uji.lokasi?.kecamatan}
						komoditasIkan={uji.lokasi?.komoditas_ikan}
						namaPokdakan={uji.lokasi?.nama_pokdakan}
						nomorSampel={uji.nomor_sampel}
						pemilik={uji.lokasi?.pemilik}
						sopAcuan={sopAcuan}
						suhuLingkungan={uji.suhu_lingkungan}
					/>

					<LhuParameterTable parameters={uji.detailParameters} />

					<LhuKesimpulanRekomendasi
						catatanLapangan={uji.catatan_lapangan}
						kesimpulan={uji.kesimpulan}
						kesimpulanUmum={uji.kesimpulan_umum}
						rekomendasiList={rekomendasiList}
						saranRekomendasiLapangan={uji.saran_rekomendasi_lapangan}
					/>

					<LhuTandaTangan
						formattedDate={formattedDate}
						jabatanPenandatangan={jabatanPenandatangan}
						jabatanPenguji={jabatanPenguji}
						namaPenandatangan={namaPenandatangan}
						namaPenguji={namaPenguji}
						nipPenandatangan={nipPenandatangan}
						nipPenguji={nipPenguji}
						pangkatPenandatangan={pangkatPenandatangan}
					/>

					<LhuFooterQr qrDataUrl={qrDataUrl} ujiId={uji.id} />
				</div>
			</div>
		</div>
	);
}
