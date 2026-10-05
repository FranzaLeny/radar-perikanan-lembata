import React from 'react';
import { MoreHorizontal, Pencil, Eye, EyeOff, Trash2, Star } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { PegawaiItem } from '../types';

interface PegawaiRowActionsProps {
  item: PegawaiItem;
  onSetPenanggungJawab: (item: PegawaiItem) => void;
  onEdit: (item: PegawaiItem) => void;
  onToggleAktif: (item: PegawaiItem) => void;
  onDelete: (item: PegawaiItem) => void;
}

export function PegawaiRowActions({
  item,
  onSetPenanggungJawab,
  onEdit,
  onToggleAktif,
  onDelete,
}: PegawaiRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center rounded-md size-7 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors focus-visible:outline-none"
        title="Menu Aksi"
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!item.is_penanggungjawab && item.aktif && (
          <DropdownMenuItem onClick={() => onSetPenanggungJawab(item)}>
            <Star className="size-3.5 mr-2 text-amber-500" />
            Jadikan Default Penandatangan
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onEdit(item)}>
          <Pencil className="size-3.5 mr-2" />
          Edit Pegawai
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
          Hapus Pegawai
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
