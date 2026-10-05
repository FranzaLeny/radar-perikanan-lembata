import { Compass, Fish } from 'lucide-react';

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
import type { LokasiItem } from '../types';
import { LokasiRowActions } from './lokasi-row-actions';

type LokasiTableProps = {
	items: LokasiItem[];
	searchTerm: string;
	onClearSearch: () => void;
	onEdit: (item: LokasiItem) => void;
	onToggleAktif: (item: LokasiItem) => void;
	onDelete: (item: LokasiItem) => void;
};

export function LokasiTable({
	items,
	searchTerm,
	onClearSearch,
	onEdit,
	onToggleAktif,
	onDelete
}: LokasiTableProps) {
	return (
		<Card>
			<div className='overflow-x-auto'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted/40 hover:bg-muted/40'>
							<TableHead className='font-semibold text-xs'>Nama Pokdakan</TableHead>
							<TableHead className='font-semibold text-xs'>Penanggung Jawab / Pemilik</TableHead>
							<TableHead className='font-semibold text-xs'>Wilayah (Kec./Desa)</TableHead>
							<TableHead className='font-semibold text-xs'>Komoditas Utama</TableHead>
							<TableHead className='font-semibold text-xs'>Titik Koordinat</TableHead>
							<TableHead className='font-semibold text-xs'>Status</TableHead>
							<TableHead className='text-right font-semibold text-xs'>Aksi</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.length === 0 ? (
							<TableRow>
								<TableCell className='py-8 text-center text-muted-foreground text-xs' colSpan={7}>
									{searchTerm ? (
										<div className='space-y-1.5'>
											<p>Tidak ada lokasi yang cocok dengan pencarian &ldquo;{searchTerm}&rdquo;.</p>
											<Button className='cursor-pointer' onClick={onClearSearch} size='xs' variant='outline'>
												Kosongkan Pencarian
											</Button>
										</div>
									) : (
										<p>Belum ada data lokasi kolam dalam kategori ini.</p>
									)}
								</TableCell>
							</TableRow>
						) : (
							items.map((item) => (
								<TableRow
									className={`transition-colors hover:bg-muted/30 ${
										!item.aktif ? 'bg-muted/15 opacity-65' : ''
									}`}
									key={item.id}
								>
									<TableCell className='font-semibold text-foreground text-xs'>
										{item.nama_pokdakan}
									</TableCell>
									<TableCell className='font-medium text-muted-foreground text-xs'>{item.pemilik}</TableCell>
									<TableCell className='text-xs'>
										<div className='font-medium text-foreground'>{item.kecamatan}</div>
										<div className='text-muted-foreground text-xs'>Desa {item.desa}</div>
									</TableCell>
									<TableCell className='text-xs'>
										<Badge className='font-normal' variant='secondary'>
											<Fish className='size-3 text-muted-foreground' />
											{item.komoditas_ikan || 'Campuran'}
										</Badge>
									</TableCell>
									<TableCell className='text-xs'>
										{item.titik_koordinat ? (
											<a
												className='inline-flex items-center gap-1 text-foreground text-xs hover:underline'
												href={`https://maps.google.com/?q=${item.titik_koordinat}`}
												rel='noreferrer'
												target='_blank'
												title='Buka di Google Maps'
											>
												<Compass className='size-3.5 text-muted-foreground' />
												<span>{item.titik_koordinat}</span>
											</a>
										) : (
											<span className='text-muted-foreground text-xs'>-</span>
										)}
									</TableCell>
									<TableCell className='text-xs'>
										<Badge
											className={`font-semibold text-[10px] ${
												item.aktif
													? 'border-emerald-500/20 bg-emerald-600/15 text-emerald-700 dark:text-emerald-400'
													: 'text-muted-foreground'
											}`}
											variant={item.aktif ? 'default' : 'outline'}
										>
											{item.aktif ? 'Aktif' : 'Nonaktif'}
										</Badge>
									</TableCell>
									<TableCell className='text-right'>
										<LokasiRowActions
											item={item}
											onDelete={onDelete}
											onEdit={onEdit}
											onToggleAktif={onToggleAktif}
										/>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</Card>
	);
}
