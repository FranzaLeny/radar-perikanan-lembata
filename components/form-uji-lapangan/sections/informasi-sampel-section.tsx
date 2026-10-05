import { ExternalLink, Plus, RefreshCw, Thermometer } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/shadcn/card';
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList
} from '@/components/shadcn/combobox';
import { Field, FieldError, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { toFieldErrors } from '@/lib/utils';
import type { IKItem, OptionItem } from '../types';

type InformasiSampelSectionProps = {
	nomorSampel: string;
	onNomorSampelChange: (val: string) => void;
	suhuLingkungan: string;
	onSuhuLingkunganChange: (val: string) => void;
	tanggalPengambilan: string;
	onTanggalPengambilanChange: (val: string) => void;
	onSetTanggalNow: () => void;
	lokasiOptions: OptionItem[];
	selectedLokasiOption: OptionItem | null;
	onSelectLokasi: (val: OptionItem | null) => void;
	onOpenQuickAddLokasi: () => void;
	tipeSop: 'arsip' | 'manual' | 'tanpa_sop';
	onTipeSopChange: (tipe: 'arsip' | 'manual' | 'tanpa_sop') => void;
	sopOptions: OptionItem[];
	selectedSopOption: OptionItem | null;
	onSelectSop: (val: string) => void;
	selectedSopDoc: IKItem | null;
	sopManualKode: string;
	onSopManualKodeChange: (val: string) => void;
	sopManualJudul: string;
	onSopManualJudulChange: (val: string) => void;
	fieldErrors: Record<string, string[]>;
};

export function InformasiSampelSection({
	nomorSampel,
	onNomorSampelChange,
	suhuLingkungan,
	onSuhuLingkunganChange,
	tanggalPengambilan,
	onTanggalPengambilanChange,
	onSetTanggalNow,
	lokasiOptions,
	selectedLokasiOption,
	onSelectLokasi,
	onOpenQuickAddLokasi,
	tipeSop,
	onTipeSopChange,
	sopOptions,
	selectedSopOption,
	onSelectSop,
	selectedSopDoc,
	sopManualKode,
	onSopManualKodeChange,
	sopManualJudul,
	onSopManualJudulChange,
	fieldErrors
}: InformasiSampelSectionProps) {
	return (
		<Card>
			<CardHeader className='border-border border-b pb-3'>
				<CardTitle className='font-heading text-base'>
					1. Informasi Sampel, Lokasi Kolam & Kondisi Lapangan
				</CardTitle>
				<CardDescription className='text-xs'>
					Identitas botol sampel, titik pemantauan kolam, waktu pengambilan, serta suhu udara sekitar.
				</CardDescription>
			</CardHeader>

			<CardContent className='space-y-4 pt-4'>
				{/* Baris 1: Nomor Sampel, Suhu Lingkungan, Tanggal Sampling */}
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
					<Field>
						<FieldLabel htmlFor='nomorSampel'>Nomor ID Sampel *</FieldLabel>
						<Input
							className='font-semibold'
							id='nomorSampel'
							onChange={(e) => onNomorSampelChange(e.target.value)}
							placeholder='SMP-YYYYMMDD-XXX'
							required
							value={nomorSampel}
						/>
						<FieldError errors={toFieldErrors(fieldErrors.nomor_sampel)} />
					</Field>

					<Field>
						<div className='flex items-center gap-1.5'>
							<Thermometer className='size-3.5 text-amber-600' />
							<FieldLabel htmlFor='suhuLingkungan'>Suhu Lingkungan (°C)</FieldLabel>
						</div>
						<Input
							id='suhuLingkungan'
							onChange={(e) => onSuhuLingkunganChange(e.target.value)}
							placeholder='Misal: 30.5'
							step='0.1'
							type='number'
							value={suhuLingkungan}
						/>
					</Field>

					<Field>
						<div className='flex items-center justify-between'>
							<FieldLabel htmlFor='tanggal'>Waktu Pengambilan *</FieldLabel>
							<Button
								className='h-5 cursor-pointer gap-1 px-1.5 text-[11px] text-muted-foreground hover:text-foreground'
								onClick={onSetTanggalNow}
								size='xs'
								type='button'
								variant='ghost'
							>
								<RefreshCw className='size-3' />
								<span>Sekarang</span>
							</Button>
						</div>
						<Input
							id='tanggal'
							onChange={(e) => onTanggalPengambilanChange(e.target.value)}
							required
							type='datetime-local'
							value={tanggalPengambilan}
						/>
						<FieldError errors={toFieldErrors(fieldErrors.tanggal_pengambilan)} />
					</Field>
				</div>

				{/* Lokasi Kolam: Combobox Autocomplete + Quick-Add */}
				<Field className='border-border border-t pt-2'>
					<div className='flex items-center justify-between'>
						<FieldLabel>Titik Lokasi Kolam Pembudidaya (Pokdakan) *</FieldLabel>
						<Button
							className='cursor-pointer gap-1'
							onClick={onOpenQuickAddLokasi}
							size='xs'
							type='button'
							variant='outline'
						>
							<Plus className='size-3' />
							<span>Tambah Lokasi Baru</span>
						</Button>
					</div>

					<Combobox<OptionItem>
						items={lokasiOptions}
						itemToStringValue={(item) => (item ? item.label : '')}
						onValueChange={onSelectLokasi}
						value={selectedLokasiOption}
					>
						<ComboboxInput placeholder='Pilih atau cari Pokdakan, pemilik, atau desa...' showClear />
						<ComboboxContent>
							<ComboboxEmpty>
								Lokasi tidak ditemukan. Tekan &ldquo;+ Tambah Lokasi Baru&rdquo;.
							</ComboboxEmpty>
							<ComboboxList>
								{(item) => (
									<ComboboxItem key={item.value} value={item}>
										<div>
											{item.label}
											{item.sublabel && (
												<span className='text-muted-foreground'>
													{' • '}[{item.sublabel}]
												</span>
											)}
										</div>
									</ComboboxItem>
								)}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
					<FieldError errors={toFieldErrors(fieldErrors.lokasi_id)} />
				</Field>

				{/* SOP Induk: Opsional (Pilihan Umum) */}
				<div className='space-y-3 border-border border-t pt-2'>
					<div className='flex items-center justify-between'>
						<div>
							<FieldLabel className='font-semibold text-xs'>
								SOP / Prosedur Pelaksanaan Induk (Opsional)
							</FieldLabel>
							<p className='text-[11px] text-muted-foreground'>
								SOP bersifat umum untuk alur sampling. Pengujian spesifik tiap parameter diatur oleh
								Instruksi Kerja di bawah.
							</p>
						</div>

						<div className='flex items-center gap-1 rounded-lg bg-muted p-0.5 text-xs'>
							<button
								className={`cursor-pointer rounded-md px-2 py-0.5 font-medium transition-colors ${
									tipeSop === 'arsip'
										? 'bg-background text-foreground shadow-xs'
										: 'text-muted-foreground hover:text-foreground'
								}`}
								onClick={() => onTipeSopChange('arsip')}
								type='button'
							>
								Pilih SOP
							</button>
							<button
								className={`cursor-pointer rounded-md px-2 py-0.5 font-medium transition-colors ${
									tipeSop === 'tanpa_sop'
										? 'bg-background text-foreground shadow-xs'
										: 'text-muted-foreground hover:text-foreground'
								}`}
								onClick={() => onTipeSopChange('tanpa_sop')}
								type='button'
							>
								Tanpa SOP
							</button>
							<button
								className={`cursor-pointer rounded-md px-2 py-0.5 font-medium transition-colors ${
									tipeSop === 'manual'
										? 'bg-background text-foreground shadow-xs'
										: 'text-muted-foreground hover:text-foreground'
								}`}
								onClick={() => onTipeSopChange('manual')}
								type='button'
							>
								Manual
							</button>
						</div>
					</div>

					{tipeSop === 'arsip' ? (
						<Field>
							<Combobox<OptionItem>
								items={sopOptions}
								itemToStringValue={(item) => (item ? item.label : '')}
								onValueChange={(val) => onSelectSop(val ? val.value : '')}
								value={selectedSopOption}
							>
								<ComboboxInput placeholder='Pilih SOP / Prosedur acuan induk...' showClear />
								<ComboboxContent>
									<ComboboxEmpty>SOP tidak ditemukan.</ComboboxEmpty>
									<ComboboxList>
										{(item) => (
											<ComboboxItem key={item.value} value={item}>
												<div className='flex flex-col py-0.5 text-left'>
													<span className='font-medium text-foreground'>{item.label}</span>
													{item.sublabel && <span className='text-muted-foreground'>{item.sublabel}</span>}
												</div>
											</ComboboxItem>
										)}
									</ComboboxList>
								</ComboboxContent>
							</Combobox>

							{selectedSopDoc?.file_path && (
								<div className='flex items-center justify-between px-1 pt-1 text-xs'>
									<span className='max-w-[240px] truncate text-muted-foreground'>
										File: {selectedSopDoc.file_path}
									</span>
									<a
										className='inline-flex cursor-pointer items-center gap-1 font-medium text-foreground hover:underline'
										href={selectedSopDoc.file_path}
										rel='noopener noreferrer'
										target='_blank'
									>
										<ExternalLink className='size-3 text-muted-foreground' />
										<span>Buka Dokumen SOP</span>
									</a>
								</div>
							)}
						</Field>
					) : tipeSop === 'manual' ? (
						<div className='grid grid-cols-1 gap-4 rounded-xl border border-border bg-muted/30 p-3 sm:grid-cols-3'>
							<Field>
								<FieldLabel htmlFor='sopManualKode'>Kode / No. SOP Manual</FieldLabel>
								<Input
									id='sopManualKode'
									onChange={(e) => onSopManualKodeChange(e.target.value)}
									placeholder='SOP-M-01'
									value={sopManualKode}
								/>
							</Field>
							<Field className='sm:col-span-2'>
								<FieldLabel htmlFor='sopManualJudul'>Judul Prosedur Manual *</FieldLabel>
								<Input
									id='sopManualJudul'
									onChange={(e) => onSopManualJudulChange(e.target.value)}
									placeholder='Contoh: Prosedur Pengujian Mandiri Lapangan Kit Cepat'
									required
									value={sopManualJudul}
								/>
							</Field>
						</div>
					) : (
						<p className='rounded-lg border border-border bg-muted/20 p-2.5 text-muted-foreground text-xs italic'>
							Pengujian ini menggunakan standar umum dinas tanpa dokumen SOP spesifik.
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
