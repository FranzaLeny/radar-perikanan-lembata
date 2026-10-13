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
				'sticky top-0 z-50 w-full border-border/30 border-b bg-background/60 backdrop-blur-md',
				className
			)}
		>
			<div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
				{/* Brand Logo & Name (Clickable link back to Home) */}
				<Link
					className='group flex items-center gap-3 transition-opacity hover:opacity-90'
					href='/'
					title='Kembali ke Beranda RADAR Lembata'
				>
					<div className='flex size-10 items-center justify-center rounded-xl bg-primary/10 p-1.5 ring-1 ring-primary/20 transition-transform duration-200 group-hover:scale-105'>
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
							<span className='font-bold font-heading text-base text-foreground tracking-tight'>
								{BRAND_NAME}
							</span>
							<Badge
								className='border-primary/30 bg-primary/10 px-1.5 py-0 font-semibold text-[10px] text-primary'
								variant='outline'
							>
								Lembata
							</Badge>
						</div>
						<p className='font-medium text-[11px] text-muted-foreground'>
							{APP_CONFIG.institution.shortName}
						</p>
					</div>
				</Link>

				{/* Navigation Links */}
				{showNavLinks && (
					<nav className='hidden items-center gap-6 font-medium text-muted-foreground text-xs md:flex'>
						<Link
							className='transition-colors hover:text-foreground'
							href={isHome ? '#keunggulan' : '/#keunggulan'}
						>
							Keunggulan
						</Link>
						<Link
							className='transition-colors hover:text-foreground'
							href={isHome ? '#alur-kerja' : '/#alur-kerja'}
						>
							Alur Kerja
						</Link>
						<Link
							className='transition-colors hover:text-foreground'
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
								<Home className='size-3.5 text-primary' />
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
