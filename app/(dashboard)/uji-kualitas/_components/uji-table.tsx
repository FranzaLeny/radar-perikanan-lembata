import { Calendar, ChevronDown, ChevronUp, MapPin, Printer, TestTube2, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { BadgeStatus } from '@/components/badge-status';
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
import type { UjiItem } from '../types';
import { UjiRowDetail } from './uji-row-detail';

type UjiTableProps = {
	items: UjiItem[];
	expandedId: string | null;
	setExpandedId: (id: string | null) => void;
};

export function UjiTable({ items, expandedId, setExpandedId }: UjiTableProps) {
	return (
		<Card className='overflow-hidden border-border bg-card shadow-xs'>
			<div className='overflow-x-auto'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted/40 hover:bg-muted/40'>
							<TableHead className='font-semibold text-xs'>Nomor Sampel</TableHead>
							<TableHead className='font-semibold text-xs'>Waktu Uji & Petugas</TableHead>
							<TableHead className='font-semibold text-xs'>Titik Kolam Pokdakan</TableHead>
							<TableHead className='font-semibold text-xs'>Ringkasan Parameter</TableHead>
							<TableHead className='text-center font-semibold text-xs'>Kesimpulan Mutu</TableHead>
							<TableHead className='text-right font-semibold text-xs'>LHU & Aksi</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.length === 0 ? (
							<TableRow>
								<TableCell className='py-12 text-center text-muted-foreground text-xs' colSpan={6}>
									<TestTube2 className='mx-auto mb-2 size-8 text-muted-foreground/50' />
									<p className='font-semibold text-foreground'>Belum ada data pengujian kualitas air.</p>
									<p className='mt-1 text-muted-foreground text-xs'>
										Klik tombol &ldquo;Input Hasil Uji Baru&rdquo; untuk merekam uji pertama.
									</p>
								</TableCell>
							</TableRow>
						) : (
							items.map((item) => {
								const isExpanded = expandedId === item.id;
								return (
									<React.Fragment key={item.id}>
										<TableRow className='hover:bg-muted/30'>
											<TableCell className='font-mono font-semibold text-foreground text-xs'>
												{item.nomor_sampel}
											</TableCell>
											<TableCell className='text-xs'>
												<div className='flex items-center gap-1.5 font-medium text-foreground'>
													<Calendar className='size-3 text-muted-foreground' />
													{new Date(item.tanggal_pengambilan).toLocaleDateString('id-ID', {
														day: 'numeric',
														month: 'short',
														year: 'numeric',
														hour: '2-digit',
														minute: '2-digit'
													})}
												</div>
												<div className='mt-0.5 flex items-center gap-1 text-muted-foreground text-xs'>
													<User className='size-3' />
													{item.petugas_uji}
												</div>
											</TableCell>
											<TableCell className='text-xs'>
												<div className='font-medium text-foreground'>{item.lokasi?.nama_pokdakan || '-'}</div>
												<div className='mt-0.5 flex items-center gap-1 text-muted-foreground text-xs'>
													<MapPin className='size-3 text-muted-foreground' />
													{item.lokasi?.desa}, {item.lokasi?.kecamatan}
												</div>
											</TableCell>
											<TableCell className='text-xs'>
												<div className='flex max-w-xs flex-wrap gap-1'>
													{item.detailParameters.slice(0, 3).map((dp) => (
														<Badge className='px-1.5 py-0 font-mono text-xs' key={dp.id} variant='secondary'>
															{dp.bakuMutu?.parameter.split(' ')[0]}: {dp.nilai_hasil}
														</Badge>
													))}
													{item.detailParameters.length > 3 && (
														<Badge className='px-1 py-0 font-mono text-xs' variant='outline'>
															+{item.detailParameters.length - 3} lainnya
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell className='text-center'>
												<BadgeStatus size='sm' status={item.kesimpulan || 'NORMAL'} />
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex items-center justify-end gap-1'>
													<Button
														className='size-7 cursor-pointer'
														onClick={() => setExpandedId(isExpanded ? null : item.id)}
														size='icon-sm'
														title={isExpanded ? 'Tutup Rincian' : 'Buka Rincian Parameter'}
														variant='ghost'
													>
														{isExpanded ? (
															<ChevronUp className='size-3.5' />
														) : (
															<ChevronDown className='size-3.5' />
														)}
													</Button>
													<Link href={`/laporan/${item.id}/cetak`}>
														<Button className='h-7 cursor-pointer gap-1 text-xs' size='sm' variant='outline'>
															<Printer className='size-3.5' />
															<span>LHU</span>
														</Button>
													</Link>
												</div>
											</TableCell>
										</TableRow>

										{/* Expanded Details Sub-Row */}
										{isExpanded && (
											<TableRow className='bg-muted/20 hover:bg-muted/20'>
												<TableCell className='p-4' colSpan={6}>
													<UjiRowDetail item={item} />
												</TableCell>
											</TableRow>
										)}
									</React.Fragment>
								);
							})
						)}
					</TableBody>
				</Table>
			</div>
		</Card>
	);
}
