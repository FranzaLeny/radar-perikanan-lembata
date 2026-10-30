import Image from 'next/image';

import { Badge } from '@/components/shadcn/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/shadcn/table';
import { APP_CONFIG, APP_NAME } from '@/lib/constants';
import type { PokdakanData, PrintSettings } from '../types';

type RekapMatrixTableProps = {
	allPokdakan: PokdakanData[];
	matrix: Record<string, Record<number, string>>;
	months: string[];
	settings: PrintSettings;
	formattedTanggalTtd: string;
	qrDataUrl: string;
};

export function RekapMatrixTable({
	allPokdakan,
	matrix,
	months,
	settings,
	formattedTanggalTtd,
	qrDataUrl
}: RekapMatrixTableProps) {
	return (
		<div className='overflow-x-auto rounded-xl border border-slate-300 bg-white text-slate-900 shadow-xs print:m-0 print:border-none print:shadow-none'>
			<div className='min-w-240 p-8 print:min-w-0 print:p-0'>
				{/* Kop Surat Resmi Dinas Perikanan Kabupaten Lembata */}
				<div className='mb-6 border-slate-900 border-b-2 pb-3'>
					<div className='flex items-center gap-4'>
						<Image
							alt='Logo Pemerintah Kabupaten Lembata'
							className='h-auto w-14 shrink-0 object-contain'
							height={76}
							priority
							src={APP_CONFIG.logo.kabupaten}
							width={64}
						/>
						<div className='flex-1 pr-14 text-center'>
							<h3 className='font-bold text-xs uppercase tracking-widest'>
								{APP_CONFIG.institution.government}
							</h3>
							<h2 className='font-extrabold text-base uppercase leading-tight tracking-wider'>
								{APP_CONFIG.institution.name}
							</h2>
							<p className='mt-0.5 text-[11px] leading-snug'>
								Jl. Trans Lembata, Lewoleba, Kab. Lembata, Nusa Tenggara Timur
							</p>
							<p className='text-[11px]'>
								Pos-El: {APP_CONFIG.institution.email} Telp. / Fax. (0383) 41477 – Lewoleba
							</p>
						</div>
					</div>
				</div>

				{/* Judul Dokumen */}
				<div className='mb-6 text-center'>
					<h1 className='font-bold text-sm uppercase tracking-wide'>
						Rekapitulasi Pemantauan Kualitas Air Kolam Pembudidaya (Pokdakan)
					</h1>
					<p className='mt-0.5 font-semibold text-xs uppercase'>
						Tahun Anggaran {settings.tahunAnggaran}
					</p>
				</div>

				{/* Legend Status Indikator Mutu */}
				<div className='mb-4 flex flex-wrap items-center justify-center gap-3 font-medium text-xs'>
					<Badge className='gap-1.5 border-emerald-300 bg-emerald-50 text-emerald-800' variant='outline'>
						<span className='size-2 rounded-full bg-emerald-600' />
						<span>Memenuhi Baku Mutu (Normal)</span>
					</Badge>
					<Badge className='gap-1.5 border-amber-300 bg-amber-50 text-amber-800' variant='outline'>
						<span className='size-2 rounded-full bg-amber-500' />
						<span>Peringatan (Mendekati Batas)</span>
					</Badge>
					<Badge className='gap-1.5 border-rose-300 bg-rose-50 text-rose-800' variant='outline'>
						<span className='size-2 rounded-full bg-rose-600' />
						<span>Kritis (Melebihi/Kurang)</span>
					</Badge>
					<Badge className='gap-1.5 border-slate-300 bg-slate-50 text-slate-500' variant='outline'>
						<span className='size-2 rounded-full bg-slate-300' />
						<span>- (Belum Ada Uji)</span>
					</Badge>
				</div>

				{/* Matriks Table */}
				<div className='mb-8 overflow-hidden rounded-lg border border-slate-300 **:data-[slot=table-container]:overflow-visible print:border-slate-400'>
					<Table className='w-full table-fixed text-xs [&_td]:border-slate-200 [&_td]:border-b [&_td]:border-r [&_td]:px-0.5 [&_td]:py-1.5 [&_td:last-child]:border-r-0 [&_th]:border-slate-300 [&_th]:border-b [&_th]:border-r [&_th]:px-0.5 [&_th]:py-1.5 [&_th:last-child]:border-r-0'>
						<TableHeader className='bg-slate-200'>
							<TableRow className='hover:bg-slate-200'>
								<TableHead className='w-[4%] text-center font-bold text-[11px] text-slate-800 uppercase'>
									No
								</TableHead>
								<TableHead className='w-[28%] px-2 font-bold text-[11px] text-slate-800 uppercase'>
									Nama Pokdakan
								</TableHead>
								<TableHead className='w-[14%] px-2 font-bold text-[11px] text-slate-800 uppercase'>
									Kecamatan
								</TableHead>
								{months.map((m) => (
									<TableHead
										className='w-[4.5%] text-center font-bold text-[11px] text-slate-800 uppercase'
										key={m}
									>
										{m}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{allPokdakan.map((p, idx) => (
								<TableRow className='hover:bg-slate-50/80' key={p.id}>
									<TableCell className='text-center text-slate-500'>
										{idx + 1}
									</TableCell>
									<TableCell className='truncate px-2 font-semibold text-slate-900'>
										<div className='truncate font-semibold text-slate-900' title={p.nama_pokdakan}>
											{p.nama_pokdakan}
										</div>
										<div className='truncate font-normal text-[11px] text-slate-500' title={p.pemilik}>
											{p.pemilik}
										</div>
									</TableCell>
									<TableCell className='not-print:truncate px-2'>
										<div className='truncate' title={p.kecamatan}>
											{p.kecamatan}
										</div>
									</TableCell>
									{months.map((_, mIdx) => {
										const stat = matrix[p.id]?.[mIdx];
										let cellContent = <span className='text-slate-300 text-xs'>-</span>;

										if (stat === 'NORMAL') {
											cellContent = (
												<span
													className='inline-flex size-3.5 items-center justify-center rounded-full bg-emerald-500 font-bold text-[10px] text-white'
													title='Normal'
												>
													✓
												</span>
											);
										} else if (stat === 'PERINGATAN') {
											cellContent = (
												<span
													className='inline-flex size-3.5 items-center justify-center rounded-full bg-amber-500 font-bold text-[10px] text-white'
													title='Peringatan'
												>
													!
												</span>
											);
										} else if (stat === 'KRITIS') {
											cellContent = (
												<span
													className='inline-flex size-3.5 items-center justify-center rounded-full bg-rose-600 font-bold text-[10px] text-white'
													title='Kritis'
												>
													✕
												</span>
											);
										}

										return (
											<TableCell
												className='text-center'
												key={mIdx}
											>
												{cellContent}
											</TableCell>
										);
									})}
								</TableRow>
							))}

							{/* Baris Tanda Tangan di dalam Table Body */}
							<TableRow className='border-slate-300 border-t hover:bg-transparent'>
								<TableCell className='border-b-0 border-r-0 p-0 pt-6' colSpan={months.length + 3}>
									<div className='grid grid-cols-2 gap-8 text-xs'>
										<div className='text-center'>
											<p className='mb-16'>{settings.pengelolaJabatan},</p>
											<p className='font-bold uppercase underline'>{settings.pengelolaNama}</p>
											{settings.pengelolaNip && <p className='text-xs'>NIP. {settings.pengelolaNip}</p>}
										</div>

										<div className='text-center'>
											<p className=''>
												{settings.lokasiTtd}, {formattedTanggalTtd}
											</p>
											<p className='mb-14'>Mengetahui, </p>
											<p className='mb-14'>{settings.kepalaDinasJabatan},</p>
											<p className='font-bold text-slate-900 uppercase underline'>{settings.kepalaDinasNama}</p>
											{settings.kepalaDinasNip && <p className='text-xs'>NIP. {settings.kepalaDinasNip}</p>}
										</div>
									</div>
								</TableCell>
							</TableRow>
						</TableBody>

						{/* Footer & QR Barcode Verifikasi Keaslian Dokumen */}
						<tfoot className='border-slate-300 border-t border-dashed bg-white'>
							<tr>
								<td className='border-b-0 border-r-0 p-3 pt-4 text-slate-500 text-xs' colSpan={months.length + 3}>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											<Image
												alt='QR Verifikasi'
												className='size-12 object-contain'
												height={48}
												priority
												src={qrDataUrl}
												unoptimized
												width={48}
											/>
											<div>
												<p className='font-bold text-slate-700'>Verifikasi Dokumen Resmi Digital</p>
												<p className='text-slate-400 text-xs'>
													Pindai QR untuk memverifikasi keaslian dokumen di portal {APP_CONFIG.name}{' '}
													{APP_CONFIG.institution.regency}
												</p>
											</div>
										</div>

										<div className='text-right text-xs'>
											<span className='block text-slate-400'>DOKUMEN REKAPITULASI TAHUNAN</span>
											<p>Dicetak melalui {APP_NAME}</p>
										</div>
									</div>
								</td>
							</tr>
						</tfoot>
					</Table>
				</div>
			</div>
		</div>
	);
}
