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
import type { FilterTab } from '../types';

type PegawaiFilterBarProps = {
	filterTab: FilterTab;
	onTabChange: (tab: FilterTab) => void;
	activeCount: number;
	inactiveCount: number;
	totalCount: number;
	filteredCount: number;
	searchTerm: string;
	onSearchChange: (val: string) => void;
	onResetSearch: () => void;
};

export function PegawaiFilterBar({
	filterTab,
	onTabChange,
	activeCount,
	inactiveCount,
	totalCount,
	filteredCount,
	searchTerm,
	onSearchChange,
	onResetSearch
}: PegawaiFilterBarProps) {
	return (
		<div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
			<Tabs onValueChange={(val) => onTabChange(val as FilterTab)} value={filterTab}>
				<TabsList>
					<TabsTrigger className='gap-2 text-xs' value='active'>
						<span>Pegawai Aktif</span>
						<Badge className='px-1.5 py-0' variant='secondary'>
							{activeCount}
						</Badge>
					</TabsTrigger>
					<TabsTrigger className='gap-2 text-xs' value='inactive'>
						<span>Nonaktif</span>
						<Badge className='px-1.5 py-0' variant='outline'>
							{inactiveCount}
						</Badge>
					</TabsTrigger>
					<TabsTrigger className='gap-2 text-xs' value='all'>
						<span>Semua Data</span>
						<Badge className='px-1.5 py-0' variant='outline'>
							{totalCount}
						</Badge>
					</TabsTrigger>
				</TabsList>
			</Tabs>

			{/* Search Input */}
			<div className='flex items-center gap-2'>
				<InputGroup className='w-full sm:w-72'>
					<InputGroupAddon align='inline-start'>
						<Search className='size-4 text-muted-foreground' />
					</InputGroupAddon>
					<InputGroupInput
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder='Cari NIP, nama, atau jabatan...'
						type='text'
						value={searchTerm}
					/>
					{searchTerm && (
						<InputGroupAddon align='inline-end'>
							<InputGroupButton
								onClick={onResetSearch}
								size='icon-xs'
								title='Hapus pencarian'
								type='button'
							>
								<X className='size-3.5' />
							</InputGroupButton>
						</InputGroupAddon>
					)}
				</InputGroup>

				{filteredCount < totalCount ? (
					<div className='flex shrink-0 items-center gap-1.5'>
						<Badge variant='secondary'>
							{filteredCount} dari {totalCount}
						</Badge>
						<Button
							className='cursor-pointer text-muted-foreground text-xs hover:text-foreground'
							onClick={onResetSearch}
							size='xs'
							variant='ghost'
						>
							Reset
						</Button>
					</div>
				) : (
					<span className='hidden shrink-0 text-muted-foreground text-xs sm:inline'>
						Total: <strong className='text-foreground'>{totalCount}</strong>
					</span>
				)}
			</div>
		</div>
	);
}
