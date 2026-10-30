import { ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import demoUsers from '@/user-demo.json';

type LoginDemoPillsProps = { onSelect: (email: string) => void };

const roleConfig: Record<string, { label: string; badge: string }> = {
	admin: { label: 'Administrator', badge: 'ADM' },
	pengelola_mutu: { label: 'Pengelola Mutu', badge: 'PM' },
	petugas_lapangan: { label: 'Petugas Lapangan', badge: 'PL' },
	kepala_dinas: { label: 'Kepala Dinas', badge: 'KD' }
};

export function LoginDemoPills({ onSelect }: LoginDemoPillsProps) {
	return (
		<div className='border-border space-y-2.5 border-t pt-4'>
			<div className='text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase'>
				<ShieldCheck className='text-muted-foreground size-3.5' />
				<span>Akses Cepat Akun Demo (Uji Coba)</span>
			</div>

			<div className='grid grid-cols-2 gap-2 text-xs'>
				{demoUsers.map((u) => {
					const config = roleConfig[u.role] || { label: u.name, badge: 'USR' };

					return (
						<Button
							className='group flex h-auto w-full cursor-pointer flex-col items-start justify-start p-2.5 text-left font-normal'
							key={u.email}
							onClick={() => onSelect(u.email)}
							type='button'
							variant='outline'
						>
							<div className='text-foreground group-hover:text-primary flex w-full items-center justify-between font-semibold transition-colors'>
								<span className='truncate'>{config.label}</span>
								<Badge className='px-1 py-0' variant='outline'>
									{config.badge}
								</Badge>
							</div>
							<p className='text-muted-foreground mt-0.5 w-full truncate text-xs'>{u.email}</p>
						</Button>
					);
				})}
			</div>
		</div>
	);
}
