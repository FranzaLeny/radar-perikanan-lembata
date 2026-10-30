import Image from 'next/image';

import { APP_CONFIG, APP_NAME } from '@/lib/constants';

type LhuTandaTanganProps = {
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

export function LhuTandaTangan({
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
}: LhuTandaTanganProps) {
	return (
		<div className='mt-5 border-slate-300 border-t pt-3 print:mt-3 print:pt-2'>
			<table className='w-full border-collapse text-xs'>
				<tbody>
					<tr className='align-top'>
						<td className='w-1/2 p-2 text-center'>
							<p className='mb-12 text-slate-500 print:mb-10'>Petugas Analis / Penguji,</p>
							<p className='font-bold text-slate-900 uppercase underline'>{namaPenguji}</p>
							<p className='text-slate-600 text-xs'>{jabatanPenguji}</p>
							{nipPenguji && <p className='mt-0.5 text-slate-500 text-xs'>{nipPenguji}</p>}
						</td>
						<td className='w-1/2 p-2 text-center'>
							<p className='text-slate-500'>Lewoleba, {formattedDate}</p>
							<p className='mb-12 text-slate-500 print:mb-10'>
								{jabatanPenandatangan || 'Kepala Dinas Perikanan'},
							</p>
							<p className='font-bold text-slate-900 uppercase underline'>{namaPenandatangan || '-'}</p>
							<p className='text-slate-600 text-xs'>{pangkatPenandatangan}</p>
							{nipPenandatangan && <p className='mt-0.5 text-slate-500 text-xs'>NIP. {nipPenandatangan}</p>}
						</td>
					</tr>
				</tbody>
				{qrDataUrl && (
					<tfoot>
						<tr>
							<td className='border-slate-300 border-t border-dashed pt-2.5 text-[11px] text-slate-500 print:pt-1.5' colSpan={2}>
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
			</table>
		</div>
	);
}
