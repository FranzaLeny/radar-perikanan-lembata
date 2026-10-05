'use client';

import { Printer } from 'lucide-react';

import { Button } from '@/components/shadcn/button';

export function PrintButton({ label = 'Cetak Dokumen' }: { label?: string }) {
	return (
		<Button
			className='no-print cursor-pointer gap-2 shadow-xs'
			onClick={() => window.print()}
			size='sm'
		>
			<Printer className='size-4' />
			<span>{label}</span>
		</Button>
	);
}
