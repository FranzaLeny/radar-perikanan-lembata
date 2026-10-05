import { Search, X } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Card, CardContent } from '@/components/shadcn/card';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput
} from '@/components/shadcn/input-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/shadcn/select';

type UjiFilterBarProps = {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	selectedKecamatan: string;
	setSelectedKecamatan: (kec: string) => void;
	selectedKesimpulan: string;
	setSelectedKesimpulan: (kes: string) => void;
	filteredCount: number;
	totalCount: number;
	onReset: () => void;
};

export function UjiFilterBar({
	searchTerm,
	setSearchTerm,
	selectedKecamatan,
	setSelectedKecamatan,
	selectedKesimpulan,
	setSelectedKesimpulan,
	filteredCount,
	totalCount,
	onReset
}: UjiFilterBarProps) {
	const isFiltered =
		searchTerm.trim() !== '' || selectedKecamatan !== 'SEMUA' || selectedKesimpulan !== 'SEMUA';

	return (
		<Card className='border-border bg-card shadow-xs'>
			<CardContent className='space-y-3 p-3.5 text-xs'>
				<div className='flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center'>
					<InputGroup className='flex-1'>
						<InputGroupAddon align='inline-start'>
							<Search className='size-4 text-muted-foreground' />
						</InputGroupAddon>
						<InputGroupInput
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='Cari nomor sampel, Pokdakan, desa, atau petugas...'
							type='text'
							value={searchTerm}
						/>
						{searchTerm && (
							<InputGroupAddon align='inline-end'>
								<InputGroupButton
									onClick={() => setSearchTerm('')}
									size='icon-xs'
									title='Hapus pencarian'
									type='button'
								>
									<X className='size-3.5' />
								</InputGroupButton>
							</InputGroupAddon>
						)}
					</InputGroup>

					<div className='flex flex-wrap items-center gap-2.5'>
						<div className='flex items-center gap-1.5'>
							<span className='whitespace-nowrap text-muted-foreground text-xs'>Kecamatan:</span>
							<Select onValueChange={(val) => val && setSelectedKecamatan(val)} value={selectedKecamatan}>
								<SelectTrigger className='w-[140px]' size='sm'>
									<SelectValue placeholder='Pilih Wilayah' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='SEMUA'>Semua Wilayah</SelectItem>
									<SelectItem value='Nubatukan'>Nubatukan</SelectItem>
									<SelectItem value='Ile Ape'>Ile Ape</SelectItem>
									<SelectItem value='Ile Ape Timur'>Ile Ape Timur</SelectItem>
									<SelectItem value='Lebatukan'>Lebatukan</SelectItem>
									<SelectItem value='Buyasuri'>Buyasuri</SelectItem>
									<SelectItem value='Omesuri'>Omesuri</SelectItem>
									<SelectItem value='Wulandoni'>Wulandoni</SelectItem>
									<SelectItem value='Atadei'>Atadei</SelectItem>
									<SelectItem value='Nagawutung'>Nagawutung</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='flex items-center gap-1.5'>
							<span className='whitespace-nowrap text-muted-foreground text-xs'>Status:</span>
							<Select
								onValueChange={(val) => val && setSelectedKesimpulan(val)}
								value={selectedKesimpulan}
							>
								<SelectTrigger className='w-[130px]' size='sm'>
									<SelectValue placeholder='Pilih Status' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='SEMUA'>Semua Status</SelectItem>
									<SelectItem value='NORMAL'>Normal</SelectItem>
									<SelectItem value='PERINGATAN'>Peringatan</SelectItem>
									<SelectItem value='KRITIS'>Kritis</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				{/* Indikator Komparasi Filter */}
				{isFiltered && (
					<div className='flex items-center justify-between border-border/60 border-t pt-2 text-xs'>
						<div className='flex items-center gap-2'>
							<span className='text-muted-foreground'>
								Menampilkan <strong className='text-foreground'>{filteredCount}</strong> dari{' '}
								<strong className='text-foreground'>{totalCount}</strong> data pengujian
								<span className='ml-1 font-medium text-muted-foreground'>(Hasil Filter)</span>
							</span>
						</div>
						<Button
							className='h-6 cursor-pointer text-muted-foreground text-xs hover:text-foreground'
							onClick={onReset}
							size='xs'
							variant='ghost'
						>
							Reset Filter
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
