'use client';

import { Loader2, Pencil } from 'lucide-react';
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
import { Field, FieldDescription, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/shadcn/select';
import { updateDokumenMutuAction } from '@/lib/actions/dokumen-mutu';
import type { DokumenMutuItem, KategoriItem } from '../types';

type DokumenEditDialogProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	editingItem: DokumenMutuItem | null;
	kategoriList: KategoriItem[];
	parameterList: string[];
	onSuccess: (updatedDoc: DokumenMutuItem) => void;
};

export function DokumenEditDialog({
	isOpen,
	onOpenChange,
	editingItem,
	kategoriList,
	parameterList,
	onSuccess
}: DokumenEditDialogProps) {
	const [editKategoriId, setEditKategoriId] = useState('');
	const [editJudul, setEditJudul] = useState('');
	const [editParameterUji, setEditParameterUji] = useState('');
	const [editMetodePengujian, setEditMetodePengujian] = useState('');
	const [editFilePath, setEditFilePath] = useState('');
	const [editDeskripsi, setEditDeskripsi] = useState('');
	const [isUpdating, setIsUpdating] = useState(false);

	const isEditIKCategory = useMemo(() => {
		const kat = kategoriList.find((k) => k.id === editKategoriId);
		return kat?.kode_kategori === 'IK';
	}, [kategoriList, editKategoriId]);

	useEffect(() => {
		if (!isOpen || !editingItem) return;
		setEditKategoriId(editingItem.kategori_id || kategoriList[0]?.id || '');
		setEditJudul(editingItem.judul);
		setEditParameterUji(editingItem.parameter_uji || '');
		setEditMetodePengujian(editingItem.metode_pengujian || '');
		setEditFilePath(editingItem.file_path);
		setEditDeskripsi(editingItem.deskripsi || '');
	}, [isOpen, editingItem, kategoriList]);

	const handleSubmitEdit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingItem) return;

		setIsUpdating(true);
		try {
			const res = await updateDokumenMutuAction(editingItem.id, {
				judul: editJudul,
				kategori_id: editKategoriId,
				parameter_uji: isEditIKCategory ? editParameterUji : undefined,
				metode_pengujian: isEditIKCategory ? editMetodePengujian : undefined,
				file_path: editFilePath,
				deskripsi: editDeskripsi
			});

			if (res.success && res.data) {
				onSuccess(res.data as DokumenMutuItem);
				toast.success(res.message || 'Metadata dokumen berhasil diperbarui.');
				onOpenChange(false);
			} else {
				toast.error(res.message || 'Gagal memperbarui dokumen.');
			}
		} catch {
			toast.error('Terjadi kesalahan sistem.');
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={isOpen}>
			<DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Pencil className='size-4 text-primary' />
						<span>Edit Metadata Dokumen Mutu</span>
					</DialogTitle>
					<DialogDescription className='text-xs'>
						Perbarui informasi dokumen <strong>{editingItem?.kode_ik}</strong>. Perubahan berkas PDF akan
						menaikkan versi dokumen secara otomatis.
					</DialogDescription>
				</DialogHeader>

				<form className='space-y-4 py-2' onSubmit={handleSubmitEdit}>
					<Field>
						<FieldLabel htmlFor='edit_kategori'>Kategori Dokumen</FieldLabel>
						<Select onValueChange={(val) => val && setEditKategoriId(val)} value={editKategoriId}>
							<SelectTrigger id='edit_kategori'>
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
					</Field>

					<Field>
						<FieldLabel htmlFor='edit_judul'>Judul Dokumen *</FieldLabel>
						<Input
							id='edit_judul'
							onChange={(e) => setEditJudul(e.target.value)}
							required
							value={editJudul}
						/>
					</Field>

					{isEditIKCategory && (
						<div className='space-y-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-900 dark:bg-blue-950/20'>
							<p className='font-semibold text-blue-900 text-xs dark:text-blue-200'>
								Spesifikasi Instruksi Kerja (IK)
							</p>

							<Field>
								<FieldLabel htmlFor='edit_parameter_uji'>Parameter Mutu Air</FieldLabel>
								<Select onValueChange={(val) => val && setEditParameterUji(val)} value={editParameterUji}>
									<SelectTrigger className='bg-background' id='edit_parameter_uji'>
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
							</Field>

							<Field>
								<FieldLabel htmlFor='edit_metode_pengujian'>Metode / Acuan Resmi SNI</FieldLabel>
								<Input
									className='bg-background'
									id='edit_metode_pengujian'
									onChange={(e) => setEditMetodePengujian(e.target.value)}
									value={editMetodePengujian}
								/>
							</Field>
						</div>
					)}

					<Field>
						<FieldLabel htmlFor='edit_file_path'>Path / URL Berkas PDF</FieldLabel>
						<Input
							className='text-xs'
							id='edit_file_path'
							onChange={(e) => setEditFilePath(e.target.value)}
							required
							value={editFilePath}
						/>
						<FieldDescription className='text-[11px]'>
							Jika URL PDF diubah, sistem otomatis menaikkan nomor versi (+1).
						</FieldDescription>
					</Field>

					<Field>
						<FieldLabel htmlFor='edit_deskripsi'>Deskripsi / Ruang Lingkup</FieldLabel>
						<Input
							id='edit_deskripsi'
							onChange={(e) => setEditDeskripsi(e.target.value)}
							value={editDeskripsi}
						/>
					</Field>

					<DialogFooter className='pt-2'>
						<Button
							disabled={isUpdating}
							onClick={() => onOpenChange(false)}
							type='button'
							variant='outline'
						>
							Batal
						</Button>
						<Button disabled={isUpdating} type='submit'>
							{isUpdating ? (
								<>
									<Loader2 className='mr-1.5 size-3.5 animate-spin' />
									Menyimpan...
								</>
							) : (
								'Perbarui Dokumen'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
