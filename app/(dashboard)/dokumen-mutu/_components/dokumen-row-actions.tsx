'use client';

import { ExternalLink, Eye, EyeOff, MoreVertical, Pencil, QrCode, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu';
import type { DokumenMutuItem } from '../types';

type DokumenRowActionsProps = {
	item: DokumenMutuItem;
	onEdit: (item: DokumenMutuItem) => void;
	onToggleAktif: (item: DokumenMutuItem) => void;
	onDelete: (item: DokumenMutuItem) => void;
};

export function DokumenRowActions({
	item,
	onEdit,
	onToggleAktif,
	onDelete
}: DokumenRowActionsProps) {
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className='inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none'
				title='Menu Tindakan'
			>
				<MoreVertical className='size-4' />
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-48'>
				<DropdownMenuLabel className='text-xs'>Tindakan Dokumen</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuItem onClick={() => window.open(item.file_path, '_blank')}>
					<ExternalLink className='mr-2 size-3.5 text-muted-foreground' />
					<span>Lihat Dokumen PDF</span>
				</DropdownMenuItem>

				<DropdownMenuItem onClick={() => router.push(`/dokumen-mutu/${item.id}/cetak-label`)}>
					<QrCode className='mr-2 size-3.5 text-muted-foreground' />
					<span>Cetak Label QR</span>
				</DropdownMenuItem>

				<DropdownMenuItem onClick={() => onEdit(item)}>
					<Pencil className='mr-2 size-3.5 text-muted-foreground' />
					<span>Edit Metadata</span>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem onClick={() => onToggleAktif(item)}>
					{item.aktif !== false ? (
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
					<span>Hapus Permanen</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
