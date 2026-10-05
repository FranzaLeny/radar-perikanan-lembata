import { TrendingUp } from 'lucide-react';

import { Badge } from '@/components/shadcn/badge';

export function TrenHeader() {
	return (
		<div>
			<Badge
				className='mb-1.5 gap-1.5 px-2.5 py-0.5 font-semibold text-xs uppercase tracking-wider'
				variant='secondary'
			>
				<TrendingUp className='size-3' />
				<span>Analisis & Visualisasi Tren</span>
			</Badge>
			<h1 className='font-bold font-heading text-2xl text-foreground tracking-tight'>
				Visualisasi Tren Mutu Air Lapangan
			</h1>
			<p className='mt-1 text-muted-foreground text-xs'>
				Pantau perubahan kualitas air dari waktu ke waktu per parameter terhadap ambang batas baku mutu
				resmi.
			</p>
		</div>
	);
}
