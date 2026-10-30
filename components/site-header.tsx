'use client';

import { ArrowRight, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { APP_CONFIG, BRAND_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

export type SiteHeaderProps = {
	className?: string;
	showNavLinks?: boolean;
	action?: React.ReactNode;
};

export function SiteHeader({ className, showNavLinks = true, action }: SiteHeaderProps) {
	const pathname = usePathname();
	const isHome = pathname === '/';
	const isAuth = pathname === '/login' || pathname?.startsWith('/login');

	return (
		<header
			className={cn(
				'border-border/30 bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md',
				className
			)}
		>
			<div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
				{/* Brand Logo & Name (Clickable link back to Home) */}
				<Link
					className='group flex items-center gap-3 transition-opacity hover:opacity-90'
					href='/'
					title={`Kembali ke Beranda ${APP_CONFIG.name} Lembata`}
				>
					<div className='bg-primary/10 ring-primary/20 flex size-10 items-center justify-center rounded-xl p-1.5 ring-1 transition-transform duration-200 group-hover:scale-105'>
						<Image
							alt='Logo Kabupaten Lembata'
							className='h-full w-auto object-contain'
							height={40}
							priority
							src={APP_CONFIG.logo.kabupaten}
							width={32}
						/>
					</div>
					<div>
						<div className='flex items-center gap-1.5'>
							<span className='font-heading text-foreground text-base font-bold tracking-tight'>
								{BRAND_NAME}
							</span>
							<Badge
								className='border-primary/30 bg-primary/10 text-primary px-1.5 py-0 text-[10px] font-semibold'
								variant='outline'
							>
								Lembata
							</Badge>
						</div>
						<p className='text-muted-foreground text-[11px] font-medium'>
							{APP_CONFIG.institution.shortName}
						</p>
					</div>
				</Link>

				{/* Navigation Links */}
				{showNavLinks && (
					<nav className='text-muted-foreground hidden items-center gap-6 text-xs font-medium md:flex'>
						<Link
							className='hover:text-foreground transition-colors'
							href={isHome ? '#keunggulan' : '/#keunggulan'}
						>
							Keunggulan
						</Link>
						<Link
							className='hover:text-foreground transition-colors'
							href={isHome ? '#alur-kerja' : '/#alur-kerja'}
						>
							Alur Kerja
						</Link>
						<Link
							className='hover:text-foreground transition-colors'
							href={isHome ? '#baku-mutu' : '/#baku-mutu'}
						>
							Standar Baku Mutu
						</Link>
					</nav>
				)}

				{/* Actions */}
				<div className='flex items-center gap-2.5'>
					<ThemeToggle />
					{action ? (
						action
					) : isAuth ? (
						<Link href='/'>
							<Button className='cursor-pointer gap-2 shadow-xs' size='sm' variant='outline'>
								<Home className='text-primary size-3.5' />
								<span className='hidden sm:inline'>Kembali ke </span>
								<span>Beranda</span>
							</Button>
						</Link>
					) : (
						<Link href='/login'>
							<Button className='cursor-pointer gap-2 shadow-xs' size='sm'>
								<span>Masuk Portal</span>
								<ArrowRight className='size-3.5' />
							</Button>
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}
