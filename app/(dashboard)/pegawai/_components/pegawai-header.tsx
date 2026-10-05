import React from 'react';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PegawaiHeaderProps {
  onOpenAdd: () => void;
}

export function PegawaiHeader({ onOpenAdd }: PegawaiHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Badge
          variant="secondary"
          className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-xs font-semibold uppercase tracking-wider"
        >
          <Users className="size-3" />
          <span>Manajemen SDM & Otoritas</span>
        </Badge>
        <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
          Master Pegawai & Pejabat Penandatangan
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Kelola data personil laboratorium, petugas penguji lapangan, dan pejabat berwenang penandatangan Lembar Hasil Uji (LHU).
        </p>
      </div>

      <Button onClick={onOpenAdd} className="gap-2 shadow-xs self-start sm:self-auto cursor-pointer">
        <Plus className="size-4" />
        <span>Tambah Pegawai / Pejabat</span>
      </Button>
    </div>
  );
}
