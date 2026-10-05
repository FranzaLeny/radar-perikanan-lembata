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
						className='mb-1 cursor-pointer gap-1.5 text-muted-foreground text-xs hover:text-foreground'
						size='sm'
						variant='ghost'
					>
						<ArrowLeft className='size-3.5' />
						<span>Kembali ke Katalog Dokumen Mutu</span>
					</Button>
				</Link>
				<h1 className='flex items-center gap-2 font-bold font-heading text-2xl text-foreground tracking-tight'>
					<FolderKanban className='size-6 text-primary' />
					<span>Manajemen Kategori Dokumen Mutu</span>
				</h1>
				<p className='mt-1 text-muted-foreground text-xs'>
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
