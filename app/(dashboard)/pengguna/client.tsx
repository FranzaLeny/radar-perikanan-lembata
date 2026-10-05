'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import type { UserItem, FilterTab } from './types';
import { PenggunaHeader } from './_components/pengguna-header';
import { PenggunaStats } from './_components/pengguna-stats';
import { PenggunaFilterBar } from './_components/pengguna-filter-bar';
import { PenggunaTable } from './_components/pengguna-table';
import { PenggunaCreateDialog } from './_components/pengguna-create-dialog';
import { PenggunaRoleDialog } from './_components/pengguna-role-dialog';
import { PenggunaDeleteDialog } from './_components/pengguna-delete-dialog';

export type { UserItem };

export function PenggunaClient({
  initialUsers,
  currentUserId,
}: {
  initialUsers: UserItem[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [filterTab, setFilterTab] = useState<FilterTab>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Role Modal State
  const [selectedUserForRole, setSelectedUserForRole] = useState<UserItem | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Delete State
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<UserItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cannotDeleteInfoUser, setCannotDeleteInfoUser] = useState<UserItem | null>(null);

  const handleOpenAdd = () => {
    setIsModalOpen(true);
  };

  const handleOpenEditRole = (user: UserItem) => {
    setSelectedUserForRole(user);
    setIsRoleModalOpen(true);
  };

  const handleRoleSuccess = (userId: string, newRole: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
  };

  const handleCreateSuccess = (newUser: UserItem) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleToggleBan = async (user: UserItem) => {
    const isBanning = user.aktif;
    try {
      if (isBanning) {
        const { error } = await authClient.admin.banUser({
          userId: user.id,
          banReason: 'Dinonaktifkan oleh Administrator',
        });
        if (!error) {
          setUsers((prev) =>
            prev.map((u) => (u.id === user.id ? { ...u, aktif: false, banned: true } : u))
          );
          toast.success(`Akun ${user.name} berhasil dinonaktifkan.`);
        } else {
          toast.error(error.message || 'Gagal menonaktifkan akun.');
        }
      } else {
        const { error } = await authClient.admin.unbanUser({
          userId: user.id,
        });
        if (!error) {
          setUsers((prev) =>
            prev.map((u) => (u.id === user.id ? { ...u, aktif: true, banned: false } : u))
          );
          toast.success(`Akun ${user.name} berhasil diaktifkan kembali.`);
        } else {
          toast.error(error.message || 'Gagal mengaktifkan akun.');
        }
      }
    } catch {
      toast.error('Gagal mengubah status keaktifan pengguna.');
    }
  };

  const handleDeleteInitiation = (user: UserItem) => {
    if (user.isUsed) {
      setCannotDeleteInfoUser(user);
    } else {
      setSelectedUserForDelete(user);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUserForDelete) return;
    setIsDeleting(true);
    try {
      const { error } = await authClient.admin.removeUser({
        userId: selectedUserForDelete.id,
      });

      if (!error) {
        setUsers((prev) => prev.filter((u) => u.id !== selectedUserForDelete.id));
        toast.success(`Akun ${selectedUserForDelete.name} berhasil dihapus permanen.`);
        setIsDeleteDialogOpen(false);
        setSelectedUserForDelete(null);
      } else {
        toast.error(error.message || 'Gagal menghapus pengguna.');
      }
    } catch {
      toast.error('Terjadi kegagalan komunikasi saat menghapus pengguna.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeactivateFromInfo = async () => {
    if (cannotDeleteInfoUser) {
      await handleToggleBan(cannotDeleteInfoUser);
      setCannotDeleteInfoUser(null);
    }
  };

  const activeCount = useMemo(() => users.filter((u) => u.aktif).length, [users]);
  const bannedCount = useMemo(() => users.filter((u) => !u.aktif).length, [users]);

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const matchesTab =
        filterTab === 'active' ? user.aktif : filterTab === 'banned' ? !user.aktif : true;

      if (!matchesTab) return false;
      if (!searchTerm.trim()) return true;

      const q = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q)
      );
    });
  }, [users, filterTab, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PenggunaHeader onOpenAdd={handleOpenAdd} />

      {/* Stats Cards */}
      <PenggunaStats users={users} />

      {/* Filter Tabs & Search Bar */}
      <PenggunaFilterBar
        filterTab={filterTab}
        onTabChange={setFilterTab}
        activeCount={activeCount}
        bannedCount={bannedCount}
        totalCount={users.length}
        filteredCount={filtered.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onResetSearch={() => setSearchTerm('')}
      />

      {/* Table Card */}
      <PenggunaTable
        users={filtered}
        currentUserId={currentUserId}
        searchTerm={searchTerm}
        onClearSearch={() => setSearchTerm('')}
        onOpenEditRole={handleOpenEditRole}
        onToggleBan={handleToggleBan}
        onDelete={handleDeleteInitiation}
      />

      {/* Modal Dialog Registrasi Pengguna */}
      <PenggunaCreateDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleCreateSuccess}
      />

      {/* Modal Dialog Ubah Role */}
      <PenggunaRoleDialog
        isOpen={isRoleModalOpen}
        onOpenChange={setIsRoleModalOpen}
        selectedUser={selectedUserForRole}
        onSuccess={handleRoleSuccess}
      />

      {/* Modal Dialog Konfirmasi Hapus & Cannot Delete Info */}
      <PenggunaDeleteDialog
        deleteUser={selectedUserForDelete}
        isDeleteDialogOpen={isDeleteDialogOpen}
        onDeleteOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
        cannotDeleteUser={cannotDeleteInfoUser}
        onCannotDeleteClose={() => setCannotDeleteInfoUser(null)}
        onDeactivateFromInfo={handleDeactivateFromInfo}
      />
    </div>
  );
}
