'use client';

import {
	ExternalLink,
	FileCheck2,
	FileText,
	Info,
	Loader2,
	MoreVertical,
	Pencil,
	Plus,
	QrCode,
	Search,
	Trash2,
	X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Card } from '@/components/shadcn/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/shadcn/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/shadcn/table';
import {
	createInstruksiKerjaAction,
	deleteInstruksiKerjaAction,
	updateInstruksiKerjaAction
} from '@/lib/actions/instruksi-kerja';
import { APP_NAME } from '@/lib/constants';
import { toFieldErrors } from '@/lib/utils';
import { instruksiKerjaSchema } from '@/lib/validations/instruksi-kerja';

type IKItem = {
	id: string;
	kode_ik: string;
	judul: string;
	kategori: string | null;
	file_path: string;
	qr_code_hash: string;
	versi: number;
	createdAt: Date;
};

export function InstruksiKerjaClient({ initialList }: { initialList: IKItem[] }) {
	const router = useRouter();
	const [list, setList] = useState<IKItem[]>(initialList);
	const [searchTerm, setSearchTerm] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Form State Tambah
	const [kodeIk, setKodeIk] = useState('');
	const [judul, setJudul] = useState('');
	const [kategori, setKategori] = useState('Standar Operasional In-Situ');
	const [filePath, setFilePath] = useState('');
	const [versi, setVersi] = useState('1');
	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

	// Form State Edit
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<IKItem | null>(null);
	const [editJudul, setEditJudul] = useState('');
	const [editKategori, setEditKategori] = useState('');
	const [editFilePath, setEditFilePath] = useState('');
	const [isUpdating, setIsUpdating] = useState(false);

	const handleOpenModal = () => {
		const nextNum = list.length + 1;
		const padded = String(nextNum).padStart(3, '0');
		setKodeIk(`IK-${padded}`);
		setJudul('');
		setFilePath(`/uploads/ik-${padded}.pdf`);
		setVersi('1');
		setFieldErrors({});
		setIsModalOpen(true);
	};

	const handleOpenEditModal = (item: IKItem) => {
		setEditingItem(item);
		setEditJudul(item.judul);
		setEditKategori(item.kategori || 'Standar Operasional In-Situ');
		setEditFilePath(item.file_path);
		setIsEditModalOpen(true);
	};

	const handleUpdateSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingItem) return;

		if (!editJudul.trim() || !editFilePath.trim()) {
			toast.error('Judul dan Tautan / File Dokumen wajib diisi.');
			return;
		}

		setIsUpdating(true);
		try {
			const res = await updateInstruksiKerjaAction(editingItem.id, {
				judul: editJudul,
				kategori: editKategori,
				file_path: editFilePath
			});

			if (res.success && res.data) {
				setList(list.map((x) => (x.id === editingItem.id ? (res.data as IKItem) : x)));
				toast.success(res.message || 'Instruksi Kerja berhasil diperbarui.');
				setIsEditModalOpen(false);
			} else {
				toast.error(res.message || 'Gagal memperbarui Instruksi Kerja.');
			}
		} catch {
			toast.error('Gagal memperbarui Instruksi Kerja.');
		} finally {
			setIsUpdating(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFieldErrors({});

		// 1. Validasi Zod Client-Side
		const validation = instruksiKerjaSchema.safeParse({
			kode_ik: kodeIk,
			judul,
			kategori,
			file_path: filePath,
			versi: Number(versi)
		});

		if (!validation.success) {
			setFieldErrors(validation.error.flatten().fieldErrors);
			return;
		}

		setIsSubmitting(true);
		try {
			const res = await createInstruksiKerjaAction({
				kode_ik: kodeIk,
				judul,
				kategori,
				file_path: filePath,
				versi: Number(versi)
			});

			if (res.success && res.data) {
				setList([res.data as IKItem, ...list]);
				toast.success(res.message || 'Instruksi kerja berhasil diterbitkan.');
				setIsModalOpen(false);
			} else {
				if (res.errors) {
					setFieldErrors(res.errors as Record<string, string[]>);
				}
				toast.error(res.message || 'Gagal menyimpan Instruksi Kerja.');
			}
		} catch {
			toast.error('Terjadi kesalahan sistem.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (id: string, kode: string) => {
		if (!confirm(`Hapus Instruksi Kerja "${kode}"? Dokumen QR terkait tidak akan valid.`)) return;

		try {
			const res = await deleteInstruksiKerjaAction(id);
			if (res.success) {
				setList(list.filter((x) => x.id !== id));
				toast.success(res.message || 'Instruksi Kerja berhasil dihapus.');
			} else {
				toast.error(res.message || 'Gagal menghapus.');
			}
		} catch {
			toast.error('Gagal menghapus Instruksi Kerja.');
		}
	};

	const filteredList = list.filter((item) => {
		if (!searchTerm.trim()) return true;
		const query = searchTerm.toLowerCase().trim();
		return (
			item.kode_ik.toLowerCase().includes(query) ||
			item.judul.toLowerCase().includes(query) ||
			item.kategori?.toLowerCase().includes(query) ||
			item.qr_code_hash.toLowerCase().includes(query)
		);
	});

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<Badge
						className='mb-1.5 gap-1.5 px-2.5 py-0.5 font-semibold text-xs uppercase tracking-wider'
						variant='secondary'
					>
						<FileCheck2 className='size-3' />
						<span>SOP & Penjaminan Mutu</span>
					</Badge>
					<h1 className='font-bold font-heading text-2xl text-foreground tracking-tight'>
						Instruksi Kerja (IK) & Integrasi Label QR
					</h1>
					<p className='mt-1 text-muted-foreground text-xs'>
						Standard Operating Procedure (SOP) pengujian mutu air dengan generator QR Code unik untuk
						stiker botol sampel.
					</p>
				</div>

				<Button
					className='cursor-pointer gap-2 self-start shadow-xs sm:self-auto'
					onClick={handleOpenModal}
				>
					<Plus className='size-4' />
					<span>Tambah Dokumen IK Baru</span>
				</Button>
			</div>

			{/* Search Bar & Indikator Komparasi */}
			<div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
				<InputGroup className='max-w-md flex-1'>
					<InputGroupAddon align='inline-start'>
						<Search className='size-4 text-muted-foreground' />
					</InputGroupAddon>
					<InputGroupInput
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder='Cari kode SOP, judul prosedur, atau kategori...'
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

				<div className='flex items-center gap-2 self-start text-xs sm:self-auto'>
					{filteredList.length < list.length ? (
						<div className='flex items-center gap-2'>
							<Badge variant='secondary'>
								Menampilkan {filteredList.length} dari {list.length} SOP (Hasil Filter)
							</Badge>
							<Button
								className='cursor-pointer text-muted-foreground text-xs hover:text-foreground'
								onClick={() => setSearchTerm('')}
								size='xs'
								variant='ghost'
							>
								Reset
							</Button>
						</div>
					) : (
						<span className='text-muted-foreground'>
							Total: <strong className='text-foreground'>{list.length}</strong> SOP terdaftar
						</span>
					)}
				</div>
			</div>

			{/* Table Card */}
			<Card>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader>
							<TableRow className='bg-muted/40 hover:bg-muted/40'>
								<TableHead className='font-semibold text-xs'>Kode IK</TableHead>
								<TableHead className='font-semibold text-xs'>Judul Prosedur SOP</TableHead>
								<TableHead className='font-semibold text-xs'>Kategori</TableHead>
								<TableHead className='font-semibold text-xs'>Versi</TableHead>
								<TableHead className='font-semibold text-xs'>Hash QR Verifikasi</TableHead>
								<TableHead className='text-right font-semibold text-xs'>Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredList.length === 0 ? (
								<TableRow>
									<TableCell className='py-8 text-center text-muted-foreground text-xs' colSpan={6}>
										{searchTerm ? (
											<div className='space-y-1.5'>
												<p>Tidak ada SOP yang cocok dengan pencarian &ldquo;{searchTerm}&rdquo;.</p>
												<Button
													className='cursor-pointer'
													onClick={() => setSearchTerm('')}
													size='xs'
													variant='outline'
												>
													Kosongkan Pencarian
												</Button>
											</div>
										) : (
											<p>Belum ada dokumen Instruksi Kerja yang terdaftar.</p>
										)}
									</TableCell>
								</TableRow>
							) : (
								filteredList.map((item) => (
									<TableRow className='hover:bg-muted/30' key={item.id}>
										<TableCell className='font-semibold text-foreground text-xs'>{item.kode_ik}</TableCell>
										<TableCell className='font-semibold text-foreground text-xs'>
											<div className='space-y-0.5'>
												<a
													className='group inline-flex cursor-pointer items-center gap-1.5 font-medium text-foreground transition-colors hover:underline'
													href={item.file_path}
													rel='noopener noreferrer'
													target='_blank'
													title={`Buka dokumen: ${item.file_path}`}
												>
													<FileText className='size-3.5 shrink-0 text-muted-foreground group-hover:text-foreground' />
													<span>{item.judul}</span>
													<ExternalLink className='size-3 shrink-0 text-muted-foreground opacity-60 group-hover:text-foreground group-hover:opacity-100' />
												</a>
												<div className='flex items-center gap-1.5 text-muted-foreground text-xs'>
													<span className='max-w-[240px] truncate' title={item.file_path}>
														{item.file_path}
													</span>
													{item.file_path.startsWith('http') && (
														<Badge className='h-4 px-1.5 py-0' variant='secondary'>
															Tautan Eksternal
														</Badge>
													)}
												</div>
											</div>
										</TableCell>
										<TableCell className='text-xs'>
											<Badge className='font-normal' variant='secondary'>
												{item.kategori || 'Standar Uji'}
											</Badge>
										</TableCell>
										<TableCell className='text-xs'>v{item.versi}.0</TableCell>
										<TableCell className='text-muted-foreground text-xs'>
											<span className='rounded bg-muted px-1.5 py-0.5 text-xs'>
												{item.qr_code_hash.substring(0, 10)}...
											</span>
										</TableCell>
										<TableCell className='text-right'>
											<DropdownMenu>
												<DropdownMenuTrigger
													className='inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
													title='Menu Aksi Dokumen IK'
												>
													<MoreVertical className='size-4' />
													<span className='sr-only'>Aksi Dokumen IK</span>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end' className='w-48'>
													<DropdownMenuGroup>
														<DropdownMenuLabel className='text-xs'>Dokumen & QR</DropdownMenuLabel>
														<DropdownMenuItem
															className='cursor-pointer gap-2 text-xs'
															onClick={() => window.open(item.file_path, '_blank', 'noopener,noreferrer')}
														>
															<ExternalLink className='size-3.5 text-muted-foreground' />
															<span>Buka Dokumen SOP</span>
														</DropdownMenuItem>
														<DropdownMenuItem
															className='cursor-pointer gap-2 text-xs'
															onClick={() => router.push(`/instruksi-kerja/${item.id}/cetak-label`)}
														>
															<QrCode className='size-3.5 text-muted-foreground' />
															<span>Cetak Label QR</span>
														</DropdownMenuItem>
													</DropdownMenuGroup>
													<DropdownMenuSeparator />
													<DropdownMenuGroup>
														<DropdownMenuLabel className='text-xs'>Kelola</DropdownMenuLabel>
														<DropdownMenuItem
															className='cursor-pointer gap-2 text-xs'
															onClick={() => handleOpenEditModal(item)}
														>
															<Pencil className='size-3.5 text-muted-foreground' />
															<span>Edit Prosedur SOP</span>
														</DropdownMenuItem>
													</DropdownMenuGroup>
													<DropdownMenuSeparator />
													<DropdownMenuGroup>
														<DropdownMenuItem
															className='cursor-pointer gap-2 text-destructive text-xs focus:bg-destructive/10'
															onClick={() => handleDelete(item.id, item.kode_ik)}
															variant='destructive'
														>
															<Trash2 className='size-3.5' />
															<span>Hapus Dokumen IK</span>
														</DropdownMenuItem>
													</DropdownMenuGroup>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</Card>

			{/* Dialog Modal Tambah IK */}
			<Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
				<DialogContent className='sm:max-w-lg'>
					<DialogHeader>
						<DialogTitle className='flex items-center gap-2'>
							<FileCheck2 className='size-4 text-muted-foreground' />
							<span>Registrasi Dokumen SOP / IK Baru</span>
						</DialogTitle>
						<DialogDescription className='text-xs'>
							Setiap IK yang didaftarkan akan secara otomatis mendapatkan hash QR Code unik untuk validasi
							keabsahan di sistem {APP_NAME}.
						</DialogDescription>
					</DialogHeader>

					<form className='space-y-4 py-2' onSubmit={handleSubmit}>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
							<Field>
								<FieldLabel htmlFor='kode_ik'>Kode IK *</FieldLabel>
								<Input
									id='kode_ik'
									onChange={(e) => setKodeIk(e.target.value)}
									placeholder='IK-001'
									type='text'
									value={kodeIk}
								/>
								<FieldError errors={toFieldErrors(fieldErrors.kode_ik)} />
							</Field>

							<Field className='sm:col-span-2'>
								<FieldLabel htmlFor='kategori'>Kategori Standar</FieldLabel>
								<Select
									onValueChange={(val) => {
										if (val) setKategori(val);
									}}
									value={kategori}
								>
									<SelectTrigger id='kategori'>
										<SelectValue placeholder='Pilih Kategori' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='Standar Operasional In-Situ'>Standar Operasional In-Situ</SelectItem>
										<SelectItem value='Uji Kimia Laboratorium'>Uji Kimia Laboratorium</SelectItem>
										<SelectItem value='Uji Mikrobiologi Air'>Uji Mikrobiologi Air</SelectItem>
										<SelectItem value='Pengambilan Sampel Fisika'>Pengambilan Sampel Fisika</SelectItem>
									</SelectContent>
								</Select>
							</Field>
						</div>

						<Field>
							<FieldLabel htmlFor='judul'>Judul Prosedur Instruksi Kerja *</FieldLabel>
							<Input
								id='judul'
								onChange={(e) => setJudul(e.target.value)}
								placeholder='Contoh: Pengambilan Sampel & Pengukuran Lapangan Suhu dan pH Kolam'
								type='text'
								value={judul}
							/>
							<FieldError errors={toFieldErrors(fieldErrors.judul)} />
						</Field>

						<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
							<Field className='sm:col-span-2'>
								<FieldLabel htmlFor='file_path'>Tautan URL / Path Dokumen *</FieldLabel>
								<InputGroup>
									<InputGroupInput
										id='file_path'
										onChange={(e) => setFilePath(e.target.value)}
										placeholder='https://drive.google.com/... atau /uploads/ik-001.pdf'
										required
										type='text'
										value={filePath}
									/>
									{filePath.startsWith('http') && (
										<InputGroupAddon align='inline-end'>
											<ExternalLink className='pointer-events-none size-3.5 text-muted-foreground' />
										</InputGroupAddon>
									)}
								</InputGroup>
								<FieldDescription>
									Dapat berupa link eksternal (Google Drive, Cloud Storage) atau file lokal. Kamera ponsel
									langsung membuka link ini saat QR di-scan.
								</FieldDescription>
								<FieldError errors={toFieldErrors(fieldErrors.file_path)} />
							</Field>

							<Field>
								<FieldLabel htmlFor='versi'>Nomor Versi</FieldLabel>
								<Input
									id='versi'
									onChange={(e) => setVersi(e.target.value)}
									placeholder='1'
									type='number'
									value={versi}
								/>
							</Field>
						</div>

						<DialogFooter className='pt-2'>
							<Button
								disabled={isSubmitting}
								onClick={() => setIsModalOpen(false)}
								type='button'
								variant='outline'
							>
								Batal
							</Button>
							<Button disabled={isSubmitting} type='submit'>
								{isSubmitting ? (
									<>
										<Loader2 className='mr-1.5 size-3.5 animate-spin' />
										Menerbitkan...
									</>
								) : (
									'Simpan & Terbitkan QR'
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Dialog Modal Edit IK (Menjaga QR fisik tetap valid) */}
			<Dialog onOpenChange={setIsEditModalOpen} open={isEditModalOpen}>
				<DialogContent className='sm:max-w-lg'>
					<DialogHeader>
						<DialogTitle className='flex items-center gap-2'>
							<Pencil className='size-4 text-muted-foreground' />
							<span>Edit Dokumen SOP ({editingItem?.kode_ik})</span>
						</DialogTitle>
						<DialogDescription className='text-xs'>
							Perbarui judul prosedur atau tautan dokumen. Barcode QR fisik yang tertempel di kolam akan
							tetap aktif.
						</DialogDescription>
					</DialogHeader>

					<form className='space-y-4 py-2' onSubmit={handleUpdateSubmit}>
						<div className='flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 p-3 text-xs'>
							<Info className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
							<div>
								<span className='font-semibold text-foreground'>Integritas Keabsahan Stiker QR:</span>
								<p className='mt-0.5 text-muted-foreground'>
									Versi akan otomatis naik dari <strong>v{editingItem?.versi}.0</strong> ke{' '}
									<strong>v{(editingItem?.versi || 1) + 1}.0</strong>. Kode QR fisik tidak berubah.
								</p>
							</div>
						</div>

						<Field>
							<FieldLabel htmlFor='edit_kategori'>Kategori Standar</FieldLabel>
							<Select
								onValueChange={(val) => {
									if (val) setEditKategori(val);
								}}
								value={editKategori}
							>
								<SelectTrigger id='edit_kategori'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='Standar Operasional In-Situ'>Standar Operasional In-Situ</SelectItem>
									<SelectItem value='Uji Kimia Laboratorium'>Uji Kimia Laboratorium</SelectItem>
									<SelectItem value='Uji Mikrobiologi Air'>Uji Mikrobiologi Air</SelectItem>
									<SelectItem value='Pengambilan Sampel Fisika'>Pengambilan Sampel Fisika</SelectItem>
								</SelectContent>
							</Select>
						</Field>

						<Field>
							<FieldLabel htmlFor='edit_judul'>Judul Prosedur Instruksi Kerja *</FieldLabel>
							<Input
								id='edit_judul'
								onChange={(e) => setEditJudul(e.target.value)}
								placeholder='Judul prosedur SOP...'
								required
								type='text'
								value={editJudul}
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor='edit_file_path'>Tautan URL / Path Dokumen *</FieldLabel>
							<InputGroup>
								<InputGroupInput
									id='edit_file_path'
									onChange={(e) => setEditFilePath(e.target.value)}
									placeholder='https://drive.google.com/... atau /uploads/ik-001.pdf'
									required
									type='text'
									value={editFilePath}
								/>
								{editFilePath.startsWith('http') && (
									<InputGroupAddon align='inline-end'>
										<ExternalLink className='pointer-events-none size-3.5 text-muted-foreground' />
									</InputGroupAddon>
								)}
							</InputGroup>
							<FieldDescription>
								Tautan link eksternal (Google Drive / Cloud PDF). Kamera ponsel akan langsung membuka URL
								ini saat QR di-scan.
							</FieldDescription>
						</Field>

						<DialogFooter className='pt-2'>
							<Button
								disabled={isUpdating}
								onClick={() => setIsEditModalOpen(false)}
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
									'Perbarui Dokumen SOP'
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
