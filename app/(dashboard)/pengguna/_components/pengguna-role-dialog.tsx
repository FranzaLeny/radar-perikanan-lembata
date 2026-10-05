'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authClient } from '@/lib/auth-client';
import { Loader2, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { UserItem, UserRole } from '../types';

interface PenggunaRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: UserItem | null;
  onSuccess: (userId: string, newRole: string) => void;
}

export function PenggunaRoleDialog({
  isOpen,
  onOpenChange,
  selectedUser,
  onSuccess,
}: PenggunaRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setSelectedRole(selectedUser.role);
    }
  }, [selectedUser]);

  const handleSubmitRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedRole) return;

    setIsUpdatingRole(true);
    try {
      const { error } = await authClient.admin.setRole({
        userId: selectedUser.id,
        role: selectedRole as "user" | "admin" | ("user" | "admin")[],
      });

      if (!error) {
        onSuccess(selectedUser.id, selectedRole);
        toast.success('Wewenang role berhasil diubah.');
        onOpenChange(false);
      } else {
        toast.error(error.message || 'Gagal mengubah wewenang role.');
      }
    } catch {
      toast.error('Gagal memperbarui wewenang role pengguna.');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <span>Ubah Hak Akses & Peran Pengguna</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Perbarui wewenang role RBAC untuk <strong>{selectedUser?.name}</strong> ({selectedUser?.email}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmitRoleChange} className="space-y-4 py-2">
          <Field>
            <FieldLabel htmlFor="edit-role">Pilih Wewenang Akses Baru *</FieldLabel>
            <Select
              value={selectedRole}
              onValueChange={(val) => {
                if (val) setSelectedRole(val as UserRole);
              }}
            >
              <SelectTrigger id="edit-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petugas_lapangan">Petugas Lapangan (Input & Scan Data)</SelectItem>
                <SelectItem value="pengelola_mutu">Pengelola Mutu (Kelola SOP & Baku Mutu)</SelectItem>
                <SelectItem value="kepala_dinas">Kepala Dinas (Dashboard & Approve LHU)</SelectItem>
                <SelectItem value="admin">Administrator (Akses Penuh Sistem)</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              Perubahan role akan langsung berlaku pada sesi login berikutnya.
            </FieldDescription>
          </Field>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdatingRole}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isUpdatingRole}>
              {isUpdatingRole ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan Role'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
