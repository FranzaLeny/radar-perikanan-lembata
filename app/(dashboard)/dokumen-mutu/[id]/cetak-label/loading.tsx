import { ViewTransition } from 'react';

import { Skeleton } from '@/components/shadcn/skeleton';
import { Spinner } from '@/components/shadcn/spinner';
import { APP_CONFIG } from '@/lib/constants';

export default function CetakLabelDokumenLoading() {
	return (
		<ViewTransition exit='slide-down'>
			<div className='fade-in-50 animate-in space-y-6 duration-300'>
				{/* Action Bar Skeleton */}
				<div className='no-print flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
					<Skeleton className='h-8 w-56 rounded-md' />
					<div className='flex items-center gap-2'>
						<Skeleton className='h-9 w-48 rounded-md' />
						<Skeleton className='h-9 w-36 rounded-md' />
					</div>
				</div>

				{/* Label Card Canvas Skeleton */}
				<div className='flex justify-center'>
					<div className='border-border/80 bg-card w-full max-w-md space-y-6 rounded-2xl border p-8 text-center shadow-lg'>
						{/* Header Dinas & System */}
						<div className='flex items-center justify-center gap-3 border-b pb-4'>
							<Skeleton className='size-12 rounded-lg' />
							<div className='space-y-1.5 text-left'>
								<Skeleton className='h-4 w-36' />
								<Skeleton className='h-3 w-48' />
							</div>
						</div>

						{/* Document Title & Badge */}
						<div className='space-y-2'>
							<Skeleton className='mx-auto h-5 w-28 rounded-full' />
							<Skeleton className='mx-auto h-6 w-64' />
							<Skeleton className='mx-auto h-4 w-40' />
						</div>

						{/* QR Code Canvas Box */}
						<div className='flex justify-center py-2'>
							<div className='space-y-2 rounded-xl border p-4'>
								<Skeleton className='size-48 rounded-lg' />
								<Skeleton className='mx-auto h-3 w-32' />
							</div>
						</div>

						{/* Footer Security / Hash */}
						<div className='border-t pt-3'>
							<Skeleton className='mx-auto h-3 w-56' />
						</div>
					</div>
				</div>

				{/* Subtle Indicator */}
				<div className='text-muted-foreground flex items-center justify-center gap-2 pt-2 text-xs'>
					<Spinner className='text-primary size-3.5' />
					<span>Menyiapkan Label QR Dokumen Mutu {APP_CONFIG.name}...</span>
				</div>
			</div>
		</ViewTransition>
	);
}
