import { ViewTransition } from 'react';

import { Skeleton } from '@/components/shadcn/skeleton';
import { Spinner } from '@/components/shadcn/spinner';
import { APP_CONFIG } from '@/lib/constants';

export default function DashboardLoading() {
	return (
		<ViewTransition exit='slide-down'>
			<div className='fade-in-50 animate-in space-y-6 duration-300'>
				{/* Welcome Banner Skeleton */}
				<div className='bg-card relative overflow-hidden rounded-2xl border p-6 shadow-sm sm:p-8'>
					<div className='max-w-2xl space-y-3'>
						<Skeleton className='h-5 w-36 rounded-full' />
						<Skeleton className='h-8 w-80' />
						<Skeleton className='h-4 w-full max-w-xl' />
					</div>
				</div>

				{/* 4 KPI Grid Cards Skeleton */}
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
					{Array.from({ length: 4 }).map((_, i) => (
						<div className='bg-card space-y-3 rounded-xl border p-5 shadow-xs' key={i}>
							<div className='flex items-center justify-between'>
								<Skeleton className='h-4 w-28' />
								<Skeleton className='size-9 rounded-xl' />
							</div>
							<Skeleton className='h-8 w-24' />
							<Skeleton className='h-3.5 w-36' />
						</div>
					))}
				</div>

				{/* 2 Column Content Grid Skeleton (Baku Mutu + Recent Tests) */}
				<div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
					{/* Baku Mutu Overview */}
					<div className='bg-card space-y-4 rounded-xl border p-6 shadow-xs'>
						<div className='flex items-center justify-between'>
							<Skeleton className='h-5 w-40' />
							<Skeleton className='h-7 w-20 rounded-md' />
						</div>
						<div className='space-y-3'>
							{Array.from({ length: 5 }).map((_, i) => (
								<div className='space-y-1.5 rounded-lg border p-3' key={i}>
									<Skeleton className='h-4 w-32' />
									<Skeleton className='h-3 w-48' />
								</div>
							))}
						</div>
					</div>

					{/* Recent Tests Table */}
					<div className='bg-card space-y-4 rounded-xl border p-6 shadow-xs lg:col-span-2'>
						<div className='flex items-center justify-between'>
							<Skeleton className='h-5 w-48' />
							<Skeleton className='h-7 w-28 rounded-md' />
						</div>
						<div className='space-y-3'>
							<Skeleton className='h-10 w-full rounded-md' />
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton className='h-12 w-full rounded-md' key={i} />
							))}
						</div>
					</div>
				</div>

				{/* Subtle Indicator */}
				<div className='text-muted-foreground flex items-center justify-center gap-2 pt-2 text-xs'>
					<Spinner className='text-primary size-3.5' />
					<span>Memuat Ringkasan Dasbor {APP_CONFIG.name}...</span>
				</div>
			</div>
		</ViewTransition>
	);
}
