import { BookOpen, TestTube2 } from 'lucide-react';

import { Badge } from '@/components/shadcn/badge';
import { Card } from '@/components/shadcn/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/shadcn/table';
import type { DokumenMutuItem } from '../types';
import { DokumenRowActions } from './dokumen-row-actions';

type DokumenTableProps = {
	items: DokumenMutuItem[];
	searchTerm: string;
	onEdit: (item: DokumenMutuItem) => void;
	onToggleAktif: (item: DokumenMutuItem) => void;
	onDelete: (item: DokumenMutuItem) => void;
};

export function DokumenTable({
	items,
	searchTerm,
	onEdit,
	onToggleAktif,
	onDelete
}: DokumenTableProps) {
	return (
		<Card>
			<div className='overflow-x-auto'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted/40 hover:bg-muted/40'>
							<TableHead className='w-28 text-xs font-semibold'>Kode Dokumen</TableHead>
							<TableHead className='w-36 text-xs font-semibold'>Kategori</TableHead>
							<TableHead className='text-xs font-semibold'>Judul & Spesifikasi Metode</TableHead>
							<TableHead className='w-20 text-center text-xs font-semibold'>Versi</TableHead>
							<TableHead className='w-24 text-center text-xs font-semibold'>Status</TableHead>
							<TableHead className='w-24 text-right text-xs font-semibold'>Aksi</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.length === 0 ? (
							<TableRow>
								<TableCell className='text-muted-foreground py-10 text-center text-xs' colSpan={6}>
									{searchTerm ? (
										<p>Tidak ada dokumen mutu yang cocok dengan &ldquo;{searchTerm}&rdquo;.</p>
									) : (
										<p>Belum ada dokumen mutu pada kategori ini.</p>
									)}
								</TableCell>
							</TableRow>
						) : (
							items.map((item) => {
								const isIK =
									item.kategoriDokumen?.kode_kategori === 'IK' ||
									item.kode_ik.startsWith('IK-') ||
									Boolean(item.parameter_uji);

								return (
									<TableRow className='hover:bg-muted/30' key={item.id}>
										<TableCell className='text-foreground text-xs font-bold'>{item.kode_ik}</TableCell>
										<TableCell>
											<Badge
												className={
													isIK
														? 'border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
														: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
												}
												variant='secondary'
											>
												{item.kategoriDokumen?.nama_kategori || item.kategori || 'Dokumen Mutu'}
											</Badge>
										</TableCell>
										<TableCell className='text-xs'>
											<div className='space-y-1'>
												<p className='text-foreground leading-snug font-medium'>{item.judul}</p>

												{/* Khusus IK: Tampilkan Parameter & Metode Pengujian Resmi */}
												{isIK ? (
													<div className='flex flex-wrap items-center gap-1.5 pt-0.5'>
														{item.parameter_uji && (
															<Badge
																className='border-primary/20 bg-primary/5 text-primary gap-1 text-[11px]'
																variant='outline'
															>
																<TestTube2 className='size-2.5' />
																<span>
																	Parameter: <strong>{item.parameter_uji}</strong>
																</span>
															</Badge>
														)}
														{item.metode_pengujian && (
															<Badge
																className='bg-muted/60 text-muted-foreground gap-1 text-[11px]'
																variant='outline'
															>
																<BookOpen className='size-2.5' />
																<span>{item.metode_pengujian}</span>
															</Badge>
														)}
													</div>
												) : item.deskripsi ? (
													<p className='text-muted-foreground line-clamp-1 text-[11px]'>{item.deskripsi}</p>
												) : null}
											</div>
										</TableCell>
										<TableCell className='text-center text-xs'>
											<Badge className='text-[11px]' variant='outline'>
												v{item.versi}
											</Badge>
										</TableCell>
										<TableCell className='text-center'>
											<Badge
												className={`text-[10px] font-semibold ${
													item.aktif !== false
														? 'border-emerald-500/20 bg-emerald-600/15 text-emerald-700 dark:text-emerald-400'
														: 'text-muted-foreground'
												}`}
												variant={item.aktif !== false ? 'default' : 'outline'}
											>
												{item.aktif !== false ? 'Berlaku' : 'Nonaktif'}
											</Badge>
										</TableCell>
										<TableCell className='text-right'>
											<DokumenRowActions
												item={item}
												onDelete={onDelete}
												onEdit={onEdit}
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
