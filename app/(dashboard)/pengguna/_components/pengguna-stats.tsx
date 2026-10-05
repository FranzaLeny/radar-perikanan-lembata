import { ShieldAlert, ShieldCheck, UserCheck } from 'lucide-react';

import { Card, CardContent } from '@/components/shadcn/card';
import type { UserItem } from '../types';

type PenggunaStatsProps = { users: UserItem[] };

export function PenggunaStats({ users }: PenggunaStatsProps) {
	const totalUsers = users.length;
	const adminCount = users.filter((u) => u.role === 'admin').length;
	const mutuCount = users.filter((u) => u.role === 'pengelola_mutu').length;
	const lapanganCount = users.filter((u) => u.role === 'petugas_lapangan').length;

	return (
		<div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
			<Card className='border-border bg-card shadow-xs'>
				<CardContent className='pt-4 pb-3'>
					<p className='font-medium text-muted-foreground text-xs'>Total Akun</p>
					<p className='mt-1 font-bold font-mono text-2xl text-foreground'>{totalUsers}</p>
				</CardContent>
			</Card>
			<Card className='border-border bg-card shadow-xs'>
				<CardContent className='pt-4 pb-3'>
					<div className='flex items-center justify-between'>
						<p className='font-medium text-muted-foreground text-xs'>Administrator</p>
						<ShieldAlert className='size-3.5 text-rose-500' />
					</div>
					<p className='mt-1 font-bold font-mono text-2xl text-rose-600 dark:text-rose-400'>
						{adminCount}
					</p>
				</CardContent>
			</Card>
			<Card className='border-border bg-card shadow-xs'>
				<CardContent className='pt-4 pb-3'>
					<div className='flex items-center justify-between'>
						<p className='font-medium text-muted-foreground text-xs'>Pengelola Mutu</p>
						<ShieldCheck className='size-3.5 text-blue-500' />
					</div>
					<p className='mt-1 font-bold font-mono text-2xl text-blue-600 dark:text-blue-400'>
						{mutuCount}
					</p>
				</CardContent>
			</Card>
			<Card className='border-border bg-card shadow-xs'>
				<CardContent className='pt-4 pb-3'>
					<div className='flex items-center justify-between'>
						<p className='font-medium text-muted-foreground text-xs'>Petugas Lapangan</p>
						<UserCheck className='size-3.5 text-emerald-500' />
					</div>
					<p className='mt-1 font-bold font-mono text-2xl text-emerald-600 dark:text-emerald-400'>
						{lapanganCount}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
