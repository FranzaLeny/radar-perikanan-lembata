import { MapPin, Plus } from 'lucide-react';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';

type LokasiHeaderProps = { onOpenAdd: () => void };

export function LokasiHeader({ onOpenAdd }: LokasiHeaderProps) {
	return (
		<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
			<div>
				<Badge
					className='mb-1.5 gap-1.5 px-2.5 font-semibold uppercase tracking-wider'
					variant='secondary'
				>
					<MapPin className='size-3' />
					<span>Master Data Wilayah</span>
				</Badge>
				<h1 className='font-bold font-heading text-2xl text-foreground tracking-tight'>
					Lokasi Kolam Pembudidaya (Pokdakan)
				</h1>
				<p className='mt-1 text-muted-foreground text-xs'>
					Kelola data kelompok pembudidaya ikan, sebaran titik kolam pemantauan, dan komoditas per
					kecamatan di Kabupaten Lembata.
				</p>
			</div>

			<Button className='cursor-pointer gap-2 self-start shadow-xs sm:self-auto' onClick={onOpenAdd}>
				<Plus className='size-4' />
				<span>Tambah Lokasi Kolam</span>
			</Button>
		</div>
	);
}
