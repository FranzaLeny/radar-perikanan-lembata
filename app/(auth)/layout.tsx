import type React from 'react';

import { ThemeToggle } from '@/components/theme-toggle';
import { APP_CONFIG } from '@/lib/constants';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4 text-foreground sm:p-6 lg:p-8'>
			{/* Dynamic Background Glows */}
			<div className='pointer-events-none absolute top-[-20%] left-[-10%] h-125 w-125 rounded-full bg-primary/10 blur-[120px]' />
			<div className='pointer-events-none absolute right-[-10%] bottom-[-20%] h-125 w-125 rounded-full bg-primary/10 blur-[120px]' />

			{/* Top right theme toggle */}
			<div className='absolute top-4 right-4 z-20'>
				<ThemeToggle />
			</div>

			<main className='relative z-10 w-full max-w-md'>{children}</main>

			<footer className='relative z-10 mt-8 space-y-1 text-center text-muted-foreground text-xs'>
				<p>
					© {APP_CONFIG.author.copyrightYear} {APP_CONFIG.institution.name} • {APP_CONFIG.name}{' '}
					{APP_CONFIG.versionLabel}
				</p>
				<p>{APP_CONFIG.fullName}</p>
				<p className='font-medium text-foreground/80'>{APP_CONFIG.author.shortCredit}</p>
			</footer>
		</div>
	);
}
