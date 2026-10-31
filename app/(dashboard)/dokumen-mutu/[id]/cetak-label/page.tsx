import { eq } from 'drizzle-orm';
import { ArrowLeft, ShieldCheck, TestTube2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PrintButton } from '@/components/print-button';
import { QrDownloadButton } from '@/components/qr-download-button';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { APP_CONFIG, BRAND_NAME } from '@/lib/constants';
import { generateQrDataUrl, generateQrSvg, getVerificationUrl } from '@/lib/qr';

export default async function CetakLabelDokumenPage({
	params
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const ik = await db.query.instruksiKerja.findFirst({
		where: eq(schema.instruksiKerja.id, id),
		with: { kategoriDokumen: true }
	});

	if (!ik) {
		notFound();
	}

	const verificationUrl = getVerificationUrl(ik.qr_code_hash);
	const [qrDataUrl, qrSvgString] = await Promise.all([
		generateQrDataUrl(verificationUrl),
		generateQrSvg(verificationUrl)
	]);

	const namaKategori = ik.kategoriDokumen?.nama_kategori || ik.kategori || 'Dokumen Mutu';

	return (
		<div className='space-y-6 print:m-0 print:space-y-0 print:p-0'>
			{/* Action Bar (Hidden when printing) */}
			<div className='no-print flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
				<Link href='/dokumen-mutu'>
					<Button
						className='text-muted-foreground hover:text-foreground gap-2 text-xs'
						size='sm'
						variant='ghost'
					>
						<ArrowLeft className='size-4' />
						<span>Kembali ke Katalog Dokumen Mutu</span>
					</Button>
				</Link>

				<div className='flex items-center gap-2'>
					<QrDownloadButton
						fileNamePrefix={ik.kode_ik}
						label='Unduh File QR (PNG/SVG)'
						qrDataUrl={qrDataUrl}
						qrSvgString={qrSvgString}
					/>
					<PrintButton label='Cetak Stiker Label (A6 / A7)' />
				</div>
			</div>

			{/* Label Container for Print */}
			<div className='flex justify-center print:m-0 print:p-0'>
				<div className='print-area flex w-full max-w-md flex-col items-center rounded-2xl border-2 border-slate-900 bg-white p-6 text-center text-slate-900 shadow-lg print:border-none print:p-0 print:shadow-none'>
					{/* Header Dinas */}
					<div className='mb-4 flex w-full items-center justify-between border-b-2 border-slate-900 pb-3 text-left'>
						<div className='flex items-center gap-2'>
							<Image
								alt='Logo Kabupaten Lembata'
								className='h-9 w-auto shrink-0 object-contain'
								height={36}
								loading='lazy'
								preload={false}
								priority={false}
								src={APP_CONFIG.logo.kabupaten}
								width={36}
							/>
							<div>
								<h3 className='text-xs font-extrabold tracking-tight text-slate-900 uppercase'>
									{APP_CONFIG.institution.government}
								</h3>
								<p className='text-xs font-bold text-cyan-800 uppercase'>{APP_CONFIG.institution.name}</p>
							</div>
						</div>
						<div className='text-right'>
							<Badge className='border-slate-400 font-bold text-slate-900' variant='outline'>
								{BRAND_NAME}
							</Badge>
						</div>
					</div>

					{/* Badge & Title */}
					<div className='mb-3'>
						<span className='mb-2 inline-block rounded-lg border border-cyan-300 bg-cyan-100 px-3 py-1 text-sm font-bold text-cyan-900'>
							{ik.kode_ik} • v{ik.versi}.0
						</span>
						<h2 className='px-2 text-base leading-snug font-extrabold text-slate-900'>{ik.judul}</h2>
						<p className='mt-1 text-xs font-medium text-slate-600'>Kategori: {namaKategori}</p>

						{/* Jika Instruksi Kerja: Tampilkan Parameter & Metode */}
						{ik.parameter_uji || ik.metode_pengujian ? (
							<div className='mt-2 flex flex-wrap items-center justify-center gap-1.5'>
								{ik.parameter_uji && (
									<span className='inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-900'>
										<TestTube2 className='size-3' />
										<span>Param: {ik.parameter_uji}</span>
									</span>
								)}
								{ik.metode_pengujian && (
									<span className='inline-block rounded border border-slate-300 bg-slate-100 px-2 py-0.5 text-[11px] text-slate-800'>
										Metode: {ik.metode_pengujian}
									</span>
								)}
							</div>
						) : null}
					</div>

					{/* QR Code */}
					<div className='my-2 rounded-2xl border-2 border-dashed border-cyan-800/40 bg-slate-50 p-3 shadow-inner'>
						<Image
							alt={`QR Code ${ik.kode_ik}`}
							className='h-48 w-48 object-contain'
							height={192}
							priority
							src={qrDataUrl}
							unoptimized
							width={192}
						/>
					</div>

					{/* Scan Instructions */}
					<div className='mt-3 max-w-xs text-xs text-slate-700'>
						<p className='flex items-center justify-center gap-1.5 font-bold text-cyan-900'>
							<ShieldCheck className='size-4 text-emerald-600' />
							{ik.file_path?.startsWith('http')
								? 'Scan Langsung ke Dokumen Mutu'
								: 'Verifikasi Mutu & Input Uji'}
						</p>
						<p className='mt-1 text-xs leading-relaxed text-slate-500'>
							{ik.file_path?.startsWith('http')
								? 'Pindai QR ini menggunakan kamera ponsel untuk langsung membuka tautan dokumen resmi.'
								: 'Pindai QR ini menggunakan kamera ponsel untuk memverifikasi keabsahan dokumen atau melakukan input hasil uji lapangan secara langsung.'}
						</p>
						{ik.file_path && (
							<p className='mx-auto mt-1.5 max-w-[280px] truncate rounded border border-cyan-200 bg-cyan-50/80 px-2 py-0.5 text-xs text-cyan-800'>
								{ik.file_path}
							</p>
						)}
					</div>

					{/* Footer Metadata */}
					<div className='mt-4 flex w-full items-center justify-between border-t border-slate-200 pt-2.5 text-xs text-slate-500'>
						<span>HASH: {ik.qr_code_hash.substring(0, 16)}...</span>
						<span>{BRAND_NAME}-LEMBATA</span>
					</div>
				</div>
			</div>
		</div>
	);
}
