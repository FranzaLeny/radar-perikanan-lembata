import { ViewTransition } from 'react';

import { Skeleton } from '@/components/shadcn/skeleton';
import { Spinner } from '@/components/shadcn/spinner';
import { APP_CONFIG } from '@/lib/constants';

export default function LaporanLoading() {
	return (
		<ViewTransition exit='slide-down'>
			<div className='fade-in-50 animate-in space-y-6 duration-300'>
				{/* Header Skeleton */}
				<div>
					<Skeleton className='mb-1 h-4 w-44' />
					<Skeleton className='h-8 w-80' />
					<Skeleton className='mt-1 h-4 w-96 max-w-full' />
				</div>

				{/* 2 Featured Report Cards Skeleton */}
				<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
					{Array.from({ length: 2 }).map((_, i) => (
						<div className='bg-card space-y-3 rounded-xl border p-6 shadow-xs' key={i}>
							<Skeleton className='size-10 rounded-xl' />
							<Skeleton className='h-6 w-64' />
							<Skeleton className='h-4 w-full' />
							<Skeleton className='h-4 w-3/4' />
							<div className='pt-2'>
								<Skeleton className='h-9 w-48 rounded-md' />
							</div>
						</div>
					))}
				</div>

				{/* LHU Table Container Skeleton */}
				<div className='bg-card space-y-4 rounded-xl border p-6 shadow-xs'>
					<div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
						<div className='space-y-1'>
							<Skeleton className='h-5 w-56' />
							<Skeleton className='h-3.5 w-72' />
						</div>
						<Skeleton className='h-9 w-64 rounded-md' />
					</div>

					<div className='space-y-3 pt-2'>
						<Skeleton className='h-10 w-full rounded-md' />
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton className='h-14 w-full rounded-md' key={i} />
						))}
					</div>
				</div>

				{/* Subtle Indicator */}
				<div className='text-muted-foreground flex items-center justify-center gap-2 pt-2 text-xs'>
					<Spinner className='text-primary size-3.5' />
					<span>Memuat Pusat Laporan Hasil Uji (LHU) {APP_CONFIG.name}...</span>
				</div>
			</div>
		</ViewTransition>
	);
}
