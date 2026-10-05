import {
	Archive,
	FileCheck2,
	FileEdit,
	MoreHorizontal,
	Printer,
	RotateCcw,
	Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/shadcn/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu';
import type { UjiLaporanItem } from '../types';

type LaporanRowActionsProps = {
	item: UjiLaporanItem;
	onUpdateStatus: (item: UjiLaporanItem, newStatus: 'draft' | 'final' | 'arsip') => void;
	onDelete: (item: UjiLaporanItem) => void;
};

export function LaporanRowActions({ item, onUpdateStatus, onDelete }: LaporanRowActionsProps) {
	const router = useRouter();
	const currentStatus = item.status || 'draft';
	const isDraft = currentStatus === 'draft';
	const isFinal = currentStatus === 'final';
	const isArsip = currentStatus === 'arsip';

	return (
		<div className='flex items-center justify-end gap-1.5'>
			<Link href={`/laporan/${item.id}/cetak`}>
				<Button className='h-7 cursor-pointer gap-1 px-2' size='xs'>
					<Printer className='size-3' />
					<span className='hidden sm:inline'>Cetak</span>
				</Button>
			</Link>

			<DropdownMenu>
				<DropdownMenuTrigger
					className='inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none'
					title='Menu Aksi'
				>
					<MoreHorizontal className='size-4' />
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuItem
						className='cursor-pointer'
						onClick={() => router.push(`/laporan/${item.id}/cetak`)}
					>
						<Printer className='mr-2 size-3.5' />
						Cetak Lembar LHU
					</DropdownMenuItem>

					{isDraft && (
						<DropdownMenuItem
							className='cursor-pointer'
							onClick={() => router.push(`/uji-kualitas/edit/${item.id}`)}
						>
							<FileEdit className='mr-2 size-3.5 text-blue-600' />
							Edit Data Uji (Draft)
						</DropdownMenuItem>
					)}

					<DropdownMenuSeparator />

					{isDraft && (
						<DropdownMenuItem onClick={() => onUpdateStatus(item, 'final')}>
							<FileCheck2 className='mr-2 size-3.5 text-emerald-600' />
							Finalkan Dokumen
						</DropdownMenuItem>
					)}

					{isFinal && (
						<>
							<DropdownMenuItem onClick={() => onUpdateStatus(item, 'arsip')}>
								<Archive className='mr-2 size-3.5 text-amber-600' />
								Arsipkan Dokumen
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onUpdateStatus(item, 'draft')}>
								<RotateCcw className='mr-2 size-3.5 text-blue-600' />
								Kembalikan ke Draft
							</DropdownMenuItem>
						</>
					)}

					{isArsip && (
						<DropdownMenuItem onClick={() => onUpdateStatus(item, 'final')}>
							<RotateCcw className='mr-2 size-3.5 text-emerald-600' />
							Kembalikan ke Final
						</DropdownMenuItem>
					)}

					{isDraft && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => onDelete(item)} variant='destructive'>
								<Trash2 className='mr-2 size-3.5' />
								Hapus Laporan (Draft)
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
