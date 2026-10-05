import { FolderKanban, Loader2 } from 'lucide-react';
import type React from 'react';

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
import { toFieldErrors } from '@/lib/utils';
import type { KategoriItem } from '../../client';

type KategoriFormDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isEditing: boolean;
	selectedItem: KategoriItem | null;
	kodeKategori: string;
	setKodeKategori: (val: string) => void;
	namaKategori: string;
	setNamaKategori: (val: string) => void;
	deskripsi: string;
	setDeskripsi: (val: string) => void;
	urutan: string;
	setUrutan: (val: string) => void;
	fieldErrors: Record<string, string[]>;
	isSubmitting: boolean;
	onSubmit: (e: React.FormEvent) => void;
};

export function KategoriFormDialog({
	open,
	onOpenChange,
	isEditing,
	selectedItem,
	kodeKategori,
	setKodeKategori,
	namaKategori,
	setNamaKategori,
	deskripsi,
	setDeskripsi,
	urutan,
	setUrutan,
	fieldErrors,
	isSubmitting,
	onSubmit
}: KategoriFormDialogProps) {
	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<FolderKanban className='size-4 text-primary' />
						<span>
							{isEditing ? `Edit Kategori: ${selectedItem?.nama_kategori}` : 'Tambah Kategori Dokumen'}
						</span>
					</DialogTitle>
					<DialogDescription>
						Kelola kategori dokumen standarisasi mutu laboratorium perikanan.
					</DialogDescription>
				</DialogHeader>

				<form className='space-y-4 py-2' onSubmit={onSubmit}>
					<Field>
						<FieldLabel htmlFor='kode_kategori'>Kode Singkatan Kategori *</FieldLabel>
						<Input
							className='font-mono uppercase'
							disabled={isEditing}
							id='kode_kategori'
							onChange={(e) => setKodeKategori(e.target.value.toUpperCase())}
							placeholder='Contoh: PM, PP, SOP, IK, FR'
							type='text'
							value={kodeKategori}
						/>
						<FieldDescription>Akronim resmi kategori (maksimal 20 karakter).</FieldDescription>
						<FieldError errors={toFieldErrors(fieldErrors.kode_kategori)} />
					</Field>

					<Field>
						<FieldLabel htmlFor='nama_kategori'>Nama Kategori Dokumen *</FieldLabel>
						<Input
							id='nama_kategori'
							onChange={(e) => setNamaKategori(e.target.value)}
							placeholder='Contoh: Instruksi Kerja'
							type='text'
							value={namaKategori}
						/>
						<FieldError errors={toFieldErrors(fieldErrors.nama_kategori)} />
					</Field>

					<Field>
						<FieldLabel htmlFor='deskripsi'>Deskripsi / Ruang Lingkup</FieldLabel>
						<Input
							id='deskripsi'
							onChange={(e) => setDeskripsi(e.target.value)}
							placeholder='Penjelasan fungsi kategori dokumen'
							type='text'
							value={deskripsi}
						/>
					</Field>

					<Field>
						<FieldLabel htmlFor='urutan'>Nomor Urutan Tampilan</FieldLabel>
						<Input
							className='font-mono'
							id='urutan'
							onChange={(e) => setUrutan(e.target.value)}
							placeholder='1'
							type='number'
							value={urutan}
						/>
					</Field>

					<DialogFooter className='pt-2'>
						<Button
							className='cursor-pointer'
							disabled={isSubmitting}
							onClick={() => onOpenChange(false)}
							type='button'
							variant='outline'
						>
							Batal
						</Button>
						<Button className='cursor-pointer' disabled={isSubmitting} type='submit'>
							{isSubmitting ? (
								<>
									<Loader2 className='mr-1.5 size-3.5 animate-spin' />
									Menyimpan...
								</>
							) : isEditing ? (
								'Simpan Perubahan'
							) : (
								'Tambah Kategori'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
