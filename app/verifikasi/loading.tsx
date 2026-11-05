import { ViewTransition } from 'react';

import { Card, CardContent, CardHeader } from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';
import { Spinner } from '@/components/shadcn/spinner';

export default function VerifikasiLoading() {
	return (
		<ViewTransition exit='slide-down'>
			<div className='bg-background flex min-h-screen items-center justify-center p-4'>
				<Card className='w-full max-w-lg space-y-4 border p-6 shadow-lg'>
					<CardHeader className='space-y-3 p-0 text-center'>
						<div className='bg-primary/10 mx-auto flex size-12 items-center justify-center rounded-xl'>
							<Spinner className='text-primary size-6' />
						</div>
						<Skeleton className='mx-auto h-6 w-56' />
						<Skeleton className='mx-auto h-4 w-72' />
					</CardHeader>
					<CardContent className='space-y-4 p-0 pt-4'>
						<Skeleton className='h-24 w-full rounded-xl' />
						<div className='space-y-2'>
							<Skeleton className='h-4 w-32' />
							<Skeleton className='h-8 w-full' />
						</div>
						<div className='space-y-2'>
							<Skeleton className='h-4 w-28' />
							<Skeleton className='h-8 w-full' />
						</div>
					</CardContent>
				</Card>
			</div>
		</ViewTransition>
	);
}
