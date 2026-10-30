import { AlertOctagon, CheckCircle2, FileCheck2, MapPin } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import type { DashboardKpiProps } from '../types';

export function DashboardKpiGrid({
	complianceRate,
	normalCount,
	totalUjiCount,
	criticalCount,
	warningCount,
	totalPokdakan,
	totalIk
}: DashboardKpiProps) {
	return (
		<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
			{/* Card 1: Tingkat Kepatuhan */}
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-muted-foreground text-xs font-medium'>
						Tingkat Kepatuhan Mutu
					</CardTitle>
					<div className='rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400'>
						<CheckCircle2 className='size-4' />
					</div>
				</CardHeader>
				<CardContent>
					<div className='flex items-baseline gap-2'>
						<span className='font-heading text-foreground text-2xl font-bold sm:text-3xl'>
							{complianceRate}%
						</span>
						<span className='text-xs font-medium text-emerald-600 dark:text-emerald-400'>
							Kondisi Normal
						</span>
					</div>
					<p className='text-muted-foreground mt-1 text-xs'>
						{normalCount} dari {totalUjiCount} pengujian dalam batas aman.
					</p>
				</CardContent>
			</Card>

			{/* Card 2: Pengujian Kritis / Melebihi */}
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-muted-foreground text-xs font-medium'>
						Sampel Perlu Perhatian
					</CardTitle>
					<div className='bg-destructive/10 text-destructive rounded-lg p-2'>
						<AlertOctagon className='size-4' />
					</div>
				</CardHeader>
				<CardContent>
					<div className='flex items-baseline gap-2'>
						<span className='font-heading text-foreground text-2xl font-bold sm:text-3xl'>
							{criticalCount + warningCount}
						</span>
						<span className='text-destructive text-xs font-medium'>Sampel Kritis/Waspada</span>
					</div>
					<p className='text-muted-foreground mt-1 text-xs'>
						{criticalCount} Kritis • {warningCount} Peringatan
					</p>
				</CardContent>
			</Card>

			{/* Card 3: Pokdakan Terpantau */}
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-muted-foreground text-xs font-medium'>
						Titik Kolam Pokdakan
					</CardTitle>
					<div className='bg-muted text-foreground rounded-lg p-2'>
						<MapPin className='size-4' />
					</div>
				</CardHeader>
				<CardContent>
					<div className='flex items-baseline gap-2'>
						<span className='font-heading text-foreground text-2xl font-bold sm:text-3xl'>
							{totalPokdakan}
						</span>
						<span className='text-muted-foreground text-xs font-medium'>Kelompok</span>
					</div>
					<p className='text-muted-foreground mt-1 text-xs'>Tersebar di 9 Kecamatan Kabupaten Lembata</p>
				</CardContent>
			</Card>

			{/* Card 4: SOP / IK Aktif */}
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-muted-foreground text-xs font-medium'>
						Instruksi Kerja (IK)
					</CardTitle>
					<div className='bg-muted text-foreground rounded-lg p-2'>
						<FileCheck2 className='size-4' />
					</div>
				</CardHeader>
				<CardContent>
					<div className='flex items-baseline gap-2'>
						<span className='font-heading text-foreground text-2xl font-bold sm:text-3xl'>{totalIk}</span>
						<span className='text-muted-foreground text-xs font-medium'>SOP Terverifikasi</span>
					</div>
					<p className='text-muted-foreground mt-1 text-xs'>Terkoneksi ke sistem QR Code publik</p>
				</CardContent>
			</Card>
		</div>
	);
}
