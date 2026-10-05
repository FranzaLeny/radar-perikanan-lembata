import { Eye, EyeOff, FileEdit, MoreHorizontal, Trash2 } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu';
import type { BakuMutuItem } from '../types';

type BakuMutuRowActionsProps = {
	item: BakuMutuItem;
	onRevise: (item: BakuMutuItem) => void;
	onToggleAktif: (item: BakuMutuItem) => void;
	onDelete: (item: BakuMutuItem) => void;
};

export function BakuMutuRowActions({
	item,
	onRevise,
	onToggleAktif,
	onDelete
}: BakuMutuRowActionsProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className='inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none'
				title='Menu Aksi'
			>
				<MoreHorizontal className='size-4' />
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{item.aktif && (
					<DropdownMenuItem onClick={() => onRevise(item)}>
						<FileEdit className='mr-2 size-3.5' />
						Revisi Versi Baru
					</DropdownMenuItem>
				)}
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
					Hapus Permanen
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
