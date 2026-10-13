import { redirect } from 'next/navigation';
import type React from 'react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getCurrentUser } from '@/lib/auth';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
	const user = await getCurrentUser();
	if (user) {
		redirect('/dashboard');
	}
	return (
		<div className='relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary'>
			{/* Dynamic Background Glows */}
			<div className='pointer-events-none absolute top-[-20%] left-[-10%] h-125 w-125 rounded-full bg-primary/10 blur-[120px]' />
			<div className='pointer-events-none absolute right-[-10%] bottom-[-20%] h-125 w-125 rounded-full bg-primary/10 blur-[120px]' />

			{/* Reusable Navbar Header */}
			<SiteHeader />

			{/* Centered Login Card Main Area */}
			<main className='relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8'>
				<div className='w-full max-w-md'>{children}</div>
			</main>

			{/* Reusable Footer */}
			<SiteFooter />
		</div>
	);
}
