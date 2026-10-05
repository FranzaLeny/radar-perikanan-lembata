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
			<Card className='border-border bg-card shadow-xs'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='font-medium text-muted-foreground text-xs'>
						Tingkat Kepatuhan Mutu
					</CardTitle>
					<div className='rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400'>
						<CheckCircle2 className='size-4' />
					</div>
				</CardHeader>
				<CardContent>
					<div className='flex items-baseline gap-2'>
						<span className='font-bold font-heading text-2xl text-foreground sm:text-3xl'>
							{complianceRate}%
						</span>
						<span className='font-medium text-emerald-600 text-xs dark:text-emerald-400'>
							Kondisi Normal
						</span>
					</div>
					<p className='mt-1 text-muted-foreground text-xs'>
						{normalCount} dari {totalUjiCount} pengujian dalam batas aman.
					</p>
				</CardContent>
			</Card>

			{/* Card 2: Pengujian Kritis / Melebihi */}
			<Card className='border-border bg-card shadow-xs'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='font-medium text-muted-foreground text-xs'>
						Sampel Perlu Perhatian
					</CardTitle>
					<div className='rounded-lg bg-destructive/10 p-2 text-destructive'>
						<AlertOctagon className='size-4' />
					</div>
				</CardHeader>
				<CardContent>
					<div className='flex items-baseline gap-2'>
						<span className='font-bold font-heading text-2xl text-foreground sm:text-3xl'>
							{criticalCount + warningCount}
						</span>
						<span className='font-medium text-destructive text-xs'>Sampel Kritis/Waspada</span>
					</div>
					<p className='mt-1 text-muted-foreground text-xs'>
						{criticalCount} Kritis • {warningCount} Peringatan
					</p>
				</CardContent>
			</Card>

			{/* Card 3: Pokdakan Terpantau */}
			<Card className='border-border bg-card shadow-xs'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='font-medium text-muted-foreground text-xs'>
						Titik Kolam Pokdakan
					</CardTitle>
					<div className='rounded-lg bg-muted p-2 text-foreground'>
						<MapPin className='size-4' />
					</div>
				</CardHeader>
				<CardContent>
					<div className='flex items-baseline gap-2'>
						<span className='font-bold font-heading text-2xl text-foreground sm:text-3xl'>
							{totalPokdakan}
						</span>
						<span className='font-medium text-muted-foreground text-xs'>Kelompok</span>
					</div>
					<p className='mt-1 text-muted-foreground text-xs'>Tersebar di 9 Kecamatan Kabupaten Lembata</p>
				</CardContent>
			</Card>

			{/* Card 4: SOP / IK Aktif */}
			<Card className='border-border bg-card shadow-xs'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='font-medium text-muted-foreground text-xs'>
						Instruksi Kerja (IK)
					</CardTitle>
					<div className='rounded-lg bg-muted p-2 text-foreground'>
						<FileCheck2 className='size-4' />
					</div>
				</CardHeader>
				<CardContent>
					<div className='flex items-baseline gap-2'>
						<span className='font-bold font-heading text-2xl text-foreground sm:text-3xl'>{totalIk}</span>
						<span className='font-medium text-muted-foreground text-xs'>SOP Terverifikasi</span>
					</div>
					<p className='mt-1 text-muted-foreground text-xs'>Terkoneksi ke sistem QR Code publik</p>
				</CardContent>
			</Card>
		</div>
	);
}
