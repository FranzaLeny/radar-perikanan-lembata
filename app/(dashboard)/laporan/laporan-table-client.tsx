'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  updateStatusUjiAction,
  deleteHasilUjiAction,
} from '@/lib/actions/uji-kualitas';
import { APP_NAME } from '@/lib/constants';
import type {
  UjiLaporanItem,
  LaporanTableClientProps,
  StatusTabType,
} from './types';
import { LaporanFilterBar } from './_components/laporan-filter-bar';
import { LaporanTable } from './_components/laporan-table';

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
      const matchLhu = `lhu/${APP_NAME.toLowerCase()}/${item.nomor_sampel}`.toLowerCase().includes(query);
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
        setList((prev) =>
          prev.map((x) => (x.id === item.id ? { ...x, status: newStatus } : x))
        );
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
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
        <div>
          <CardTitle className="text-base font-heading">
            Daftar Lembar Hasil Uji (LHU) Siap Cetak
          </CardTitle>
          <CardDescription className="text-xs">
            Kelola siklus status dokumen (Draft &rarr; Final &rarr; Arsip) dan penerbitan Laporan Hasil Uji resmi.
          </CardDescription>
        </div>

        {/* Indikator Counter */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isFiltered ? (
            <Badge variant="secondary" className="gap-1.5 text-xs py-0.5">
              <span>
                Menampilkan {filteredList.length} dari {list.length} Dokumen
              </span>
            </Badge>
          ) : (
            <Badge variant="outline" className="font-mono text-xs">
              {list.length} Dokumen Terdaftar
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tabs Status & Search Bar */}
        <LaporanFilterBar
          statusTab={statusTab}
          setStatusTab={setStatusTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          list={list}
          isFiltered={isFiltered}
          onReset={handleResetFilter}
        />

        {/* Tabel Data */}
        <LaporanTable
          items={filteredList}
          isFiltered={isFiltered}
          onResetFilter={handleResetFilter}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
}
