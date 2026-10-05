import { Button } from '@/components/shadcn/button';
import { Card, CardContent } from '@/components/shadcn/card';
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList
} from '@/components/shadcn/combobox';
import { Field, FieldLabel } from '@/components/shadcn/field';

type OptionItem = { value: string; label: string; sublabel?: string };

type TrenFilterBarProps = {
	parameterOptions: OptionItem[];
	selectedParameterOption: OptionItem;
	onSelectParameter: (val: string) => void;
	lokasiOptions: OptionItem[];
	selectedLokasiOption: OptionItem;
	onSelectLokasi: (val: string) => void;
	selectedLokasiId: string;
	selectedLokasiNama?: string;
	detailCount: number;
	onResetLokasi: () => void;
};

export function TrenFilterBar({
	parameterOptions,
	selectedParameterOption,
	onSelectParameter,
	lokasiOptions,
	selectedLokasiOption,
	onSelectLokasi,
	selectedLokasiId,
	selectedLokasiNama,
	detailCount,
	onResetLokasi
}: TrenFilterBarProps) {
	return (
		<Card>
			<CardContent className='space-y-3 p-4 text-xs'>
				<div className='flex flex-col items-center gap-4 sm:flex-row'>
					<Field className='w-full flex-1 sm:w-auto'>
						<FieldLabel>Pilih Parameter Kualitas Air:</FieldLabel>
						<Combobox<OptionItem>
							items={parameterOptions}
							itemToStringValue={(item) => (item ? item.label : '')}
							onValueChange={(val) => {
								if (val) onSelectParameter(val.value);
							}}
							value={selectedParameterOption}
						>
							<ComboboxInput placeholder='Cari atau pilih parameter...' showClear />
							<ComboboxContent>
								<ComboboxEmpty>Parameter tidak ditemukan.</ComboboxEmpty>
								<ComboboxList>
									{(item) => (
										<ComboboxItem key={item.value} value={item}>
											<div className='flex flex-col py-0.5 text-left'>
												<span className='font-medium text-foreground'>{item.label}</span>
												{item.sublabel && (
													<span className='text-muted-foreground text-xs'>{item.sublabel}</span>
												)}
											</div>
										</ComboboxItem>
									)}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>
					</Field>

					<Field className='w-full flex-1 sm:w-auto'>
						<FieldLabel>Filter Lokasi / Pokdakan:</FieldLabel>
						<Combobox<OptionItem>
							items={lokasiOptions}
							itemToStringValue={(item) => (item ? item.label : '')}
							onValueChange={(val) => {
								if (val) onSelectLokasi(val.value);
							}}
							value={selectedLokasiOption}
						>
							<ComboboxInput placeholder='Cari atau pilih lokasi kolam...' showClear />
							<ComboboxContent>
								<ComboboxEmpty>Lokasi kolam tidak ditemukan.</ComboboxEmpty>
								<ComboboxList>
									{(item) => (
										<ComboboxItem key={item.value} value={item}>
											<div className='flex flex-col py-0.5 text-left'>
												<span className='font-medium text-foreground'>{item.label}</span>
												{item.sublabel && (
													<span className='text-muted-foreground text-xs'>{item.sublabel}</span>
												)}
											</div>
										</ComboboxItem>
									)}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>
					</Field>
				</div>

				{/* Indikator Filter Aktif */}
				{selectedLokasiId !== 'SEMUA' && (
					<div className='flex items-center justify-between border-border/60 border-t pt-2 text-xs'>
						<div className='flex items-center gap-2 text-muted-foreground'>
							<span>
								Menampilkan data pengukuran untuk:{' '}
								<strong className='text-foreground'>{selectedLokasiNama}</strong> ({detailCount} titik
								pengukuran)
								<span className='ml-1 font-medium text-muted-foreground'>(Hasil Filter)</span>
							</span>
						</div>
						<Button
							className='h-6 cursor-pointer text-muted-foreground text-xs hover:text-foreground'
							onClick={onResetLokasi}
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
