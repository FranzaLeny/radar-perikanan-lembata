import { Shield, ShieldAlert, ShieldCheck, UserCheck } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/shadcn/avatar';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Card } from '@/components/shadcn/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/shadcn/table';
import type { UserItem } from '../types';
import { PenggunaRowActions } from './pengguna-row-actions';

type PenggunaTableProps = {
	users: UserItem[];
	currentUserId: string;
	searchTerm: string;
	onClearSearch: () => void;
	onOpenEditCredentials: (u: UserItem) => void;
	onOpenEditRole: (u: UserItem) => void;
	onToggleBan: (u: UserItem) => void;
	onDelete: (u: UserItem) => void;
};

export function PenggunaTable({
	users,
	currentUserId,
	searchTerm,
	onClearSearch,
	onOpenEditCredentials,
	onOpenEditRole,
	onToggleBan,
	onDelete
}: PenggunaTableProps) {
	const getRoleBadge = (role: string) => {
		switch (role) {
			case 'admin':
				return (
					<Badge className='gap-1 border-rose-500/30 bg-rose-500/15 font-semibold text-[11px] text-rose-700 dark:text-rose-400'>
						<ShieldAlert className='size-3' />
						Administrator
					</Badge>
				);
			case 'pengelola_mutu':
				return (
					<Badge className='gap-1 border-blue-500/30 bg-blue-500/15 font-semibold text-[11px] text-blue-700 dark:text-blue-400'>
						<ShieldCheck className='size-3' />
						Pengelola Mutu
					</Badge>
				);
			case 'kepala_dinas':
				return (
					<Badge className='gap-1 border-purple-500/30 bg-purple-500/15 font-semibold text-[11px] text-purple-700 dark:text-purple-400'>
						<Shield className='size-3' />
						Kepala Dinas
					</Badge>
				);
			default:
				return (
					<Badge className='gap-1 text-[11px] text-muted-foreground' variant='outline'>
						<UserCheck className='size-3' />
						Petugas Lapangan
					</Badge>
				);
		}
	};

	return (
		<Card>
			<div className='overflow-x-auto'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted/40 hover:bg-muted/40'>
							<TableHead className='font-semibold text-xs'>Nama & Email Pengguna</TableHead>
							<TableHead className='font-semibold text-xs'>Peran / Hak Akses</TableHead>
							<TableHead className='font-semibold text-xs'>Status Keaktifan</TableHead>
							<TableHead className='font-semibold text-xs'>Terdaftar</TableHead>
							<TableHead className='font-semibold text-xs'>Penggunaan</TableHead>
							<TableHead className='text-right font-semibold text-xs'>Aksi</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.length === 0 ? (
							<TableRow>
								<TableCell className='py-8 text-center text-muted-foreground text-xs' colSpan={6}>
									{searchTerm ? (
										<div className='space-y-1.5'>
											<p>Tidak ada pengguna yang cocok dengan pencarian &ldquo;{searchTerm}&rdquo;.</p>
											<Button className='cursor-pointer' onClick={onClearSearch} size='xs' variant='outline'>
												Kosongkan Pencarian
											</Button>
										</div>
									) : (
										<p>Belum ada data pengguna dalam kategori ini.</p>
									)}
								</TableCell>
							</TableRow>
						) : (
							users.map((user) => {
								const isSelf = user.id === currentUserId;

								return (
									<TableRow
										className={`transition-colors hover:bg-muted/30 ${
											!user.aktif ? 'bg-muted/15 opacity-60' : ''
										}`}
										key={user.id}
									>
										<TableCell>
											<div className='flex items-center gap-3'>
												<Avatar className='size-8 font-semibold text-xs'>
													<AvatarFallback className='bg-primary/10 text-primary'>
														{user.name
															? user.name
																	.split(' ')
																	.map((n) => n[0])
																	.slice(0, 2)
																	.join('')
																	.toUpperCase()
															: 'U'}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className='flex items-center gap-2'>
														<span className='font-semibold text-foreground text-xs'>{user.name}</span>
														{isSelf && (
															<Badge className='px-1 py-0 font-normal text-[10px]' variant='secondary'>
																Anda
															</Badge>
														)}
													</div>
													<span className='text-[11px] text-muted-foreground'>{user.email}</span>
												</div>
											</div>
										</TableCell>
										<TableCell className='text-xs'>{getRoleBadge(user.role)}</TableCell>
										<TableCell className='text-xs'>
											<Badge
												className={`font-semibold text-[10px] ${
													user.aktif
														? 'border-emerald-500/20 bg-emerald-600/15 text-emerald-700 dark:text-emerald-400'
														: 'text-muted-foreground'
												}`}
												variant={user.aktif ? 'default' : 'outline'}
											>
												{user.aktif ? 'Aktif' : 'Dinonaktifkan'}
											</Badge>
										</TableCell>
										<TableCell className='text-muted-foreground text-xs'>
											{new Date(user.createdAt).toLocaleDateString('id-ID', {
												day: 'numeric',
												month: 'short',
												year: 'numeric'
											})}
										</TableCell>
										<TableCell className='text-xs'>
											{user.isUsed ? (
												<Badge
													className='border-blue-500/20 bg-blue-500/10 text-[10px] text-blue-700 dark:text-blue-300'
													variant='secondary'
												>
													{user.transactionCount} Pengujian
												</Badge>
											) : (
												<span className='text-[11px] text-muted-foreground italic'>Belum Ada</span>
											)}
										</TableCell>
										<TableCell className='text-right'>
											<PenggunaRowActions
												isSelf={isSelf}
												onDelete={onDelete}
												onOpenEditCredentials={onOpenEditCredentials}
												onOpenEditRole={onOpenEditRole}
												onToggleBan={onToggleBan}
												user={user}
											/>
										</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</div>
		</Card>
	);
}
