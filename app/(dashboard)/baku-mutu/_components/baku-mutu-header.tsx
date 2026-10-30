import { Plus, Scale } from 'lucide-react';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';

type BakuMutuHeaderProps = { onOpenAdd: () => void };

export function BakuMutuHeader({ onOpenAdd }: BakuMutuHeaderProps) {
	return (
		<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
			<div>
				<Badge
					className='mb-1.5 gap-1.5 px-2.5 font-semibold tracking-wider uppercase'
					variant='secondary'
				>
					<Scale className='size-3' />
					<span>Master Regulasi</span>
				</Badge>
				<h1 className='font-heading text-foreground text-2xl font-bold tracking-tight'>
					Master Baku Mutu Air (Berversi)
				</h1>
				<p className='text-muted-foreground mt-1 text-xs'>
					Standar acuan ambang batas kualitas air budidaya. Mendukung ambang dinamis deviasi suhu
					lingkungan, pemisahan nomor regulasi singkat vs lengkap, serta metode uji diatur terpisah pada
					Instruksi Kerja.
				</p>
			</div>

			<Button className='cursor-pointer gap-2 self-start shadow-xs sm:self-auto' onClick={onOpenAdd}>
				<Plus className='size-4' />
				<span>Tambah Parameter Baru</span>
			</Button>
		</div>
	);
}
