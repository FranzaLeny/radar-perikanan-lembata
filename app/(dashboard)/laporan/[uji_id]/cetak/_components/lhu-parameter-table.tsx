import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/shadcn/table';
import type { DetailParameterUji } from '../types';

type LhuParameterTableProps = { parameters: DetailParameterUji[] };

export function LhuParameterTable({ parameters }: LhuParameterTableProps) {
	return (
		<div className='mb-4 print:mb-2.5'>
			<h4 className='mb-1.5 font-bold text-slate-800 text-xs uppercase tracking-wider print:mb-1'>
				A. Hasil Evaluasi Parameter Kualitas Air
			</h4>
			<div className='min-w-fit rounded-lg border border-slate-300'>
				<Table className='text-xs'>
					<TableHeader className='border-slate-300 border-b bg-slate-100'>
						<TableRow className='border-slate-300 border-b hover:bg-slate-100'>
							<TableHead className='w-8 border-slate-300 border-r py-1.5 text-center font-bold text-[11px] text-slate-700 uppercase print:py-1'>
								No
							</TableHead>
							<TableHead className='border-slate-300 border-r py-1.5 font-bold text-[11px] text-slate-700 uppercase print:py-1'>
								Parameter Uji
							</TableHead>
							<TableHead className='w-14 border-slate-300 border-r py-1.5 text-center font-bold text-[11px] text-slate-700 uppercase print:py-1'>
								Satuan
							</TableHead>
							<TableHead className='border-slate-300 border-r py-1.5 text-center font-bold text-[11px] text-slate-700 uppercase print:py-1'>
								Baku Mutu (Regulasi)
							</TableHead>
							<TableHead className='border-slate-300 border-r py-1.5 text-left font-bold text-[11px] text-slate-700 uppercase print:py-1'>
								Metode Pengujian (IK)
							</TableHead>
							<TableHead className='border-slate-300 border-r py-1.5 text-center font-bold text-[11px] text-slate-700 uppercase print:py-1'>
								Hasil Uji
							</TableHead>
							<TableHead className='py-1.5 text-center font-bold text-[11px] text-slate-700 uppercase print:py-1'>
								Status Kelayakan
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{parameters.map((dp, idx) => {
							const min =
								dp.nilai_min_terapkan !== null && dp.nilai_min_terapkan !== undefined
									? dp.nilai_min_terapkan
									: dp.bakuMutu?.nilai_min;
							const max =
								dp.nilai_max_terapkan !== null && dp.nilai_max_terapkan !== undefined
									? dp.nilai_max_terapkan
									: dp.bakuMutu?.nilai_max;

							let standardStr = '-';
							if (min !== null && min !== undefined && max !== null && max !== undefined) {
								standardStr = `${min} – ${max}`;
							} else if (min !== null && min !== undefined) {
								standardStr = `≥ ${min}`;
							} else if (max !== null && max !== undefined) {
								standardStr = `≤ ${max}`;
							}

							const regulasiSingkat = dp.nomor_regulasi || dp.bakuMutu?.nomor_regulasi || 'PP No. 22/2021';
							const metodeUji =
								dp.metode_pengujian || dp.ik?.metode_pengujian || dp.ik?.judul || 'SNI Pengujian Mutu Air';

							const isMelebihi = dp.status_kelayakan === 'MELEBIHI';
							const isDibawah = dp.status_kelayakan === 'DIBAWAH';

							return (
								<TableRow className='border-slate-200 border-b hover:bg-slate-50/80' key={dp.id}>
									<TableCell className='border-slate-300 border-r py-1.5 text-center font-mono text-slate-500 print:py-1'>
										{idx + 1}
									</TableCell>
									<TableCell className='border-slate-300 border-r py-1.5 font-medium text-slate-900 print:py-1'>
										{dp.bakuMutu?.parameter}
									</TableCell>
									<TableCell className='border-slate-300 border-r py-1.5 text-center font-mono text-slate-600 print:py-1'>
										{dp.bakuMutu?.satuan}
									</TableCell>
									<TableCell className='border-slate-300 border-r py-1.5 text-center font-mono text-slate-700 print:py-1'>
										<div>
											<span className='font-bold'>{standardStr}</span>
											<span className='block font-sans text-[10px] text-slate-500'>({regulasiSingkat})</span>
										</div>
									</TableCell>
									<TableCell className='border-slate-300 border-r py-1.5 text-left text-[11px] text-slate-800 print:py-1'>
										<span className='font-medium text-slate-900'>{metodeUji}</span>
										{dp.ik?.kode_ik && (
											<span className='block font-mono text-[10px] text-slate-500'>[{dp.ik.kode_ik}]</span>
										)}
									</TableCell>
									<TableCell className='border-slate-300 border-r py-1.5 text-center font-bold font-mono text-slate-900 print:py-1'>
										{dp.nilai_hasil}
									</TableCell>
									<TableCell className='py-1.5 text-center font-bold text-xs print:py-1'>
										{isMelebihi ? (
											<span className='text-rose-700'>MELEBIHI BATAS</span>
										) : isDibawah ? (
											<span className='text-amber-700'>DI BAWAH BATAS</span>
										) : (
											<span className='text-emerald-700'>MEMENUHI</span>
										)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
