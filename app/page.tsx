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
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent } from '@/components/shadcn/card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { APP_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
	title: { absolute: `${APP_CONFIG.name} | Rekapitulasi Mutu Air Kolam Budidaya Lembata` },
	description:
		'Instrumen digital terpadu Dinas Perikanan Kabupaten Lembata untuk rekapitulasi data pengujian mutu air kolam budidaya.'
};

export default async function HomePage() {
	'use cache';
	return (
		<div className='bg-background text-foreground selection:bg-primary/20 selection:text-primary relative flex min-h-screen flex-col justify-between overflow-x-hidden'>
			{/* Scenic Illustration Hero Background */}
			<div className='pointer-events-none absolute inset-x-0 top-0 z-0 h-215 overflow-hidden select-none sm:h-235 lg:h-255'>
				<Image
					alt='Ilustrasi Pemandangan Budidaya Lembata'
					className='size-full object-cover object-[center_top]'
					height={720}
					loading='lazy'
					preload={false}
					priority={false}
					quality={100}
					src='/images/hero-bg-lembata.jpg'
					width={1080}
				/>
				{/* Soft luminous center mist to ensure crisp text contrast matching Gambar 2 */}
				<div className='absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_38%,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0.25)_55%,transparent_90%)] dark:bg-[radial-gradient(ellipse_70%_55%_at_50%_38%,rgba(10,15,30,0.5)_0%,rgba(10,15,30,0.2)_55%,transparent_90%)]' />
				{/* Smooth fade transition to content below */}
				<div className='from-background via-background/80 absolute inset-x-0 bottom-0 h-44 bg-linear-to-t to-transparent' />
			</div>

			{/* Ambient Background Glows */}
			<div className='pointer-events-none absolute top-[40%] -right-40 z-0 h-112.5 w-112.5 rounded-full bg-blue-500/10 blur-[140px] dark:bg-blue-600/10' />
			<div className='pointer-events-none absolute top-[70%] -left-40 z-0 h-112.5 w-112.5 rounded-full bg-cyan-500/10 blur-[140px] dark:bg-cyan-600/10' />

			{/* ========================================================================= */}
			{/* 1. NAVBAR */}
			{/* ========================================================================= */}
			<SiteHeader />

			{/* ========================================================================= */}
			{/* 2. HERO SECTION */}
			{/* ========================================================================= */}
			<section className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 pt-12 pb-16 text-center sm:px-6 sm:pt-20 lg:px-8'>
				{/* Top Tagline Badge */}
				<div className='fade-in slide-in-from-top-3 animate-in border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold shadow-xs duration-500'>
					<Sparkles className='text-primary size-3.5' />
					<span>{APP_CONFIG.tagline}</span>
				</div>

				{/* Main Headline */}
				<h1 className='font-heading text-foreground mt-6 max-w-4xl text-3xl leading-[1.15] font-black tracking-tight sm:text-5xl lg:text-6xl'>
					Rekapitulasi & Analisis Data Kualitas Air Kolam Budidaya{' '}
					<span className='bg-linear-to-r from-blue-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-400 dark:to-teal-300'>
						Kabupaten Lembata
					</span>
				</h1>

				{/* Subheadline */}
				<p className='mt-6 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base sm:leading-relaxed dark:text-white'>
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
							className='border-border/80 bg-background/80 w-full cursor-pointer gap-2 backdrop-blur-xs sm:w-auto'
							size='lg'
							variant='outline'
						>
							<QrCode className='text-primary size-4' />
							<span>Verifikasi Dokumen QR</span>
						</Button>
					</Link>
				</div>

				{/* ========================================================================= */}
				{/* LIVE INTERACTIVE PREVIEW CARD */}
				{/* ========================================================================= */}
				<div className='border-border/80 bg-card/80 mt-14 w-full max-w-4xl rounded-2xl border p-4 text-left shadow-xl backdrop-blur-md sm:p-6'>
					<div className='border-border/60 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between'>
						<div className='flex items-center gap-3'>
							<div className='flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400'>
								<Activity className='size-5' />
							</div>
							<div>
								<div className='flex items-center gap-2'>
									<h2 className='font-heading text-foreground text-sm font-bold'>
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
						<div className='border-border/60 bg-muted/20 rounded-xl border p-3'>
							<span className='text-muted-foreground text-[11px]'>Oksigen Terlarut (DO)</span>
							<div className='mt-1 flex items-baseline gap-1'>
								<span className='text-foreground text-lg font-bold'>6.40</span>
								<span className='text-muted-foreground text-[10px]'>mg/L</span>
							</div>
							<div className='mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400'>
								<CheckCircle2 className='size-3' />
								<span>Memenuhi (≥ 3.0)</span>
							</div>
						</div>

						<div className='border-border/60 bg-muted/20 rounded-xl border p-3'>
							<span className='text-muted-foreground text-[11px]'>Derajat Keasaman (pH)</span>
							<div className='mt-1 flex items-baseline gap-1'>
								<span className='text-foreground text-lg font-bold'>7.85</span>
								<span className='text-muted-foreground text-[10px]'>-</span>
							</div>
							<div className='mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400'>
								<CheckCircle2 className='size-3' />
								<span>Optimal (7.5 - 8.5)</span>
							</div>
						</div>

						<div className='border-border/60 bg-muted/20 rounded-xl border p-3'>
							<span className='text-muted-foreground text-[11px]'>Suhu Air Kolam</span>
							<div className='mt-1 flex items-baseline gap-1'>
								<span className='text-foreground text-lg font-bold'>29.50</span>
								<span className='text-muted-foreground text-[10px]'>°C</span>
							</div>
							<div className='mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400'>
								<CheckCircle2 className='size-3' />
								<span>Stabil (28 - 32)</span>
							</div>
						</div>

						<div className='border-border/60 bg-muted/20 rounded-xl border p-3'>
							<span className='text-muted-foreground text-[11px]'>Amonia Bebas (NH₃)</span>
							<div className='mt-1 flex items-baseline gap-1'>
								<span className='text-foreground text-lg font-bold'>0.008</span>
								<span className='text-muted-foreground text-[10px]'>mg/L</span>
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
			<section className='border-border/60 bg-muted/25 border-y py-10'>
				<div className='mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-4 lg:px-8'>
					<div className='text-center'>
						<span className='font-heading text-primary text-2xl font-black sm:text-4xl'>100%</span>
						<p className='text-muted-foreground mt-1 text-xs sm:text-sm'>
							Validasi Regulasi SNI & Permen KKP
						</p>
					</div>
					<div className='text-center'>
						<span className='font-heading text-2xl font-black text-blue-600 sm:text-4xl dark:text-blue-400'>
							Real-time
						</span>
						<p className='text-muted-foreground mt-1 text-xs sm:text-sm'>
							Evaluasi Ambang Batas Lapangan
						</p>
					</div>
					<div className='text-center'>
						<span className='font-heading text-2xl font-black text-cyan-600 sm:text-4xl dark:text-cyan-400'>
							QR Code
						</span>
						<p className='text-muted-foreground mt-1 text-xs sm:text-sm'>
							Otentikasi & Keabsahan Lembar Hasil Uji
						</p>
					</div>
					<div className='text-center'>
						<span className='font-heading text-2xl font-black text-teal-600 sm:text-4xl dark:text-teal-400'>
							9 Kec.
						</span>
						<p className='text-muted-foreground mt-1 text-xs sm:text-sm'>Sentra Kolam Pokdakan Lembata</p>
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
					<h2 className='font-heading text-foreground mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl'>
						Transformasi Digital Pengawasan Mutu Air
					</h2>
					<p className='text-muted-foreground mx-auto mt-3 max-w-2xl text-sm'>
						Dirancang untuk menjawab kebutuhan teknis petugas penguji laboratorium dan petambak perikanan
						di lapangan.
					</p>
				</div>

				<div className='mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{/* Card 1 */}
					<Card className='border-border/70 bg-card/60 hover:border-primary/40 transition-all hover:shadow-md'>
						<CardContent className='p-6'>
							<div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400'>
								<Scale className='size-6' />
							</div>
							<h3 className='font-heading text-foreground text-base font-bold'>
								Validasi Baku Mutu Cerdas
							</h3>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
								Menghubungkan angka pengukuran dengan database ambang batas Permen KKP 75/2016 & PP 22/2021
								secara otomatis, mencegah kesalahan analisis data di lapangan.
							</p>
						</CardContent>
					</Card>

					{/* Card 2 */}
					<Card className='border-border/70 bg-card/60 hover:border-primary/40 transition-all hover:shadow-md'>
						<CardContent className='p-6'>
							<div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400'>
								<QrCode className='size-6' />
							</div>
							<h3 className='font-heading text-foreground text-base font-bold'>
								Keamanan QR Code Anti-Pemalsuan
							</h3>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
								Setiap LHU dan SOP dilengkapi kode QR kriptografis yang dapat dipindai oleh masyarakat,
								pembeli, dan mitra usaha untuk memverifikasi keabsahan data mutu air.
							</p>
						</CardContent>
					</Card>

					{/* Card 3 */}
					<Card className='border-border/70 bg-card/60 hover:border-primary/40 transition-all hover:shadow-md'>
						<CardContent className='p-6'>
							<div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'>
								<TrendingUp className='size-6' />
							</div>
							<h3 className='font-heading text-foreground text-base font-bold'>
								Deteksi Dini & Tren Kualitas Air
							</h3>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
								Visualisasi grafik fluktuasi parameter berkala per kolam budidaya memberikan sinyal
								peringatan dini sebelum terjadinya penurunan mutu yang memicu kematian biota.
							</p>
						</CardContent>
					</Card>

					{/* Card 4 */}
					<Card className='border-border/70 bg-card/60 hover:border-primary/40 transition-all hover:shadow-md'>
						<CardContent className='p-6'>
							<div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
								<FileText className='size-6' />
							</div>
							<h3 className='font-heading text-foreground text-base font-bold'>
								Penerbitan LHU Resmi Sekali Klik
							</h3>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
								Mencetak Lembar Hasil Uji berstandar format kedinasan lengkap dengan tanda tangan pejabat
								pengesahan dan saran rekomendasi perbaikan kolam secara instan.
							</p>
						</CardContent>
					</Card>

					{/* Card 5 */}
					<Card className='border-border/70 bg-card/60 hover:border-primary/40 transition-all hover:shadow-md'>
						<CardContent className='p-6'>
							<div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400'>
								<Layers className='size-6' />
							</div>
							<h3 className='font-heading text-foreground text-base font-bold'>
								Manajemen Dokumen Mutu Terstruktur
							</h3>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
								Hirarki dokumen baku berbasis tingkatan: Tingkat 1 (Pedoman), Tingkat 2 (SOP Umum), Tingkat
								3 (Instruksi Kerja Spesifik Parameter), dan Tingkat 4 (Formulir).
							</p>
						</CardContent>
					</Card>

					{/* Card 6 */}
					<Card className='border-border/70 bg-card/60 hover:border-primary/40 transition-all hover:shadow-md'>
						<CardContent className='p-6'>
							<div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400'>
								<FileSpreadsheet className='size-6' />
							</div>
							<h3 className='font-heading text-foreground text-base font-bold'>
								Rekapitulasi Tahunan Pimpinan
							</h3>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
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
			<section className='border-border/60 bg-muted/15 border-t py-20' id='alur-kerja'>
				<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
					<div className='text-center'>
						<Badge className='px-3 py-1 text-xs' variant='secondary'>
							SOP Standar Pengujian
						</Badge>
						<h2 className='font-heading text-foreground mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl'>
							Alur Kerja Terpadu {APP_CONFIG.name}
						</h2>
						<p className='text-muted-foreground mx-auto mt-3 max-w-xl text-sm'>
							4 langkah sistematis dari pengambilan sampel lapangan hingga penerbitan laporan resmi.
						</p>
					</div>

					<div className='mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
						{/* Step 1 */}
						<div className='border-border/80 bg-card relative flex flex-col rounded-2xl border p-6 shadow-xs'>
							<span className='bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-xs font-bold'>
								01
							</span>
							<div className='mt-4 flex items-center gap-2'>
								<MapPin className='text-primary size-4' />
								<h3 className='font-heading text-sm font-bold'>Sampling Lapangan</h3>
							</div>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
								Petugas mendatangi kolam Pokdakan, mencatat koordinat lokasi dan kondisi visual air kolam.
							</p>
						</div>

						{/* Step 2 */}
						<div className='border-border/80 bg-card relative flex flex-col rounded-2xl border p-6 shadow-xs'>
							<span className='bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-xs font-bold'>
								02
							</span>
							<div className='mt-4 flex items-center gap-2'>
								<TestTube2 className='text-primary size-4' />
								<h3 className='font-heading text-sm font-bold'>Pengujian & Input IK</h3>
							</div>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
								Pengujian parameter in-situ / lab terhubung langsung ke Instruksi Kerja (IK) SNI terkait.
							</p>
						</div>

						{/* Step 3 */}
						<div className='border-border/80 bg-card relative flex flex-col rounded-2xl border p-6 shadow-xs'>
							<span className='bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-xs font-bold'>
								03
							</span>
							<div className='mt-4 flex items-center gap-2'>
								<ShieldCheck className='text-primary size-4' />
								<h3 className='font-heading text-sm font-bold'>Evaluasi Otomatis</h3>
							</div>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
								Sistem mengkalkulasi kepatuhan ambang batas regulasi Permen KKP dan menghasilkan status
								kelayakan.
							</p>
						</div>

						{/* Step 4 */}
						<div className='border-border/80 bg-card relative flex flex-col rounded-2xl border p-6 shadow-xs'>
							<span className='bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-xs font-bold'>
								04
							</span>
							<div className='mt-4 flex items-center gap-2'>
								<QrCode className='text-primary size-4' />
								<h3 className='font-heading text-sm font-bold'>Penerbitan & QR LHU</h3>
							</div>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
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
						<h2 className='font-heading text-foreground mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl'>
							Standar Parameter Mutu Air
						</h2>
						<p className='text-muted-foreground mt-2 text-sm'>
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
					<div className='border-border/70 bg-card flex items-start gap-3.5 rounded-xl border p-4'>
						<div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600'>
							<Droplets className='size-4' />
						</div>
						<div>
							<h3 className='text-foreground text-sm font-bold'>Oksigen Terlarut (DO)</h3>
							<p className='text-muted-foreground text-xs'>Ambang: ≥ 3.00 mg/L</p>
							<p className='text-muted-foreground/80 mt-1 text-[11px]'>
								Kritis untuk respirasi dan metabolisme ikan.
							</p>
						</div>
					</div>

					<div className='border-border/70 bg-card flex items-start gap-3.5 rounded-xl border p-4'>
						<div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600'>
							<Activity className='size-4' />
						</div>
						<div>
							<h3 className='text-foreground text-sm font-bold'>Derajat Keasaman (pH)</h3>
							<p className='text-muted-foreground text-xs'>Ambang: 7.50 – 8.50</p>
							<p className='text-muted-foreground/80 mt-1 text-[11px]'>
								Menjaga keseimbangan asam basa media air.
							</p>
						</div>
					</div>

					<div className='border-border/70 bg-card flex items-start gap-3.5 rounded-xl border p-4'>
						<div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600'>
							<Clock className='size-4' />
						</div>
						<div>
							<h3 className='text-foreground text-sm font-bold'>Suhu Air Kolam</h3>
							<p className='text-muted-foreground text-xs'>Ambang: 28.00 – 32.00 °C</p>
							<p className='text-muted-foreground/80 mt-1 text-[11px]'>
								Mempengaruhi nafsu makan & laju pertumbuhan.
							</p>
						</div>
					</div>

					<div className='border-border/70 bg-card flex items-start gap-3.5 rounded-xl border p-4'>
						<div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600'>
							<Scale className='size-4' />
						</div>
						<div>
							<h3 className='text-foreground text-sm font-bold'>Amonia Bebas (NH₃-N)</h3>
							<p className='text-muted-foreground text-xs'>Ambang: ≤ 0.01 mg/L</p>
							<p className='text-muted-foreground/80 mt-1 text-[11px]'>
								Senyawa toksik hasil metabolisme dan sisa pakan.
							</p>
						</div>
					</div>

					<div className='border-border/70 bg-card flex items-start gap-3.5 rounded-xl border p-4'>
						<div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600'>
							<Layers className='size-4' />
						</div>
						<div>
							<h3 className='text-foreground text-sm font-bold'>Alkalinitas</h3>
							<p className='text-muted-foreground text-xs'>Ambang: 100 – 250 mg/L</p>
							<p className='text-muted-foreground/80 mt-1 text-[11px]'>
								Kapasitas penyangga (buffer) kestabilan pH kolam.
							</p>
						</div>
					</div>

					<div className='border-border/70 bg-card flex items-start gap-3.5 rounded-xl border p-4'>
						<div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600'>
							<ShieldCheck className='size-4' />
						</div>
						<div>
							<h3 className='text-foreground text-sm font-bold'>Salinitas Air</h3>
							<p className='text-muted-foreground text-xs'>Ambang: 5.00 – 40.00 ppt</p>
							<p className='text-muted-foreground/80 mt-1 text-[11px]'>
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
				<div className='relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-cyan-600 to-teal-600 p-8 text-white shadow-xl sm:p-12'>
					<div className='relative z-10 max-w-2xl'>
						<h2 className='font-heading text-2xl font-black tracking-tight sm:text-4xl'>
							Tingkatkan Kepastian Mutu Air Budidaya Perikanan Lembata
						</h2>
						<p className='mt-3 text-sm leading-relaxed text-white/90'>
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
			<SiteFooter />
		</div>
	);
}
