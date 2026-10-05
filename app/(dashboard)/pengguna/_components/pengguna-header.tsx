import { Plus, Users2 } from 'lucide-react';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';

type PenggunaHeaderProps = { onOpenAdd: () => void };

export function PenggunaHeader({ onOpenAdd }: PenggunaHeaderProps) {
	return (
		<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
			<div>
				<Badge
					className='mb-1.5 gap-1.5 px-2.5 font-semibold uppercase tracking-wider'
					variant='secondary'
				>
					<Users2 className='size-3' />
					<span>Manajemen Akses & Keamanan</span>
				</Badge>
				<h1 className='font-bold font-heading text-2xl text-foreground tracking-tight'>
					Kelola Akun & Hak Akses Pengguna
				</h1>
				<p className='mt-1 text-muted-foreground text-xs'>
					Daftarkan akun petugas dinas, ubah peran wewenang (Role-Based Access Control), dan kelola
					status keaktifan login.
				</p>
			</div>

			<Button className='cursor-pointer gap-2 self-start shadow-xs sm:self-auto' onClick={onOpenAdd}>
				<Plus className='size-4' />
				<span>Tambah Pengguna Baru</span>
			</Button>
		</div>
	);
}
