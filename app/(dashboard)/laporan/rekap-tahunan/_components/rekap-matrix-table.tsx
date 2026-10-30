import Image from 'next/image';

import { Badge } from '@/components/shadcn/badge';
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
		<div className='w-fit border-slate-300 bg-white text-slate-900 not-print:overflow-x-auto not-print:rounded-xl not-print:border not-print:shadow-xs'>
			<div className='not-print:min-w-240 not-print:p-8'>
				{/* Kop Surat Resmi Dinas Perikanan Kabupaten Lembata */}
				<div className='mb-6 min-w-full border-b-2 border-slate-900 pb-3'>
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
							<h3 className='text-xs font-bold tracking-widest uppercase'>
								{APP_CONFIG.institution.government}
							</h3>
							<h2 className='text-base leading-tight font-extrabold tracking-wider uppercase'>
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
				<div className='mb-6 min-w-full text-center'>
					<h1 className='text-sm font-bold tracking-wide uppercase'>
						Rekapitulasi Pemantauan Kualitas Air Kolam Pembudidaya (Pokdakan)
					</h1>
					<p className='mt-0.5 text-xs font-semibold uppercase'>
						Tahun Anggaran {settings.tahunAnggaran}
					</p>
				</div>

				{/* Matriks Table */}
				<div className='min-w-full not-print:mb-8 print:p-px'>
					<table className='w-full table-auto border-collapse text-xs [&_td]:border [&_td]:border-slate-400 [&_td]:px-0.5 [&_td]:py-1.5 [&_th]:border [&_th]:border-slate-500 [&_th]:px-0.5 [&_th]:py-1.5'>
						<thead>
							<tr className='bg-slate-200 font-bold uppercase *:text-center *:text-[11px] *:text-slate-800'>
								<th className='max-w-fit'>No</th>
								<th className='max-w-[28%]'>Nama Pokdakan</th>
								<th className='max-w-[14%]'>Kecamatan</th>
								{months.map((m) => (
									<th className='max-w-fit' key={m}>
										{m}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{allPokdakan.map((p, idx) => (
								<tr className='not-print:hover:bg-slate-50/80' key={p.id}>
									<td className='text-center'>{idx + 1}</td>
									<td>
										<div className='font-semibold text-slate-900' title={p.nama_pokdakan}>
											{p.nama_pokdakan}
										</div>
										<div className='text-slate-500' title={p.pemilik}>
											{p.pemilik}
										</div>
									</td>
									<td>
										<div title={p.kecamatan}>{p.kecamatan}</div>
									</td>
									{months.map((_, mIdx) => {
										const stat = matrix[p.id]?.[mIdx];
										let cellContent = <span className='text-xs text-slate-300'>-</span>;

										if (stat === 'NORMAL') {
											cellContent = (
												<span
													className='inline-flex size-3 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white'
													title='Normal'
												>
													✓
												</span>
											);
										} else if (stat === 'PERINGATAN') {
											cellContent = (
												<span
													className='inline-flex size-3 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white'
													title='Peringatan'
												>
													!
												</span>
											);
										} else if (stat === 'KRITIS') {
											cellContent = (
												<span
													className='inline-flex size-3 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white'
													title='Kritis'
												>
													✕
												</span>
											);
										}

										return (
											<td className='text-center' key={mIdx}>
												{cellContent}
											</td>
										);
									})}
								</tr>
							))}

							<tr>
								<td className='border-0! p-0 pt-6 text-center' colSpan={months.length + 3}>
									{/* Legend Status Indikator Mutu */}
									<div className='mb-4 flex min-w-full flex-wrap items-center justify-center gap-3 text-xs font-medium'>
										<Badge
											className='gap-1.5 border-emerald-300 bg-emerald-50 text-emerald-800'
											variant='outline'
										>
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

									{/* Baris Tanda Tangan di dalam Table Body */}
									<table className='min-w-full table-fixed **:border-0! **:py-0!'>
										<tbody>
											<tr>
												<td colSpan={2}>
													{settings.lokasiTtd}, {formattedTanggalTtd}
												</td>
											</tr>
											<tr>
												<td></td>
												<td>Mengetahui,</td>
											</tr>
											<tr>
												<td className='w-1/2'>{settings.pengelolaJabatan}</td>
												<td className='w-1/2'>{settings.kepalaDinasJabatan}</td>
											</tr>
											<tr>
												<td className='h-[2cm]' colSpan={2}></td>
											</tr>
											<tr>
												<td className='leading-none'>
													<p className='font-bold uppercase underline'>{settings.pengelolaNama}</p>
													{settings.pengelolaNip && <p className='text-xs'>NIP. {settings.pengelolaNip}</p>}
												</td>
												<td className='leading-none'>
													<p className='font-bold text-slate-900 uppercase underline'>
														{settings.kepalaDinasNama}
													</p>
													{settings.kepalaDinasNip && <p className='text-xs'>NIP. {settings.kepalaDinasNip}</p>}
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>

						{/* Footer & QR Barcode Verifikasi Keaslian Dokumen */}
						<tfoot>
							<tr>
								<td className='h-[2cm] border-0!' colSpan={months.length + 3}>
									<div className='text-2xs bottom-0 flex min-w-full items-center justify-between px-3 text-slate-500 print:fixed'>
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
												<p className='font-bold text-slate-700'>Dicetak melalui {APP_NAME}</p>
												<p className='text-xs text-slate-400'>
													Pindai QR untuk memverifikasi keaslian dokumen di portal {APP_CONFIG.name}{' '}
													{APP_CONFIG.institution.regency}
												</p>
											</div>
										</div>
									</div>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</div>
	);
}
