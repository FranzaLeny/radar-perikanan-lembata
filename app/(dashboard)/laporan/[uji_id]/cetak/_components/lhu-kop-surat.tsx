import Image from 'next/image';

import { APP_CONFIG, BRAND_NAME } from '@/lib/constants';

type LhuKopSuratProps = { nomorSampel: string };

export function LhuKopSurat({ nomorSampel }: LhuKopSuratProps) {
	return (
		<>
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
				<h1 className='text-sm font-bold tracking-wide uppercase underline'>
					Lembar Hasil Uji (LHU) Kualitas Air
				</h1>
				<p className='mt-0.5 text-xs font-semibold uppercase'>
					Nomor: LHU/{BRAND_NAME}/{nomorSampel}
				</p>
			</div>
		</>
	);
}
