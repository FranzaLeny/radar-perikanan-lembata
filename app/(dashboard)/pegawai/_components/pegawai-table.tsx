import { CheckCircle2, Shield, Star, UserCheck } from 'lucide-react';

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
import type { PegawaiItem } from '../types';
import { PegawaiRowActions } from './pegawai-row-actions';

type PegawaiTableProps = {
	items: PegawaiItem[];
	searchTerm: string;
	onClearSearch: () => void;
	onSetPenanggungJawab: (item: PegawaiItem) => void;
	onEdit: (item: PegawaiItem) => void;
	onToggleAktif: (item: PegawaiItem) => void;
	onDelete: (item: PegawaiItem) => void;
};

export function PegawaiTable({
	items,
	searchTerm,
	onClearSearch,
	onSetPenanggungJawab,
	onEdit,
	onToggleAktif,
	onDelete
}: PegawaiTableProps) {
	const getPeranBadge = (peran: string) => {
		switch (peran) {
			case 'kepala_dinas':
				return (
					<Badge className='gap-1 border-purple-500/30 bg-purple-500/15 font-semibold text-[11px] text-purple-700 dark:text-purple-300'>
						<Shield className='size-3' />
						Kepala Dinas
					</Badge>
				);
			case 'pengelola_mutu':
				return (
					<Badge className='gap-1 border-blue-500/30 bg-blue-500/15 font-semibold text-[11px] text-blue-700 dark:text-blue-300'>
						<UserCheck className='size-3' />
						Pengelola Mutu
					</Badge>
				);
			default:
				return (
					<Badge className='gap-1 text-[11px] text-muted-foreground' variant='outline'>
						<CheckCircle2 className='size-3' />
						Petugas Penguji
					</Badge>
				);
		}
	};

	return (
		<Card>
			<div className='overflow-x-auto'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted/40 hover:bg-muted/40'>
							<TableHead className='font-semibold text-xs'>Nama Pegawai</TableHead>
							<TableHead className='font-semibold text-xs'>NIP</TableHead>
							<TableHead className='font-semibold text-xs'>Jabatan & Pangkat</TableHead>
							<TableHead className='font-semibold text-xs'>Peran Tanda Tangan</TableHead>
							<TableHead className='font-semibold text-xs'>Status</TableHead>
							<TableHead className='text-right font-semibold text-xs'>Aksi</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.length === 0 ? (
							<TableRow>
								<TableCell className='py-8 text-center text-muted-foreground text-xs' colSpan={6}>
									{searchTerm ? (
										<div className='space-y-1.5'>
											<p>Tidak ada pegawai yang cocok dengan pencarian &ldquo;{searchTerm}&rdquo;.</p>
											<Button className='cursor-pointer' onClick={onClearSearch} size='xs' variant='outline'>
												Kosongkan Pencarian
											</Button>
										</div>
									) : (
										<p>Belum ada data pegawai dalam kategori ini.</p>
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
										<div className='flex items-center gap-2'>
											<span>{item.nama}</span>
											{item.is_penanggungjawab && (
												<Badge className='gap-1 border-amber-500/30 bg-amber-500/15 px-1.5 py-0 font-semibold text-[10px] text-amber-700 dark:text-amber-300'>
													<Star className='size-2.5 fill-amber-500 text-amber-500' />
													Default TTD
												</Badge>
											)}
										</div>
									</TableCell>
									<TableCell className='text-muted-foreground text-xs'>{item.nip}</TableCell>
									<TableCell className='text-xs'>
										<div className='font-medium text-foreground'>{item.jabatan}</div>
										{item.pangkat_golongan && (
											<div className='text-[11px] text-muted-foreground'>{item.pangkat_golongan}</div>
										)}
									</TableCell>
									<TableCell className='text-xs'>{getPeranBadge(item.peran_tanda_tangan)}</TableCell>
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
										<PegawaiRowActions
											item={item}
											onDelete={onDelete}
											onEdit={onEdit}
											onSetPenanggungJawab={onSetPenanggungJawab}
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
