import { Plus, Users } from 'lucide-react';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';

type PegawaiHeaderProps = { onOpenAdd: () => void };

export function PegawaiHeader({ onOpenAdd }: PegawaiHeaderProps) {
	return (
		<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
			<div>
				<Badge
					className='mb-1.5 gap-1.5 px-2.5 font-semibold uppercase tracking-wider'
					variant='secondary'
				>
					<Users className='size-3' />
					<span>Manajemen SDM & Otoritas</span>
				</Badge>
				<h1 className='font-bold font-heading text-2xl text-foreground tracking-tight'>
					Master Pegawai & Pejabat Penandatangan
				</h1>
				<p className='mt-1 text-muted-foreground text-xs'>
					Kelola data personil laboratorium, petugas penguji lapangan, dan pejabat berwenang
					penandatangan Lembar Hasil Uji (LHU).
				</p>
			</div>

			<Button className='cursor-pointer gap-2 self-start shadow-xs sm:self-auto' onClick={onOpenAdd}>
				<Plus className='size-4' />
				<span>Tambah Pegawai / Pejabat</span>
			</Button>
		</div>
	);
}
