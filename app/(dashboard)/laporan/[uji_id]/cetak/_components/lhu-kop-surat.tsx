import Image from 'next/image';

import { APP_CONFIG, APP_NAME } from '@/lib/constants';

type LhuKopSuratProps = { nomorSampel: string };

export function LhuKopSurat({ nomorSampel }: LhuKopSuratProps) {
	return (
		<>
			{/* KOP RESMI DINAS PERIKANAN KABUPATEN LEMBATA */}
			<div className='relative mb-4 border-slate-900 border-b-4 border-double pb-3 print:mb-2.5 print:pb-2'>
				<div className='flex items-center justify-between gap-3'>
					{/* Logo Lambang Daerah Kabupaten Lembata */}
					<div className='flex w-16 shrink-0 items-center justify-start sm:w-20'>
						<Image
							alt='Logo Pemerintah Kabupaten Lembata'
							className='h-16 w-auto shrink-0 object-contain sm:h-20 print:h-16'
							height={80}
							priority
							src={APP_CONFIG.logo.kabupaten}
							width={80}
						/>
					</div>
					<div className='flex-1 px-1 text-center'>
						<h2 className='font-bold text-slate-900 text-xs uppercase tracking-wider sm:text-sm'>
							{APP_CONFIG.institution.government}
						</h2>
						<h1 className='font-extrabold text-base text-slate-900 uppercase leading-snug tracking-tight sm:text-xl'>
							{APP_CONFIG.institution.name}
						</h1>
						<p className='mt-0.5 font-medium text-[11px] text-slate-700 sm:text-xs'>
							Jl. Trans Lembata, Kel. Lewoleba, Kec. Nubatukan, Kab. Lembata, NTT 86611
						</p>
						<p className='text-[10px] text-slate-600 sm:text-[11px]'>
							Aplikasi: {APP_CONFIG.fullName} ({APP_CONFIG.name}) • Email: {APP_CONFIG.institution.email}
						</p>
					</div>
					{/* Spacer penyeimbang simetris agar teks kop tepat di tengah kertas */}
					<div aria-hidden='true' className='pointer-events-none w-16 shrink-0 sm:w-20' />
				</div>
			</div>

			{/* JUDUL DOKUMEN */}
			<div className='mb-4 text-center print:mb-2.5'>
				<h3 className='font-bold text-base text-slate-900 uppercase tracking-wide underline sm:text-lg'>
					LEMBAR HASIL UJI (LHU) KUALITAS AIR
				</h3>
				<p className='mt-0.5 text-slate-600 text-xs'>
					Nomor: LHU/{APP_NAME}/{nomorSampel}
				</p>
			</div>
		</>
	);
}
