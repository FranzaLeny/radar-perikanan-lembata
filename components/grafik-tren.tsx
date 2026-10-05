'use client';

import React from 'react';
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';

import { Badge } from '@/components/shadcn/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/shadcn/card';

type DataPoint = { tanggal: string; nilai: number; sampel: string; pokdakan?: string };

type GrafikTrenProps = {
	title: string;
	parameterName: string;
	satuan: string;
	nilaiMin?: number | null;
	nilaiMax?: number | null;
	data: DataPoint[];
};

export function GrafikTren({
	title,
	parameterName,
	satuan,
	nilaiMin,
	nilaiMax,
	data
}: GrafikTrenProps) {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!data || data.length === 0) {
		return (
			<Card className='border-border bg-card p-8 text-center'>
				<p className='font-medium text-muted-foreground text-sm'>
					Belum ada rekaman data historis untuk grafik tren ini.
				</p>
				<p className='mt-1 text-muted-foreground/70 text-xs'>
					Lakukan pengujian kualitas air terlebih dahulu untuk melihat visualisasi tren.
				</p>
			</Card>
		);
	}

	return (
		<Card className='border-border bg-card shadow-xs'>
			<CardHeader className='flex flex-col gap-2 pb-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<CardTitle className='font-semibold text-base'>{title}</CardTitle>
					<CardDescription className='mt-0.5 text-xs'>
						Parameter: <span className='font-semibold text-foreground'>{parameterName}</span> ({satuan})
					</CardDescription>
				</div>

				<div className='flex items-center gap-3 font-mono text-xs'>
					{nilaiMin !== null && nilaiMin !== undefined && (
						<Badge
							className='gap-1.5 border-amber-300 bg-amber-50 font-mono text-amber-700 text-xs dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
							variant='outline'
						>
							<span className='size-2 rounded-full bg-amber-500' />
							<span>Min: {nilaiMin}</span>
						</Badge>
					)}
					{nilaiMax !== null && nilaiMax !== undefined && (
						<Badge
							className='gap-1.5 border-rose-300 bg-rose-50 font-mono text-rose-700 text-xs dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
							variant='outline'
						>
							<span className='size-2 rounded-full bg-rose-500' />
							<span>Max: {nilaiMax}</span>
						</Badge>
					)}
				</div>
			</CardHeader>

			<CardContent>
				<div className='h-72 w-full min-w-0 pt-2'>
					{mounted ? (
						<ResponsiveContainer
							height='100%'
							initialDimension={{ width: 600, height: 288 }}
							minHeight={288}
							minWidth={0}
							width='100%'
						>
							<LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
								<CartesianGrid className='stroke-border' strokeDasharray='3 3' vertical={false} />
								<XAxis
									axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
									className='fill-muted-foreground text-xs'
									dataKey='tanggal'
									tickLine={false}
								/>
								<YAxis
									axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
									className='fill-muted-foreground text-xs'
									domain={['auto', 'auto']}
									tickLine={false}
									unit={` ${satuan}`}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: 'var(--popover)',
										borderColor: 'var(--border)',
										borderRadius: 'var(--radius)',
										fontSize: '12px',
										color: 'var(--popover-foreground)',
										boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
									}}
									formatter={(val: unknown) => {
										return [`${val} ${satuan}`, parameterName];
									}}
									labelFormatter={(label, payload) => {
										const item = payload?.[0]?.payload as DataPoint | undefined;
										return `${label} ${item?.pokdakan ? `• ${item.pokdakan}` : ''} (${item?.sampel || ''})`;
									}}
								/>
								<Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

								{/* Ambang Batas Reference Lines */}
								{nilaiMin !== null && nilaiMin !== undefined && (
									<ReferenceLine
										label={{
											value: `Batas Min (${nilaiMin})`,
											fill: '#f59e0b',
											fontSize: 10,
											position: 'insideBottomLeft'
										}}
										stroke='#f59e0b'
										strokeDasharray='4 4'
										y={nilaiMin}
									/>
								)}
								{nilaiMax !== null && nilaiMax !== undefined && (
									<ReferenceLine
										label={{
											value: `Batas Max (${nilaiMax})`,
											fill: '#ef4444',
											fontSize: 10,
											position: 'insideTopLeft'
										}}
										stroke='#ef4444'
										strokeDasharray='4 4'
										y={nilaiMax}
									/>
								)}

								<Line
									activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--card)', strokeWidth: 2 }}
									dataKey='nilai'
									dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--background)' }}
									name={`${parameterName} (${satuan})`}
									stroke='var(--primary)'
									strokeWidth={2.5}
									type='monotone'
								/>
							</LineChart>
						</ResponsiveContainer>
					) : (
						<div className='flex h-full w-full animate-pulse items-center justify-center text-muted-foreground/60 text-xs'>
							Menyiapkan kanvas grafik...
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
