import React from 'react';
import Link from 'next/link';
import { FileCheck2, FolderKanban, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DokumenHeaderProps {
  onOpenAdd: () => void;
}

export function DokumenHeader({ onOpenAdd }: DokumenHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Badge
          variant="secondary"
          className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-xs font-semibold uppercase tracking-wider"
        >
          <FileCheck2 className="size-3" />
          <span>Standarisasi Laboratorium Mutu</span>
        </Badge>
        <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
          Dokumen Mutu & Instruksi Kerja (IK)
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Katalog dokumen standarisasi mutu air budidaya: Pedoman Mutu, Prosedur Pelaksanaan, SOP, Instruksi Kerja per parameter, dan Formulir resmi.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <Link href="/dokumen-mutu/kategori">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs cursor-pointer">
            <FolderKanban className="size-3.5" />
            <span>Kelola Kategori</span>
          </Button>
        </Link>

        <Button onClick={onOpenAdd} size="sm" className="gap-1.5 text-xs cursor-pointer shadow-xs">
          <Plus className="size-3.5" />
          <span>Tambah Dokumen</span>
        </Button>
      </div>
    </div>
  );
}
