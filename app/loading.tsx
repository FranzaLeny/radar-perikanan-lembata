import { Loading } from '@/components/loading';

export default function RootLoading() {
	return (
		<Loading className='fixed z-100 flex h-full w-full items-center justify-center'>
			{process.env.NODE_ENV === 'development' && (
				<div className='text-muted-foreground'>Root Loading...</div>
			)}
		</Loading>
	);
}
