'use client';

import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
	createKategoriDokumenAction,
	deleteKategoriDokumenAction,
	toggleKategoriDokumenAction,
	updateKategoriDokumenAction
} from '@/lib/actions/dokumen-mutu';
import { kategoriDokumenSchema } from '@/lib/validations/dokumen-mutu';
import type { KategoriItem } from '../client';
import { KategoriFormDialog } from './_components/kategori-form-dialog';
import { KategoriHeader } from './_components/kategori-header';
import { KategoriTable } from './_components/kategori-table';
import type { KategoriDokumenClientProps } from './types';

export * from './types';

export function KategoriDokumenClient({ initialList }: KategoriDokumenClientProps) {
	const [list, setList] = useState(initialList);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedItem, setSelectedItem] = useState<KategoriItem | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Form State
	const [kodeKategori, setKodeKategori] = useState('');
	const [namaKategori, setNamaKategori] = useState('');
	const [deskripsi, setDeskripsi] = useState('');
	const [urutan, setUrutan] = useState('0');
	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

	const handleOpenAdd = () => {
		setIsEditing(false);
		setSelectedItem(null);
		setKodeKategori('');
		setNamaKategori('');
		setDeskripsi('');
		setUrutan(String(list.length + 1));
		setFieldErrors({});
		setIsModalOpen(true);
	};

	const handleOpenEdit = (item: KategoriItem) => {
		setIsEditing(true);
		setSelectedItem(item);
		setKodeKategori(item.kode_kategori);
		setNamaKategori(item.nama_kategori);
		setDeskripsi(item.deskripsi || '');
		setUrutan(String(item.urutan || 0));
		setFieldErrors({});
		setIsModalOpen(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFieldErrors({});

		const payload = {
			kode_kategori: kodeKategori.trim().toUpperCase(),
			nama_kategori: namaKategori.trim(),
			deskripsi: deskripsi.trim() || null,
			urutan: Number(urutan) || 0,
			aktif: true
		};

		const validation = kategoriDokumenSchema.safeParse(payload);
		if (!validation.success) {
			setFieldErrors(validation.error.flatten().fieldErrors);
			return;
		}

		setIsSubmitting(true);
		try {
			if (isEditing && selectedItem) {
				const res = await updateKategoriDokumenAction(selectedItem.id, payload);
				if (res.success && res.data) {
					setList(list.map((k) => (k.id === selectedItem.id ? { ...k, ...res.data } : k)));
					toast.success(res.message);
					setIsModalOpen(false);
				} else {
					toast.error(res.message || 'Gagal memperbarui kategori.');
				}
			} else {
				const res = await createKategoriDokumenAction(payload);
				if (res.success && res.data) {
					setList([...list, { ...res.data, documentCount: 0 }]);
					toast.success(res.message);
					setIsModalOpen(false);
				} else {
					if (res.errors) setFieldErrors(res.errors as Record<string, string[]>);
					toast.error(res.message || 'Gagal menyimpan kategori.');
				}
			}
		} catch {
			toast.error('Terjadi kesalahan sistem.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleToggleAktif = async (item: KategoriItem) => {
		const newStatus = !item.aktif;
		try {
			const res = await toggleKategoriDokumenAction(item.id, newStatus);
			if (res.success) {
				setList(list.map((k) => (k.id === item.id ? { ...k, aktif: newStatus } : k)));
				toast.success(res.message);
			} else {
				toast.error(res.message);
			}
		} catch {
			toast.error('Gagal mengubah status kategori.');
		}
	};

	const handleDelete = async (item: KategoriItem) => {
		if (
			!confirm(`Hapus permanen kategori "${item.nama_kategori}"? Tindakan ini tidak dapat dibatalkan.`)
		)
			return;

		try {
			const res = await deleteKategoriDokumenAction(item.id);
			if (res.success) {
				setList(list.filter((k) => k.id !== item.id));
				toast.success(res.message);
			} else {
				toast.error(res.message);
			}
		} catch {
			toast.error('Gagal menghapus kategori.');
		}
	};

	return (
		<div className='space-y-6'>
			<KategoriHeader onAdd={handleOpenAdd} />

			<KategoriTable
				items={list}
				onDelete={handleDelete}
				onEdit={handleOpenEdit}
				onToggleAktif={handleToggleAktif}
			/>

			<KategoriFormDialog
				deskripsi={deskripsi}
				fieldErrors={fieldErrors}
				isEditing={isEditing}
				isSubmitting={isSubmitting}
				kodeKategori={kodeKategori}
				namaKategori={namaKategori}
				onOpenChange={setIsModalOpen}
				onSubmit={handleSubmit}
				open={isModalOpen}
				selectedItem={selectedItem}
				setDeskripsi={setDeskripsi}
				setKodeKategori={setKodeKategori}
				setNamaKategori={setNamaKategori}
				setUrutan={setUrutan}
				urutan={urutan}
			/>
		</div>
	);
}
