import { ArrowLeft, Printer, Settings2 } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';

type RekapActionBarProps = {
	tahunAnggaran: number;
	filterTahun: boolean;
	onOpenSettings: () => void;
	onPrint: () => void;
};

export function RekapActionBar({
	tahunAnggaran,
	filterTahun,
	onOpenSettings,
	onPrint
}: RekapActionBarProps) {
	return (
		<div className='flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between print:hidden'>
			<div className='flex items-center gap-3'>
				<Link href='/laporan'>
					<Button className='cursor-pointer gap-1.5 text-xs' size='sm' variant='ghost'>
						<ArrowLeft className='size-4' />
						<span>Kembali ke Laporan</span>
					</Button>
				</Link>
				<div className='hidden h-4 w-px bg-border sm:block' />
				<div className='flex items-center gap-2'>
					<Badge className='font-bold font-mono text-xs' variant='outline'>
						TA {tahunAnggaran}
					</Badge>
					{filterTahun && (
						<Badge className='text-[11px]' variant='secondary'>
							Tersaring Tahun Ini
						</Badge>
					)}
				</div>
			</div>

			<div className='flex items-center gap-2'>
				<Button
					className='cursor-pointer gap-2 text-xs'
					onClick={onOpenSettings}
					size='sm'
					variant='outline'
				>
					<Settings2 className='size-3.5' />
					<span>Pengaturan Cetak</span>
				</Button>

				<Button
					className='cursor-pointer gap-2 font-semibold text-xs shadow-xs'
					onClick={onPrint}
					size='sm'
				>
					<Printer className='size-3.5' />
					<span>Cetak Dokumen (A4 Landscape)</span>
				</Button>
			</div>
		</div>
	);
}
