import { History, Thermometer } from 'lucide-react';

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
import type { BakuMutuItem } from '../types';
import { BakuMutuRowActions } from './baku-mutu-row-actions';

type BakuMutuTableProps = {
	items: BakuMutuItem[];
	searchTerm: string;
	onClearSearch: () => void;
	onRevise: (item: BakuMutuItem) => void;
	onToggleAktif: (item: BakuMutuItem) => void;
	onDelete: (item: BakuMutuItem) => void;
};

export function BakuMutuTable({
	items,
	searchTerm,
	onClearSearch,
	onRevise,
	onToggleAktif,
	onDelete
}: BakuMutuTableProps) {
	return (
		<Card>
			<div className='overflow-x-auto'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted/40 hover:bg-muted/40'>
							<TableHead className='font-semibold text-xs'>Parameter Uji</TableHead>
							<TableHead className='font-semibold text-xs'>Satuan</TableHead>
							<TableHead className='font-semibold text-xs'>Ambang Batas Baku Mutu</TableHead>
							<TableHead className='font-semibold text-xs'>Nomor Regulasi (LHU)</TableHead>
							<TableHead className='font-semibold text-xs'>Dasar Regulasi Lengkap</TableHead>
							<TableHead className='font-semibold text-xs'>Status Versi</TableHead>
							<TableHead className='text-right font-semibold text-xs'>Aksi</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.length === 0 ? (
							<TableRow>
								<TableCell className='py-8 text-center text-muted-foreground text-xs' colSpan={7}>
									{searchTerm ? (
										<div className='space-y-1.5'>
											<p>Tidak ada parameter yang cocok dengan pencarian &ldquo;{searchTerm}&rdquo;.</p>
											<Button className='cursor-pointer' onClick={onClearSearch} size='xs' variant='outline'>
												Kosongkan Pencarian
											</Button>
										</div>
									) : (
										<p>Tidak ada parameter pada kategori ini.</p>
									)}
								</TableCell>
							</TableRow>
						) : (
							items.map((item) => {
								const isDinamisSuhu = item.tipe_ambang_batas === 'deviasi_suhu_lingkungan';

								return (
									<TableRow className='hover:bg-muted/30' key={item.id}>
										<TableCell className='font-semibold text-foreground text-xs'>{item.parameter}</TableCell>
										<TableCell className='text-xs'>
											<Badge variant='secondary'>
												{item.satuan}
											</Badge>
										</TableCell>
										<TableCell className='text-xs'>
											{isDinamisSuhu ? (
												<div className='space-y-1'>
													<Badge
														className='gap-1 border-amber-300 bg-amber-50 text-[11px] text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
														variant='outline'
													>
														<Thermometer className='size-3' />
														<span>Deviasi ±{item.deviasi_toleransi || '2.00'}°C dari Suhu Udara</span>
													</Badge>
													{item.nilai_min && item.nilai_max && (
														<p className='text-[11px] text-muted-foreground'>
															Acuan kisaran: {item.nilai_min} – {item.nilai_max} {item.satuan}
														</p>
													)}
												</div>
											) : (
												<span className='font-medium text-foreground'>
													{item.nilai_min !== null && item.nilai_max !== null
														? `${item.nilai_min} – ${item.nilai_max}`
														: item.nilai_min !== null
															? `≥ ${item.nilai_min}`
															: item.nilai_max !== null
																? `≤ ${item.nilai_max}`
																: '-'}
												</span>
											)}
										</TableCell>
										<TableCell className='text-xs'>
											<Badge className='font-semibold' variant='secondary'>
												{item.nomor_regulasi || 'PP No. 22/2021'}
											</Badge>
										</TableCell>
										<TableCell
											className='max-w-xs truncate text-muted-foreground text-xs'
											title={item.dasar_regulasi || ''}
										>
											{item.dasar_regulasi || '-'}
										</TableCell>
										<TableCell>
											{item.aktif ? (
												<Badge
													className='border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
													variant='outline'
												>
													<span className='size-1.5 rounded-full bg-emerald-500' />
													<span>Berlaku</span>
												</Badge>
											) : (
												<Badge variant='secondary'>
													<History className='size-3 text-muted-foreground' />
													<span>Arsip</span>
												</Badge>
											)}
										</TableCell>
										<TableCell className='text-right'>
											<BakuMutuRowActions
												item={item}
												onDelete={onDelete}
												onRevise={onRevise}
												onToggleAktif={onToggleAktif}
											/>
										</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</div>
		</Card>
	);
}
