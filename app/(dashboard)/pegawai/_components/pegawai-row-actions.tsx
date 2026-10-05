import { Eye, EyeOff, MoreHorizontal, Pencil, Star, Trash2 } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu';
import type { PegawaiItem } from '../types';

type PegawaiRowActionsProps = {
	item: PegawaiItem;
	onSetPenanggungJawab: (item: PegawaiItem) => void;
	onEdit: (item: PegawaiItem) => void;
	onToggleAktif: (item: PegawaiItem) => void;
	onDelete: (item: PegawaiItem) => void;
};

export function PegawaiRowActions({
	item,
	onSetPenanggungJawab,
	onEdit,
	onToggleAktif,
	onDelete
}: PegawaiRowActionsProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className='inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none'
				title='Menu Aksi'
			>
				<MoreHorizontal className='size-4' />
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{!item.is_penanggungjawab && item.aktif && (
					<DropdownMenuItem onClick={() => onSetPenanggungJawab(item)}>
						<Star className='mr-2 size-3.5 text-amber-500' />
						Jadikan Default Penandatangan
					</DropdownMenuItem>
				)}
				<DropdownMenuItem onClick={() => onEdit(item)}>
					<Pencil className='mr-2 size-3.5' />
					Edit Pegawai
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => onToggleAktif(item)}>
					{item.aktif ? (
						<>
							<EyeOff className='mr-2 size-3.5 text-amber-600' />
							<span>Nonaktifkan</span>
						</>
					) : (
						<>
							<Eye className='mr-2 size-3.5 text-emerald-600' />
							<span>Aktifkan Kembali</span>
						</>
					)}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => onDelete(item)} variant='destructive'>
					<Trash2 className='mr-2 size-3.5' />
					Hapus Pegawai
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
