import { BadgeStatus } from '@/components/badge-status';
import { Button } from '@/components/shadcn/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/shadcn/table';
import { BRAND_NAME } from '@/lib/constants';
import type { UjiLaporanItem } from '../types';
import { LaporanRowActions } from './laporan-row-actions';
import { LaporanStatusBadge } from './laporan-status-badge';

type LaporanTableProps = {
	items: UjiLaporanItem[];
	isFiltered: boolean;
	onResetFilter: () => void;
	onUpdateStatus: (item: UjiLaporanItem, newStatus: 'draft' | 'final' | 'arsip') => void;
	onDelete: (item: UjiLaporanItem) => void;
};

export function LaporanTable({
	items,
	isFiltered,
	onResetFilter,
	onUpdateStatus,
	onDelete
}: LaporanTableProps) {
	return (
		<div className='border-border overflow-hidden rounded-xl border'>
			<Table>
				<TableHeader>
					<TableRow className='bg-muted/40 hover:bg-muted/40'>
						<TableHead className='w-[170px] text-xs font-semibold'>Nomor LHU / Sampel</TableHead>
						<TableHead className='w-[120px] text-xs font-semibold'>Tanggal Sampel</TableHead>
						<TableHead className='text-xs font-semibold'>Pokdakan & Wilayah</TableHead>
						<TableHead className='w-[140px] text-xs font-semibold'>Petugas Penguji</TableHead>
						<TableHead className='w-[110px] text-center text-xs font-semibold'>Status Dokumen</TableHead>
						<TableHead className='w-[110px] text-center text-xs font-semibold'>Status Mutu</TableHead>
						<TableHead className='w-[150px] text-right text-xs font-semibold'>Aksi</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.length === 0 ? (
						<TableRow>
							<TableCell className='text-muted-foreground h-28 text-center text-xs' colSpan={7}>
								{isFiltered ? (
									<div className='space-y-1.5'>
										<p>Tidak ada dokumen LHU yang cocok dengan filter pencarian ini.</p>
										<Button className='cursor-pointer' onClick={onResetFilter} size='xs' variant='outline'>
											Reset Filter
										</Button>
									</div>
								) : (
									<p>Belum ada Lembar Hasil Uji (LHU) yang tercatat dalam sistem.</p>
								)}
							</TableCell>
						</TableRow>
					) : (
						items.map((u) => (
							<TableRow className='hover:bg-muted/30' key={u.id}>
								<TableCell className='text-foreground text-xs font-semibold'>
									LHU/{BRAND_NAME}/{u.nomor_sampel}
								</TableCell>
								<TableCell className='text-muted-foreground text-xs'>
									{new Date(u.tanggal_pengambilan).toLocaleDateString('id-ID', {
										day: 'numeric',
										month: 'short',
										year: 'numeric'
									})}
								</TableCell>
								<TableCell>
									<div className='text-foreground text-xs font-medium'>{u.lokasi?.nama_pokdakan}</div>
									<div className='text-muted-foreground text-xs'>
										{u.lokasi?.desa}, {u.lokasi?.kecamatan}
									</div>
								</TableCell>
								<TableCell className='text-muted-foreground text-xs'>{u.petugas_uji}</TableCell>
								<TableCell className='text-center'>
									<LaporanStatusBadge status={u.status} />
								</TableCell>
								<TableCell className='text-center'>
									<BadgeStatus size='sm' status={u.kesimpulan || 'NORMAL'} />
								</TableCell>
								<TableCell className='text-right'>
									<LaporanRowActions item={u} onDelete={onDelete} onUpdateStatus={onUpdateStatus} />
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
