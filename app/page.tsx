import { ArrowRight, QrCode, Scale, ShieldCheck, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent } from '@/components/shadcn/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { getCurrentUser } from '@/lib/auth';
import { APP_CONFIG } from '@/lib/constants';

export default async function HomePage() {
	const user = await getCurrentUser();
	if (user) {
		redirect('/dashboard');
	}

	return (
		<div className='relative flex min-h-screen flex-col justify-between overflow-hidden bg-background text-foreground'>
			{/* Background Lighting Glows */}
			<div className='pointer-events-none absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]' />
			<div className='pointer-events-none absolute top-[20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]' />

			{/* Navbar */}
			<header className='relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6'>
				<div className='flex items-center gap-3'>
					<Image
						alt='Logo Kabupaten Lembata'
						className='h-10 w-auto object-contain'
						height={48}
						priority
						src={APP_CONFIG.logo.kabupaten}
						width={40}
					/>
					<div>
						<h1 className='font-extrabold font-heading text-base tracking-wider'>{APP_CONFIG.name}</h1>
						<p className='font-medium text-muted-foreground text-xs'>{APP_CONFIG.institution.name}</p>
					</div>
				</div>

				<div className='flex items-center gap-3'>
					<ThemeToggle />
					<Link href='/login'>
						<Button className='gap-2' size='sm'>
							<span>Masuk Sistem</span>
							<ArrowRight className='size-3.5' />
						</Button>
					</Link>
				</div>
			</header>

			{/* Hero Section */}
			<main className='relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-12 text-center sm:py-20'>
				<Badge className='mb-6 gap-1.5 px-3.5 py-1 font-semibold' variant='secondary'>
					<ShieldCheck className='size-3.5' />
					<span>Sistem Informasi Mutu Air Budidaya Perikanan Terpadu</span>
				</Badge>

				<h2 className='max-w-4xl font-extrabold font-heading text-3xl leading-tight tracking-tight sm:text-5xl lg:text-6xl'>
					Standar Mutu Air Budidaya Andal untuk{' '}
					<span className='text-foreground'>Kesejahteraan Pembudidaya Lembata</span>
				</h2>

				<p className='mt-6 max-w-2xl text-muted-foreground text-sm leading-relaxed sm:text-base'>
					Platform digitalisasi pengujian mutu air kolam pembudidaya (Pokdakan) berbasis validasi
					otomatis standar SNI & Kepmen-KP, pelabelan QR Code terintegrasi, dan penerbitan Lembar Hasil
					Uji (LHU) resmi.
				</p>

				<div className='mt-8 flex flex-col items-center gap-4 sm:flex-row'>
					<Link href='/login'>
						<Button className='w-full gap-2 font-semibold shadow-xs sm:w-auto' size='lg'>
							<span>Buka Dashboard Petugas</span>
							<ArrowRight className='size-4' />
						</Button>
					</Link>
					<Link href='/verifikasi/preview'>
						<Button className='w-full gap-2 sm:w-auto' size='lg' variant='outline'>
							<QrCode className='size-4 text-muted-foreground' />
							<span>Simulasi Verifikasi QR</span>
						</Button>
					</Link>
				</div>

				{/* Value Highlights */}
				<div className='mt-16 grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-3'>
					<Card className='bg-card/60 backdrop-blur-xs'>
						<CardContent>
							<div className='mb-3 w-fit rounded-xl bg-muted p-2.5 text-foreground'>
								<Scale className='size-5' />
							</div>
							<h3 className='font-bold font-heading text-sm'>Validasi Baku Mutu Otomatis</h3>
							<p className='mt-1 text-muted-foreground text-xs leading-relaxed'>
								Kalkulasi status kelayakan per parameter (Suhu, pH, DO, Salinitas, Amonia, Nitrit)
								dievaluasi secara otomatis dan akurat.
							</p>
						</CardContent>
					</Card>

					<Card className='bg-card/60 backdrop-blur-xs'>
						<CardContent>
							<div className='mb-3 w-fit rounded-xl bg-muted p-2.5 text-foreground'>
								<QrCode className='size-5' />
							</div>
							<h3 className='font-bold font-heading text-sm'>Integritas QR Code Unik</h3>
							<p className='mt-1 text-muted-foreground text-xs leading-relaxed'>
								Setiap botol sampel dan lembar LHU dilengkapi barcode QR anti-pemalsuan yang dapat
								diverifikasi secara publik oleh siapa saja.
							</p>
						</CardContent>
					</Card>

					<Card className='bg-card/60 backdrop-blur-xs'>
						<CardContent>
							<div className='mb-3 w-fit rounded-xl bg-muted p-2.5 text-foreground'>
								<TrendingUp className='size-5' />
							</div>
							<h3 className='font-bold font-heading text-sm'>Analisis Tren & Peringatan</h3>
							<p className='mt-1 text-muted-foreground text-xs leading-relaxed'>
								Visualisasi grafik tren fluktuasi kualitas air kolam memberikan deteksi dini sebelum terjadi
								mortalitas ikan budidaya.
							</p>
						</CardContent>
					</Card>
				</div>
			</main>

			{/* Footer */}
			<footer className='relative z-10 w-full space-y-1 border-border border-t py-6 text-center text-muted-foreground text-xs'>
				<p>
					{APP_CONFIG.author.copyrightText} — Versi {APP_CONFIG.version}
				</p>
				<p className='font-medium text-muted-foreground'>{APP_CONFIG.author.credit}</p>
			</footer>
		</div>
	);
}
