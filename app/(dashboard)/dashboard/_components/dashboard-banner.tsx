import { Droplets, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Card } from '@/components/shadcn/card';
import { APP_CONFIG } from '@/lib/constants';

export function DashboardBanner() {
	return (
		<Card className='border-border bg-card p-6 shadow-xs sm:p-8'>
			<div className='relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center'>
				<div className='max-w-2xl'>
					<Badge className='mb-3 gap-1.5 px-3 py-1 font-semibold text-xs' variant='secondary'>
						<Droplets className='size-3.5' />
						<span>{APP_CONFIG.institution.name}</span>
					</Badge>
					<h1 className='font-extrabold font-heading text-2xl text-foreground leading-tight tracking-tight sm:text-3xl'>
						{APP_CONFIG.fullName} ({APP_CONFIG.name})
					</h1>
					<p className='mt-2 text-muted-foreground text-xs leading-relaxed sm:text-sm'>
						Monitoring parameter fisika-kimia kolam perikanan secara terintegrasi dengan validasi otomatis
						ambang batas baku mutu dan ketertelusuran QR Code.
					</p>
				</div>

				<div className='flex shrink-0 flex-wrap gap-3 sm:flex-col'>
					<Link href='/uji-kualitas/input'>
						<Button className='cursor-pointer gap-2 shadow-xs'>
							<Plus className='size-4' />
							<span>Input Uji Baru</span>
						</Button>
					</Link>
					<Link href='/tren'>
						<Button className='cursor-pointer gap-2' variant='outline'>
							<TrendingUp className='size-4' />
							<span>Analisis Tren</span>
						</Button>
					</Link>
				</div>
			</div>
		</Card>
	);
}
