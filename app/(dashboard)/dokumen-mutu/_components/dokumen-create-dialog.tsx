'use client';

import { Loader2, Plus } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
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
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/shadcn/select';
import { createDokumenMutuAction } from '@/lib/actions/dokumen-mutu';
import { toFieldErrors } from '@/lib/utils';
import { dokumenMutuSchema } from '@/lib/validations/dokumen-mutu';
import type { DokumenMutuItem, KategoriItem } from '../types';

type DokumenCreateDialogProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	kategoriList: KategoriItem[];
	parameterList: string[];
	existingList: DokumenMutuItem[];
	onSuccess: (newDoc: DokumenMutuItem) => void;
};

export function DokumenCreateDialog({
	isOpen,
	onOpenChange,
	kategoriList,
	parameterList,
	existingList,
	onSuccess
}: DokumenCreateDialogProps) {
	const [selectedKategoriId, setSelectedKategoriId] = useState<string>(
		kategoriList.find((k) => k.kode_kategori === 'IK')?.id || kategoriList[0]?.id || ''
	);
	const [kodeDokumen, setKodeDokumen] = useState('');
	const [judul, setJudul] = useState('');
	const [parameterUji, setParameterUji] = useState('');
	const [metodePengujian, setMetodePengujian] = useState('');
	const [filePath, setFilePath] = useState('');
	const [deskripsi, setDeskripsi] = useState('');
	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isIKCategory = useMemo(() => {
		const kat = kategoriList.find((k) => k.id === selectedKategoriId);
		return kat?.kode_kategori === 'IK';
	}, [kategoriList, selectedKategoriId]);

	useEffect(() => {
		if (!isOpen) return;
		const defaultIK = kategoriList.find((k) => k.kode_kategori === 'IK') || kategoriList[0];
		const katId = defaultIK?.id || '';
		setSelectedKategoriId(katId);

		const ikCount = existingList.filter((d) => d.kode_ik.startsWith('IK-')).length + 1;
		const padded = String(ikCount).padStart(3, '0');
		setKodeDokumen(`IK-${padded}`);
		setJudul('');
		setParameterUji(parameterList[0] || 'pH');
		setMetodePengujian('SNI 6989.11:2019 (In-situ pH Meter)');
		setFilePath(`/uploads/ik-${padded}.pdf`);
		setDeskripsi('');
		setFieldErrors({});
	}, [isOpen, kategoriList, existingList, parameterList]);

	const handleKategoriChange = (newKatId: string) => {
		setSelectedKategoriId(newKatId);
		const kat = kategoriList.find((k) => k.id === newKatId);
		const prefix = kat?.kode_kategori || 'DOC';
		const count = existingList.filter((d) => d.kode_ik.startsWith(`${prefix}-`)).length + 1;
		const padded = String(count).padStart(3, '0');
		setKodeDokumen(`${prefix}-${padded}`);
		setFilePath(`/uploads/${prefix.toLowerCase()}-${padded}.pdf`);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFieldErrors({});

		const validation = dokumenMutuSchema.safeParse({
			kode_ik: kodeDokumen,
			judul,
			kategori_id: selectedKategoriId,
			parameter_uji: isIKCategory ? parameterUji : undefined,
			metode_pengujian: isIKCategory ? metodePengujian : undefined,
			deskripsi,
			file_path: filePath
		});

		if (!validation.success) {
			setFieldErrors(validation.error.flatten().fieldErrors);
			return;
		}

		setIsSubmitting(true);
		try {
			const res = await createDokumenMutuAction({
				kode_ik: kodeDokumen,
				judul,
				kategori_id: selectedKategoriId,
				parameter_uji: isIKCategory ? parameterUji : undefined,
				metode_pengujian: isIKCategory ? metodePengujian : undefined,
				deskripsi,
				file_path: filePath
			});

			if (res.success && res.data) {
				onSuccess(res.data as DokumenMutuItem);
				toast.success(res.message || 'Dokumen mutu berhasil didaftarkan.');
				onOpenChange(false);
			} else {
				if (res.errors) setFieldErrors(res.errors as Record<string, string[]>);
				toast.error(res.message || 'Gagal menyimpan dokumen mutu.');
			}
		} catch {
			toast.error('Terjadi kesalahan sistem.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={isOpen}>
			<DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Plus className='size-4 text-primary' />
						<span>Registrasi Dokumen Mutu Baru</span>
					</DialogTitle>
					<DialogDescription className='text-xs'>
						Daftarkan pedoman mutu, prosedur, SOP, instruksi kerja, atau formulir resmi ke dalam sistem.
					</DialogDescription>
				</DialogHeader>

				<form className='space-y-4 py-2' onSubmit={handleSubmit}>
					{/* Kategori Dokumen */}
					<Field>
						<FieldLabel htmlFor='kategori_id'>Kategori Dokumen *</FieldLabel>
						<Select onValueChange={(val) => val && handleKategoriChange(val)} value={selectedKategoriId}>
							<SelectTrigger id='kategori_id'>
								<SelectValue placeholder='Pilih Kategori' />
							</SelectTrigger>
							<SelectContent>
								{kategoriList.map((kat) => (
									<SelectItem key={kat.id} value={kat.id}>
										[{kat.kode_kategori}] {kat.nama_kategori}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FieldError errors={toFieldErrors(fieldErrors.kategori_id)} />
					</Field>

					{/* Kode Dokumen & Judul */}
					<div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
						<Field className='sm:col-span-1'>
							<FieldLabel htmlFor='kode_dokumen'>Kode Dokumen *</FieldLabel>
							<Input
								className='font-bold font-mono'
								id='kode_dokumen'
								onChange={(e) => setKodeDokumen(e.target.value)}
								placeholder='IK-001'
								value={kodeDokumen}
							/>
							<FieldError errors={toFieldErrors(fieldErrors.kode_ik)} />
						</Field>

						<Field className='sm:col-span-2'>
							<FieldLabel htmlFor='judul'>Judul Dokumen *</FieldLabel>
							<Input
								id='judul'
								onChange={(e) => setJudul(e.target.value)}
								placeholder='Contoh: Pengujian Derajat Keasaman (pH)'
								value={judul}
							/>
							<FieldError errors={toFieldErrors(fieldErrors.judul)} />
						</Field>
					</div>

					{/* Khusus IK: Parameter Uji & Metode Pengujian */}
					{isIKCategory && (
						<div className='space-y-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-900 dark:bg-blue-950/20'>
							<p className='font-semibold text-blue-900 text-xs dark:text-blue-200'>
								Spesifikasi Instruksi Kerja (IK)
							</p>

							<Field>
								<FieldLabel htmlFor='parameter_uji'>Parameter Mutu Air yang Diuji *</FieldLabel>
								<Select onValueChange={(val) => val && setParameterUji(val)} value={parameterUji}>
									<SelectTrigger className='bg-background' id='parameter_uji'>
										<SelectValue placeholder='Pilih Parameter' />
									</SelectTrigger>
									<SelectContent>
										{parameterList.map((p) => (
											<SelectItem key={p} value={p}>
												{p}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldError errors={toFieldErrors(fieldErrors.parameter_uji)} />
							</Field>

							<Field>
								<FieldLabel htmlFor='metode_pengujian'>Metode / Acuan Resmi SNI *</FieldLabel>
								<Input
									className='bg-background'
									id='metode_pengujian'
									onChange={(e) => setMetodePengujian(e.target.value)}
									placeholder='Contoh: SNI 6989.11:2019 (In-situ pH Meter)'
									value={metodePengujian}
								/>
								<FieldDescription className='text-[11px]'>
									Metode ini akan otomatis tercantum pada Lembar Hasil Uji (LHU) saat parameter diuji.
								</FieldDescription>
								<FieldError errors={toFieldErrors(fieldErrors.metode_pengujian)} />
							</Field>
						</div>
					)}

					{/* Path File PDF */}
					<Field>
						<FieldLabel htmlFor='file_path'>Path / URL Berkas PDF Dokumen *</FieldLabel>
						<Input
							className='font-mono text-xs'
							id='file_path'
							onChange={(e) => setFilePath(e.target.value)}
							placeholder='/uploads/ik-001.pdf'
							value={filePath}
						/>
						<FieldDescription className='text-[11px]'>
							Tautan berkas digital yang akan terbuka saat QR Code dipindai.
						</FieldDescription>
						<FieldError errors={toFieldErrors(fieldErrors.file_path)} />
					</Field>

					{/* Deskripsi */}
					<Field>
						<FieldLabel htmlFor='deskripsi'>Deskripsi / Ruang Lingkup (Opsional)</FieldLabel>
						<Input
							id='deskripsi'
							onChange={(e) => setDeskripsi(e.target.value)}
							placeholder='Keterangan singkat isi atau prosedur dokumen'
							value={deskripsi}
						/>
					</Field>

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
							) : (
								'Simpan Dokumen Mutu'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
