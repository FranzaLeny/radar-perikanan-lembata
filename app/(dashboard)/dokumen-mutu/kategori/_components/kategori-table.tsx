import React from 'react';
import { Pencil, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import type { KategoriItem } from '../../client';

interface KategoriTableProps {
  items: (KategoriItem & { documentCount?: number })[];
  onEdit: (item: KategoriItem) => void;
  onToggleAktif: (item: KategoriItem) => void;
  onDelete: (item: KategoriItem) => void;
}

export function KategoriTable({
  items,
  onEdit,
  onToggleAktif,
  onDelete,
}: KategoriTableProps) {
  return (
    <Card className="border-border bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="text-xs font-semibold w-24">Kode</TableHead>
            <TableHead className="text-xs font-semibold">
              Nama Kategori Dokumen
            </TableHead>
            <TableHead className="text-xs font-semibold">
              Deskripsi / Ruang Lingkup
            </TableHead>
            <TableHead className="text-xs font-semibold text-center w-24">
              Urutan
            </TableHead>
            <TableHead className="text-xs font-semibold text-center w-24">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold text-right w-28">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/30">
              <TableCell className="font-mono font-bold text-xs">
                <Badge variant="secondary" className="font-mono text-xs">
                  {item.kode_kategori}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold text-foreground text-xs">
                {item.nama_kategori}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {item.deskripsi || '-'}
              </TableCell>
              <TableCell className="text-center font-mono text-xs text-muted-foreground">
                {item.urutan}
              </TableCell>
              <TableCell className="text-center">
                {item.aktif ? (
                  <Badge
                    variant="outline"
                    className="border-emerald-300 text-emerald-800 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-[11px]"
                  >
                    Aktif
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[11px]">
                    Nonaktif
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onEdit(item)}
                    title="Edit Kategori"
                    className="cursor-pointer"
                  >
                    <Pencil className="size-3.5 text-muted-foreground hover:text-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onToggleAktif(item)}
                    title={item.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                    className="cursor-pointer"
                  >
                    {item.aktif ? (
                      <EyeOff className="size-3.5 text-amber-600" />
                    ) : (
                      <Eye className="size-3.5 text-emerald-600" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onDelete(item)}
                    title="Hapus Kategori"
                    className="cursor-pointer text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
