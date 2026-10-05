'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { toggleBakuMutuAction, deleteBakuMutuAction } from '@/lib/actions/baku-mutu';
import type { BakuMutuItem, FilterTab } from './types';
import { BakuMutuHeader } from './_components/baku-mutu-header';
import { BakuMutuFilterBar } from './_components/baku-mutu-filter-bar';
import { BakuMutuTable } from './_components/baku-mutu-table';
import { BakuMutuFormDialog } from './_components/baku-mutu-form-dialog';

export type { BakuMutuItem };

export function BakuMutuClient({ initialList }: { initialList: BakuMutuItem[] }) {
  const [list, setList] = useState<BakuMutuItem[]>(initialList);
  const [filterTab, setFilterTab] = useState<FilterTab>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BakuMutuItem | null>(null);

  const handleOpenAdd = () => {
    setIsRevisionMode(false);
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleOpenRevision = (item: BakuMutuItem) => {
    setIsRevisionMode(true);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleFormSuccess = ({
    mode,
    data,
    originalId,
  }: {
    mode: 'create' | 'revision';
    data: BakuMutuItem;
    originalId?: string;
  }) => {
    if (mode === 'revision' && originalId) {
      const isReactivated = data.id === originalId;
      if (isReactivated) {
        setList((prev) => prev.map((item) => (item.id === originalId ? data : item)));
      } else {
        const updated = list.map((item) =>
          item.id === originalId ? { ...item, aktif: false } : item
        );
        setList([data, ...updated]);
      }
    } else {
      setList((prev) => [data, ...prev]);
    }
  };

  const handleToggleAktif = async (item: BakuMutuItem) => {
    const newStatus = !item.aktif;
    try {
      const res = await toggleBakuMutuAction(item.id, newStatus);
      if (res.success) {
        setList((prev) => prev.map((x) => (x.id === item.id ? { ...x, aktif: newStatus } : x)));
        toast.success(res.message);
      } else {
        toast.error(res.message || 'Gagal mengubah status parameter.');
      }
    } catch {
      toast.error('Gagal mengubah status parameter.');
    }
  };

  const handleDelete = async (item: BakuMutuItem) => {
    if (!confirm(`Hapus permanen parameter "${item.parameter}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    try {
      const res = await deleteBakuMutuAction(item.id);
      if (res.success) {
        setList((prev) => prev.filter((x) => x.id !== item.id));
        toast.success(res.message || 'Parameter berhasil dihapus.');
      } else {
        toast.error(res.message || 'Gagal menghapus parameter.');
      }
    } catch {
      toast.error('Gagal menghapus parameter.');
    }
  };

  const activeCount = useMemo(() => list.filter((x) => x.aktif).length, [list]);
  const archivedCount = useMemo(() => list.filter((x) => !x.aktif).length, [list]);

  const filteredList = useMemo(() => {
    return list.filter((item) => {
      const matchesTab =
        filterTab === 'active' ? item.aktif : filterTab === 'archived' ? !item.aktif : true;

      if (!matchesTab) return false;
      if (!searchTerm.trim()) return true;

      const query = searchTerm.toLowerCase().trim();
      return (
        item.parameter.toLowerCase().includes(query) ||
        item.satuan.toLowerCase().includes(query) ||
        item.nomor_regulasi.toLowerCase().includes(query) ||
        (item.dasar_regulasi && item.dasar_regulasi.toLowerCase().includes(query))
      );
    });
  }, [list, filterTab, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <BakuMutuHeader onOpenAdd={handleOpenAdd} />

      {/* Tabs Filter & Search Bar */}
      <BakuMutuFilterBar
        filterTab={filterTab}
        onTabChange={setFilterTab}
        activeCount={activeCount}
        archivedCount={archivedCount}
        totalCount={list.length}
        filteredCount={filteredList.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onResetSearch={() => setSearchTerm('')}
      />

      {/* Table Card */}
      <BakuMutuTable
        items={filteredList}
        searchTerm={searchTerm}
        onClearSearch={() => setSearchTerm('')}
        onRevise={handleOpenRevision}
        onToggleAktif={handleToggleAktif}
        onDelete={handleDelete}
      />

      {/* Dialog Modal Tambah / Revisi */}
      <BakuMutuFormDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        isRevisionMode={isRevisionMode}
        selectedItem={selectedItem}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
