import Image from 'next/image';

import { APP_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

export type SiteFooterProps = { className?: string };

export function SiteFooter({ className }: SiteFooterProps) {
	return (
		<footer
			className={cn(
				'border-border/80 bg-muted/20 text-muted-foreground w-full border-t py-8 text-center text-xs',
				className
			)}
		>
			<div className='mx-auto max-w-7xl space-y-2 px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-center gap-2'>
					<Image
						alt='Logo Lembata'
						className='h-5 w-auto object-contain'
						height={20}
						src={APP_CONFIG.logo.kabupaten}
						width={16}
					/>
					<span className='text-foreground font-bold'>
						{APP_CONFIG.name} — {APP_CONFIG.institution.name}
					</span>
				</div>
				<p>{APP_CONFIG.fullName}</p>
				<p className='text-muted-foreground pt-1 font-medium'>
					{APP_CONFIG.author.copyrightText} • {APP_CONFIG.author.credit}
				</p>
			</div>
		</footer>
	);
}
