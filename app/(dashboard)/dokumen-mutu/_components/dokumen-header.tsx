import { FileCheck2, FolderKanban, Plus } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';

type DokumenHeaderProps = { onOpenAdd: () => void };

export function DokumenHeader({ onOpenAdd }: DokumenHeaderProps) {
	return (
		<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
			<div>
				<Badge
					className='mb-1.5 gap-1.5 px-2.5 font-semibold uppercase tracking-wider'
					variant='secondary'
				>
					<FileCheck2 className='size-3' />
					<span>Standarisasi Laboratorium Mutu</span>
				</Badge>
				<h1 className='font-bold font-heading text-2xl text-foreground tracking-tight'>
					Dokumen Mutu & Instruksi Kerja (IK)
				</h1>
				<p className='mt-1 text-muted-foreground text-xs'>
					Katalog dokumen standarisasi mutu air budidaya: Pedoman Mutu, Prosedur Pelaksanaan, SOP,
					Instruksi Kerja per parameter, dan Formulir resmi.
				</p>
			</div>

			<div className='flex items-center gap-2 self-start sm:self-auto'>
				<Link href='/dokumen-mutu/kategori'>
					<Button className='cursor-pointer gap-1.5 text-xs' size='sm' variant='outline'>
						<FolderKanban className='size-3.5' />
						<span>Kelola Kategori</span>
					</Button>
				</Link>

				<Button className='cursor-pointer gap-1.5 text-xs shadow-xs' onClick={onOpenAdd} size='sm'>
					<Plus className='size-3.5' />
					<span>Tambah Dokumen</span>
				</Button>
			</div>
		</div>
	);
}
