'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  toggleDokumenMutuAction,
  deleteDokumenMutuAction,
} from '@/lib/actions/dokumen-mutu';
import type { DokumenMutuItem, KategoriItem, DokumenMutuClientProps } from './types';
import { DokumenHeader } from './_components/dokumen-header';
import { DokumenFilterBar } from './_components/dokumen-filter-bar';
import { DokumenTable } from './_components/dokumen-table';
import { DokumenCreateDialog } from './_components/dokumen-create-dialog';
import { DokumenEditDialog } from './_components/dokumen-edit-dialog';

export type { DokumenMutuItem, KategoriItem };

export function DokumenMutuClient({
  initialList,
  kategoriList,
  parameterList,
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
    const newStatus = item.aktif === false ? true : false;
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
        (item.parameter_uji && item.parameter_uji.toLowerCase().includes(q)) ||
        (item.metode_pengujian && item.metode_pengujian.toLowerCase().includes(q)) ||
        (item.deskripsi && item.deskripsi.toLowerCase().includes(q))
      );
    });
  }, [list, selectedKategoriTab, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <DokumenHeader onOpenAdd={handleOpenAdd} />

      {/* Tabs Filter Kategori & Search */}
      <DokumenFilterBar
        selectedKategoriTab={selectedKategoriTab}
        onTabChange={setSelectedKategoriTab}
        kategoriList={kategoriList}
        list={list}
        filteredCount={filteredList.length}
        totalCount={list.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onResetSearch={() => setSearchTerm('')}
      />

      {/* Table Dokumen Mutu */}
      <DokumenTable
        items={filteredList}
        searchTerm={searchTerm}
        onEdit={handleOpenEdit}
        onToggleAktif={handleToggleAktif}
        onDelete={handleDelete}
      />

      {/* Dialog Modal Registrasi Dokumen Baru */}
      <DokumenCreateDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        kategoriList={kategoriList}
        parameterList={parameterList}
        existingList={list}
        onSuccess={handleAddSuccess}
      />

      {/* Dialog Modal Edit Metadata Dokumen */}
      <DokumenEditDialog
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        editingItem={editingItem}
        kategoriList={kategoriList}
        parameterList={parameterList}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
