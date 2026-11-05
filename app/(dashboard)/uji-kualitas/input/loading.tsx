import { ViewTransition } from 'react';

import { Skeleton } from '@/components/shadcn/skeleton';
import { Spinner } from '@/components/shadcn/spinner';
import { APP_CONFIG } from '@/lib/constants';

export default function InputUjiKualitasLoading() {
	return (
		<ViewTransition exit='slide-down'>
			<div className='fade-in-50 animate-in space-y-6 duration-300'>
				{/* Header Skeleton */}
				<div>
					<Skeleton className='mb-2 h-7 w-48 rounded-md' />
					<Skeleton className='h-5 w-40 rounded-full' />
					<Skeleton className='mt-2 h-8 w-72' />
					<Skeleton className='mt-1 h-4 w-96 max-w-full' />
				</div>

				{/* Form Container Skeleton */}
				<div className='space-y-6'>
					{/* Section 1: Lokasi & Sampling Info */}
					<div className='bg-card space-y-4 rounded-xl border p-6 shadow-xs'>
						<Skeleton className='h-5 w-44' />
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-28' />
								<Skeleton className='h-10 w-full rounded-md' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-32' />
								<Skeleton className='h-10 w-full rounded-md' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-36' />
								<Skeleton className='h-10 w-full rounded-md' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-40' />
								<Skeleton className='h-10 w-full rounded-md' />
							</div>
						</div>
					</div>

					{/* Section 2: Parameter Measurements Grid */}
					<div className='bg-card space-y-4 rounded-xl border p-6 shadow-xs'>
						<div className='flex items-center justify-between'>
							<div className='space-y-1'>
								<Skeleton className='h-5 w-52' />
								<Skeleton className='h-3.5 w-72' />
							</div>
							<Skeleton className='h-8 w-32 rounded-md' />
						</div>

						<div className='grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3'>
							{Array.from({ length: 6 }).map((_, i) => (
								<div className='space-y-2 rounded-lg border p-4' key={i}>
									<Skeleton className='h-4 w-32' />
									<Skeleton className='h-3 w-40' />
									<Skeleton className='h-10 w-full rounded-md' />
								</div>
							))}
						</div>
					</div>

					{/* Action Buttons Skeleton */}
					<div className='flex items-center justify-end gap-3'>
						<Skeleton className='h-10 w-28 rounded-md' />
						<Skeleton className='h-10 w-44 rounded-md' />
					</div>
				</div>

				{/* Subtle Indicator */}
				<div className='text-muted-foreground flex items-center justify-center gap-2 pt-2 text-xs'>
					<Spinner className='text-primary size-3.5' />
					<span>Menyiapkan Formulir Pengujian Lapangan {APP_CONFIG.name}...</span>
				</div>
			</div>
		</ViewTransition>
	);
}
