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
	const telaahanUmum = [
		{ label: 'Saran & Rekomendasi', value: saranRekomendasiLapangan || '' },
		{ label: 'Catatan', value: catatanLapangan || '' }
	].filter((d) => !!d.value);
	return (
		<>
			{/* KESIMPULAN & REKOMENDASI TEKNIS OTOMATIS */}
			<div className='mb-4 space-y-1.5 print:mb-2.5 print:space-y-1'>
				<h4 className='font-bold text-slate-800 text-xs uppercase tracking-wider'>B. Kesimpulan</h4>

				<div className='rounded-lg border border-slate-300 not-print:bg-slate-50 p-3 text-xs print:p-2'>
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

			{/* TELAAH UMUM & CATATAN LAPANGAN PETUGAS */}
			{telaahanUmum.length > 0 && (
				<div className='mb-4 space-y-1.5 print:mb-2.5 print:space-y-1'>
					<h4 className='font-bold text-slate-800 text-xs uppercase tracking-wider'>
						C. Saran dan Rekomendasi
					</h4>
					<div className='space-y-1.5 rounded-lg border border-slate-300 bg-slate-50 p-3 text-xs print:bg-white print:p-2'>
						{telaahanUmum.map((item) => (
							<div className='even:border-slate-200 even:border-t' key={item.label}>
								<span className='mb-0.5 block font-bold text-slate-900'>{item.label}:</span>
								<p className='text-slate-700 leading-relaxed'>{item.value}</p>
							</div>
						))}
					</div>
				</div>
			)}
		</>
	);
}
