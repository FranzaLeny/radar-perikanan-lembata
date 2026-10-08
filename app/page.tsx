import {
	Activity,
	ArrowRight,
	CheckCircle2,
	ChevronRight,
	Clock,
	Droplets,
	FileSpreadsheet,
	FileText,
	Layers,
	MapPin,
	QrCode,
	Scale,
	ShieldCheck,
	Sparkles,
	TestTube2,
	TrendingUp
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent } from '@/components/shadcn/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { getCurrentUser } from '@/lib/auth';
import { APP_CONFIG, BRAND_NAME } from '@/lib/constants';

export default async function HomePage() {
	const user = await getCurrentUser();
	if (user) {
		redirect('/dashboard');
	}

	return (
		<div className='relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary'>
			{/* Ambient Background Glows */}
			<div className='pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px] dark:bg-primary/15' />
			<div className='pointer-events-none absolute top-[35%] -right-40 -z-10 h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[140px] dark:bg-blue-600/10' />
			<div className='pointer-events-none absolute top-[70%] -left-40 -z-10 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[140px] dark:bg-cyan-600/10' />

			{/* ========================================================================= */}
			{/* 1. NAVBAR */}
			{/* ========================================================================= */}
			<header className='sticky top-0 z-50 w-full border-border/40 border-b bg-background/80 backdrop-blur-md'>
				<div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center gap-3'>
						<div className='flex size-10 items-center justify-center rounded-xl bg-primary/10 p-1.5 ring-1 ring-primary/20'>
							<Image
								alt='Logo Kabupaten Lembata'
								className='h-full w-auto object-contain'
								height={40}
								priority
								src={APP_CONFIG.logo.kabupaten}
								width={32}
							/>
						</div>
						<div>
							<div className='flex items-center gap-1.5'>
								<span className='font-bold font-heading text-base text-foreground tracking-tight'>
									{BRAND_NAME}
								</span>
								<Badge
									className='border-primary/30 bg-primary/10 px-1.5 py-0 font-semibold text-[10px] text-primary'
									variant='outline'
								>
									Lembata
								</Badge>
							</div>
							<p className='font-medium text-[11px] text-muted-foreground'>
								{APP_CONFIG.institution.shortName}
							</p>
						</div>
					</div>

					{/* Navigation Links */}
					<nav className='hidden items-center gap-6 font-medium text-muted-foreground text-xs md:flex'>
						<a className='transition-colors hover:text-foreground' href='#keunggulan'>
							Keunggulan
						</a>
						<a className='transition-colors hover:text-foreground' href='#alur-kerja'>
							Alur Kerja
						</a>
						<a className='transition-colors hover:text-foreground' href='#baku-mutu'>
							Standar Baku Mutu
						</a>
					</nav>

					{/* Actions */}
					<div className='flex items-center gap-2.5'>
						<ThemeToggle />
						<Link href='/login'>
							<Button className='cursor-pointer gap-2 shadow-xs' size='sm'>
								<span>Masuk Portal</span>
								<ArrowRight className='size-3.5' />
							</Button>
						</Link>
					</div>
				</div>
			</header>

			{/* ========================================================================= */}
			{/* 2. HERO SECTION */}
			{/* ========================================================================= */}
			<section className='relative mx-auto flex w-full max-w-7xl flex-col items-center px-4 pt-12 pb-16 text-center sm:px-6 sm:pt-20 lg:px-8'>
				{/* Top Tagline Badge */}
				<div className='fade-in slide-in-from-top-3 inline-flex animate-in items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 font-semibold text-primary text-xs shadow-xs duration-500'>
					<Sparkles className='size-3.5 text-primary' />
					<span>{APP_CONFIG.tagline}</span>
				</div>

				{/* Main Headline */}
				<h1 className='mt-6 max-w-4xl font-black font-heading text-3xl text-foreground leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl'>
					Rekapitulasi & Analisis Data Mutu Air Kolam Budidaya{' '}
					<span className='bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-400 dark:to-teal-300'>
						Kabupaten Lembata
					</span>
				</h1>

				{/* Subheadline */}
				<p className='mt-6 max-w-2xl text-muted-foreground text-sm leading-relaxed sm:text-base sm:leading-relaxed'>
					Instrumen digital terpadu Dinas Perikanan Kabupaten Lembata untuk menghimpun data pengukuran
					lapangan, memvalidasi kepatuhan baku mutu nasional (Permen KKP No. 75/2016 & PP No. 22/2021),
					serta menerbitkan Lembar Hasil Uji (LHU) berotentikasi QR Code resmi.
				</p>

				{/* CTA Buttons */}
				<div className='mt-8 flex w-full max-w-md flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row'>
					<Link className='w-full sm:w-auto' href='/login'>
						<Button className='w-full cursor-pointer gap-2 font-semibold shadow-md sm:w-auto' size='lg'>
							<span>Buka Dashboard Petugas</span>
							<ArrowRight className='size-4' />
						</Button>
					</Link>
					<Link className='w-full sm:w-auto' href='/verifikasi/preview'>
						<Button
							className='w-full cursor-pointer gap-2 border-border/80 bg-background/80 backdrop-blur-xs sm:w-auto'
							size='lg'
							variant='outline'
						>
							<QrCode className='size-4 text-primary' />
							<span>Verifikasi Dokumen QR</span>
						</Button>
					</Link>
				</div>

				{/* ========================================================================= */}
				{/* LIVE INTERACTIVE PREVIEW CARD */}
				{/* ========================================================================= */}
				<div className='mt-14 w-full max-w-4xl rounded-2xl border border-border/80 bg-card/80 p-4 text-left shadow-xl backdrop-blur-md sm:p-6'>
					<div className='flex flex-col gap-4 border-border/60 border-b pb-4 sm:flex-row sm:items-center sm:justify-between'>
						<div className='flex items-center gap-3'>
							<div className='flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400'>
								<Activity className='size-5' />
							</div>
							<div>
								<div className='flex items-center gap-2'>
									<h2 className='font-bold font-heading text-foreground text-sm'>
										Monitoring Kualitas Air Real-time
									</h2>
									<Badge
										className='gap-1 border-emerald-300 bg-emerald-50 text-[10px] text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
										variant='outline'
									>
										<span className='size-1.5 animate-pulse rounded-full bg-emerald-500' />
										Sistem Aktif
									</Badge>
								</div>
								<p className='text-muted-foreground text-xs'>
									Pokdakan Mina Bahari • Kec. Nubatukan, Kab. Lembata
								</p>
							</div>
						</div>

						<div className='flex items-center gap-2'>
							<Badge className='text-[11px]' variant='secondary'>
								Standar: Permen KKP 75/2016
							</Badge>
						</div>
					</div>

					{/* Metric Parameters Grid */}
					<div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<div className='rounded-xl border border-border/60 bg-muted/20 p-3'>
							<span className='text-[11px] text-muted-foreground'>Oksigen Terlarut (DO)</span>
							<div className='mt-1 flex items-baseline gap-1'>
								<span className='font-bold text-foreground text-lg'>6.40</span>
								<span className='text-[10px] text-muted-foreground'>mg/L</span>
							</div>
							<div className='mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400'>
								<CheckCircle2 className='size-3' />
								<span>Memenuhi (≥ 3.0)</span>
							</div>
						</div>

						<div className='rounded-xl border border-border/60 bg-muted/20 p-3'>
							<span className='text-[11px] text-muted-foreground'>Derajat Keasaman (pH)</span>
							<div className='mt-1 flex items-baseline gap-1'>
								<span className='font-bold text-foreground text-lg'>7.85</span>
								<span className='text-[10px] text-muted-foreground'>-</span>
							</div>
							<div className='mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400'>
								<CheckCircle2 className='size-3' />
								<span>Optimal (7.5 - 8.5)</span>
							</div>
						</div>

						<div className='rounded-xl border border-border/60 bg-muted/20 p-3'>
							<span className='text-[11px] text-muted-foreground'>Suhu Air Kolam</span>
							<div className='mt-1 flex items-baseline gap-1'>
								<span className='font-bold text-foreground text-lg'>29.50</span>
								<span className='text-[10px] text-muted-foreground'>°C</span>
							</div>
							<div className='mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400'>
								<CheckCircle2 className='size-3' />
								<span>Stabil (28 - 32)</span>
							</div>
						</div>

						<div className='rounded-xl border border-border/60 bg-muted/20 p-3'>
							<span className='text-[11px] text-muted-foreground'>Amonia Bebas (NH₃)</span>
							<div className='mt-1 flex items-baseline gap-1'>
								<span className='font-bold text-foreground text-lg'>0.008</span>
								<span className='text-[10px] text-muted-foreground'>mg/L</span>
							</div>
							<div className='mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400'>
								<CheckCircle2 className='size-3' />
								<span>Aman (&lt; 0.01)</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ========================================================================= */}
			{/* 3. KEY IMPACT STATS */}
			{/* ========================================================================= */}
			<section className='border-border/60 border-y bg-muted/25 py-10'>
				<div className='mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-4 lg:px-8'>
					<div className='text-center'>
						<span className='font-black font-heading text-2xl text-primary sm:text-4xl'>100%</span>
						<p className='mt-1 text-muted-foreground text-xs sm:text-sm'>
							Validasi Regulasi SNI & Permen KKP
						</p>
					</div>
					<div className='text-center'>
						<span className='font-black font-heading text-2xl text-blue-600 sm:text-4xl dark:text-blue-400'>
							Real-time
						</span>
						<p className='mt-1 text-muted-foreground text-xs sm:text-sm'>
							Evaluasi Ambang Batas Lapangan
						</p>
					</div>
					<div className='text-center'>
						<span className='font-black font-heading text-2xl text-cyan-600 sm:text-4xl dark:text-cyan-400'>
							QR Code
						</span>
						<p className='mt-1 text-muted-foreground text-xs sm:text-sm'>
							Otentikasi & Keabsahan Lembar Hasil Uji
						</p>
					</div>
					<div className='text-center'>
						<span className='font-black font-heading text-2xl text-teal-600 sm:text-4xl dark:text-teal-400'>
							9 Kec.
						</span>
						<p className='mt-1 text-muted-foreground text-xs sm:text-sm'>Sentra Kolam Pokdakan Lembata</p>
					</div>
				</div>
			</section>

			{/* ========================================================================= */}
			{/* 4. FITUR UNGGULAN SECTION */}
			{/* ========================================================================= */}
			<section className='mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8' id='keunggulan'>
				<div className='text-center'>
					<Badge className='px-3 py-1 text-xs' variant='secondary'>
						Fitur Unggulan Sistem
					</Badge>
					<h2 className='mt-3 font-extrabold font-heading text-2xl text-foreground tracking-tight sm:text-4xl'>
						Transformasi Digital Pengawasan Mutu Air
					</h2>
					<p className='mx-auto mt-3 max-w-2xl text-muted-foreground text-sm'>
						Dirancang untuk menjawab kebutuhan teknis petugas penguji laboratorium dan petambak perikanan
						di lapangan.
					</p>
				</div>

				<div className='mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{/* Card 1 */}
					<Card className='border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-md'>
						<CardContent className='p-6'>
							<div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400'>
								<Scale className='size-6' />
							</div>
							<h3 className='font-bold font-heading text-base text-foreground'>
								Validasi Baku Mutu Cerdas
							</h3>
							<p className='mt-2 text-muted-foreground text-xs leading-relaxed'>
								Menghubungkan angka pengukuran dengan database ambang batas Permen KKP 75/2016 & PP 22/2021
								secara otomatis, mencegah kesalahan analisis data di lapangan.
							</p>
						</CardContent>
					</Card>

					{/* Card 2 */}
					<Card className='border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-md'>
						<CardContent className='p-6'>
							<div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400'>
								<QrCode className='size-6' />
							</div>
							<h3 className='font-bold font-heading text-base text-foreground'>
								Keamanan QR Code Anti-Pemalsuan
							</h3>
							<p className='mt-2 text-muted-foreground text-xs leading-relaxed'>
								Setiap LHU dan SOP dilengkapi kode QR kriptografis yang dapat dipindai oleh masyarakat,
								pembeli, dan mitra usaha untuk memverifikasi keabsahan data mutu air.
							</p>
						</CardContent>
					</Card>

					{/* Card 3 */}
					<Card className='border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-md'>
						<CardContent className='p-6'>
							<div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'>
								<TrendingUp className='size-6' />
							</div>
							<h3 className='font-bold font-heading text-base text-foreground'>
								Deteksi Dini & Tren Kualitas Air
							</h3>
							<p className='mt-2 text-muted-foreground text-xs leading-relaxed'>
								Visualisasi grafik fluktuasi parameter berkala per kolam budidaya memberikan sinyal
								peringatan dini sebelum terjadinya penurunan mutu yang memicu kematian biota.
							</p>
						</CardContent>
					</Card>

					{/* Card 4 */}
					<Card className='border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-md'>
						<CardContent className='p-6'>
							<div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
								<FileText className='size-6' />
							</div>
							<h3 className='font-bold font-heading text-base text-foreground'>
								Penerbitan LHU Resmi Sekali Klik
							</h3>
							<p className='mt-2 text-muted-foreground text-xs leading-relaxed'>
								Mencetak Lembar Hasil Uji berstandar format kedinasan lengkap dengan tanda tangan pejabat
								pengesahan dan saran rekomendasi perbaikan kolam secara instan.
							</p>
						</CardContent>
					</Card>

					{/* Card 5 */}
					<Card className='border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-md'>
						<CardContent className='p-6'>
							<div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400'>
								<Layers className='size-6' />
							</div>
							<h3 className='font-bold font-heading text-base text-foreground'>
								Manajemen Dokumen Mutu Terstruktur
							</h3>
							<p className='mt-2 text-muted-foreground text-xs leading-relaxed'>
								Hirarki dokumen baku berbasis tingkatan: Tingkat 1 (Pedoman), Tingkat 2 (SOP Umum), Tingkat
								3 (Instruksi Kerja Spesifik Parameter), dan Tingkat 4 (Formulir).
							</p>
						</CardContent>
					</Card>

					{/* Card 6 */}
					<Card className='border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-md'>
						<CardContent className='p-6'>
							<div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400'>
								<FileSpreadsheet className='size-6' />
							</div>
							<h3 className='font-bold font-heading text-base text-foreground'>
								Rekapitulasi Tahunan Pimpinan
							</h3>
							<p className='mt-2 text-muted-foreground text-xs leading-relaxed'>
								Menyusun matriks agregasi tahunan kualitas air per Pokdakan dan kecamatan untuk mendukung
								kebijakan berbasis bukti (evidence-based policy) Dinas Perikanan.
							</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* ========================================================================= */}
			{/* 5. ALUR KERJA SISTEM */}
			{/* ========================================================================= */}
			<section className='border-border/60 border-t bg-muted/15 py-20' id='alur-kerja'>
				<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
					<div className='text-center'>
						<Badge className='px-3 py-1 text-xs' variant='secondary'>
							SOP Standar Pengujian
						</Badge>
						<h2 className='mt-3 font-extrabold font-heading text-2xl text-foreground tracking-tight sm:text-4xl'>
							Alur Kerja Terpadu RADAR
						</h2>
						<p className='mx-auto mt-3 max-w-xl text-muted-foreground text-sm'>
							4 langkah sistematis dari pengambilan sampel lapangan hingga penerbitan laporan resmi.
						</p>
					</div>

					<div className='mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
						{/* Step 1 */}
						<div className='relative flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-xs'>
							<span className='flex size-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground text-xs'>
								01
							</span>
							<div className='mt-4 flex items-center gap-2'>
								<MapPin className='size-4 text-primary' />
								<h3 className='font-bold font-heading text-sm'>Sampling Lapangan</h3>
							</div>
							<p className='mt-2 text-muted-foreground text-xs leading-relaxed'>
								Petugas mendatangi kolam Pokdakan, mencatat koordinat lokasi dan kondisi visual air kolam.
							</p>
						</div>

						{/* Step 2 */}
						<div className='relative flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-xs'>
							<span className='flex size-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground text-xs'>
								02
							</span>
							<div className='mt-4 flex items-center gap-2'>
								<TestTube2 className='size-4 text-primary' />
								<h3 className='font-bold font-heading text-sm'>Pengujian & Input IK</h3>
							</div>
							<p className='mt-2 text-muted-foreground text-xs leading-relaxed'>
								Pengujian parameter in-situ / lab terhubung langsung ke Instruksi Kerja (IK) SNI terkait.
							</p>
						</div>

						{/* Step 3 */}
						<div className='relative flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-xs'>
							<span className='flex size-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground text-xs'>
								03
							</span>
							<div className='mt-4 flex items-center gap-2'>
								<ShieldCheck className='size-4 text-primary' />
								<h3 className='font-bold font-heading text-sm'>Evaluasi Otomatis</h3>
							</div>
							<p className='mt-2 text-muted-foreground text-xs leading-relaxed'>
								Sistem mengkalkulasi kepatuhan ambang batas regulasi Permen KKP dan menghasilkan status
								kelayakan.
							</p>
						</div>

						{/* Step 4 */}
						<div className='relative flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-xs'>
							<span className='flex size-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground text-xs'>
								04
							</span>
							<div className='mt-4 flex items-center gap-2'>
								<QrCode className='size-4 text-primary' />
								<h3 className='font-bold font-heading text-sm'>Penerbitan & QR LHU</h3>
							</div>
							<p className='mt-2 text-muted-foreground text-xs leading-relaxed'>
								Laporan Hasil Uji (LHU) disahkan dan siap dicetak atau diverifikasi publik melalui scan QR.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ========================================================================= */}
			{/* 6. STANDAR BAKU MUTU SECTION */}
			{/* ========================================================================= */}
			<section className='mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8' id='baku-mutu'>
				<div className='flex flex-col items-start justify-between gap-6 md:flex-row md:items-end'>
					<div>
						<Badge className='px-3 py-1 text-xs' variant='secondary'>
							Landasan Regulasi Resmi
						</Badge>
						<h2 className='mt-3 font-extrabold font-heading text-2xl text-foreground tracking-tight sm:text-4xl'>
							Standar Parameter Mutu Air
						</h2>
						<p className='mt-2 text-muted-foreground text-sm'>
							Parameter kritis yang dipantau secara berkala untuk menjamin produktivitas dan kelestarian
							biota budidaya.
						</p>
					</div>

					<Link href='/login'>
						<Button className='cursor-pointer gap-1.5 text-xs' variant='outline'>
							<span>Lihat Semua Parameter</span>
							<ChevronRight className='size-3.5' />
						</Button>
					</Link>
				</div>

				<div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					<div className='flex items-start gap-3.5 rounded-xl border border-border/70 bg-card p-4'>
						<div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600'>
							<Droplets className='size-4' />
						</div>
						<div>
							<h3 className='font-bold text-foreground text-sm'>Oksigen Terlarut (DO)</h3>
							<p className='text-muted-foreground text-xs'>Ambang: ≥ 3.00 mg/L</p>
							<p className='mt-1 text-[11px] text-muted-foreground/80'>
								Kritis untuk respirasi dan metabolisme ikan.
							</p>
						</div>
					</div>

					<div className='flex items-start gap-3.5 rounded-xl border border-border/70 bg-card p-4'>
						<div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600'>
							<Activity className='size-4' />
						</div>
						<div>
							<h3 className='font-bold text-foreground text-sm'>Derajat Keasaman (pH)</h3>
							<p className='text-muted-foreground text-xs'>Ambang: 7.50 – 8.50</p>
							<p className='mt-1 text-[11px] text-muted-foreground/80'>
								Menjaga keseimbangan asam basa media air.
							</p>
						</div>
					</div>

					<div className='flex items-start gap-3.5 rounded-xl border border-border/70 bg-card p-4'>
						<div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600'>
							<Clock className='size-4' />
						</div>
						<div>
							<h3 className='font-bold text-foreground text-sm'>Suhu Air Kolam</h3>
							<p className='text-muted-foreground text-xs'>Ambang: 28.00 – 32.00 °C</p>
							<p className='mt-1 text-[11px] text-muted-foreground/80'>
								Mempengaruhi nafsu makan & laju pertumbuhan.
							</p>
						</div>
					</div>

					<div className='flex items-start gap-3.5 rounded-xl border border-border/70 bg-card p-4'>
						<div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600'>
							<Scale className='size-4' />
						</div>
						<div>
							<h3 className='font-bold text-foreground text-sm'>Amonia Bebas (NH₃-N)</h3>
							<p className='text-muted-foreground text-xs'>Ambang: ≤ 0.01 mg/L</p>
							<p className='mt-1 text-[11px] text-muted-foreground/80'>
								Senyawa toksik hasil metabolisme dan sisa pakan.
							</p>
						</div>
					</div>

					<div className='flex items-start gap-3.5 rounded-xl border border-border/70 bg-card p-4'>
						<div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600'>
							<Layers className='size-4' />
						</div>
						<div>
							<h3 className='font-bold text-foreground text-sm'>Alkalinitas</h3>
							<p className='text-muted-foreground text-xs'>Ambang: 100 – 250 mg/L</p>
							<p className='mt-1 text-[11px] text-muted-foreground/80'>
								Kapasitas penyangga (buffer) kestabilan pH kolam.
							</p>
						</div>
					</div>

					<div className='flex items-start gap-3.5 rounded-xl border border-border/70 bg-card p-4'>
						<div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600'>
							<ShieldCheck className='size-4' />
						</div>
						<div>
							<h3 className='font-bold text-foreground text-sm'>Salinitas Air</h3>
							<p className='text-muted-foreground text-xs'>Ambang: 5.00 – 40.00 ppt</p>
							<p className='mt-1 text-[11px] text-muted-foreground/80'>
								Disesuaikan dengan komoditas ikan/udang budidaya.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ========================================================================= */}
			{/* 7. BOTTOM CTA BANNER */}
			{/* ========================================================================= */}
			<section className='mx-auto mb-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 p-8 text-white shadow-xl sm:p-12'>
					<div className='relative z-10 max-w-2xl'>
						<h2 className='font-black font-heading text-2xl tracking-tight sm:text-4xl'>
							Tingkatkan Kepastian Mutu Air Budidaya Perikanan Lembata
						</h2>
						<p className='mt-3 text-sm text-white/90 leading-relaxed'>
							Masuk ke portal petugas untuk mencatat pengujian lapangan, mengelola master baku mutu, atau
							verifikasi publik dokumen LHU.
						</p>
						<div className='mt-6 flex flex-wrap gap-3'>
							<Link href='/login'>
								<Button
									className='cursor-pointer bg-white font-semibold text-blue-700 shadow-md hover:bg-white/90'
									size='lg'
								>
									<span>Masuk Portal Petugas</span>
									<ArrowRight className='size-4' />
								</Button>
							</Link>
							<Link href='/verifikasi/preview'>
								<Button
									className='cursor-pointer border-white/40 bg-white/10 text-white backdrop-blur-xs hover:bg-white/20'
									size='lg'
									variant='outline'
								>
									<QrCode className='size-4' />
									<span>Cek Verifikasi QR</span>
								</Button>
							</Link>
						</div>
					</div>

					{/* Decorative Shape */}
					<div className='pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-white/10 blur-2xl' />
				</div>
			</section>

			{/* ========================================================================= */}
			{/* 8. FOOTER */}
			{/* ========================================================================= */}
			<footer className='w-full border-border/80 border-t bg-muted/20 py-8 text-center text-muted-foreground text-xs'>
				<div className='mx-auto max-w-7xl space-y-2 px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-center gap-2'>
						<Image
							alt='Logo Lembata'
							className='h-5 w-auto object-contain'
							height={20}
							src={APP_CONFIG.logo.kabupaten}
							width={16}
						/>
						<span className='font-bold text-foreground'>
							{APP_CONFIG.name} — {APP_CONFIG.institution.name}
						</span>
					</div>
					<p>{APP_CONFIG.fullName}</p>
					<p className='pt-1 font-medium text-muted-foreground'>
						{APP_CONFIG.author.copyrightText} • {APP_CONFIG.author.credit}
					</p>
				</div>
			</footer>
		</div>
	);
}
