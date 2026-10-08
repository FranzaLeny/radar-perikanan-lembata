import { FileCheck2, SlidersHorizontal, Thermometer, Trash2 } from 'lucide-react';

import { BadgeStatus } from '@/components/badge-status';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList
} from '@/components/shadcn/combobox';
import { Field, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import type {
	BakuMutuItem,
	EvaluatedParameterRow,
	IKItem,
	OptionItem,
	ParameterRow
} from '../types';

type ParameterRowItemProps = {
	idx: number;
	row: ParameterRow;
	evalRow: EvaluatedParameterRow | undefined;
	currentBm: BakuMutuItem | undefined;
	currentOption: OptionItem | null;
	bakuMutuOptions: OptionItem[];
	ikList: IKItem[];
	selectedIkDoc: IKItem | null;
	suhuLingkungan: string;
	onSelectBakuMutu: (tempId: string, bmId: string) => void;
	onSelectIk: (tempId: string, ikId: string) => void;
	onValueChange: (tempId: string, val: string) => void;
	onToggleCustomAmbang: (tempId: string) => void;
	onOverrideMinChange: (tempId: string, val: string) => void;
	onOverrideMaxChange: (tempId: string, val: string) => void;
	onRemoveRow: (tempId: string) => void;
};

export function ParameterRowItem({
	idx,
	row,
	evalRow,
	currentBm,
	currentOption,
	bakuMutuOptions,
	ikList,
	selectedIkDoc,
	suhuLingkungan,
	onSelectBakuMutu,
	onSelectIk,
	onValueChange,
	onToggleCustomAmbang,
	onOverrideMinChange,
	onOverrideMaxChange,
	onRemoveRow
}: ParameterRowItemProps) {
	// Auto-Filter: Hanya IK Teknis (Tingkatan 3) yang cocok dengan parameter ini
	const paramName = currentBm?.parameter.toLowerCase().trim() || '';

	// Saring hanya dokumen Tingkatan 3 (Instruksi Kerja Teknis Parameter)
	const tingkat3Iks = ikList.filter((doc) => {
		const isTingkat3 =
			doc.kategoriDokumen?.tingkatan === 3 ||
			doc.kategoriDokumen?.kode_kategori === 'IK' ||
			doc.kode_ik.startsWith('IK-') ||
			(!doc.kategoriDokumen && Boolean(doc.parameter_uji));
		return isTingkat3;
	});

	// Cocokkan parameter uji
	const filteredIks = tingkat3Iks.filter((ik) => {
		if (!ik.parameter_uji) return false;
		return ik.parameter_uji.toLowerCase().trim() === paramName;
	});
	const availableIks =
		filteredIks.length > 0 ? filteredIks : tingkat3Iks.length > 0 ? tingkat3Iks : ikList;
	const isDinamisSuhu = currentBm?.tipe_ambang_batas === 'deviasi_suhu_lingkungan';

	return (
		<div className='space-y-3 rounded-xl border border-border bg-card p-3.5 shadow-xs transition-all'>
			{/* Baris Atas: Parameter Uji & Pilihan IK (Auto-Filter) */}
			<div className='grid grid-cols-1 items-start gap-3 md:grid-cols-12'>
				{/* Pilihan Parameter Baku Mutu */}
				<Field className='md:col-span-5'>
					<div className='flex items-center justify-between'>
						<FieldLabel>#{idx + 1} Parameter Uji *</FieldLabel>
						{currentBm && (
							<Badge className='px-1 py-0 text-[11px]' variant='secondary'>
								{currentBm.nomor_regulasi || 'PP 22/2021'}
							</Badge>
						)}
					</div>

					<Combobox<OptionItem>
						items={bakuMutuOptions}
						itemToStringValue={(item) => (item ? item.label : '')}
						onValueChange={(val) => {
							if (val) onSelectBakuMutu(row.tempId, val.value);
						}}
						value={currentOption}
					>
						<ComboboxInput placeholder='Pilih parameter kualitas air...' />
						<ComboboxContent>
							<ComboboxEmpty>Parameter tidak ditemukan.</ComboboxEmpty>
							<ComboboxList>
								{(item) => (
									<ComboboxItem key={item.value} value={item}>
										<div className='flex flex-col py-0.5 text-left'>
											<div className='flex items-center gap-1.5'>
												<span className='font-medium text-foreground'>{item.label}</span>
												{item.badge && (
													<Badge
														className='px-1 py-0 text-[11px]'
														variant={item.badge === 'Aktif' ? 'outline' : 'secondary'}
													>
														{item.badge}
													</Badge>
												)}
											</div>
											{item.sublabel && (
												<span className='text-[11px] text-muted-foreground'>{item.sublabel}</span>
											)}
										</div>
									</ComboboxItem>
								)}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
				</Field>

				{/* Pilihan Instruksi Kerja (Auto-Filter sesuai Parameter) - WAJIB */}
				<Field className='md:col-span-7'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-1'>
							<FileCheck2 className='size-3 text-primary' />
							<FieldLabel>Instruksi Kerja (IK) & Metode Uji *</FieldLabel>
						</div>
						<span className='text-[11px] text-muted-foreground'>{filteredIks.length} IK tersedia</span>
					</div>

					<select
						className='h-9 w-full cursor-pointer rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
						onChange={(e) => onSelectIk(row.tempId, e.target.value)}
						required
						value={row.ik_id}
					>
						{availableIks.map((ik) => (
							<option className='bg-popover text-foreground text-xs' key={ik.id} value={ik.id}>
								[{ik.kode_ik}] {ik.judul} {ik.metode_pengujian ? `• Metode: ${ik.metode_pengujian}` : ''}
							</option>
						))}
					</select>

					{selectedIkDoc?.metode_pengujian && (
						<p className='mt-1 text-[11px] text-primary'>
							Metode Resmi: <strong>{selectedIkDoc.metode_pengujian}</strong>
						</p>
					)}
				</Field>
			</div>

			{/* Baris Bawah: Hasil Ukur, Info Ambang Batas & Evaluasi Realtime */}
			<div className='grid grid-cols-1 items-center gap-3 border-border/60 border-t pt-2 md:grid-cols-12'>
				{/* Input Hasil Ukur */}
				<Field className='md:col-span-4'>
					<FieldLabel>Hasil Pengukuran {currentBm ? `(${currentBm.satuan})` : ''} *</FieldLabel>
					<Input
						className='font-semibold'
						onChange={(e) => onValueChange(row.tempId, e.target.value)}
						placeholder='Contoh: 7.50'
						required
						step='any'
						type='number'
						value={row.nilai_hasil}
					/>
				</Field>

				{/* Ambang Batas Efektif (Dinamis / Statis) */}
				<div className='space-y-1 text-xs md:col-span-5'>
					<div className='flex items-center justify-between'>
						<span className='font-medium text-muted-foreground'>Batas Evaluasi:</span>
						<Button
							className='h-5 cursor-pointer gap-1 px-1.5 text-[11px] text-muted-foreground hover:text-foreground'
							onClick={() => onToggleCustomAmbang(row.tempId)}
							size='xs'
							title='Sesuaikan batas manual jika ada kondisi khusus lapangan'
							type='button'
							variant='ghost'
						>
							<SlidersHorizontal className='size-3' />
							<span>{row.is_custom_ambang ? 'Batal Override' : 'Sesuaikan'}</span>
						</Button>
					</div>

					{row.is_custom_ambang ? (
						<div className='flex items-center gap-1.5'>
							<Input
								className='h-7 w-20 text-xs'
								onChange={(e) => onOverrideMinChange(row.tempId, e.target.value)}
								placeholder='Min'
								step='any'
								type='number'
								value={row.nilai_min_override}
							/>
							<span>s/d</span>
							<Input
								className='h-7 w-20 text-xs'
								onChange={(e) => onOverrideMaxChange(row.tempId, e.target.value)}
								placeholder='Max'
								step='any'
								type='number'
								value={row.nilai_max_override}
							/>
							<span className='text-[11px] text-muted-foreground'>{currentBm?.satuan}</span>
						</div>
					) : isDinamisSuhu ? (
						<div className='space-y-0.5'>
							<Badge
								className='gap-1 border-amber-300 bg-amber-50 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
								variant='outline'
							>
								<Thermometer className='size-2.5' />
								<span>
									{suhuLingkungan !== ''
										? `Batas: ${evalRow?.effectiveMin ?? '-'} s/d ${evalRow?.effectiveMax ?? '-'} °C (Deviasi ±${currentBm?.deviasi_toleransi || 2}°C)`
										: `Deviasi ±${currentBm?.deviasi_toleransi || 2}°C dari Suhu Udara`}
								</span>
							</Badge>
						</div>
					) : (
						<span className='font-semibold text-foreground text-xs'>
							{evalRow && evalRow.effectiveMin !== null && evalRow.effectiveMax !== null
								? `${evalRow.effectiveMin} – ${evalRow.effectiveMax} ${currentBm?.satuan || ''}`
								: evalRow && evalRow.effectiveMin !== null
									? `≥ ${evalRow.effectiveMin} ${currentBm?.satuan || ''}`
									: evalRow && evalRow.effectiveMax !== null
										? `≤ ${evalRow.effectiveMax} ${currentBm?.satuan || ''}`
										: '-'}
						</span>
					)}
				</div>

				{/* Status Kelayakan & Tombol Hapus */}
				<div className='flex items-center justify-end gap-2 md:col-span-3'>
					{evalRow?.isEvaluated ? (
						<BadgeStatus size='sm' status={evalRow.status} />
					) : (
						<span className='text-[11px] text-muted-foreground italic'>Isi hasil ukur</span>
					)}

					<Button
						className='shrink-0 cursor-pointer text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
						onClick={() => onRemoveRow(row.tempId)}
						size='icon-sm'
						title='Hapus parameter ini'
						type='button'
						variant='ghost'
					>
						<Trash2 className='size-3.5' />
					</Button>
				</div>
			</div>
		</div>
	);
}
