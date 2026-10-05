import { Search, X } from 'lucide-react';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput
} from '@/components/shadcn/input-group';
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import type { StatusTabType, UjiLaporanItem } from '../types';

type LaporanFilterBarProps = {
	statusTab: StatusTabType;
	setStatusTab: (val: StatusTabType) => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	list: UjiLaporanItem[];
	isFiltered: boolean;
	onReset: () => void;
};

export function LaporanFilterBar({
	statusTab,
	setStatusTab,
	searchQuery,
	setSearchQuery,
	list,
	isFiltered,
	onReset
}: LaporanFilterBarProps) {
	const allCount = list.length;
	const draftCount = list.filter((x) => (x.status || 'draft') === 'draft').length;
	const finalCount = list.filter((x) => x.status === 'final').length;
	const arsipCount = list.filter((x) => x.status === 'arsip').length;

	return (
		<div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
			<Tabs onValueChange={(val) => setStatusTab((val as StatusTabType) || 'all')} value={statusTab}>
				<TabsList>
					<TabsTrigger className='cursor-pointer gap-1.5 text-xs' value='all'>
						<span>Semua Dokumen</span>
						<Badge className='px-1.5 py-0 text-[10px]' variant='outline'>
							{allCount}
						</Badge>
					</TabsTrigger>
					<TabsTrigger className='cursor-pointer gap-1.5 text-xs' value='draft'>
						<span>Draft</span>
						<Badge className='px-1.5 py-0 text-[10px]' variant='secondary'>
							{draftCount}
						</Badge>
					</TabsTrigger>
					<TabsTrigger className='cursor-pointer gap-1.5 text-xs' value='final'>
						<span>Final</span>
						<Badge className='px-1.5 py-0 text-[10px]' variant='secondary'>
							{finalCount}
						</Badge>
					</TabsTrigger>
					<TabsTrigger className='cursor-pointer gap-1.5 text-xs' value='arsip'>
						<span>Arsip</span>
						<Badge className='px-1.5 py-0 text-[10px]' variant='outline'>
							{arsipCount}
						</Badge>
					</TabsTrigger>
				</TabsList>
			</Tabs>

			<div className='flex items-center gap-2'>
				<InputGroup className='w-full sm:w-72'>
					<InputGroupAddon align='inline-start'>
						<Search className='size-4 text-muted-foreground' />
					</InputGroupAddon>
					<InputGroupInput
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder='Cari Pokdakan, nomor LHU, penguji...'
						type='text'
						value={searchQuery}
					/>
					{searchQuery && (
						<InputGroupAddon align='inline-end'>
							<InputGroupButton
								onClick={() => setSearchQuery('')}
								size='icon-xs'
								title='Hapus pencarian'
								type='button'
							>
								<X className='size-3.5' />
							</InputGroupButton>
						</InputGroupAddon>
					)}
				</InputGroup>

				{isFiltered && (
					<Button
						className='cursor-pointer text-muted-foreground text-xs hover:text-foreground'
						onClick={onReset}
						size='xs'
						variant='ghost'
					>
						Reset
					</Button>
				)}
			</div>
		</div>
	);
}
