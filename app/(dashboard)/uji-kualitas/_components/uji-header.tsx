import { Plus, TestTube2 } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';

export function UjiHeader() {
	return (
		<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
			<div>
				<Badge
					className='mb-1.5 gap-1.5 px-2.5 font-semibold uppercase tracking-wider'
					variant='secondary'
				>
					<TestTube2 className='size-3' />
					<span>Pengujian Mutu Air</span>
				</Badge>
				<h1 className='font-bold font-heading text-2xl text-foreground tracking-tight'>
					Log & Riwayat Pengujian Kualitas Air
				</h1>
				<p className='mt-1 text-muted-foreground text-xs'>
					Daftar hasil uji lapangan dan laboratorium dengan evaluasi otomatis kesimpulan mutu air kolam.
				</p>
			</div>

			<Link href='/uji-kualitas/input'>
				<Button className='cursor-pointer gap-2 self-start shadow-xs sm:self-auto'>
					<Plus className='size-4' />
					<span>Input Hasil Uji Baru</span>
				</Button>
			</Link>
		</div>
	);
}
