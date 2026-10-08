import { KeyRound, MoreVertical, ShieldCheck, Trash2, UserCheck, UserX } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu';
import type { UserItem } from '../types';

type PenggunaRowActionsProps = {
	user: UserItem;
	isSelf: boolean;
	onOpenEditCredentials: (u: UserItem) => void;
	onOpenEditRole: (u: UserItem) => void;
	onToggleBan: (u: UserItem) => void;
	onDelete: (u: UserItem) => void;
};

export function PenggunaRowActions({
	user,
	isSelf,
	onOpenEditCredentials,
	onOpenEditRole,
	onToggleBan,
	onDelete
}: PenggunaRowActionsProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className='inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none'
				title='Menu Tindakan'
			>
				<MoreVertical className='size-4' />
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-56'>
				<DropdownMenuLabel className='text-xs'>Aksi Pengguna</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => onOpenEditCredentials(user)}>
						<KeyRound className='mr-2 size-3.5 text-sky-500' />
						<span>Ganti Email & Password</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => onOpenEditRole(user)}>
						<ShieldCheck className='mr-2 size-3.5 text-primary' />
						<span>Ubah Wewenang Role</span>
					</DropdownMenuItem>
					{!isSelf && (
						<DropdownMenuItem onClick={() => onToggleBan(user)}>
							{user.aktif ? (
								<>
									<UserX className='mr-2 size-3.5 text-amber-600' />
									<span>Nonaktifkan Akun</span>
								</>
							) : (
								<>
									<UserCheck className='mr-2 size-3.5 text-emerald-600' />
									<span>Aktifkan Kembali</span>
								</>
							)}
						</DropdownMenuItem>
					)}
				</DropdownMenuGroup>
				{!isSelf && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							{user.isUsed ? (
								<DropdownMenuItem
									className='cursor-pointer gap-2 text-muted-foreground text-xs hover:text-foreground'
									onClick={() => onDelete(user)}
								>
									<Trash2 className='size-3.5 text-muted-foreground/60' />
									<div className='flex flex-col text-left'>
										<span className='text-muted-foreground'>Hapus Akun</span>
										<span className='font-normal text-[10px] text-amber-500'>
											Terkunci (Hanya bisa dinonaktifkan)
										</span>
									</div>
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									className='cursor-pointer gap-2 text-destructive text-xs focus:bg-destructive/10 focus:text-destructive'
									onClick={() => onDelete(user)}
									variant='destructive'
								>
									<Trash2 className='mr-2 size-3.5' />
									<span>Hapus Akun</span>
								</DropdownMenuItem>
							)}
						</DropdownMenuGroup>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
