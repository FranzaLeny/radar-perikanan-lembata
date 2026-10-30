import Image from 'next/image';

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
		<div className='min-w-full not-print:mb-8 print:p-px'>
			<table className='w-full table-auto border-collapse text-xs [&_td]:border [&_td]:border-slate-400 [&_td]:px-1.5 [&_td]:py-1.5 [&_th]:border [&_th]:border-slate-500 [&_th]:px-1.5 [&_th]:py-1.5'>
				<thead>
					<tr className='bg-slate-200 font-bold uppercase *:text-center *:text-[11px] *:text-slate-800'>
						<th className='max-w-fit'>No</th>
						<th>Parameter Uji</th>
						<th className='max-w-fit'>Satuan</th>
						<th>Baku Mutu (Regulasi)</th>
						<th>Metode Pengujian (IK)</th>
						<th className='max-w-fit'>Hasil Uji</th>
						<th>Status Kelayakan</th>
					</tr>
				</thead>
				<tbody>
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
							<tr className='not-print:hover:bg-slate-50/80' key={dp.id}>
								<td className='text-center text-slate-500'>{idx + 1}</td>
								<td className='font-medium text-slate-900'>{dp.bakuMutu?.parameter}</td>
								<td className='text-center text-slate-600'>{dp.bakuMutu?.satuan}</td>
								<td className='text-center text-slate-700'>
									<div>
										<span className='font-bold'>{standardStr}</span>
										<span className='block font-sans text-[10px] text-slate-500'>({regulasiSingkat})</span>
									</div>
								</td>
								<td className='text-left text-[11px] text-slate-800'>
									<span className='font-medium text-slate-900'>{metodeUji}</span>
									{dp.ik?.kode_ik && (
										<span className='block text-[10px] text-slate-500'>[{dp.ik.kode_ik}]</span>
									)}
								</td>
								<td className='text-center font-bold text-slate-900'>{dp.nilai_hasil}</td>
								<td className='text-center text-xs font-bold'>
									{isMelebihi ? (
										<span className='text-rose-700'>MELEBIHI BATAS</span>
									) : isDibawah ? (
										<span className='text-amber-700'>DI BAWAH BATAS</span>
									) : (
										<span className='text-emerald-700'>MEMENUHI</span>
									)}
								</td>
							</tr>
						);
					})}

					{/* BAGIAN B & C KESIMPULAN & TANDA TANGAN (DIMASUKKAN DALAM BODY TABEL) */}
					<tr>
						<td className='border-0! p-0 pt-4 text-left' colSpan={7}>
							<div className='mb-4 space-y-3'>
								<div>
									<h4 className='mb-1 text-xs font-bold tracking-wider text-slate-800 uppercase'>
										B. Kesimpulan
									</h4>
									<div className='rounded-lg border border-slate-300 p-2.5 text-xs not-print:bg-slate-50 print:p-2'>
										<div className='mb-1.5 flex items-center gap-2 font-bold'>
											<span>Status Kepatuhan Baku Mutu:</span>
											<span
												className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
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
											<p className='text-xs leading-relaxed text-slate-700'>
												Seluruh parameter kualitas air memenuhi standar baku mutu yang dipersyaratkan. Kondisi
												lingkungan kolam sangat mendukung pertumbuhan ikan yang optimal. Lanjutkan manajemen
												pakan dan aerasi rutin.
											</p>
										) : (
											<div className='mt-1.5 space-y-1'>
												<ul className='list-inside list-disc space-y-0.5 text-xs text-slate-700'>
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
										<h4 className='mb-1 text-xs font-bold tracking-wider text-slate-800 uppercase'>
											C. Saran dan Rekomendasi
										</h4>
										<div className='space-y-1.5 rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-xs print:bg-white print:p-2'>
											{telaahanUmum.map((item) => (
												<div className='even:border-t even:border-slate-200' key={item.label}>
													<span className='mb-0.5 block font-bold text-slate-900'>{item.label}:</span>
													<p className='leading-relaxed text-slate-700'>{item.value}</p>
												</div>
											))}
										</div>
									</div>
								)}
							</div>

							{/* Baris Tanda Tangan */}
							<table className='min-w-full table-fixed text-center **:border-0! **:py-0!'>
								<tbody>
									<tr>
										<td></td>
										<td>Lewoleba, {formattedDate}</td>
									</tr>
									<tr>
										<td className='w-1/2'>Petugas Analis / Penguji,</td>
										<td className='w-1/2'>{jabatanPenandatangan || 'Kepala Dinas Perikanan'},</td>
									</tr>
									<tr>
										<td className='h-[2cm]' colSpan={2}></td>
									</tr>
									<tr>
										<td className='leading-none'>
											<p className='font-bold uppercase underline'>{namaPenguji}</p>
											<p className='text-xs text-slate-600'>{jabatanPenguji}</p>
											{nipPenguji && <p className='mt-0.5 text-xs text-slate-500'>{nipPenguji}</p>}
										</td>
										<td className='leading-none'>
											<p className='font-bold text-slate-900 uppercase underline'>
												{namaPenandatangan || '-'}
											</p>
											<p className='text-xs text-slate-600'>{pangkatPenandatangan}</p>
											{nipPenandatangan && (
												<p className='mt-0.5 text-xs text-slate-500'>NIP. {nipPenandatangan}</p>
											)}
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>

				{/* Footer & QR Barcode Verifikasi Keaslian Dokumen */}
				{qrDataUrl && (
					<tfoot>
						<tr>
							<td className='h-[2cm] border-0!' colSpan={7}>
								<div className='text-2xs bottom-0 flex min-w-full items-center justify-between px-3 text-slate-500 print:fixed'>
									<div className='flex items-center gap-3'>
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
											<p className='font-bold text-slate-700'>Dicetak melalui {APP_NAME}</p>
											<p className='text-xs text-slate-400'>
												Pindai QR untuk memverifikasi keaslian dokumen di portal {APP_CONFIG.name}{' '}
												{APP_CONFIG.institution.regency}
											</p>
										</div>
									</div>
									{ujiId && (
										<div className='text-right text-[10px]'>
											<span>ID: {ujiId.substring(0, 18)}</span>
										</div>
									)}
								</div>
							</td>
						</tr>
					</tfoot>
				)}
			</table>
		</div>
	);
}
