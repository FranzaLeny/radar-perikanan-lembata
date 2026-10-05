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
import { APP_NAME } from '@/lib/constants';
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
		<div className='overflow-hidden rounded-xl border border-border'>
			<Table>
				<TableHeader>
					<TableRow className='bg-muted/40 hover:bg-muted/40'>
						<TableHead className='w-[170px] font-semibold text-xs'>Nomor LHU / Sampel</TableHead>
						<TableHead className='w-[120px] font-semibold text-xs'>Tanggal Sampel</TableHead>
						<TableHead className='font-semibold text-xs'>Pokdakan & Wilayah</TableHead>
						<TableHead className='w-[140px] font-semibold text-xs'>Petugas Penguji</TableHead>
						<TableHead className='w-[110px] text-center font-semibold text-xs'>Status Dokumen</TableHead>
						<TableHead className='w-[110px] text-center font-semibold text-xs'>Status Mutu</TableHead>
						<TableHead className='w-[150px] text-right font-semibold text-xs'>Aksi</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.length === 0 ? (
						<TableRow>
							<TableCell className='h-28 text-center text-muted-foreground text-xs' colSpan={7}>
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
								<TableCell className='font-mono font-semibold text-foreground text-xs'>
									LHU/{APP_NAME}/{u.nomor_sampel}
								</TableCell>
								<TableCell className='text-muted-foreground text-xs'>
									{new Date(u.tanggal_pengambilan).toLocaleDateString('id-ID', {
										day: 'numeric',
										month: 'short',
										year: 'numeric'
									})}
								</TableCell>
								<TableCell>
									<div className='font-medium text-foreground text-xs'>{u.lokasi?.nama_pokdakan}</div>
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
