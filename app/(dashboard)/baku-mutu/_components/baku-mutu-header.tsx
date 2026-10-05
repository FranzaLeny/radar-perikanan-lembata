import React from 'react';
import { Scale, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BakuMutuHeaderProps {
  onOpenAdd: () => void;
}

export function BakuMutuHeader({ onOpenAdd }: BakuMutuHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Badge
          variant="secondary"
          className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-xs font-semibold uppercase tracking-wider"
        >
          <Scale className="size-3" />
          <span>Master Regulasi</span>
        </Badge>
        <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
          Master Baku Mutu Air (Berversi)
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Standar acuan ambang batas kualitas air budidaya. Mendukung ambang dinamis deviasi suhu
          lingkungan, pemisahan nomor regulasi singkat vs lengkap, serta metode uji diatur terpisah
          pada Instruksi Kerja.
        </p>
      </div>

      <Button onClick={onOpenAdd} className="gap-2 shadow-xs self-start sm:self-auto cursor-pointer">
        <Plus className="size-4" />
        <span>Tambah Parameter Baru</span>
      </Button>
    </div>
  );
}
