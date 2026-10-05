'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { deleteDokumenMutuAction, toggleDokumenMutuAction } from '@/lib/actions/dokumen-mutu';
import { DokumenCreateDialog } from './_components/dokumen-create-dialog';
import { DokumenEditDialog } from './_components/dokumen-edit-dialog';
import { DokumenFilterBar } from './_components/dokumen-filter-bar';
import { DokumenHeader } from './_components/dokumen-header';
import { DokumenTable } from './_components/dokumen-table';
import type { DokumenMutuClientProps, DokumenMutuItem, KategoriItem } from './types';

export type { DokumenMutuItem, KategoriItem };

export function DokumenMutuClient({
	initialList,
	kategoriList,
	parameterList
}: DokumenMutuClientProps) {
	const [list, setList] = useState<DokumenMutuItem[]>(initialList);
	const [selectedKategoriTab, setSelectedKategoriTab] = useState<string>('all');
	const [searchTerm, setSearchTerm] = useState('');

	// Dialog States
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<DokumenMutuItem | null>(null);

	const handleOpenAdd = () => {
		setIsModalOpen(true);
	};

	const handleOpenEdit = (item: DokumenMutuItem) => {
		setEditingItem(item);
		setIsEditModalOpen(true);
	};

	const handleAddSuccess = (newDoc: DokumenMutuItem) => {
		setList((prev) => [newDoc, ...prev]);
	};

	const handleEditSuccess = (updatedDoc: DokumenMutuItem) => {
		setList((prev) => prev.map((x) => (x.id === updatedDoc.id ? { ...x, ...updatedDoc } : x)));
	};

	const handleToggleAktif = async (item: DokumenMutuItem) => {
		const newStatus = item.aktif === false;
		try {
			const res = await toggleDokumenMutuAction(item.id, newStatus);
			if (res.success) {
				setList((prev) => prev.map((x) => (x.id === item.id ? { ...x, aktif: newStatus } : x)));
				toast.success(res.message);
			} else {
				toast.error(res.message || 'Gagal mengubah status dokumen.');
			}
		} catch {
			toast.error('Gagal mengubah status dokumen.');
		}
	};

	const handleDelete = async (item: DokumenMutuItem) => {
		if (
			!confirm(
				`Hapus permanen dokumen "${item.kode_ik} - ${item.judul}"? Tindakan ini tidak dapat dibatalkan.`
			)
		) {
			return;
		}

		try {
			const res = await deleteDokumenMutuAction(item.id);
			if (res.success) {
				setList((prev) => prev.filter((x) => x.id !== item.id));
				toast.success(res.message || 'Dokumen berhasil dihapus.');
			} else {
				toast.error(res.message || 'Gagal menghapus dokumen.');
			}
		} catch {
			toast.error('Gagal menghapus dokumen.');
		}
	};

	const filteredList = useMemo(() => {
		return list.filter((item) => {
			// 1. Filter Kategori
			if (selectedKategoriTab !== 'all') {
				const matchesCategory =
					item.kategoriDokumen?.kode_kategori === selectedKategoriTab ||
					item.kode_ik.startsWith(`${selectedKategoriTab}-`);
				if (!matchesCategory) return false;
			}

			// 2. Filter Pencarian
			if (!searchTerm.trim()) return true;
			const q = searchTerm.toLowerCase();

			return (
				item.kode_ik.toLowerCase().includes(q) ||
				item.judul.toLowerCase().includes(q) ||
				item.parameter_uji?.toLowerCase().includes(q) ||
				item.metode_pengujian?.toLowerCase().includes(q) ||
				item.deskripsi?.toLowerCase().includes(q)
			);
		});
	}, [list, selectedKategoriTab, searchTerm]);

	return (
		<div className='space-y-6'>
			{/* Header */}
			<DokumenHeader onOpenAdd={handleOpenAdd} />

			{/* Tabs Filter Kategori & Search */}
			<DokumenFilterBar
				filteredCount={filteredList.length}
				kategoriList={kategoriList}
				list={list}
				onResetSearch={() => setSearchTerm('')}
				onSearchChange={setSearchTerm}
				onTabChange={setSelectedKategoriTab}
				searchTerm={searchTerm}
				selectedKategoriTab={selectedKategoriTab}
				totalCount={list.length}
			/>

			{/* Table Dokumen Mutu */}
			<DokumenTable
				items={filteredList}
				onDelete={handleDelete}
				onEdit={handleOpenEdit}
				onToggleAktif={handleToggleAktif}
				searchTerm={searchTerm}
			/>

			{/* Dialog Modal Registrasi Dokumen Baru */}
			<DokumenCreateDialog
				existingList={list}
				isOpen={isModalOpen}
				kategoriList={kategoriList}
				onOpenChange={setIsModalOpen}
				onSuccess={handleAddSuccess}
				parameterList={parameterList}
			/>

			{/* Dialog Modal Edit Metadata Dokumen */}
			<DokumenEditDialog
				editingItem={editingItem}
				isOpen={isEditModalOpen}
				kategoriList={kategoriList}
				onOpenChange={setIsEditModalOpen}
				onSuccess={handleEditSuccess}
				parameterList={parameterList}
			/>
		</div>
	);
}
