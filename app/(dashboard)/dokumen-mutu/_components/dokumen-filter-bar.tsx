import { Search, X } from 'lucide-react';

import { Badge } from '@/components/shadcn/badge';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput
} from '@/components/shadcn/input-group';
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import type { DokumenMutuItem, KategoriItem } from '../types';

type DokumenFilterBarProps = {
	selectedKategoriTab: string;
	onTabChange: (val: string) => void;
	kategoriList: KategoriItem[];
	list: DokumenMutuItem[];
	filteredCount: number;
	totalCount: number;
	searchTerm: string;
	onSearchChange: (val: string) => void;
	onResetSearch: () => void;
};

export function DokumenFilterBar({
	selectedKategoriTab,
	onTabChange,
	kategoriList,
	list,
	filteredCount,
	totalCount,
	searchTerm,
	onSearchChange,
	onResetSearch
}: DokumenFilterBarProps) {
	return (
		<div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
			<Tabs onValueChange={onTabChange} value={selectedKategoriTab}>
				<TabsList className='h-9'>
					<TabsTrigger className='gap-1.5 text-xs' value='all'>
						<span>Semua Dokumen</span>
						<Badge className='px-1 py-0 text-[11px]' variant='secondary'>
							{totalCount}
						</Badge>
					</TabsTrigger>
					{kategoriList.map((kat) => {
						const count = list.filter(
							(d) =>
								d.kategoriDokumen?.kode_kategori === kat.kode_kategori ||
								d.kategori_id === kat.id ||
								d.kode_ik.startsWith(`${kat.kode_kategori}-`)
						).length;

						return (
							<TabsTrigger className='gap-1.5 text-xs' key={kat.id} value={kat.kode_kategori}>
								<span>{kat.nama_kategori}</span>
								<Badge className='px-1 py-0 text-[11px]' variant='outline'>
									{count}
								</Badge>
							</TabsTrigger>
						);
					})}
				</TabsList>
			</Tabs>

			{/* Search Bar */}
			<div className='flex items-center gap-2'>
				<InputGroup className='w-full sm:w-72'>
					<InputGroupAddon align='inline-start'>
						<Search className='size-4 text-muted-foreground' />
					</InputGroupAddon>
					<InputGroupInput
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder='Cari kode, judul, metode, parameter...'
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
					<Badge variant='secondary'>
						{filteredCount} dari {totalCount}
					</Badge>
				) : null}
			</div>
		</div>
	);
}
