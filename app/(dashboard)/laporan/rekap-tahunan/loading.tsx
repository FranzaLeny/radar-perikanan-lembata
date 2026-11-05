import { ViewTransition } from 'react';

import { Skeleton } from '@/components/shadcn/skeleton';
import { Spinner } from '@/components/shadcn/spinner';
import { APP_CONFIG } from '@/lib/constants';

export default function RekapTahunanLoading() {
	return (
		<ViewTransition exit='slide-down'>
			<div className='fade-in-50 animate-in space-y-6 duration-300'>
				{/* Top Action Bar Skeleton */}
				<div className='border-border bg-muted/30 flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between'>
					<div className='flex items-center gap-3'>
						<Skeleton className='h-8 w-36 rounded-md' />
						<Skeleton className='h-6 w-20 rounded-md' />
					</div>
					<div className='flex items-center gap-2'>
						<Skeleton className='h-8 w-32 rounded-md' />
						<Skeleton className='h-8 w-44 rounded-md' />
					</div>
				</div>

				{/* Summary Metric Cards Skeleton */}
				<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
					{Array.from({ length: 4 }).map((_, i) => (
						<div className='bg-card space-y-2 rounded-xl border p-4 shadow-xs' key={i}>
							<Skeleton className='h-3 w-28' />
							<Skeleton className='h-7 w-20' />
							<Skeleton className='h-3 w-36' />
						</div>
					))}
				</div>

				{/* Annual Matrix Table Skeleton */}
				<div className='bg-card space-y-3 rounded-xl border p-6 shadow-xs'>
					<div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
						<div className='space-y-1.5'>
							<Skeleton className='h-5 w-64' />
							<Skeleton className='h-3.5 w-96 max-w-full' />
						</div>
						<Skeleton className='h-9 w-48 rounded-md' />
					</div>

					<div className='space-y-2 pt-2'>
						<Skeleton className='h-10 w-full rounded-lg' />
						{Array.from({ length: 8 }).map((_, i) => (
							<Skeleton className='h-12 w-full rounded-lg' key={i} />
						))}
					</div>
				</div>

				{/* Subtle Indicator */}
				<div className='text-muted-foreground flex items-center justify-center gap-2 pt-2 text-xs'>
					<Spinner className='text-primary size-3.5' />
					<span>Memuat Matriks Rekapitulasi Mutu Tahunan {APP_CONFIG.name}...</span>
				</div>
			</div>
		</ViewTransition>
	);
}
