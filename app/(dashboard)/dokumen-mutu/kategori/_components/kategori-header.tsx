import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FolderKanban, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KategoriHeaderProps {
  onAdd: () => void;
}

export function KategoriHeader({ onAdd }: KategoriHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Link href="/dokumen-mutu">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1 cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Kembali ke Katalog Dokumen Mutu</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground flex items-center gap-2">
          <FolderKanban className="size-6 text-primary" />
          <span>Manajemen Kategori Dokumen Mutu</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Atur struktur kategori standarisasi mutu seperti Pedoman Mutu (PM), Prosedur Pelaksanaan (PP), Standar Operasional Prosedur (SOP), Instruksi Kerja (IK), dan Formulir (FR).
        </p>
      </div>

      <Button
        onClick={onAdd}
        size="sm"
        className="gap-1.5 text-xs cursor-pointer shadow-xs self-start sm:self-auto"
      >
        <Plus className="size-3.5" />
        <span>Tambah Kategori Baru</span>
      </Button>
    </div>
  );
}
