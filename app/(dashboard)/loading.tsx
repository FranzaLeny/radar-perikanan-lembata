import { Skeleton } from '@/components/shadcn/skeleton';
import { Spinner } from '@/components/shadcn/spinner';

export default function DashboardLoading() {
	return (
		<div className='fade-in-50 animate-in space-y-6 duration-300'>
			{/* Header Skeleton */}
			<div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
				<div className='space-y-2'>
					<Skeleton className='h-4 w-32' />
					<Skeleton className='h-8 w-64' />
					<Skeleton className='h-4 w-96 max-w-full' />
				</div>
				<div className='flex items-center gap-2'>
					<Skeleton className='h-9 w-28 rounded-lg' />
					<Skeleton className='h-9 w-36 rounded-lg' />
				</div>
			</div>

			{/* Top Metric Cards Skeleton */}
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div className='space-y-3 rounded-xl border bg-card p-5 shadow-xs' key={i}>
						<div className='flex items-center justify-between'>
							<Skeleton className='h-4 w-24' />
							<Skeleton className='size-8 rounded-lg' />
						</div>
						<Skeleton className='h-7 w-20' />
						<Skeleton className='h-3 w-36' />
					</div>
				))}
			</div>

			{/* Main Content Area / Table Skeleton */}
			<div className='space-y-4 rounded-xl border bg-card p-6 shadow-xs'>
				<div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
					<Skeleton className='h-6 w-48' />
					<div className='flex items-center gap-2'>
						<Skeleton className='h-9 w-40 rounded-md' />
						<Skeleton className='h-9 w-24 rounded-md' />
					</div>
				</div>

				<div className='space-y-3 pt-2'>
					<Skeleton className='h-10 w-full rounded-lg' />
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton className='h-14 w-full rounded-lg' key={i} />
					))}
				</div>

				{/* Floating Subtle Indicator */}
				<div className='flex items-center justify-center gap-2 pt-4 text-muted-foreground text-xs'>
					<Spinner className='size-3.5 text-primary' />
					<span>Memuat data sistem RADAR...</span>
				</div>
			</div>
		</div>
	);
}
