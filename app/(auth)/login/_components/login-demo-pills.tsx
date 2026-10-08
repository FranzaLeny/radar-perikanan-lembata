import { ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';

type LoginDemoPillsProps = { onSelect: (email: string) => void };

export function LoginDemoPills({ onSelect }: LoginDemoPillsProps) {
	return (
		<div className='space-y-2.5 border-border border-t pt-4'>
			<div className='flex items-center gap-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider'>
				<ShieldCheck className='size-3.5 text-muted-foreground' />
				<span>Akses Cepat Akun Demo (Uji Coba)</span>
			</div>

			<div className='grid grid-cols-2 gap-2 text-xs'>
				<Button
					className='group flex h-auto w-full cursor-pointer flex-col items-start justify-start p-2.5 text-left font-normal'
					onClick={() => onSelect('admin@radar.lembata.go.id')}
					type='button'
					variant='outline'
				>
					<div className='flex w-full items-center justify-between font-semibold text-foreground transition-colors group-hover:text-primary'>
						<span>Administrator</span>
						<Badge className='px-1 py-0' variant='outline'>
							ADM
						</Badge>
					</div>
					<p className='mt-0.5 w-full truncate text-muted-foreground text-xs'>admin@radar...</p>
				</Button>

				<Button
					className='group flex h-auto w-full cursor-pointer flex-col items-start justify-start p-2.5 text-left font-normal'
					onClick={() => onSelect('pengelola@radar.lembata.go.id')}
					type='button'
					variant='outline'
				>
					<div className='flex w-full items-center justify-between font-semibold text-foreground transition-colors group-hover:text-primary'>
						<span>Pengelola Mutu</span>
						<Badge className='px-1 py-0' variant='outline'>
							PM
						</Badge>
					</div>
					<p className='mt-0.5 w-full truncate text-muted-foreground text-xs'>pengelola@radar...</p>
				</Button>

				<Button
					className='group flex h-auto w-full cursor-pointer flex-col items-start justify-start p-2.5 text-left font-normal'
					onClick={() => onSelect('petugas@radar.lembata.go.id')}
					type='button'
					variant='outline'
				>
					<div className='flex w-full items-center justify-between font-semibold text-foreground transition-colors group-hover:text-primary'>
						<span>Petugas Lapangan</span>
						<Badge className='px-1 py-0' variant='outline'>
							PL
						</Badge>
					</div>
					<p className='mt-0.5 w-full truncate text-muted-foreground text-xs'>petugas@radar...</p>
				</Button>

				<Button
					className='group flex h-auto w-full cursor-pointer flex-col items-start justify-start p-2.5 text-left font-normal'
					onClick={() => onSelect('kadin@radar.lembata.go.id')}
					type='button'
					variant='outline'
				>
					<div className='flex w-full items-center justify-between font-semibold text-foreground transition-colors group-hover:text-primary'>
						<span>Kepala Dinas</span>
						<Badge className='px-1 py-0' variant='outline'>
							KD
						</Badge>
					</div>
					<p className='mt-0.5 w-full truncate text-muted-foreground text-xs'>kadin@radar...</p>
				</Button>
			</div>
		</div>
	);
}
