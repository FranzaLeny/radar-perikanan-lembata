import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';

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
import type { KategoriItem } from '../../client';

type KategoriTableProps = {
	items: (KategoriItem & { documentCount?: number })[];
	onEdit: (item: KategoriItem) => void;
	onToggleAktif: (item: KategoriItem) => void;
	onDelete: (item: KategoriItem) => void;
};

export function KategoriTable({ items, onEdit, onToggleAktif, onDelete }: KategoriTableProps) {
	return (
		<Card>
			<Table>
				<TableHeader>
					<TableRow className='bg-muted/40 hover:bg-muted/40'>
						<TableHead className='w-20 font-semibold text-xs'>Kode</TableHead>
						<TableHead className='font-semibold text-xs'>Nama Kategori Dokumen</TableHead>
						<TableHead className='w-48 font-semibold text-xs'>Tingkatan / Peran</TableHead>
						<TableHead className='font-semibold text-xs'>Deskripsi / Ruang Lingkup</TableHead>
						<TableHead className='w-24 text-center font-semibold text-xs'>Status</TableHead>
						<TableHead className='w-28 text-right font-semibold text-xs'>Aksi</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((item) => (
						<TableRow className='hover:bg-muted/30' key={item.id}>
							<TableCell className='font-bold text-xs'>
								<Badge variant='secondary'>{item.kode_kategori}</Badge>
							</TableCell>
							<TableCell className='font-semibold text-foreground text-xs'>{item.nama_kategori}</TableCell>
							<TableCell>
								{item.tingkatan === 2 ? (
									<Badge
										className='border-blue-300 bg-blue-50 text-[11px] text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
										variant='outline'
									>
										Tingkat 2 (General / SOP Induk)
									</Badge>
								) : item.tingkatan === 3 ? (
									<Badge
										className='border-purple-300 bg-purple-50 text-[11px] text-purple-800 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300'
										variant='outline'
									>
										Tingkat 3 (Parameter Uji / IK)
									</Badge>
								) : (
									<Badge className='text-[11px] text-muted-foreground' variant='secondary'>
										Tingkat {item.tingkatan} (Arsip)
									</Badge>
								)}
							</TableCell>
							<TableCell className='text-muted-foreground text-xs'>{item.deskripsi || '-'}</TableCell>
							<TableCell className='text-center'>
								{item.aktif ? (
									<Badge
										className='border-emerald-300 bg-emerald-50 text-[11px] text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
										variant='outline'
									>
										Aktif
									</Badge>
								) : (
									<Badge className='text-[11px]' variant='secondary'>
										Nonaktif
									</Badge>
								)}
							</TableCell>
							<TableCell className='text-right'>
								<div className='flex items-center justify-end gap-1'>
									<Button
										className='cursor-pointer'
										onClick={() => onEdit(item)}
										size='icon-xs'
										title='Edit Kategori'
										variant='ghost'
									>
										<Pencil className='size-3.5 text-muted-foreground hover:text-foreground' />
									</Button>
									<Button
										className='cursor-pointer'
										onClick={() => onToggleAktif(item)}
										size='icon-xs'
										title={item.aktif ? 'Nonaktifkan' : 'Aktifkan'}
										variant='ghost'
									>
										{item.aktif ? (
											<EyeOff className='size-3.5 text-amber-600' />
										) : (
											<Eye className='size-3.5 text-emerald-600' />
										)}
									</Button>
									<Button
										className='cursor-pointer text-destructive hover:bg-destructive/10'
										onClick={() => onDelete(item)}
										size='icon-xs'
										title='Hapus Kategori'
										variant='ghost'
									>
										<Trash2 className='size-3.5' />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
	);
}
