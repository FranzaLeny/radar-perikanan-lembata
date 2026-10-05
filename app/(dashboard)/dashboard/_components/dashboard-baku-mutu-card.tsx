import { ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/shadcn/card';
import type { MasterBakuMutuItem } from '../types';

type DashboardBakuMutuCardProps = { items: MasterBakuMutuItem[] };

export function DashboardBakuMutuCard({ items }: DashboardBakuMutuCardProps) {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between border-b pb-4'>
				<div>
					<CardTitle className='flex items-center gap-2'>
						<ShieldCheck className='size-4 text-muted-foreground' />
						<span>Baku Mutu Aktif (SNI/KKP)</span>
					</CardTitle>
					<CardDescription>Ambang batas mutu air acuan</CardDescription>
				</div>
				<Link href='/baku-mutu'>
					<Button
						className='h-7 cursor-pointer gap-1 px-2 font-semibold text-foreground text-xs'
						size='sm'
						variant='ghost'
					>
						<span>Kelola</span>
						<ArrowRight className='size-3' />
					</Button>
				</Link>
			</CardHeader>

			<CardContent className='space-y-2.5 pt-4'>
				{items.map((bm) => (
					<div
						className='flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3 text-xs'
						key={bm.id}
					>
						<div>
							<p className='font-semibold text-foreground'>{bm.parameter}</p>
							<p className='mt-0.5 text-muted-foreground text-xs'>
								Ambang:{' '}
								<span className='font-medium text-foreground'>
									{bm.nilai_min !== null && bm.nilai_max !== null
										? `${bm.nilai_min} – ${bm.nilai_max}`
										: bm.nilai_min !== null
											? `≥ ${bm.nilai_min}`
											: bm.nilai_max !== null
												? `≤ ${bm.nilai_max}`
												: '-'}
								</span>
							</p>
						</div>
						<Badge variant='secondary'>
							{bm.satuan}
						</Badge>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
