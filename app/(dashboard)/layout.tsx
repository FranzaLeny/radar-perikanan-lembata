import { redirect } from 'next/navigation';
import type React from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { DashboardBreadcrumb } from '@/components/dashboard-breadcrumb';
import { Separator } from '@/components/shadcn/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/shadcn/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { getCurrentUser } from '@/lib/auth';
import { APP_CONFIG } from '@/lib/constants';
export const instant = false;
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const user = await getCurrentUser();

	if (!user) {
		redirect('/login');
	}

	return (
		<SidebarProvider className='print:block print:min-h-0 print:w-full print:bg-transparent'>
			<AppSidebar className='no-print print:hidden' user={user} />
			<SidebarInset className='print:m-0 print:w-full print:bg-transparent print:p-0 print:shadow-none'>
				<header className='no-print bg-background/95 sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur-xs transition-[width,height] ease-linear'>
					<div className='flex items-center gap-2'>
						<SidebarTrigger className='-ml-1' />
						<Separator className='mr-2' orientation='vertical' />
						<DashboardBreadcrumb />
					</div>
					<div className='flex items-center gap-2'>
						<ThemeToggle />
					</div>
				</header>
				<main className='bg-muted/15 flex-1 overflow-auto p-4 md:p-6 lg:p-8 print:m-0 print:w-full print:overflow-visible print:bg-white print:p-0'>
					{children}
				</main>
				<footer className='no-print border-border bg-background/80 text-muted-foreground flex flex-col items-center justify-between gap-2 border-t px-6 py-3 text-center text-xs backdrop-blur-xs sm:flex-row'>
					<p>{APP_CONFIG.author.copyrightText}</p>
					<p className='text-muted-foreground font-medium'>{APP_CONFIG.author.credit}</p>
				</footer>
			</SidebarInset>
		</SidebarProvider>
	);
}
