'use client';

import { useMemo, useState } from 'react';

import { UjiFilterBar } from './_components/uji-filter-bar';
import { UjiHeader } from './_components/uji-header';
import { UjiTable } from './_components/uji-table';
import type { UjiKualitasListClientProps } from './types';

export * from './types';

export function UjiKualitasListClient({ initialList }: UjiKualitasListClientProps) {
	const list = initialList;
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedKecamatan, setSelectedKecamatan] = useState('SEMUA');
	const [selectedKesimpulan, setSelectedKesimpulan] = useState('SEMUA');
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const filtered = useMemo(() => {
		return list.filter((item) => {
			const matchesSearch =
				item.nomor_sampel.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.petugas_uji.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.lokasi?.nama_pokdakan.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.lokasi?.desa.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesKecamatan =
				selectedKecamatan === 'SEMUA' || (item.lokasi && item.lokasi.kecamatan === selectedKecamatan);

			const matchesKesimpulan =
				selectedKesimpulan === 'SEMUA' || item.kesimpulan === selectedKesimpulan;

			return matchesSearch && matchesKecamatan && matchesKesimpulan;
		});
	}, [list, searchTerm, selectedKecamatan, selectedKesimpulan]);

	const handleResetFilter = () => {
		setSearchTerm('');
		setSelectedKecamatan('SEMUA');
		setSelectedKesimpulan('SEMUA');
	};

	return (
		<div className='space-y-6'>
			<UjiHeader />

			<UjiFilterBar
				filteredCount={filtered.length}
				onReset={handleResetFilter}
				searchTerm={searchTerm}
				selectedKecamatan={selectedKecamatan}
				selectedKesimpulan={selectedKesimpulan}
				setSearchTerm={setSearchTerm}
				setSelectedKecamatan={setSelectedKecamatan}
				setSelectedKesimpulan={setSelectedKesimpulan}
				totalCount={initialList.length}
			/>

			<UjiTable expandedId={expandedId} items={filtered} setExpandedId={setExpandedId} />
		</div>
	);
}
