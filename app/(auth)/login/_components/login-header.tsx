import Image from 'next/image';

import { CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { APP_CONFIG } from '@/lib/constants';

export function LoginHeader() {
	return (
		<CardHeader className='pb-4 text-center'>
			<div className='mb-3 flex items-center justify-center gap-4'>
				<Image
					alt='Logo Pemerintah Kabupaten Lembata'
					className='h-14 w-auto object-contain drop-shadow-xs'
					height={56}
					priority
					src={APP_CONFIG.logo.kabupaten}
					width={56}
				/>
				<div className='h-10 w-px bg-border/80' />
				<Image
					alt={`Logo ${APP_CONFIG.name}`}
					className='h-14 w-auto object-contain drop-shadow-xs'
					height={56}
					priority
					src={APP_CONFIG.logo.app}
					width={56}
				/>
			</div>
			<CardTitle className='font-bold font-heading text-2xl tracking-tight'>
				{APP_CONFIG.name}
			</CardTitle>
			<CardDescription className='font-semibold text-foreground text-xs'>
				{APP_CONFIG.fullName}
			</CardDescription>
			<p className='mt-1 text-muted-foreground text-xs'>{APP_CONFIG.institution.name}</p>
		</CardHeader>
	);
}
