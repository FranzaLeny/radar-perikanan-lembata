import { eq } from 'drizzle-orm';
import {
	ArrowRight,
	Building2,
	Calendar,
	CheckCircle2,
	ExternalLink,
	ShieldCheck,
	Sparkles
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/shadcn/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { APP_CONFIG, BRAND_NAME } from '@/lib/constants';

export default async function PublicVerificationPage({
	params,
	searchParams
}: {
	params: Promise<{ hash: string }>;
	searchParams?: Promise<{ info?: string; preview?: string; detail?: string }>;
}) {
	const { hash } = await params;
	const search = searchParams ? await searchParams : {};
	const showInfoOnly =
		search.info === 'true' || search.preview === 'true' || search.detail === 'true';

	const ik = await db.query.instruksiKerja.findFirst({
		where: eq(schema.instruksiKerja.qr_code_hash, hash)
	});

	if (!ik) {
		return (
			<div className='flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground'>
				<Card className='w-full max-w-md p-6 text-center'>
					<div className='mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive'>
						<ShieldCheck className='size-8' />
					</div>
					<CardTitle className='mb-2 text-xl'>QR Code Tidak Terdaftar</CardTitle>
					<CardDescription className='text-xs leading-relaxed'>
						Kode QR atau hash verifikasi ini tidak ditemukan dalam basis data resmi{' '}
						{APP_CONFIG.institution.name}.
					</CardDescription>
					<div className='mt-6 flex justify-center'>
						<Link href='/login'>
							<Button size='sm' variant='outline'>
								<span>Masuk ke {BRAND_NAME}</span>
							</Button>
						</Link>
					</div>
				</Card>
			</div>
		);
	}

	// Jika file_path merupakan tautan eksternal (http:// atau https://) dan bukan mode pratinjau/info,
	// langsung redirect pemindai QR / browser ke tautan dokumen resmi tersebut.
	if (
		!showInfoOnly &&
		ik.file_path &&
		(ik.file_path.startsWith('http://') || ik.file_path.startsWith('https://'))
	) {
		redirect(ik.file_path);
	}

	// Ambil parameter baku mutu aktif untuk ditampilkan sebagai referensi
	const bakuMutuList = await db.query.masterBakuMutu.findMany({
		where: eq(schema.masterBakuMutu.aktif, true)
	});

	return (
		<div className='flex min-h-screen flex-col justify-between bg-background p-4 text-foreground sm:p-6 lg:p-8'>
			{/* Decorative Glow */}
			<div className='pointer-events-none fixed top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]' />

			{/* Top Bar with Brand & Theme Toggle */}
			<header className='relative z-10 mx-auto flex w-full max-w-2xl items-center justify-between py-2'>
				<div className='flex items-center gap-2'>
					<Image
						alt='Logo Kabupaten Lembata'
						className='h-7 w-auto object-contain'
						height={28}
						priority
						src={APP_CONFIG.logo.kabupaten}
						width={28}
					/>
					<Image
						alt={BRAND_NAME}
						className='size-7 object-contain'
						height={28}
						priority
						src={APP_CONFIG.logo.app}
						width={28}
					/>
					<span className='font-extrabold font-heading text-sm tracking-wider'>{BRAND_NAME}</span>
				</div>
				<ThemeToggle />
			</header>

			{/* Main Container */}
			<main className='relative z-10 mx-auto my-auto w-full max-w-2xl py-6'>
				<Card className='border-primary/20 shadow-2xl'>
					{/* Top Seal */}
					<CardHeader className='flex flex-col items-center border-b pb-6 text-center'>
						<Badge
							className='mb-3 gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-600 dark:text-emerald-400'
							variant='outline'
						>
							<CheckCircle2 className='size-4 text-emerald-500' />
							<span>Dokumen Resmi Terverifikasi Keabsahannya</span>
						</Badge>

						<div className='mb-3 flex items-center justify-center gap-4'>
							<Image
								alt='Logo Pemerintah Kabupaten Lembata'
								className='h-16 w-auto object-contain drop-shadow-sm'
								height={64}
								priority
								src={APP_CONFIG.logo.kabupaten}
								width={64}
							/>
							<div className='h-12 w-px bg-border/80' />
							<Image
								alt={BRAND_NAME}
								className='h-16 w-auto object-contain drop-shadow-sm'
								height={64}
								priority
								src={APP_CONFIG.logo.app}
								width={64}
							/>
						</div>

						<CardTitle className='font-bold text-xl tracking-tight sm:text-2xl'>
							{APP_CONFIG.institution.government}
						</CardTitle>
						<p className='mt-0.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider'>
							{APP_CONFIG.institution.name.toUpperCase()}
						</p>
					</CardHeader>

					{/* IK Detail Section */}
					<CardContent className='space-y-4 py-6'>
						<div className='flex items-center justify-between'>
							<span className='rounded-lg border border-border bg-muted px-2.5 py-1 font-bold text-foreground text-xs'>
								{ik.kode_ik}
							</span>
							<Badge className='font-semibold' variant='secondary'>
								Versi Dokumen: {ik.versi}.0
							</Badge>
						</div>

						<div>
							<h2 className='font-bold font-heading text-foreground text-lg leading-snug'>{ik.judul}</h2>
							<p className='mt-1 text-muted-foreground text-xs'>
								Kategori:{' '}
								<span className='font-medium text-foreground'>
									{ik.kategori || 'Standar Operasional Prosedur'}
								</span>
							</p>
						</div>

						<div className='grid grid-cols-2 gap-3 pt-2 text-xs'>
							<div className='rounded-xl border border-border bg-muted/40 p-3'>
								<span className='mb-1 flex items-center gap-1.5 text-muted-foreground text-xs'>
									<Calendar className='size-3.5 text-muted-foreground' />
									Tanggal Diterbitkan
								</span>
								<span className='font-semibold text-foreground'>
									{new Date(ik.createdAt).toLocaleDateString('id-ID', {
										day: 'numeric',
										month: 'long',
										year: 'numeric'
									})}
								</span>
							</div>

							<div className='rounded-xl border border-border bg-muted/40 p-3'>
								<span className='mb-1 flex items-center gap-1.5 text-muted-foreground text-xs'>
									<Building2 className='size-3.5 text-muted-foreground' />
									Otoritas Pengesah
								</span>
								<span className='block truncate font-semibold text-foreground'>
									{APP_CONFIG.institution.shortName}
								</span>
							</div>
						</div>

						{/* Standard Water Quality Parameters */}
						<div className='mt-6 border-border border-t pt-5'>
							<h3 className='mb-3 flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider'>
								<Sparkles className='size-3.5' />
								Parameter Baku Mutu Acuan (PP No. 22/2021)
							</h3>
							<div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
								{bakuMutuList.map((bm) => (
									<div className='rounded-xl border border-border bg-muted/30 p-2.5 text-xs' key={bm.id}>
										<p className='font-semibold text-foreground'>{bm.parameter}</p>
										<p className='mt-0.5 font-medium text-foreground text-xs'>
											{bm.nilai_min !== null && bm.nilai_max !== null
												? `${bm.nilai_min} - ${bm.nilai_max} ${bm.satuan}`
												: bm.nilai_min !== null
													? `≥ ${bm.nilai_min} ${bm.satuan}`
													: bm.nilai_max !== null
														? `≤ ${bm.nilai_max} ${bm.satuan}`
														: `-`}
										</p>
									</div>
								))}
							</div>
						</div>
					</CardContent>

					{/* Action Footer */}
					<CardFooter className='flex flex-col items-center justify-between gap-3 border-border border-t pt-4 sm:flex-row'>
						<span className='truncate text-muted-foreground text-xs'>HASH ID: {ik.qr_code_hash}</span>

						<div className='flex w-full flex-wrap items-center gap-2 sm:w-auto'>
							{ik.file_path && (
								<a
									className='w-full sm:w-auto'
									href={ik.file_path}
									rel='noopener noreferrer'
									target='_blank'
								>
									<Button className='w-full gap-2 sm:w-auto' size='sm' variant='outline'>
										<ExternalLink className='size-3.5 text-muted-foreground' />
										<span>Buka Tautan Dokumen</span>
									</Button>
								</a>
							)}

							<Link className='w-full sm:w-auto' href={`/uji-kualitas/input?ik_id=${ik.id}`}>
								<Button className='w-full gap-2 sm:w-auto' size='sm'>
									<span>Input Uji via SOP Ini</span>
									<ArrowRight className='size-3.5' />
								</Button>
							</Link>
						</div>
					</CardFooter>
				</Card>
			</main>

			{/* Footer */}
			<footer className='relative z-10 space-y-1 py-4 text-center text-muted-foreground text-xs'>
				<p>
					© {APP_CONFIG.author.copyrightYear} {APP_CONFIG.institution.name} •{' '}
					{APP_CONFIG.institution.province}
				</p>
				<p className='text-muted-foreground/80 text-xs'>
					{BRAND_NAME} — {APP_CONFIG.fullName}
				</p>
				<p className='font-medium text-muted-foreground'>{APP_CONFIG.author.credit}</p>
			</footer>
		</div>
	);
}
