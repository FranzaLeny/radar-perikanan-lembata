import Image from 'next/image';

import { APP_CONFIG, APP_NAME } from '@/lib/constants';

type LhuFooterQrProps = { qrDataUrl: string; ujiId: string };

export function LhuFooterQr({ qrDataUrl, ujiId }: LhuFooterQrProps) {
	return (
		<div className='mt-5 flex items-center justify-between border-slate-300 border-t border-dashed pt-2.5 text-[11px] text-slate-500 print:mt-2.5 print:pt-1.5'>
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
				<span>ID: {ujiId.substring(0, 18)}</span>
				<p>Dicetak melalui {APP_NAME}</p>
			</div>
		</div>
	);
}
