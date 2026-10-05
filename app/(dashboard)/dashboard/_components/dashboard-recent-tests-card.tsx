import { ArrowRight, Printer, TestTube2 } from 'lucide-react';
import Link from 'next/link';

import { BadgeStatus } from '@/components/badge-status';
import { Button } from '@/components/shadcn/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/shadcn/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/shadcn/table';
import type { RecentUjiItem } from '../types';

type DashboardRecentTestsCardProps = { items: RecentUjiItem[] };

export function DashboardRecentTestsCard({ items }: DashboardRecentTestsCardProps) {
	return (
		<Card className='border-border bg-card shadow-xs lg:col-span-2'>
			<CardHeader className='flex flex-row items-center justify-between border-b pb-4'>
				<div>
					<CardTitle className='flex items-center gap-2 font-semibold text-sm'>
						<TestTube2 className='size-4 text-muted-foreground' />
						<span>Hasil Uji Mutu Air Terbaru</span>
					</CardTitle>
					<CardDescription className='mt-0.5 text-xs'>
						10 riwayat pengujian sampel laboratorium terakhir
					</CardDescription>
				</div>
				<Link href='/uji-kualitas'>
					<Button
						className='h-7 cursor-pointer gap-1 px-2 font-semibold text-foreground text-xs'
						size='sm'
						variant='ghost'
					>
						<span>Lihat Semua</span>
						<ArrowRight className='size-3' />
					</Button>
				</Link>
			</CardHeader>

			<CardContent className='p-0 pt-4 sm:p-6'>
				<div className='overflow-hidden rounded-xl border border-border'>
					<Table>
						<TableHeader>
							<TableRow className='bg-muted/40 hover:bg-muted/40'>
								<TableHead className='font-semibold text-xs'>Sampel</TableHead>
								<TableHead className='font-semibold text-xs'>Pokdakan</TableHead>
								<TableHead className='font-semibold text-xs'>Tanggal</TableHead>
								<TableHead className='text-center font-semibold text-xs'>Status</TableHead>
								<TableHead className='text-right font-semibold text-xs'>Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{items.length === 0 ? (
								<TableRow>
									<TableCell className='py-8 text-center text-muted-foreground text-xs' colSpan={5}>
										Belum ada rekaman data uji kualitas air.
									</TableCell>
								</TableRow>
							) : (
								items.map((u) => {
									const tgl = new Date(u.tanggal_pengambilan).toLocaleDateString('id-ID', {
										day: 'numeric',
										month: 'short',
										year: 'numeric'
									});

									return (
										<TableRow className='hover:bg-muted/30' key={u.id}>
											<TableCell className='font-medium text-foreground text-xs'>{u.nomor_sampel}</TableCell>
											<TableCell className='text-xs'>
												<span className='font-semibold text-foreground'>
													{u.lokasi?.nama_pokdakan || 'Pokdakan'}
												</span>
												<span className='block text-muted-foreground text-xs'>
													{u.lokasi?.kecamatan || 'Lembata'}
												</span>
											</TableCell>
											<TableCell className='text-muted-foreground text-xs'>{tgl}</TableCell>
											<TableCell className='text-center'>
												<BadgeStatus size='sm' status={u.kesimpulan || 'NORMAL'} />
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex items-center justify-end gap-1'>
													<Link href={`/laporan/${u.id}/cetak`}>
														<Button
															className='size-7 cursor-pointer'
															size='icon-sm'
															title='Cetak LHU'
															variant='ghost'
														>
															<Printer className='size-3.5' />
														</Button>
													</Link>
												</div>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
