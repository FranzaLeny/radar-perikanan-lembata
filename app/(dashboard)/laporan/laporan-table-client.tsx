'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/shadcn/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/shadcn/card';
import { deleteHasilUjiAction, updateStatusUjiAction } from '@/lib/actions/uji-kualitas';
import { APP_NAME } from '@/lib/constants';
import { LaporanFilterBar } from './_components/laporan-filter-bar';
import { LaporanTable } from './_components/laporan-table';
import type { LaporanTableClientProps, StatusTabType, UjiLaporanItem } from './types';

export * from './types';

export function LaporanTableClient({ initialList }: LaporanTableClientProps) {
	const [list, setList] = useState<UjiLaporanItem[]>(initialList);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusTab, setStatusTab] = useState<StatusTabType>('all');

	const filteredList = useMemo(() => {
		let result = list;

		// Filter status tab
		if (statusTab !== 'all') {
			result = result.filter((item) => (item.status || 'draft') === statusTab);
		}

		// Filter search
		if (!searchQuery.trim()) return result;
		const query = searchQuery.toLowerCase().trim();

		return result.filter((item) => {
			const matchNomor = item.nomor_sampel.toLowerCase().includes(query);
			const matchLhu = `lhu/${APP_NAME.toLowerCase()}/${item.nomor_sampel}`
				.toLowerCase()
				.includes(query);
			const matchPetugas = item.petugas_uji.toLowerCase().includes(query);
			const matchPokdakan = item.lokasi?.nama_pokdakan.toLowerCase().includes(query) ?? false;
			const matchDesa = item.lokasi?.desa.toLowerCase().includes(query) ?? false;
			const matchKecamatan = item.lokasi?.kecamatan.toLowerCase().includes(query) ?? false;
			const matchStatus = (item.kesimpulan || '').toLowerCase().includes(query);

			return (
				matchNomor ||
				matchLhu ||
				matchPetugas ||
				matchPokdakan ||
				matchDesa ||
				matchKecamatan ||
				matchStatus
			);
		});
	}, [list, searchQuery, statusTab]);

	const isFiltered = searchQuery.trim().length > 0 || statusTab !== 'all';

	const handleResetFilter = () => {
		setSearchQuery('');
		setStatusTab('all');
	};

	const handleUpdateStatus = async (
		item: UjiLaporanItem,
		newStatus: 'draft' | 'final' | 'arsip'
	) => {
		try {
			const res = await updateStatusUjiAction(item.id, newStatus);
			if (res.success) {
				setList((prev) => prev.map((x) => (x.id === item.id ? { ...x, status: newStatus } : x)));
				toast.success(res.message);
			} else {
				toast.error(res.message || 'Gagal mengubah status.');
			}
		} catch {
			toast.error('Terjadi kesalahan saat mengubah status dokumen.');
		}
	};

	const handleDelete = async (item: UjiLaporanItem) => {
		if (
			!confirm(
				`Hapus laporan hasil uji sampel "${item.nomor_sampel}"? Dokumen draft yang dihapus tidak dapat dipulihkan.`
			)
		)
			return;

		try {
			const res = await deleteHasilUjiAction(item.id);
			if (res.success) {
				setList((prev) => prev.filter((x) => x.id !== item.id));
				toast.success(res.message);
			} else {
				toast.error(res.message || 'Gagal menghapus laporan.');
			}
		} catch {
			toast.error('Terjadi kesalahan saat menghapus laporan.');
		}
	};

	return (
		<Card>
			<CardHeader className='flex flex-col justify-between gap-3 pb-3 sm:flex-row sm:items-center'>
				<div>
					<CardTitle>
						Daftar Lembar Hasil Uji (LHU) Siap Cetak
					</CardTitle>
					<CardDescription className='text-xs'>
						Kelola siklus status dokumen (Draft &rarr; Final &rarr; Arsip) dan penerbitan Laporan Hasil
						Uji resmi.
					</CardDescription>
				</div>

				{/* Indikator Counter */}
				<div className='flex items-center gap-2 self-start sm:self-auto'>
					{isFiltered ? (
						<Badge className='gap-1.5' variant='secondary'>
							<span>
								Menampilkan {filteredList.length} dari {list.length} Dokumen
							</span>
						</Badge>
					) : (
						<Badge variant='outline'>
							{list.length} Dokumen Terdaftar
						</Badge>
					)}
				</div>
			</CardHeader>

			<CardContent className='space-y-4'>
				{/* Tabs Status & Search Bar */}
				<LaporanFilterBar
					isFiltered={isFiltered}
					list={list}
					onReset={handleResetFilter}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					setStatusTab={setStatusTab}
					statusTab={statusTab}
				/>

				{/* Tabel Data */}
				<LaporanTable
					isFiltered={isFiltered}
					items={filteredList}
					onDelete={handleDelete}
					onResetFilter={handleResetFilter}
					onUpdateStatus={handleUpdateStatus}
				/>
			</CardContent>
		</Card>
	);
}
