type LhuMetadataCardProps = {
	nomorSampel: string;
	formattedDate: string;
	namaPokdakan?: string;
	pemilik?: string;
	desa?: string;
	kecamatan?: string;
	komoditasIkan?: string | null;
	sopAcuan: string;
	suhuLingkungan?: string | null;
};

export function LhuMetadataCard({
	nomorSampel,
	formattedDate,
	namaPokdakan,
	pemilik,
	desa,
	kecamatan,
	komoditasIkan,
	sopAcuan,
	suhuLingkungan
}: LhuMetadataCardProps) {
	return (
		<div className='mb-4 grid grid-cols-2 gap-x-6 gap-y-1.5 rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-xs print:mb-2.5 print:border-slate-300 print:bg-white print:p-2'>
			<div>
				<span className='block text-slate-500 text-xs'>Nomor Sampel:</span>
				<span className='font-bold text-slate-900'>{nomorSampel}</span>
			</div>
			<div>
				<span className='block text-slate-500 text-xs'>Tanggal Pengambilan:</span>
				<span className='font-semibold text-slate-900'>{formattedDate}</span>
			</div>
			<div>
				<span className='block text-slate-500 text-xs'>Kelompok Pembudidaya (Pokdakan):</span>
				<span className='font-semibold text-slate-900'>
					{namaPokdakan || '-'} {pemilik ? `(${pemilik})` : ''}
				</span>
			</div>
			<div>
				<span className='block text-slate-500 text-xs'>Wilayah Kolam:</span>
				<span className='font-semibold text-slate-900'>
					Desa {desa || '-'}, Kec. {kecamatan || '-'}
				</span>
			</div>
			<div>
				<span className='block text-slate-500 text-xs'>Komoditas Budidaya:</span>
				<span className='font-semibold text-slate-900'>{komoditasIkan || 'Ikan Air Tawar/Payau'}</span>
			</div>
			<div>
				<span className='block text-slate-500 text-xs'>SOP Acuan Pelaksanaan:</span>
				<span className='font-semibold text-slate-900'>{sopAcuan}</span>
			</div>
			{suhuLingkungan && (
				<div>
					<span className='block text-slate-500 text-xs'>Suhu Udara / Lingkungan:</span>
					<span className='font-semibold text-slate-900'>{suhuLingkungan} °C</span>
				</div>
			)}
		</div>
	);
}
