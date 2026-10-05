'use client';

import React, { useState, useMemo } from 'react';
import type { UjiKualitasListClientProps } from './types';
import { UjiHeader } from './_components/uji-header';
import { UjiFilterBar } from './_components/uji-filter-bar';
import { UjiTable } from './_components/uji-table';

export * from './types';

export function UjiKualitasListClient({
  initialList,
}: UjiKualitasListClientProps) {
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
        (item.lokasi &&
          item.lokasi.nama_pokdakan
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (item.lokasi &&
          item.lokasi.desa.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesKecamatan =
        selectedKecamatan === 'SEMUA' ||
        (item.lokasi && item.lokasi.kecamatan === selectedKecamatan);

      const matchesKesimpulan =
        selectedKesimpulan === 'SEMUA' ||
        item.kesimpulan === selectedKesimpulan;

      return matchesSearch && matchesKecamatan && matchesKesimpulan;
    });
  }, [list, searchTerm, selectedKecamatan, selectedKesimpulan]);

  const handleResetFilter = () => {
    setSearchTerm('');
    setSelectedKecamatan('SEMUA');
    setSelectedKesimpulan('SEMUA');
  };

  return (
    <div className="space-y-6">
      <UjiHeader />

      <UjiFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedKecamatan={selectedKecamatan}
        setSelectedKecamatan={setSelectedKecamatan}
        selectedKesimpulan={selectedKesimpulan}
        setSelectedKesimpulan={setSelectedKesimpulan}
        filteredCount={filtered.length}
        totalCount={initialList.length}
        onReset={handleResetFilter}
      />

      <UjiTable
        items={filtered}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
      />
    </div>
  );
}
