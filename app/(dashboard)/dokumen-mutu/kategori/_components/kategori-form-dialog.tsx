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
	tingkatan: string;
	setTingkatan: (val: string) => void;
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
	tingkatan,
	setTingkatan,
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
						Kelola kategori dan tingkatan peran dokumen mutu laboratorium perikanan.
					</DialogDescription>
				</DialogHeader>

				<form className='space-y-4 py-2' onSubmit={onSubmit}>
					<Field>
						<FieldLabel htmlFor='kode_kategori'>Kode Singkatan Kategori *</FieldLabel>
						<Input
							className='uppercase'
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
						<FieldLabel htmlFor='tingkatan'>Tingkatan / Peran Dokumen *</FieldLabel>
						<select
							className='h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
							id='tingkatan'
							onChange={(e) => setTingkatan(e.target.value)}
							value={tingkatan}
						>
							<option className='bg-popover text-foreground text-xs' value='1'>
								Tingkat 1: Pedoman / Kebijakan Mutu (Hanya Arsip)
							</option>
							<option className='bg-popover text-foreground text-xs' value='2'>
								Tingkat 2: General / SOP Induk (Dapat Dipilih untuk Pengujian Umum)
							</option>
							<option className='bg-popover text-foreground text-xs' value='3'>
								Tingkat 3: Instruksi Kerja Teknis (Dapat Dipilih saat Input Parameter Uji)
							</option>
							<option className='bg-popover text-foreground text-xs' value='4'>
								Tingkat 4: Formulir / Rekaman Mutu (Hanya Arsip)
							</option>
							<option className='bg-popover text-foreground text-xs' value='5'>
								Tingkat 5+: Dokumen Eksternal / Pendukung Lainnya (Arsip)
							</option>
						</select>
						<FieldDescription>
							Tingkat 2 digunakan sebagai SOP Umum, Tingkat 3 untuk pilihan saat input parameter, dan
							tingkat lain sebagai arsip.
						</FieldDescription>
						<FieldError errors={toFieldErrors(fieldErrors.tingkatan)} />
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
