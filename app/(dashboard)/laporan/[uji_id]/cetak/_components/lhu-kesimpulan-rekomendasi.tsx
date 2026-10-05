import type { RekomendasiItem } from '../types';

type LhuKesimpulanRekomendasiProps = {
	kesimpulan: string | null;
	rekomendasiList: RekomendasiItem[];
	kesimpulanUmum?: string | null;
	saranRekomendasiLapangan?: string | null;
	catatanLapangan?: string | null;
};

export function LhuKesimpulanRekomendasi({
	kesimpulan,
	rekomendasiList,
	kesimpulanUmum,
	saranRekomendasiLapangan,
	catatanLapangan
}: LhuKesimpulanRekomendasiProps) {
	return (
		<>
			{/* KESIMPULAN & REKOMENDASI TEKNIS OTOMATIS */}
			<div className='mb-4 space-y-1.5 print:mb-2.5 print:space-y-1'>
				<h4 className='font-bold text-slate-800 text-xs uppercase tracking-wider'>
					B. Kesimpulan Evaluasi & Rekomendasi Teknis
				</h4>

				<div className='rounded-lg border border-slate-300 bg-slate-50 p-3 text-xs print:bg-white print:p-2'>
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
							<p className='font-semibold text-slate-800 text-xs'>
								Rekomendasi Tindakan Korektif Lapangan:
							</p>
							<ul className='list-inside list-disc space-y-0.5 text-slate-700 text-xs'>
								{rekomendasiList.map((rec, i) => (
									<li key={i}>
										<strong className='text-slate-900'>{rec.parameter}:</strong> {rec.saran}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>

			{/* TELAAH UMUM & CATATAN LAPANGAN PETUGAS */}
			{(kesimpulanUmum || saranRekomendasiLapangan || catatanLapangan) && (
				<div className='mb-4 space-y-1.5 print:mb-2.5 print:space-y-1'>
					<h4 className='font-bold text-slate-800 text-xs uppercase tracking-wider'>
						C. Telaah Lapangan & Rekomendasi Terpadu
					</h4>
					<div className='space-y-1.5 rounded-lg border border-slate-300 bg-slate-50 p-3 text-xs print:bg-white print:p-2'>
						{kesimpulanUmum && (
							<div>
								<span className='mb-0.5 block font-bold text-slate-900'>Kesimpulan Umum Pengujian:</span>
								<p className='text-slate-700 leading-relaxed'>{kesimpulanUmum}</p>
							</div>
						)}
						{saranRekomendasiLapangan && (
							<div className='border-slate-200 border-t pt-1'>
								<span className='mb-0.5 block font-bold text-slate-900'>Saran & Rekomendasi Petugas:</span>
								<p className='text-slate-700 leading-relaxed'>{saranRekomendasiLapangan}</p>
							</div>
						)}
						{catatanLapangan && (
							<div className='border-slate-200 border-t pt-1'>
								<span className='mb-0.5 block font-bold text-slate-900'>
									Catatan Observasi Fisik Kolam:
								</span>
								<p className='text-slate-600 italic leading-relaxed'>{catatanLapangan}</p>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
