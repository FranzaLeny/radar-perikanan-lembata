'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
	deletePegawaiAction,
	setPenanggungJawabAction,
	togglePegawaiAction
} from '@/lib/actions/pegawai';
import { PegawaiFilterBar } from './_components/pegawai-filter-bar';
import { PegawaiFormDialog } from './_components/pegawai-form-dialog';
import { PegawaiHeader } from './_components/pegawai-header';
import { PegawaiTable } from './_components/pegawai-table';
import type { FilterTab, PegawaiItem } from './types';

export type { PegawaiItem };

export function PegawaiClient({ initialList }: { initialList: PegawaiItem[] }) {
	const [list, setList] = useState<PegawaiItem[]>(initialList);
	const [filterTab, setFilterTab] = useState<FilterTab>('active');
	const [searchTerm, setSearchTerm] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<PegawaiItem | null>(null);

	const handleOpenAdd = () => {
		setEditingItem(null);
		setIsModalOpen(true);
	};

	const handleOpenEdit = (item: PegawaiItem) => {
		setEditingItem(item);
		setIsModalOpen(true);
	};

	const handleFormSuccess = ({
		mode,
		data,
		isPenanggungjawab
	}: {
		mode: 'create' | 'edit';
		data: PegawaiItem;
		isPenanggungjawab: boolean;
	}) => {
		if (mode === 'edit') {
			setList((prev) =>
				prev.map((x) => {
					if (x.id === data.id) {
						return { ...x, ...data };
					}
					if (isPenanggungjawab) {
						return { ...x, is_penanggungjawab: false };
					}
					return x;
				})
			);
		} else {
			setList((prev) => [
				data,
				...prev.map((x) => (isPenanggungjawab ? { ...x, is_penanggungjawab: false } : x))
			]);
		}
	};

	const handleSetPenanggungJawab = async (item: PegawaiItem) => {
		try {
			const res = await setPenanggungJawabAction(item.id);
			if (res.success) {
				setList((prev) => prev.map((x) => ({ ...x, is_penanggungjawab: x.id === item.id })));
				toast.success(res.message);
			} else {
				toast.error(res.message || 'Gagal mengubah penanggung jawab.');
			}
		} catch {
			toast.error('Gagal menetapkan penanggung jawab.');
		}
	};

	const handleToggleAktif = async (item: PegawaiItem) => {
		const newStatus = !item.aktif;
		try {
			const res = await togglePegawaiAction(item.id, newStatus);
			if (res.success) {
				setList((prev) =>
					prev.map((x) => {
						if (x.id === item.id) {
							return {
								...x,
								aktif: newStatus,
								is_penanggungjawab: newStatus ? x.is_penanggungjawab : false
							};
						}
						return x;
					})
				);
				toast.success(res.message);
			} else {
				toast.error(res.message || 'Gagal mengubah status pegawai.');
			}
		} catch {
			toast.error('Gagal mengubah status pegawai.');
		}
	};

	const handleDelete = async (item: PegawaiItem) => {
		if (
			!confirm(
				`Hapus data pegawai "${item.nama}"? Pegawai yang sudah pernah menandatangani LHU tidak dapat dihapus permanen.`
			)
		) {
			return;
		}

		try {
			const res = await deletePegawaiAction(item.id);
			if (res.success) {
				setList((prev) => prev.filter((x) => x.id !== item.id));
				toast.success(res.message || 'Pegawai berhasil dihapus.');
			} else {
				toast.error(res.message || 'Gagal menghapus pegawai.');
			}
		} catch {
			toast.error('Gagal menghapus pegawai.');
		}
	};

	const activeCount = useMemo(() => list.filter((p) => p.aktif).length, [list]);
	const inactiveCount = useMemo(() => list.filter((p) => !p.aktif).length, [list]);

	const filtered = useMemo(() => {
		return list.filter((item) => {
			const matchesTab =
				filterTab === 'active' ? item.aktif : filterTab === 'inactive' ? !item.aktif : true;

			if (!matchesTab) return false;
			if (!searchTerm.trim()) return true;

			const q = searchTerm.toLowerCase();
			return (
				item.nama.toLowerCase().includes(q) ||
				item.nip.toLowerCase().includes(q) ||
				item.jabatan.toLowerCase().includes(q)
			);
		});
	}, [list, filterTab, searchTerm]);

	return (
		<div className='space-y-6'>
			{/* Header */}
			<PegawaiHeader onOpenAdd={handleOpenAdd} />

			{/* Tabs Filter & Search Bar */}
			<PegawaiFilterBar
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
			<PegawaiTable
				items={filtered}
				onClearSearch={() => setSearchTerm('')}
				onDelete={handleDelete}
				onEdit={handleOpenEdit}
				onSetPenanggungJawab={handleSetPenanggungJawab}
				onToggleAktif={handleToggleAktif}
				searchTerm={searchTerm}
			/>

			{/* Dialog Modal Tambah / Edit */}
			<PegawaiFormDialog
				editingItem={editingItem}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
				onSuccess={handleFormSuccess}
			/>
		</div>
	);
}
