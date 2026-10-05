'use client';

import React from 'react';
import { Trash2, AlertTriangle, ShieldAlert, Info, UserX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { APP_NAME } from '@/lib/constants';
import type { UserItem } from '../types';

interface PenggunaDeleteDialogProps {
  deleteUser: UserItem | null;
  isDeleteDialogOpen: boolean;
  onDeleteOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
  isDeleting: boolean;
  cannotDeleteUser: UserItem | null;
  onCannotDeleteClose: () => void;
  onDeactivateFromInfo: () => void;
}

export function PenggunaDeleteDialog({
  deleteUser,
  isDeleteDialogOpen,
  onDeleteOpenChange,
  onConfirmDelete,
  isDeleting,
  cannotDeleteUser,
  onCannotDeleteClose,
  onDeactivateFromInfo,
}: PenggunaDeleteDialogProps) {
  return (
    <>
      {/* Dialog Modal Konfirmasi Hapus Pengguna (Untuk user yang belum terpakai) */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={onDeleteOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="size-4" />
              <span>Konfirmasi Hapus Akun Pengguna</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tindakan ini akan menghapus akun <strong>{deleteUser?.name}</strong> ({deleteUser?.email}) beserta seluruh hak akses login secara permanen dari database.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-destructive flex items-center gap-1.5">
              <AlertTriangle className="size-3.5" /> Informasi Penghapusan:
            </p>
            <p>
              Akun ini belum memiliki riwayat pengujian kualitas air, sehingga aman untuk dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onDeleteOpenChange(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Menghapus...
                </>
              ) : (
                'Ya, Hapus Akun'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Modal Info Pengguna Tidak Bisa Dihapus Karena Terlanjur Dipakai */}
      <Dialog open={!!cannotDeleteUser} onOpenChange={(open) => !open && onCannotDeleteClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-500">
              <ShieldAlert className="size-4" />
              <span>Akun Tidak Dapat Dihapus</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Akun <strong>{cannotDeleteUser?.name}</strong> ({cannotDeleteUser?.email}) terikat dengan data transaksi riwayat pengujian.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-foreground space-y-2">
            <p className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Info className="size-3.5" /> Terdaftar dalam {cannotDeleteUser?.transactionCount || 1} Data Pengujian
            </p>
            <p className="text-muted-foreground">
              Untuk menjaga integritas <strong>Audit Trail</strong> dan keabsahan lembar hasil uji (LHU) laboratorium, akun yang sudah pernah digunakan dalam pencatatan pengujian <strong>tidak boleh dihapus</strong>.
            </p>
            <p className="text-muted-foreground">
              Sesuai standar operasional, akun ini <strong>hanya dapat dinonaktifkan</strong> agar tidak dapat lagi login atau melakukan aktivitas apapun di sistem {APP_NAME}.
            </p>
          </div>

          <DialogFooter className="pt-2 flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCannotDeleteClose}
            >
              Tutup
            </Button>
            {cannotDeleteUser?.aktif && (
              <Button
                type="button"
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={onDeactivateFromInfo}
              >
                <UserX className="size-3.5 mr-1.5" />
                Nonaktifkan Akun Ini
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
