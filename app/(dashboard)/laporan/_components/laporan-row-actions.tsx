import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Printer,
  FileEdit,
  Trash2,
  Archive,
  RotateCcw,
  MoreHorizontal,
  FileCheck2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UjiLaporanItem } from '../types';

interface LaporanRowActionsProps {
  item: UjiLaporanItem;
  onUpdateStatus: (item: UjiLaporanItem, newStatus: 'draft' | 'final' | 'arsip') => void;
  onDelete: (item: UjiLaporanItem) => void;
}

export function LaporanRowActions({
  item,
  onUpdateStatus,
  onDelete,
}: LaporanRowActionsProps) {
  const router = useRouter();
  const currentStatus = item.status || 'draft';
  const isDraft = currentStatus === 'draft';
  const isFinal = currentStatus === 'final';
  const isArsip = currentStatus === 'arsip';

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link href={`/laporan/${item.id}/cetak`}>
        <Button
          size="xs"
          variant="default"
          className="gap-1 font-medium cursor-pointer h-7 px-2"
        >
          <Printer className="size-3" />
          <span className="hidden sm:inline">Cetak</span>
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex items-center justify-center rounded-md size-7 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors focus-visible:outline-none"
          title="Menu Aksi"
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => router.push(`/laporan/${item.id}/cetak`)}
            className="cursor-pointer"
          >
            <Printer className="size-3.5 mr-2" />
            Cetak Lembar LHU
          </DropdownMenuItem>

          {isDraft && (
            <DropdownMenuItem
              onClick={() => router.push(`/uji-kualitas/edit/${item.id}`)}
              className="cursor-pointer"
            >
              <FileEdit className="size-3.5 mr-2 text-blue-600" />
              Edit Data Uji (Draft)
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {isDraft && (
            <DropdownMenuItem onClick={() => onUpdateStatus(item, 'final')}>
              <FileCheck2 className="size-3.5 mr-2 text-emerald-600" />
              Finalkan Dokumen
            </DropdownMenuItem>
          )}

          {isFinal && (
            <>
              <DropdownMenuItem onClick={() => onUpdateStatus(item, 'arsip')}>
                <Archive className="size-3.5 mr-2 text-amber-600" />
                Arsipkan Dokumen
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(item, 'draft')}>
                <RotateCcw className="size-3.5 mr-2 text-blue-600" />
                Kembalikan ke Draft
              </DropdownMenuItem>
            </>
          )}

          {isArsip && (
            <DropdownMenuItem onClick={() => onUpdateStatus(item, 'final')}>
              <RotateCcw className="size-3.5 mr-2 text-emerald-600" />
              Kembalikan ke Final
            </DropdownMenuItem>
          )}

          {isDraft && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(item)}
              >
                <Trash2 className="size-3.5 mr-2" />
                Hapus Laporan (Draft)
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
