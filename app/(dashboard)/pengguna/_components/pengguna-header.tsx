import React from 'react';
import { Users2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PenggunaHeaderProps {
  onOpenAdd: () => void;
}

export function PenggunaHeader({ onOpenAdd }: PenggunaHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Badge
          variant="secondary"
          className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-xs font-semibold uppercase tracking-wider"
        >
          <Users2 className="size-3" />
          <span>Manajemen Akses & Keamanan</span>
        </Badge>
        <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
          Kelola Akun & Hak Akses Pengguna
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Daftarkan akun petugas dinas, ubah peran wewenang (Role-Based Access Control), dan kelola status keaktifan login.
        </p>
      </div>

      <Button onClick={onOpenAdd} className="gap-2 shadow-xs self-start sm:self-auto cursor-pointer">
        <Plus className="size-4" />
        <span>Tambah Pengguna Baru</span>
      </Button>
    </div>
  );
}
