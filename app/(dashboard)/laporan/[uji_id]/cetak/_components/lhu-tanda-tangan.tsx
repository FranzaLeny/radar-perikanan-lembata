type LhuTandaTanganProps = {
	formattedDate: string;
	namaPenguji: string;
	jabatanPenguji: string;
	nipPenguji?: string;
	namaPenandatangan?: string;
	jabatanPenandatangan?: string;
	pangkatPenandatangan?: string;
	nipPenandatangan?: string;
};

export function LhuTandaTangan({
	formattedDate,
	namaPenguji,
	jabatanPenguji,
	nipPenguji,
	namaPenandatangan,
	jabatanPenandatangan,
	pangkatPenandatangan,
	nipPenandatangan
}: LhuTandaTanganProps) {
	return (
		<div className='mt-5 grid grid-cols-2 gap-8 border-slate-300 border-t pt-3 text-xs print:mt-3 print:pt-2'>
			<div className='text-center'>
				<p className='mb-10 text-slate-500 print:mb-8'>Petugas Analis / Penguji,</p>
				<p className='font-bold text-slate-900 uppercase underline'>{namaPenguji}</p>
				<p className='text-slate-600 text-xs'>{jabatanPenguji}</p>
				{nipPenguji && <p className='mt-0.5 text-slate-500 text-xs'>{nipPenguji}</p>}
			</div>

			<div className='text-center'>
				<p className='text-slate-500'>Lewoleba, {formattedDate}</p>
				<p className='mb-9 text-slate-500 print:mb-7'>
					{jabatanPenandatangan || 'Kepala Dinas Perikanan'},
				</p>
				<p className='font-bold text-slate-900 uppercase underline'>{namaPenandatangan || '-'}</p>
				<p className='text-slate-600 text-xs'>{pangkatPenandatangan}</p>
				{nipPenandatangan && <p className='mt-0.5 text-slate-500 text-xs'>NIP. {nipPenandatangan}</p>}
			</div>
		</div>
	);
}
