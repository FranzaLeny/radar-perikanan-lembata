import { ArrowLeft, FolderKanban, Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/shadcn/button';

type KategoriHeaderProps = { onAdd: () => void };

export function KategoriHeader({ onAdd }: KategoriHeaderProps) {
	return (
		<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
			<div>
				<Link href='/dokumen-mutu'>
					<Button
						className='text-muted-foreground hover:text-foreground mb-1 cursor-pointer gap-1.5 text-xs'
						size='sm'
						variant='ghost'
					>
						<ArrowLeft className='size-3.5' />
						<span>Kembali ke Katalog Dokumen Mutu</span>
					</Button>
				</Link>
				<h1 className='font-heading text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight'>
					<FolderKanban className='text-primary size-6' />
					<span>Manajemen Kategori Dokumen Mutu</span>
				</h1>
				<p className='text-muted-foreground mt-1 text-xs'>
					Atur struktur kategori standarisasi mutu seperti Pedoman Mutu (PM), Prosedur Pelaksanaan (PP),
					Standar Operasional Prosedur (SOP), Instruksi Kerja (IK), dan Formulir (FR).
				</p>
			</div>

			<Button
				className='cursor-pointer gap-1.5 self-start text-xs shadow-xs sm:self-auto'
				onClick={onAdd}
				size='sm'
			>
				<Plus className='size-3.5' />
				<span>Tambah Kategori Baru</span>
			</Button>
		</div>
	);
}
