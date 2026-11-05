import { ViewTransition } from 'react';

import { Skeleton } from '@/components/shadcn/skeleton';
import { Spinner } from '@/components/shadcn/spinner';
import { APP_CONFIG } from '@/lib/constants';

export default function CetakLhuLoading() {
	return (
		<ViewTransition exit='slide-down'>
			<div className='fade-in-50 animate-in space-y-6 duration-300'>
				{/* Top Action Bar Skeleton */}
				<div className='no-print flex items-center justify-between'>
					<Skeleton className='h-8 w-44 rounded-md' />
					<Skeleton className='h-9 w-48 rounded-md' />
				</div>

				{/* A4 Document Paper Canvas Skeleton */}
				<div className='flex justify-center'>
					<div className='border-border/60 bg-card w-full max-w-4xl space-y-6 rounded-xl border p-8 shadow-sm sm:p-12'>
						{/* Kop Surat Skeleton */}
						<div className='flex items-center gap-4 border-b-2 pb-6'>
							<Skeleton className='size-16 shrink-0 rounded-lg' />
							<div className='flex-1 space-y-2 text-center'>
								<Skeleton className='mx-auto h-4 w-72' />
								<Skeleton className='mx-auto h-6 w-96' />
								<Skeleton className='mx-auto h-3 w-80' />
							</div>
						</div>

						{/* Document Title & Number */}
						<div className='space-y-2 text-center'>
							<Skeleton className='mx-auto h-6 w-64' />
							<Skeleton className='mx-auto h-4 w-48' />
						</div>

						{/* Metadata Grid Skeleton */}
						<div className='border-border/60 grid grid-cols-1 gap-3 rounded-lg border p-4 sm:grid-cols-2'>
							{Array.from({ length: 6 }).map((_, i) => (
								<div className='space-y-1' key={i}>
									<Skeleton className='h-3 w-24' />
									<Skeleton className='h-4 w-44' />
								</div>
							))}
						</div>

						{/* Parameter Table Skeleton */}
						<div className='space-y-2 pt-2'>
							<Skeleton className='h-10 w-full rounded-md' />
							{Array.from({ length: 6 }).map((_, i) => (
								<Skeleton className='h-9 w-full rounded-md' key={i} />
							))}
						</div>

						{/* Bottom Signature & QR Area */}
						<div className='flex items-end justify-between pt-8'>
							<div className='space-y-2'>
								<Skeleton className='h-3 w-32' />
								<Skeleton className='size-24 rounded-lg' />
								<Skeleton className='h-3 w-28' />
							</div>
							<div className='space-y-2 text-right'>
								<Skeleton className='ml-auto h-3 w-36' />
								<Skeleton className='ml-auto h-16 w-36' />
								<Skeleton className='ml-auto h-4 w-44' />
								<Skeleton className='ml-auto h-3 w-32' />
							</div>
						</div>
					</div>
				</div>

				{/* Subtle Indicator */}
				<div className='text-muted-foreground flex items-center justify-center gap-2 pt-2 text-xs'>
					<Spinner className='text-primary size-3.5' />
					<span>Menyiapkan Lembar Hasil Uji (LHU) {APP_CONFIG.name}...</span>
				</div>
			</div>
		</ViewTransition>
	);
}
