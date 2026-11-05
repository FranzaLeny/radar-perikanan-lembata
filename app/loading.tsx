import { ViewTransition } from 'react';

import { Loading } from '@/components/loading';

export default async function RootLoading() {
	'use cache';
	return (
		<ViewTransition exit='slide-down'>
			<Loading className='fixed z-100 flex h-full w-full items-center justify-center'>
				{process.env.NODE_ENV === 'development' && (
					<div className='text-muted-foreground'>Root Loading...</div>
				)}
			</Loading>
		</ViewTransition>
	);
}
