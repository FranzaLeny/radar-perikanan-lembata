import { desc } from 'drizzle-orm';
import { ArrowRight, FileSpreadsheet, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/shadcn/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { APP_CONFIG } from '@/lib/constants';
import { LaporanTableClient } from './laporan-table-client';

export default async function LaporanHubPage() {
	const allUji = await db.query.ujiKualitasAir.findMany({
		orderBy: [desc(schema.ujiKualitasAir.tanggal_pengambilan)],
		with: { lokasi: true }
	});
	return (
		<div className='space-y-6'>
			{/* Header */}
			<div>
				<div className='mb-1 flex items-center gap-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider'>
					<FileSpreadsheet className='size-4' />
					<span>Modul Pelaporan & Diseminasi</span>
				</div>
				<h1 className='font-bold font-heading text-2xl text-foreground tracking-tight'>
					Pusat Laporan & Rekapitulasi Mutu Air
				</h1>
				<p className='mt-1 text-muted-foreground text-xs'>
					Penerbitan Lembar Hasil Uji (LHU) resmi dan rekapitulasi kepatuhan mutu tahunan untuk{' '}
					{APP_CONFIG.institution.name}.
				</p>
			</div>

			{/* Featured Report Cards */}
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				{/* Card 1: Rekap Tahunan */}
				<Card className='flex flex-col justify-between'>
					<CardHeader>
						<div className='mb-2 flex size-10 items-center justify-center rounded-xl bg-muted text-foreground'>
							<FileSpreadsheet className='size-5' />
						</div>
						<CardTitle className='font-heading text-base'>
							Matriks Rekapitulasi Tahunan Mutu Air (2026)
						</CardTitle>
						<CardDescription className='text-xs leading-relaxed'>
							Tabel matriks kepatuhan kualitas air per Pokdakan per bulan untuk bahan evaluasi kepala dinas
							dan laporan pertanggungjawaban program perikanan budidaya.
						</CardDescription>
					</CardHeader>
					<CardFooter className='pt-2'>
						<Link className='w-full sm:w-auto' href='/laporan/rekap-tahunan'>
							<Button className='w-full gap-2 font-medium sm:w-auto' size='sm'>
								<span>Buka Matriks Rekap Tahunan</span>
								<ArrowRight className='size-3.5' />
							</Button>
						</Link>
					</CardFooter>
				</Card>

				{/* Card 2: Laporan Evaluasi Terkini */}
				<Card className='flex flex-col justify-between'>
					<CardHeader>
						<div className='mb-2 flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'>
							<TrendingUp className='size-5' />
						</div>
						<CardTitle className='font-heading text-base'>Analisis Fluktuasi Parameter</CardTitle>
						<CardDescription className='text-xs leading-relaxed'>
							Lihat visualisasi pergerakan parameter utama (Suhu, pH, DO, Amonia, Nitrit) terhadap batas
							aman regulasi PP No. 22 Tahun 2021.
						</CardDescription>
					</CardHeader>
					<CardFooter className='pt-2'>
						<Link className='w-full sm:w-auto' href='/tren'>
							<Button className='w-full gap-2 font-medium sm:w-auto' size='sm' variant='outline'>
								<span>Buka Analisis Grafik Tren</span>
								<ArrowRight className='size-3.5' />
							</Button>
						</Link>
					</CardFooter>
				</Card>
			</div>

			{/* Tabel Penerbitan LHU Siap Cetak (Interaktif dengan Pencarian Lokasi & Kode Sampel) */}
			<LaporanTableClient initialList={allUji} />
		</div>
	);
}
