import { eq } from 'drizzle-orm';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PrintButton } from '@/components/print-button';
import { QrDownloadButton } from '@/components/qr-download-button';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { APP_CONFIG, APP_NAME } from '@/lib/constants';
import { generateQrDataUrl, generateQrSvg, getVerificationUrl } from '@/lib/qr';

export default async function CetakLabelPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const ik = await db.query.instruksiKerja.findFirst({ where: eq(schema.instruksiKerja.id, id) });

	if (!ik) {
		notFound();
	}

	const verificationUrl = getVerificationUrl(ik.qr_code_hash);
	const [qrDataUrl, qrSvgString] = await Promise.all([
		generateQrDataUrl(verificationUrl),
		generateQrSvg(verificationUrl)
	]);

	return (
		<div className='space-y-6 print:m-0 print:space-y-0 print:p-0'>
			{/* Action Bar (Hidden when printing) */}
			<div className='no-print flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
				<Link href='/instruksi-kerja'>
					<Button
						className='gap-2 text-muted-foreground text-xs hover:text-foreground'
						size='sm'
						variant='ghost'
					>
						<ArrowLeft className='size-4' />
						<span>Kembali ke Daftar Instruksi Kerja</span>
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
					<div className='mb-4 flex w-full items-center justify-between border-slate-900 border-b-2 pb-3 text-left'>
						<div className='flex items-center gap-2'>
							<Image
								alt='Logo Kabupaten Lembata'
								className='h-9 w-auto shrink-0 object-contain'
								height={36}
								priority
								src={APP_CONFIG.logo.kabupaten}
								width={36}
							/>
							<div>
								<h3 className='font-extrabold text-slate-900 text-xs uppercase tracking-tight'>
									{APP_CONFIG.institution.government}
								</h3>
								<p className='font-bold text-cyan-800 text-xs uppercase'>{APP_CONFIG.institution.name}</p>
							</div>
						</div>
						<div className='text-right'>
							<Badge
								className='border-slate-400 font-bold font-mono text-slate-900 text-xs'
								variant='outline'
							>
								{APP_NAME}
							</Badge>
						</div>
					</div>

					{/* Badge & Title */}
					<div className='mb-3'>
						<span className='mb-2 inline-block rounded-lg border border-cyan-300 bg-cyan-100 px-3 py-1 font-bold font-mono text-cyan-900 text-sm'>
							{ik.kode_ik} • v{ik.versi}.0
						</span>
						<h2 className='px-2 font-extrabold text-base text-slate-900 leading-snug'>{ik.judul}</h2>
						<p className='mt-1 font-medium text-slate-600 text-xs'>
							Kategori: {ik.kategori || 'Standar Operasional Prosedur'}
						</p>
					</div>

					{/* QR Code */}
					<div className='my-2 rounded-2xl border-2 border-cyan-800/40 border-dashed bg-slate-50 p-3 shadow-inner'>
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
					<div className='mt-3 max-w-xs text-slate-700 text-xs'>
						<p className='flex items-center justify-center gap-1.5 font-bold text-cyan-900'>
							<ShieldCheck className='size-4 text-emerald-600' />
							{ik.file_path?.startsWith('http')
								? 'Scan Langsung ke Dokumen SOP'
								: 'Verifikasi Mutu & Input Uji'}
						</p>
						<p className='mt-1 text-slate-500 text-xs leading-relaxed'>
							{ik.file_path?.startsWith('http')
								? 'Pindai QR ini menggunakan kamera ponsel untuk langsung membuka tautan dokumen SOP resmi.'
								: 'Pindai QR ini menggunakan kamera ponsel untuk memverifikasi keabsahan SOP atau melakukan input hasil uji lapangan secara langsung.'}
						</p>
						{ik.file_path && (
							<p className='mx-auto mt-1.5 max-w-[280px] truncate rounded border border-cyan-200 bg-cyan-50/80 px-2 py-0.5 font-mono text-cyan-800 text-xs'>
								{ik.file_path}
							</p>
						)}
					</div>

					{/* Footer Metadata */}
					<div className='mt-4 flex w-full items-center justify-between border-slate-200 border-t pt-2.5 font-mono text-slate-500 text-xs'>
						<span>HASH: {ik.qr_code_hash.substring(0, 16)}...</span>
						<span>{APP_NAME}-LEMBATA</span>
					</div>
				</div>
			</div>
		</div>
	);
}
