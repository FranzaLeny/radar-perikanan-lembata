import { Eye, EyeOff, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu';
import type { LokasiItem } from '../types';

type LokasiRowActionsProps = {
	item: LokasiItem;
	onEdit: (item: LokasiItem) => void;
	onToggleAktif: (item: LokasiItem) => void;
	onDelete: (item: LokasiItem) => void;
};

export function LokasiRowActions({ item, onEdit, onToggleAktif, onDelete }: LokasiRowActionsProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className='inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none'
				title='Menu Aksi'
			>
				<MoreHorizontal className='size-4' />
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => onEdit(item)}>
					<Pencil className='mr-2 size-3.5' />
					Edit Lokasi
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
					Hapus Lokasi
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
