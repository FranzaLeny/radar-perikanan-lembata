import React from 'react';
import { MoreHorizontal, FileEdit, Eye, EyeOff, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { BakuMutuItem } from '../types';

interface BakuMutuRowActionsProps {
  item: BakuMutuItem;
  onRevise: (item: BakuMutuItem) => void;
  onToggleAktif: (item: BakuMutuItem) => void;
  onDelete: (item: BakuMutuItem) => void;
}

export function BakuMutuRowActions({
  item,
  onRevise,
  onToggleAktif,
  onDelete,
}: BakuMutuRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center rounded-md size-7 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors focus-visible:outline-none"
        title="Menu Aksi"
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {item.aktif && (
          <DropdownMenuItem onClick={() => onRevise(item)}>
            <FileEdit className="size-3.5 mr-2" />
            Revisi Versi Baru
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onToggleAktif(item)}>
          {item.aktif ? (
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
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(item)}>
          <Trash2 className="size-3.5 mr-2" />
          Hapus Permanen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
