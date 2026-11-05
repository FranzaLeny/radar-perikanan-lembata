import { ViewTransition } from 'react';

import { Skeleton } from '@/components/shadcn/skeleton';
import { Spinner } from '@/components/shadcn/spinner';
import { APP_CONFIG } from '@/lib/constants';

export default function KategoriDokumenLoading() {
	return (
		<ViewTransition exit='slide-down'>
			<div className='fade-in-50 animate-in space-y-6 duration-300'>
				{/* Header Skeleton */}
				<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
					<div className='space-y-1.5'>
						<Skeleton className='mb-1 h-7 w-52 rounded-md' />
						<Skeleton className='h-8 w-80' />
						<Skeleton className='h-4 w-96 max-w-full' />
					</div>
					<Skeleton className='h-9 w-40 rounded-md' />
				</div>

				{/* Category Hierarchy Table Skeleton */}
				<div className='bg-card space-y-4 rounded-xl border p-6 shadow-xs'>
					<div className='flex items-center justify-between'>
						<div className='space-y-1'>
							<Skeleton className='h-5 w-48' />
							<Skeleton className='h-3.5 w-64' />
						</div>
						<Skeleton className='h-8 w-44 rounded-md' />
					</div>

					<div className='space-y-3 pt-2'>
						<Skeleton className='h-10 w-full rounded-md' />
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton className='h-12 w-full rounded-md' key={i} />
						))}
					</div>
				</div>

				{/* Subtle Indicator */}
				<div className='text-muted-foreground flex items-center justify-center gap-2 pt-2 text-xs'>
					<Spinner className='text-primary size-3.5' />
					<span>Memuat Kategori Dokumen Mutu {APP_CONFIG.name}...</span>
				</div>
			</div>
		</ViewTransition>
	);
}
