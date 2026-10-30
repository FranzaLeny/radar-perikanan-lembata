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

type BakuMutuFilterBarProps = {
	filterTab: FilterTab;
	onTabChange: (tab: FilterTab) => void;
	activeCount: number;
	archivedCount: number;
	totalCount: number;
	filteredCount: number;
	searchTerm: string;
	onSearchChange: (value: string) => void;
	onResetSearch: () => void;
};

export function BakuMutuFilterBar({
	filterTab,
	onTabChange,
	activeCount,
	archivedCount,
	totalCount,
	filteredCount,
	searchTerm,
	onSearchChange,
	onResetSearch
}: BakuMutuFilterBarProps) {
	return (
		<div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
			<Tabs onValueChange={(val) => onTabChange(val as FilterTab)} value={filterTab}>
				<TabsList>
					<TabsTrigger className='gap-2 text-xs' value='active'>
						<span>Standar Aktif</span>
						<Badge className='px-1.5 py-0' variant='secondary'>
							{activeCount}
						</Badge>
					</TabsTrigger>
					<TabsTrigger className='gap-2 text-xs' value='archived'>
						<span>Arsip Versi Lama</span>
						<Badge className='px-1.5 py-0' variant='outline'>
							{archivedCount}
						</Badge>
					</TabsTrigger>
					<TabsTrigger className='gap-2 text-xs' value='all'>
						<span>Semua Riwayat</span>
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
						<Search className='text-muted-foreground size-4' />
					</InputGroupAddon>
					<InputGroupInput
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder='Cari parameter, nomor regulasi...'
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
							className='text-muted-foreground hover:text-foreground cursor-pointer text-xs'
							onClick={onResetSearch}
							size='xs'
							variant='ghost'
						>
							Reset
						</Button>
					</div>
				) : (
					<span className='text-muted-foreground hidden shrink-0 text-xs sm:inline'>
						Total: <strong className='text-foreground'>{totalCount}</strong>
					</span>
				)}
			</div>
		</div>
	);
}
