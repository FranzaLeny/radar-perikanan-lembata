'use client';

import { Calendar, CheckCircle2, MapPin, RotateCcw, Settings2, UserCheck } from 'lucide-react';
import type React from 'react';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/shadcn/dialog';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { NativeSelect } from '@/components/shadcn/native-select';
import type { PegawaiData, PrintSettings } from '../types';

type RekapSettingsDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	settings: PrintSettings;
	setSettings: React.Dispatch<React.SetStateAction<PrintSettings>>;
	allPegawai: PegawaiData[];
	currentYear: number;
	formattedTanggalTtd: string;
	onResetDefaults: () => void;
};

export function RekapSettingsDialog({
	open,
	onOpenChange,
	settings,
	setSettings,
	allPegawai,
	currentYear,
	formattedTanggalTtd,
	onResetDefaults
}: RekapSettingsDialogProps) {
	const handlePengelolaChange = (val: string) => {
		if (val === 'custom') {
			setSettings((s) => ({
				...s,
				pengelolaId: 'custom',
				pengelolaNama: '',
				pengelolaNip: '',
				pengelolaJabatan: 'Pengelola Mutu Air Budidaya'
			}));
		} else {
			const p = allPegawai.find((item) => item.id === val);
			if (p) {
				setSettings((s) => ({
					...s,
					pengelolaId: p.id,
					pengelolaNama: p.nama,
					pengelolaNip: p.nip,
					pengelolaJabatan: p.jabatan
				}));
			}
		}
	};

	const handleKadisChange = (val: string) => {
		if (val === 'custom') {
			setSettings((s) => ({
				...s,
				kepalaDinasId: 'custom',
				kepalaDinasNama: '',
				kepalaDinasNip: '',
				kepalaDinasJabatan: 'Kepala Dinas Perikanan Kabupaten Lembata'
			}));
		} else {
			const p = allPegawai.find((item) => item.id === val);
			if (p) {
				setSettings((s) => ({
					...s,
					kepalaDinasId: p.id,
					kepalaDinasNama: p.nama,
					kepalaDinasNip: p.nip,
					kepalaDinasJabatan: p.jabatan
				}));
			}
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-xl'>
				<DialogHeader>
					<div className='mb-1 flex items-center gap-2 font-semibold text-primary text-xs uppercase tracking-wider'>
						<Settings2 className='size-4' />
						<span>Pengaturan Lembar Cetak</span>
					</div>
					<DialogTitle className='text-lg'>Pengaturan Cetak Rekapitulasi Tahunan</DialogTitle>
					<DialogDescription className='text-xs'>
						Sesuaikan tahun anggaran, tanggal cetak, dan pejabat penandatangan sebelum mencetak dokumen
						resmi A4 Landscape.
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-4 py-2 text-xs'>
					{/* 1. Baris Tahun & Filter */}
					<div className='grid grid-cols-1 gap-3.5 rounded-lg border border-border bg-muted/30 p-3 sm:grid-cols-2'>
						<div className='space-y-1.5'>
							<Label className='flex items-center gap-1.5 font-semibold text-xs'>
								<Calendar className='size-3.5 text-muted-foreground' />
								Tahun Anggaran Laporan
							</Label>
							<Input
								className='h-8 text-xs'
								max={2099}
								min={2020}
								onChange={(e) =>
									setSettings((s) => ({ ...s, tahunAnggaran: Number(e.target.value) || currentYear }))
								}
								type='number'
								value={settings.tahunAnggaran}
							/>
						</div>

						<div className='flex flex-col justify-end space-y-1.5'>
							<label className='flex cursor-pointer items-center gap-2 py-1'>
								<input
									checked={settings.filterTahun}
									className='size-4 rounded border-input text-primary focus:ring-primary'
									onChange={(e) => setSettings((s) => ({ ...s, filterTahun: e.target.checked }))}
									type='checkbox'
								/>
								<span className='font-medium text-foreground text-xs'>
									Hanya tampilkan uji tahun {settings.tahunAnggaran}
								</span>
							</label>
							<p className='text-[11px] text-muted-foreground'>
								{settings.filterTahun
									? 'Matriks hanya menyaring data tahun terpilih.'
									: 'Menampilkan seluruh histori pemantauan mutu.'}
							</p>
						</div>
					</div>

					{/* 2. Tanggal dan Lokasi Tanda Tangan */}
					<div className='grid grid-cols-1 gap-3.5 rounded-lg border border-border bg-muted/30 p-3 sm:grid-cols-2'>
						<div className='space-y-1.5'>
							<Label className='flex items-center gap-1.5 font-semibold text-xs'>
								<Calendar className='size-3.5 text-muted-foreground' />
								Tanggal Tanda Tangan
							</Label>
							<Input
								className='h-8 text-xs'
								onChange={(e) => setSettings((s) => ({ ...s, tanggalTtd: e.target.value }))}
								type='date'
								value={settings.tanggalTtd}
							/>
							<p className='text-[11px] text-muted-foreground'>
								Tampil: <strong>{formattedTanggalTtd || '-'}</strong>
							</p>
						</div>

						<div className='space-y-1.5'>
							<Label className='flex items-center gap-1.5 font-semibold text-xs'>
								<MapPin className='size-3.5 text-muted-foreground' />
								Lokasi / Kota Penandatanganan
							</Label>
							<Input
								className='h-8 text-xs'
								onChange={(e) => setSettings((s) => ({ ...s, lokasiTtd: e.target.value }))}
								placeholder='Contoh: Lewoleba'
								type='text'
								value={settings.lokasiTtd}
							/>
						</div>
					</div>

					{/* 3. Pejabat Pengelola Mutu Air (Tanda Tangan Kiri) */}
					<div className='space-y-3 rounded-lg border border-border bg-muted/10 p-3'>
						<div className='flex items-center justify-between'>
							<Label className='flex items-center gap-1.5 font-semibold text-foreground text-xs'>
								<UserCheck className='size-3.5 text-emerald-600 dark:text-emerald-400' />
								Penandatangan 1 (Pengelola Mutu Air)
							</Label>
							<Badge className='py-0 text-[10px]' variant='outline'>
								Sisi Kiri
							</Badge>
						</div>

						<div className='space-y-2'>
							<NativeSelect
								className='w-full'
								onChange={(e) => handlePengelolaChange(e.target.value)}
								value={settings.pengelolaId}
							>
								{allPegawai.map((p) => (
									<option key={p.id} value={p.id}>
										{p.nama} — {p.jabatan} {p.peran_tanda_tangan === 'pengelola_mutu' ? '⭐' : ''}
									</option>
								))}
								<option value='custom'>✏️ Kustom / Input Manual Sendiri</option>
							</NativeSelect>

							{/* Form edit detail penandatangan pengelola */}
							<div className='grid grid-cols-1 gap-2 border-border/60 border-t pt-1 sm:grid-cols-2'>
								<div>
									<Label className='text-[11px] text-muted-foreground'>Nama Lengkap & Gelar</Label>
									<Input
										className='mt-0.5 h-7 text-xs'
										onChange={(e) => setSettings((s) => ({ ...s, pengelolaNama: e.target.value }))}
										type='text'
										value={settings.pengelolaNama}
									/>
								</div>
								<div>
									<Label className='text-[11px] text-muted-foreground'>NIP</Label>
									<Input
										className='mt-0.5 h-7 font-mono text-xs'
										onChange={(e) => setSettings((s) => ({ ...s, pengelolaNip: e.target.value }))}
										placeholder='18 digit NIP...'
										type='text'
										value={settings.pengelolaNip}
									/>
								</div>
								<div className='sm:col-span-2'>
									<Label className='text-[11px] text-muted-foreground'>Jabatan Kedinasan</Label>
									<Input
										className='mt-0.5 h-7 text-xs'
										onChange={(e) => setSettings((s) => ({ ...s, pengelolaJabatan: e.target.value }))}
										type='text'
										value={settings.pengelolaJabatan}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* 4. Pejabat Pengesahan Kepala Dinas (Tanda Tangan Kanan) */}
					<div className='space-y-3 rounded-lg border border-border bg-muted/10 p-3'>
						<div className='flex items-center justify-between'>
							<Label className='flex items-center gap-1.5 font-semibold text-foreground text-xs'>
								<CheckCircle2 className='size-3.5 text-blue-600 dark:text-blue-400' />
								Penandatangan 2 (Kepala Dinas / Pengesahan)
							</Label>
							<Badge className='py-0 text-[10px]' variant='outline'>
								Sisi Kanan
							</Badge>
						</div>

						<div className='space-y-2'>
							<NativeSelect
								className='w-full'
								onChange={(e) => handleKadisChange(e.target.value)}
								value={settings.kepalaDinasId}
							>
								{allPegawai.map((p) => (
									<option key={p.id} value={p.id}>
										{p.nama} — {p.jabatan} {p.peran_tanda_tangan === 'kepala_dinas' ? '⭐' : ''}
									</option>
								))}
								<option value='custom'>✏️ Kustom / Input Manual Sendiri</option>
							</NativeSelect>

							{/* Form edit detail penandatangan kadis */}
							<div className='grid grid-cols-1 gap-2 border-border/60 border-t pt-1 sm:grid-cols-2'>
								<div>
									<Label className='text-[11px] text-muted-foreground'>Nama Lengkap & Gelar</Label>
									<Input
										className='mt-0.5 h-7 text-xs'
										onChange={(e) => setSettings((s) => ({ ...s, kepalaDinasNama: e.target.value }))}
										type='text'
										value={settings.kepalaDinasNama}
									/>
								</div>
								<div>
									<Label className='text-[11px] text-muted-foreground'>NIP</Label>
									<Input
										className='mt-0.5 h-7 font-mono text-xs'
										onChange={(e) => setSettings((s) => ({ ...s, kepalaDinasNip: e.target.value }))}
										placeholder='18 digit NIP...'
										type='text'
										value={settings.kepalaDinasNip}
									/>
								</div>
								<div className='sm:col-span-2'>
									<Label className='text-[11px] text-muted-foreground'>Jabatan Kedinasan</Label>
									<Input
										className='mt-0.5 h-7 text-xs'
										onChange={(e) => setSettings((s) => ({ ...s, kepalaDinasJabatan: e.target.value }))}
										type='text'
										value={settings.kepalaDinasJabatan}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter className='flex items-center justify-between pt-2 sm:justify-between'>
					<Button
						className='gap-1.5 text-muted-foreground text-xs hover:text-foreground'
						onClick={onResetDefaults}
						size='sm'
						type='button'
						variant='ghost'
					>
						<RotateCcw className='size-3.5' />
						<span>Reset ke Default DB</span>
					</Button>

					<Button
						className='cursor-pointer gap-1.5 text-xs'
						onClick={() => onOpenChange(false)}
						size='sm'
						type='button'
					>
						<span>Terapkan Pengaturan</span>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
