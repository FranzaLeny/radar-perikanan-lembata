import { BadgeStatus } from '@/components/badge-status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import type { UjiItem } from '../types';

type UjiRowDetailProps = { item: UjiItem };

export function UjiRowDetail({ item }: UjiRowDetailProps) {
	return (
		<Card>
			<CardHeader className='border-b px-4 py-2.5'>
				<CardTitle className='flex items-center justify-between font-semibold text-xs'>
					<span>Rincian Lengkap Hasil Uji Sampel #{item.nomor_sampel}</span>
					<span className='font-normal text-muted-foreground'>
						SOP: {item.instruksiKerja?.kode_ik || '-'} • {item.instruksiKerja?.judul || '-'}
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent className='p-4'>
				<div className='mb-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3 md:grid-cols-4'>
					{item.detailParameters.map((dp) => (
						<div className='rounded-lg border border-border bg-muted/40 p-2.5' key={dp.id}>
							<p className='font-semibold text-foreground text-xs'>{dp.bakuMutu?.parameter}</p>
							<div className='mt-1 flex items-baseline justify-between'>
								<span className='font-bold text-base text-foreground'>{dp.nilai_hasil}</span>
								<span className='text-muted-foreground text-xs'>{dp.bakuMutu?.satuan}</span>
							</div>
							<div className='mt-1.5'>
								<BadgeStatus size='sm' status={dp.status_kelayakan || 'NORMAL'} />
							</div>
						</div>
					))}
				</div>
				{item.catatan_lapangan && (
					<div className='border-t pt-2 text-muted-foreground text-xs'>
						<span className='font-semibold text-foreground'>Catatan Petugas: </span>
						{item.catatan_lapangan}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
