import { Plus, TestTube2 } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';

export function UjiHeader() {
	return (
		<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
			<div>
				<Badge
					className='mb-1.5 gap-1.5 px-2.5 font-semibold tracking-wider uppercase'
					variant='secondary'
				>
					<TestTube2 className='size-3' />
					<span>Pengujian Mutu Air</span>
				</Badge>
				<h1 className='font-heading text-foreground text-2xl font-bold tracking-tight'>
					Log & Riwayat Pengujian Kualitas Air
				</h1>
				<p className='text-muted-foreground mt-1 text-xs'>
					Daftar hasil uji lapangan dan laboratorium dengan evaluasi otomatis kesimpulan mutu air kolam.
				</p>
			</div>

			<Link href='/uji-kualitas/input' transitionTypes={['nav-forward']}>
				<Button className='cursor-pointer gap-2 self-start shadow-xs sm:self-auto'>
					<Plus className='size-4' />
					<span>Input Hasil Uji Baru</span>
				</Button>
			</Link>
		</div>
	);
}
