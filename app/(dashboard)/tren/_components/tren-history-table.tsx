import { BadgeStatus } from '@/components/badge-status';
import { Card, CardHeader, CardTitle } from '@/components/shadcn/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/shadcn/table';
import type { DetailRow } from '../types';

type TrenHistoryTableProps = { parameterName: string; satuan: string; rows: DetailRow[] };

export function TrenHistoryTable({ parameterName, satuan, rows }: TrenHistoryTableProps) {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between border-b px-4 py-3'>
				<CardTitle className='font-semibold text-muted-foreground text-xs uppercase tracking-wider'>
					Riwayat Titik Uji Parameter: {parameterName}
				</CardTitle>
				<span className='text-muted-foreground text-xs'>Total {rows.length} titik pengukuran</span>
			</CardHeader>

			<div className='overflow-x-auto'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted/40 hover:bg-muted/40'>
							<TableHead className='font-semibold text-xs'>Nomor Sampel</TableHead>
							<TableHead className='font-semibold text-xs'>Pokdakan</TableHead>
							<TableHead className='font-semibold text-xs'>Waktu Pengambilan</TableHead>
							<TableHead className='font-semibold text-xs'>Nilai Pengukuran</TableHead>
							<TableHead className='text-center font-semibold text-xs'>Status Kelayakan</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.length === 0 ? (
							<TableRow>
								<TableCell className='py-8 text-center text-muted-foreground text-xs' colSpan={5}>
									Belum ada data untuk parameter ini pada filter terpilih.
								</TableCell>
							</TableRow>
						) : (
							rows.map((row) => (
								<TableRow className='hover:bg-muted/30' key={row.id}>
									<TableCell className='font-semibold text-foreground text-xs'>{row.nomor_sampel}</TableCell>
									<TableCell className='font-medium text-foreground text-xs'>{row.pokdakan}</TableCell>
									<TableCell className='text-muted-foreground text-xs'>{row.tanggal}</TableCell>
									<TableCell className='font-bold text-foreground text-xs'>
										{row.nilai} {satuan}
									</TableCell>
									<TableCell className='text-center'>
										<BadgeStatus size='sm' status={row.status} />
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
