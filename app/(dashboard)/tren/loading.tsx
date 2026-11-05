import { ViewTransition } from 'react';

import { Skeleton } from '@/components/shadcn/skeleton';
import { Spinner } from '@/components/shadcn/spinner';
import { APP_CONFIG } from '@/lib/constants';

export default function TrenLoading() {
	return (
		<ViewTransition exit='slide-down'>
			<div className='fade-in-50 animate-in space-y-6 duration-300'>
				{/* Header Skeleton */}
				<div>
					<Skeleton className='mb-1.5 h-5 w-44 rounded-full' />
					<Skeleton className='h-8 w-80' />
					<Skeleton className='mt-1 h-4 w-96 max-w-full' />
				</div>

				{/* Filter Bar Skeleton */}
				<div className='bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between'>
					<div className='flex flex-wrap items-center gap-2'>
						<Skeleton className='h-9 w-48 rounded-md' />
						<Skeleton className='h-9 w-44 rounded-md' />
						<Skeleton className='h-9 w-36 rounded-md' />
					</div>
					<Skeleton className='h-9 w-28 rounded-md' />
				</div>

				{/* Chart Canvas Card Skeleton */}
				<div className='bg-card space-y-4 rounded-xl border p-6 shadow-xs'>
					<div className='flex items-center justify-between'>
						<div className='space-y-1'>
							<Skeleton className='h-5 w-56' />
							<Skeleton className='h-3.5 w-72' />
						</div>
						<Skeleton className='h-7 w-32 rounded-md' />
					</div>
					<div className='flex h-80 items-end gap-3 pt-6 pb-2'>
						{Array.from({ length: 12 }).map((_, i) => (
							<Skeleton
								className='flex-1 rounded-t-md'
								key={i}
								style={{ height: `${30 + ((i * 19) % 65)}%` }}
							/>
						))}
					</div>
				</div>

				{/* History Data Table Skeleton */}
				<div className='bg-card space-y-3 rounded-xl border p-6 shadow-xs'>
					<Skeleton className='h-5 w-48' />
					<Skeleton className='h-10 w-full rounded-md' />
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton className='h-12 w-full rounded-md' key={i} />
					))}
				</div>

				{/* Subtle Indicator */}
				<div className='text-muted-foreground flex items-center justify-center gap-2 pt-2 text-xs'>
					<Spinner className='text-primary size-3.5' />
					<span>Memuat Visualisasi Grafik Tren {APP_CONFIG.name}...</span>
				</div>
			</div>
		</ViewTransition>
	);
}
