import { Card, CardContent, CardHeader } from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';
import { Spinner } from '@/components/shadcn/spinner';

export default function AuthLoading() {
	return (
		<div className='fade-in-50 w-full max-w-md animate-in duration-300'>
			<Card className='border-border/80 bg-card/95 shadow-xl backdrop-blur-md'>
				<CardHeader className='space-y-3 text-center'>
					<div className='mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10'>
						<Spinner className='size-6 text-primary' />
					</div>
					<div className='space-y-1.5'>
						<Skeleton className='mx-auto h-6 w-48' />
						<Skeleton className='mx-auto h-3.5 w-64' />
					</div>
				</CardHeader>
				<CardContent className='space-y-4 pt-2'>
					<div className='space-y-2'>
						<Skeleton className='h-4 w-16' />
						<Skeleton className='h-10 w-full rounded-lg' />
					</div>
					<div className='space-y-2'>
						<Skeleton className='h-4 w-20' />
						<Skeleton className='h-10 w-full rounded-lg' />
					</div>
					<Skeleton className='h-10 w-full rounded-lg' />
				</CardContent>
			</Card>
		</div>
	);
}
