import React from 'react';
import { MoreHorizontal, Pencil, Eye, EyeOff, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { LokasiItem } from '../types';

interface LokasiRowActionsProps {
  item: LokasiItem;
  onEdit: (item: LokasiItem) => void;
  onToggleAktif: (item: LokasiItem) => void;
  onDelete: (item: LokasiItem) => void;
}

export function LokasiRowActions({
  item,
  onEdit,
  onToggleAktif,
  onDelete,
}: LokasiRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center rounded-md size-7 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors focus-visible:outline-none"
        title="Menu Aksi"
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(item)}>
          <Pencil className="size-3.5 mr-2" />
          Edit Lokasi
        </DropdownMenuItem>
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
          Hapus Lokasi
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
