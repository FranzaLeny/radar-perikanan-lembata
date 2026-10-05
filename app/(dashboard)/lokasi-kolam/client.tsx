'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { deleteLokasiKolamAction, toggleLokasiKolamAction } from '@/lib/actions/lokasi-kolam';
import { LokasiFilterBar } from './_components/lokasi-filter-bar';
import { LokasiFormDialog } from './_components/lokasi-form-dialog';
import { LokasiHeader } from './_components/lokasi-header';
import { LokasiTable } from './_components/lokasi-table';
import type { FilterTab, LokasiItem } from './types';

export type { LokasiItem };

export function LokasiKolamClient({ initialList }: { initialList: LokasiItem[] }) {
	const [list, setList] = useState<LokasiItem[]>(initialList);
	const [filterTab, setFilterTab] = useState<FilterTab>('active');
	const [searchTerm, setSearchTerm] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<LokasiItem | null>(null);

	const handleOpenAdd = () => {
		setEditingItem(null);
		setIsModalOpen(true);
	};

	const handleOpenEdit = (item: LokasiItem) => {
		setEditingItem(item);
		setIsModalOpen(true);
	};

	const handleFormSuccess = ({ mode, data }: { mode: 'create' | 'edit'; data: LokasiItem }) => {
		if (mode === 'edit') {
			setList((prev) => prev.map((x) => (x.id === data.id ? { ...x, ...data } : x)));
		} else {
			setList((prev) => [data, ...prev]);
		}
	};

	const handleToggleAktif = async (item: LokasiItem) => {
		const newStatus = !item.aktif;
		try {
			const res = await toggleLokasiKolamAction(item.id, newStatus);
			if (res.success) {
				setList((prev) => prev.map((x) => (x.id === item.id ? { ...x, aktif: newStatus } : x)));
				toast.success(res.message);
			} else {
				toast.error(res.message || 'Gagal mengubah status lokasi.');
			}
		} catch {
			toast.error('Gagal mengubah status lokasi.');
		}
	};

	const handleDelete = async (id: string, nama: string) => {
		if (
			!confirm(
				`Hapus lokasi "${nama}"? Lokasi yang sudah terhubung dengan riwayat pengujian tidak dapat dihapus permanen.`
			)
		) {
			return;
		}

		try {
			const res = await deleteLokasiKolamAction(id);
			if (res.success) {
				setList((prev) => prev.filter((x) => x.id !== id));
				toast.success(res.message || 'Lokasi kolam berhasil dihapus.');
			} else {
				toast.error(res.message || 'Gagal menghapus lokasi kolam.');
			}
		} catch {
			toast.error('Gagal menghapus lokasi kolam.');
		}
	};

	const activeCount = useMemo(() => list.filter((l) => l.aktif).length, [list]);
	const inactiveCount = useMemo(() => list.filter((l) => !l.aktif).length, [list]);

	const filtered = useMemo(() => {
		return list.filter((item) => {
			const matchesTab =
				filterTab === 'active' ? item.aktif : filterTab === 'inactive' ? !item.aktif : true;

			if (!matchesTab) return false;
			if (!searchTerm.trim()) return true;

			const q = searchTerm.toLowerCase();
			return (
				item.nama_pokdakan.toLowerCase().includes(q) ||
				item.pemilik.toLowerCase().includes(q) ||
				item.kecamatan.toLowerCase().includes(q) ||
				item.desa.toLowerCase().includes(q) ||
				item.komoditas_ikan?.toLowerCase().includes(q)
			);
		});
	}, [list, filterTab, searchTerm]);

	return (
		<div className='space-y-6'>
			{/* Header */}
			<LokasiHeader onOpenAdd={handleOpenAdd} />

			{/* Tabs Filter & Search Bar */}
			<LokasiFilterBar
				activeCount={activeCount}
				filteredCount={filtered.length}
				filterTab={filterTab}
				inactiveCount={inactiveCount}
				onResetSearch={() => setSearchTerm('')}
				onSearchChange={setSearchTerm}
				onTabChange={setFilterTab}
				searchTerm={searchTerm}
				totalCount={list.length}
			/>

			{/* Table Card */}
			<LokasiTable
				items={filtered}
				onClearSearch={() => setSearchTerm('')}
				onDelete={(item) => handleDelete(item.id, item.nama_pokdakan)}
				onEdit={handleOpenEdit}
				onToggleAktif={handleToggleAktif}
				searchTerm={searchTerm}
			/>

			{/* Dialog Modal Tambah / Edit */}
			<LokasiFormDialog
				editingItem={editingItem}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
				onSuccess={handleFormSuccess}
			/>
		</div>
	);
}
