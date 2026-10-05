'use client';

import { Loader2, Star, Users } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/shadcn/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/shadcn/dialog';
import { Field, FieldError, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/shadcn/select';
import { createPegawaiAction, updatePegawaiAction } from '@/lib/actions/pegawai';
import { toFieldErrors } from '@/lib/utils';
import { pegawaiSchema } from '@/lib/validations/pegawai-master';
import type { PegawaiItem, PeranTandaTangan } from '../types';

type PegawaiFormDialogProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	editingItem: PegawaiItem | null;
	onSuccess: (result: {
		mode: 'create' | 'edit';
		data: PegawaiItem;
		isPenanggungjawab: boolean;
	}) => void;
};

export function PegawaiFormDialog({
	isOpen,
	onOpenChange,
	editingItem,
	onSuccess
}: PegawaiFormDialogProps) {
	const [nip, setNip] = useState('');
	const [nama, setNama] = useState('');
	const [jabatan, setJabatan] = useState('');
	const [pangkatGolongan, setPangkatGolongan] = useState('');
	const [peranTandaTangan, setPeranTandaTangan] = useState<PeranTandaTangan>('penguji');
	const [isPenanggungjawab, setIsPenanggungjawab] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (!isOpen) return;

		if (editingItem) {
			setNip(editingItem.nip);
			setNama(editingItem.nama);
			setJabatan(editingItem.jabatan);
			setPangkatGolongan(editingItem.pangkat_golongan || '');
			setPeranTandaTangan((editingItem.peran_tanda_tangan as PeranTandaTangan) || 'penguji');
			setIsPenanggungjawab(editingItem.is_penanggungjawab || false);
		} else {
			setNip('');
			setNama('');
			setJabatan('');
			setPangkatGolongan('');
			setPeranTandaTangan('penguji');
			setIsPenanggungjawab(false);
		}
		setFieldErrors({});
	}, [isOpen, editingItem]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFieldErrors({});

		const nipClean = nip.replace(/\s+/g, '');
		const validation = pegawaiSchema.safeParse({
			nip: nipClean,
			nama,
			jabatan,
			pangkat_golongan: pangkatGolongan,
			peran_tanda_tangan: peranTandaTangan,
			is_penanggungjawab: isPenanggungjawab
		});

		if (!validation.success) {
			setFieldErrors(validation.error.flatten().fieldErrors);
			return;
		}

		setIsSubmitting(true);
		try {
			if (editingItem) {
				const res = await updatePegawaiAction(editingItem.id, {
					nip: nipClean,
					nama,
					jabatan,
					pangkat_golongan: pangkatGolongan,
					peran_tanda_tangan: peranTandaTangan,
					is_penanggungjawab: isPenanggungjawab
				});

				if (res.success && res.data) {
					onSuccess({ mode: 'edit', data: res.data as PegawaiItem, isPenanggungjawab });
					toast.success(res.message || 'Data pegawai berhasil diperbarui.');
					onOpenChange(false);
				} else {
					if (res.errors) setFieldErrors(res.errors as Record<string, string[]>);
					toast.error(res.message || 'Gagal memperbarui pegawai.');
				}
			} else {
				const res = await createPegawaiAction({
					nip: nipClean,
					nama,
					jabatan,
					pangkat_golongan: pangkatGolongan,
					peran_tanda_tangan: peranTandaTangan,
					is_penanggungjawab: isPenanggungjawab
				});

				if (res.success && res.data) {
					onSuccess({ mode: 'create', data: res.data as PegawaiItem, isPenanggungjawab });
					toast.success(res.message || 'Pegawai berhasil didaftarkan.');
					onOpenChange(false);
				} else {
					if (res.errors) setFieldErrors(res.errors as Record<string, string[]>);
					toast.error(res.message || 'Gagal mendaftarkan pegawai.');
				}
			}
		} catch {
			toast.error('Terjadi kesalahan sistem.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={isOpen}>
			<DialogContent className='sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Users className='size-4 text-muted-foreground' />
						<span>{editingItem ? 'Edit Data Pegawai' : 'Registrasi Pegawai Baru'}</span>
					</DialogTitle>
					<DialogDescription>
						{editingItem
							? 'Perbarui NIP, nama lengkap, jabatan, atau peran penandatangan resmi LHU.'
							: 'Daftarkan personil ASN atau petugas penguji kualitas air dinas.'}
					</DialogDescription>
				</DialogHeader>

				<form className='space-y-4 py-2' onSubmit={handleSubmit}>
					<Field>
						<FieldLabel htmlFor='nip'>NIP (Nomor Induk Pegawai) *</FieldLabel>
						<Input
							id='nip'
							onChange={(e) => setNip(e.target.value)}
							placeholder='Contoh: 198501012010011001'
							type='text'
							value={nip}
						/>
						<FieldError errors={toFieldErrors(fieldErrors.nip)} />
					</Field>

					<Field>
						<FieldLabel htmlFor='nama'>Nama Lengkap & Gelar *</FieldLabel>
						<Input
							id='nama'
							onChange={(e) => setNama(e.target.value)}
							placeholder='Contoh: Ir. Fransiskus Xaverius, M.Si'
							type='text'
							value={nama}
						/>
						<FieldError errors={toFieldErrors(fieldErrors.nama)} />
					</Field>

					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<Field>
							<FieldLabel htmlFor='jabatan'>Jabatan Kedinasan *</FieldLabel>
							<Input
								id='jabatan'
								onChange={(e) => setJabatan(e.target.value)}
								placeholder='Contoh: Kepala Dinas Perikanan'
								type='text'
								value={jabatan}
							/>
							<FieldError errors={toFieldErrors(fieldErrors.jabatan)} />
						</Field>

						<Field>
							<FieldLabel htmlFor='pangkat_golongan'>Pangkat / Golongan Ruang</FieldLabel>
							<Input
								id='pangkat_golongan'
								onChange={(e) => setPangkatGolongan(e.target.value)}
								placeholder='Contoh: Pembina Utama Muda (IV/c)'
								type='text'
								value={pangkatGolongan}
							/>
							<FieldError errors={toFieldErrors(fieldErrors.pangkat_golongan)} />
						</Field>
					</div>

					<Field>
						<FieldLabel htmlFor='peran_tanda_tangan'>Peran Resmi di Dokumen LHU *</FieldLabel>
						<Select
							onValueChange={(val) => {
								if (val) setPeranTandaTangan(val as PeranTandaTangan);
							}}
							value={peranTandaTangan}
						>
							<SelectTrigger id='peran_tanda_tangan'>
								<SelectValue placeholder='Pilih Peran' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='penguji'>Petugas Penguji Lapangan</SelectItem>
								<SelectItem value='pengelola_mutu'>Pengelola Mutu & Evaluator</SelectItem>
								<SelectItem value='kepala_dinas'>Kepala Dinas (Penandatangan Pengesahan)</SelectItem>
							</SelectContent>
						</Select>
					</Field>

					<div className='flex items-start gap-3 rounded-lg border border-border/70 bg-muted/20 p-3'>
						<input
							checked={isPenanggungjawab}
							className='mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary'
							id='is_penanggungjawab'
							onChange={(e) => setIsPenanggungjawab(e.target.checked)}
							type='checkbox'
						/>
						<label className='cursor-pointer select-none text-xs' htmlFor='is_penanggungjawab'>
							<span className='flex items-center gap-1.5 font-semibold text-foreground'>
								<Star className='inline size-3 fill-amber-500 text-amber-500' />
								Jadikan Penanggung Jawab Default Penandatangan
							</span>
							<p className='mt-0.5 text-muted-foreground'>
								Pegawai ini akan otomatis dipilih sebagai default penandatangan Laporan Hasil Uji (LHU)
								baru. Hanya satu pegawai yang dapat menjadi default.
							</p>
						</label>
					</div>

					<DialogFooter className='pt-2'>
						<Button
							disabled={isSubmitting}
							onClick={() => onOpenChange(false)}
							type='button'
							variant='outline'
						>
							Batal
						</Button>
						<Button disabled={isSubmitting} type='submit'>
							{isSubmitting ? (
								<>
									<Loader2 className='mr-1.5 size-3.5 animate-spin' />
									Menyimpan...
								</>
							) : editingItem ? (
								'Perbarui Pegawai'
							) : (
								'Simpan Pegawai'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
