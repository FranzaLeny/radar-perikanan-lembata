import { ViewTransition } from 'react';

import { Skeleton } from '@/components/shadcn/skeleton';
import { Spinner } from '@/components/shadcn/spinner';
import { APP_CONFIG } from '@/lib/constants';

export default function LokasiKolamLoading() {
	return (
		<ViewTransition exit='slide-down'>
			<div className='fade-in-50 animate-in space-y-6 duration-300'>
				{/* Header Skeleton */}
				<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
					<div className='space-y-1.5'>
						<Skeleton className='h-5 w-40 rounded-full' />
						<Skeleton className='h-8 w-80' />
						<Skeleton className='h-4 w-96 max-w-full' />
					</div>
					<Skeleton className='h-9 w-44 rounded-md' />
				</div>

				{/* Filter Bar Skeleton */}
				<div className='bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between'>
					<Skeleton className='h-9 w-full max-w-sm rounded-md' />
					<div className='flex items-center gap-2'>
						<Skeleton className='h-9 w-44 rounded-md' />
						<Skeleton className='h-9 w-24 rounded-md' />
					</div>
				</div>

				{/* Table Container Skeleton */}
				<div className='bg-card space-y-4 rounded-xl border p-6 shadow-xs'>
					<div className='flex items-center justify-between pb-2'>
						<Skeleton className='h-5 w-48' />
						<Skeleton className='h-4 w-32' />
					</div>
					<Skeleton className='h-10 w-full rounded-md' />
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton className='h-14 w-full rounded-md' key={i} />
					))}
				</div>

				{/* Subtle Indicator */}
				<div className='text-muted-foreground flex items-center justify-center gap-2 pt-2 text-xs'>
					<Spinner className='text-primary size-3.5' />
					<span>Memuat Master Lokasi Kolam Pokdakan {APP_CONFIG.name}...</span>
				</div>
			</div>
		</ViewTransition>
	);
}
