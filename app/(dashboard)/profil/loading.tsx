import { ViewTransition } from 'react';

import { Skeleton } from '@/components/shadcn/skeleton';
import { Spinner } from '@/components/shadcn/spinner';
import { APP_CONFIG } from '@/lib/constants';

export default function ProfilLoading() {
	return (
		<ViewTransition exit='slide-down'>
			<div className='fade-in-50 animate-in space-y-6 duration-300'>
				{/* Header Skeleton */}
				<div>
					<Skeleton className='mb-1.5 h-5 w-32 rounded-full' />
					<Skeleton className='h-8 w-64' />
					<Skeleton className='mt-1 h-4 w-96 max-w-full' />
				</div>

				{/* User Info Overview Card Skeleton */}
				<div className='bg-card flex flex-col items-start gap-4 rounded-xl border p-6 shadow-xs sm:flex-row sm:items-center'>
					<Skeleton className='size-16 rounded-full' />
					<div className='space-y-2'>
						<div className='flex items-center gap-2'>
							<Skeleton className='h-6 w-48' />
							<Skeleton className='h-5 w-24 rounded-full' />
						</div>
						<Skeleton className='h-4 w-60' />
					</div>
				</div>

				{/* 2 Column Settings Form Cards Skeleton */}
				<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
					{/* Card 1: Data Diri */}
					<div className='bg-card space-y-4 rounded-xl border p-6 shadow-xs'>
						<div className='space-y-1 border-b pb-3'>
							<Skeleton className='h-5 w-40' />
							<Skeleton className='h-3.5 w-64' />
						</div>
						<div className='space-y-3'>
							<div className='space-y-1.5'>
								<Skeleton className='h-4 w-28' />
								<Skeleton className='h-10 w-full rounded-md' />
							</div>
							<div className='space-y-1.5'>
								<Skeleton className='h-4 w-24' />
								<Skeleton className='h-10 w-full rounded-md' />
							</div>
							<div className='pt-2'>
								<Skeleton className='h-9 w-36 rounded-md' />
							</div>
						</div>
					</div>

					{/* Card 2: Keamanan / Password */}
					<div className='bg-card space-y-4 rounded-xl border p-6 shadow-xs'>
						<div className='space-y-1 border-b pb-3'>
							<Skeleton className='h-5 w-44' />
							<Skeleton className='h-3.5 w-64' />
						</div>
						<div className='space-y-3'>
							<div className='space-y-1.5'>
								<Skeleton className='h-4 w-32' />
								<Skeleton className='h-10 w-full rounded-md' />
							</div>
							<div className='space-y-1.5'>
								<Skeleton className='h-4 w-32' />
								<Skeleton className='h-10 w-full rounded-md' />
							</div>
							<div className='pt-2'>
								<Skeleton className='h-9 w-36 rounded-md' />
							</div>
						</div>
					</div>
				</div>

				{/* Subtle Indicator */}
				<div className='text-muted-foreground flex items-center justify-center gap-2 pt-2 text-xs'>
					<Spinner className='text-primary size-3.5' />
					<span>Memuat Profil Pengguna {APP_CONFIG.name}...</span>
				</div>
			</div>
		</ViewTransition>
	);
}
