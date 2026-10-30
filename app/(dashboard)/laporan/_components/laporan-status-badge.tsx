import { Archive, CheckCircle, FileEdit } from 'lucide-react';

import { Badge } from '@/components/shadcn/badge';

type LaporanStatusBadgeProps = { status?: string };

export function LaporanStatusBadge({ status }: LaporanStatusBadgeProps) {
	const s = status || 'draft';
	switch (s) {
		case 'final':
			return (
				<Badge className='border-emerald-500/25 bg-emerald-600/15 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400'>
					<CheckCircle className='size-3 text-emerald-600 dark:text-emerald-400' />
					Final
				</Badge>
			);
		case 'arsip':
			return (
				<Badge className='text-muted-foreground text-[11px]' variant='secondary'>
					<Archive className='size-3' />
					Arsip
				</Badge>
			);
		default:
			return (
				<Badge
					className='border-amber-500/30 bg-amber-50/50 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
					variant='outline'
				>
					<FileEdit className='size-3' />
					Draft
				</Badge>
			);
	}
}
