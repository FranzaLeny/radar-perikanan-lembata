'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  MoreVertical,
  ExternalLink,
  QrCode,
  Pencil,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DokumenMutuItem } from '../types';

interface DokumenRowActionsProps {
  item: DokumenMutuItem;
  onEdit: (item: DokumenMutuItem) => void;
  onToggleAktif: (item: DokumenMutuItem) => void;
  onDelete: (item: DokumenMutuItem) => void;
}

export function DokumenRowActions({
  item,
  onEdit,
  onToggleAktif,
  onDelete,
}: DokumenRowActionsProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center rounded-md size-7 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors focus-visible:outline-none"
        title="Menu Tindakan"
      >
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs">Tindakan Dokumen</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => window.open(item.file_path, '_blank')}>
          <ExternalLink className="size-3.5 mr-2 text-muted-foreground" />
          <span>Lihat Dokumen PDF</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push(`/dokumen-mutu/${item.id}/cetak-label`)}>
          <QrCode className="size-3.5 mr-2 text-muted-foreground" />
          <span>Cetak Label QR</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onEdit(item)}>
          <Pencil className="size-3.5 mr-2 text-muted-foreground" />
          <span>Edit Metadata</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onToggleAktif(item)}>
          {item.aktif !== false ? (
            <>
              <EyeOff className="size-3.5 mr-2 text-amber-600" />
              <span>Nonaktifkan</span>
            </>
          ) : (
            <>
              <Eye className="size-3.5 mr-2 text-emerald-600" />
              <span>Aktifkan Kembali</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="size-3.5 mr-2" />
          <span>Hapus Permanen</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
