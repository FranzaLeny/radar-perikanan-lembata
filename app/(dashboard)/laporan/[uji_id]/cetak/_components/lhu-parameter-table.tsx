import Image from 'next/image';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/shadcn/table';
import { APP_CONFIG, APP_NAME } from '@/lib/constants';
import type { DetailParameterUji, RekomendasiItem } from '../types';

type LhuParameterTableProps = {
	parameters: DetailParameterUji[];
	kesimpulan: string | null;
	rekomendasiList: RekomendasiItem[];
	kesimpulanUmum?: string | null;
	saranRekomendasiLapangan?: string | null;
	catatanLapangan?: string | null;
	formattedDate: string;
	namaPenguji: string;
	jabatanPenguji: string;
	nipPenguji?: string;
	namaPenandatangan?: string;
	jabatanPenandatangan?: string;
	pangkatPenandatangan?: string;
	nipPenandatangan?: string;
	qrDataUrl?: string;
	ujiId?: string;
};

export function LhuParameterTable({
	parameters,
	kesimpulan,
	rekomendasiList,
	kesimpulanUmum,
	saranRekomendasiLapangan,
	catatanLapangan,
	formattedDate,
	namaPenguji,
	jabatanPenguji,
	nipPenguji,
	namaPenandatangan,
	jabatanPenandatangan,
	pangkatPenandatangan,
	nipPenandatangan,
	qrDataUrl,
	ujiId
}: LhuParameterTableProps) {
	const telaahanUmum = [
		{ label: 'Saran & Rekomendasi', value: saranRekomendasiLapangan || '' },
		{ label: 'Catatan', value: catatanLapangan || '' }
	].filter((d) => !!d.value);

	return (
		<div className='mb-4 print:mb-2.5'>
			<h4 className='mb-1.5 font-bold text-slate-800 text-xs uppercase tracking-wider print:mb-1'>
				A. Hasil Evaluasi Parameter Kualitas Air
			</h4>
			<div className='min-w-fit rounded-lg border border-slate-300'>
				<Table className='text-xs [&_td]:border-slate-300 [&_td]:border-b [&_td]:border-r [&_td]:px-2 [&_td]:py-1.5 [&_td:last-child]:border-r-0 [&_th]:border-slate-300 [&_th]:border-b [&_th]:border-r [&_th]:px-2 [&_th]:py-1.5 [&_th:last-child]:border-r-0 print:[&_td]:py-1 print:[&_th]:py-1'>
					<TableHeader className='bg-slate-100'>
						<TableRow className='hover:bg-slate-100'>
							<TableHead className='w-8 text-center font-bold text-[11px] text-slate-700 uppercase'>
								No
							</TableHead>
							<TableHead className='font-bold text-[11px] text-slate-700 uppercase'>
								Parameter Uji
							</TableHead>
							<TableHead className='w-14 text-center font-bold text-[11px] text-slate-700 uppercase'>
								Satuan
							</TableHead>
							<TableHead className='text-center font-bold text-[11px] text-slate-700 uppercase'>
								Baku Mutu (Regulasi)
							</TableHead>
							<TableHead className='text-left font-bold text-[11px] text-slate-700 uppercase'>
								Metode Pengujian (IK)
							</TableHead>
							<TableHead className='border-r-0 text-center font-bold text-[11px] text-slate-700 uppercase'>
								Hasil Uji
							</TableHead>
							<TableHead className='text-center font-bold text-[11px] text-slate-700 uppercase'>
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
								<TableRow className='hover:bg-slate-50/80' key={dp.id}>
									<TableCell className='text-center text-slate-500'>
										{idx + 1}
									</TableCell>
									<TableCell className='font-medium text-slate-900'>
										{dp.bakuMutu?.parameter}
									</TableCell>
									<TableCell className='text-center text-slate-600'>
										{dp.bakuMutu?.satuan}
									</TableCell>
									<TableCell className='text-center text-slate-700'>
										<div>
											<span className='font-bold'>{standardStr}</span>
											<span className='block font-sans text-[10px] text-slate-500'>({regulasiSingkat})</span>
										</div>
									</TableCell>
									<TableCell className='text-left text-[11px] text-slate-800'>
										<span className='font-medium text-slate-900'>{metodeUji}</span>
										{dp.ik?.kode_ik && (
											<span className='block text-[10px] text-slate-500'>[{dp.ik.kode_ik}]</span>
										)}
									</TableCell>
									<TableCell className='text-center font-bold text-slate-900'>
										{dp.nilai_hasil}
									</TableCell>
									<TableCell className='text-center font-bold text-xs'>
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

						{/* BAGIAN B: KESIMPULAN & REKOMENDASI (DIMASUKKAN DALAM BODY TABEL) */}
						<TableRow className='hover:bg-transparent'>
							<TableCell className='border-r-0 p-3 text-left' colSpan={7}>
								<div className='space-y-3'>
									<div>
										<h4 className='mb-1 font-bold text-slate-800 text-xs uppercase tracking-wider'>
											B. Kesimpulan
										</h4>
										<div className='rounded-lg border border-slate-300 not-print:bg-slate-50 p-2.5 text-xs print:p-2'>
											<div className='mb-1.5 flex items-center gap-2 font-bold'>
												<span>Status Kepatuhan Baku Mutu:</span>
												<span
													className={`rounded-full px-2.5 py-0.5 font-extrabold text-xs ${
														kesimpulan === 'NORMAL'
															? 'border border-emerald-300 bg-emerald-100 text-emerald-800'
															: kesimpulan === 'PERINGATAN'
																? 'border border-amber-300 bg-amber-100 text-amber-800'
																: 'border border-rose-300 bg-rose-100 text-rose-800'
													}`}
												>
													{kesimpulan || 'NORMAL'}
												</span>
											</div>

											{rekomendasiList.length === 0 ? (
												<p className='text-slate-700 text-xs leading-relaxed'>
													Seluruh parameter kualitas air memenuhi standar baku mutu yang dipersyaratkan. Kondisi
													lingkungan kolam sangat mendukung pertumbuhan ikan yang optimal. Lanjutkan manajemen pakan
													dan aerasi rutin.
												</p>
											) : (
												<div className='mt-1.5 space-y-1'>
													<ul className='list-inside list-disc space-y-0.5 text-slate-700 text-xs'>
														{rekomendasiList.map((rec, i) => (
															<li key={i}>
																<strong className='text-slate-900'>{rec.parameter}:</strong> {rec.saran}
															</li>
														))}
													</ul>
												</div>
											)}
											{kesimpulanUmum && <p className='pt-2'>{kesimpulanUmum}</p>}
										</div>
									</div>

									{telaahanUmum.length > 0 && (
										<div>
											<h4 className='mb-1 font-bold text-slate-800 text-xs uppercase tracking-wider'>
												C. Saran dan Rekomendasi
											</h4>
											<div className='space-y-1.5 rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-xs print:bg-white print:p-2'>
												{telaahanUmum.map((item) => (
													<div className='even:border-slate-200 even:border-t' key={item.label}>
														<span className='mb-0.5 block font-bold text-slate-900'>{item.label}:</span>
														<p className='text-slate-700 leading-relaxed'>{item.value}</p>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</TableCell>
						</TableRow>

						{/* BAGIAN TANDA TANGAN (DIMASUKKAN DALAM BODY TABEL) */}
						<TableRow className='hover:bg-transparent'>
							<TableCell className='border-b-0 border-r-0 p-3 pt-5' colSpan={7}>
								<div className='grid grid-cols-2 gap-8 text-xs'>
									<div className='text-center'>
										<p className='mb-12 text-slate-500 print:mb-10'>Petugas Analis / Penguji,</p>
										<p className='font-bold text-slate-900 uppercase underline'>{namaPenguji}</p>
										<p className='text-slate-600 text-xs'>{jabatanPenguji}</p>
										{nipPenguji && <p className='mt-0.5 text-slate-500 text-xs'>{nipPenguji}</p>}
									</div>

									<div className='text-center'>
										<p className='text-slate-500'>Lewoleba, {formattedDate}</p>
										<p className='mb-12 text-slate-500 print:mb-10'>
											{jabatanPenandatangan || 'Kepala Dinas Perikanan'},
										</p>
										<p className='font-bold text-slate-900 uppercase underline'>{namaPenandatangan || '-'}</p>
										<p className='text-slate-600 text-xs'>{pangkatPenandatangan}</p>
										{nipPenandatangan && (
											<p className='mt-0.5 text-slate-500 text-xs'>NIP. {nipPenandatangan}</p>
										)}
									</div>
								</div>
							</TableCell>
						</TableRow>
					</TableBody>

					{/* BAGIAN FOOTER & BARCODE / QR VERIFIKASI (MENGGUNAKAN TFOOT) */}
					{qrDataUrl && (
						<tfoot className='border-slate-300 border-t border-dashed bg-white'>
							<tr>
								<td className='border-b-0 border-r-0 p-3 text-[11px] text-slate-500 print:py-2' colSpan={7}>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2.5'>
											<Image
												alt='QR Verifikasi'
												className='size-10 object-contain'
												height={40}
												priority
												src={qrDataUrl}
												unoptimized
												width={40}
											/>
											<div>
												<p className='font-bold text-slate-700'>Verifikasi Keaslian LHU Digital</p>
												<p className='text-[10px] text-slate-400'>
													Pindai QR untuk memverifikasi dokumen di portal {APP_CONFIG.name}{' '}
													{APP_CONFIG.institution.regency}
												</p>
											</div>
										</div>

										<div className='text-right text-[10px]'>
											{ujiId && <span>ID: {ujiId.substring(0, 18)}</span>}
											<p>Dicetak melalui {APP_NAME}</p>
										</div>
									</div>
								</td>
							</tr>
						</tfoot>
					)}
				</Table>
			</div>
		</div>
	);
}
