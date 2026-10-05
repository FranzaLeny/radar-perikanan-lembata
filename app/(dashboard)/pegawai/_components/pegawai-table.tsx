import React from 'react';
import { Star, CheckCircle2, Shield, UserCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PegawaiRowActions } from './pegawai-row-actions';
import type { PegawaiItem } from '../types';

interface PegawaiTableProps {
  items: PegawaiItem[];
  searchTerm: string;
  onClearSearch: () => void;
  onSetPenanggungJawab: (item: PegawaiItem) => void;
  onEdit: (item: PegawaiItem) => void;
  onToggleAktif: (item: PegawaiItem) => void;
  onDelete: (item: PegawaiItem) => void;
}

export function PegawaiTable({
  items,
  searchTerm,
  onClearSearch,
  onSetPenanggungJawab,
  onEdit,
  onToggleAktif,
  onDelete,
}: PegawaiTableProps) {
  const getPeranBadge = (peran: string) => {
    switch (peran) {
      case 'kepala_dinas':
        return (
          <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 text-[11px] gap-1 font-semibold">
            <Shield className="size-3" />
            Kepala Dinas
          </Badge>
        );
      case 'pengelola_mutu':
        return (
          <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 text-[11px] gap-1 font-semibold">
            <UserCheck className="size-3" />
            Pengelola Mutu
          </Badge>
        );
      case 'penguji':
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground text-[11px] gap-1">
            <CheckCircle2 className="size-3" />
            Petugas Penguji
          </Badge>
        );
    }
  };

  return (
    <Card className="border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">Nama Pegawai</TableHead>
              <TableHead className="text-xs font-semibold">NIP</TableHead>
              <TableHead className="text-xs font-semibold">Jabatan & Pangkat</TableHead>
              <TableHead className="text-xs font-semibold">Peran Tanda Tangan</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                  {searchTerm ? (
                    <div className="space-y-1.5">
                      <p>Tidak ada pegawai yang cocok dengan pencarian &ldquo;{searchTerm}&rdquo;.</p>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={onClearSearch}
                        className="cursor-pointer"
                      >
                        Kosongkan Pencarian
                      </Button>
                    </div>
                  ) : (
                    <p>Belum ada data pegawai dalam kategori ini.</p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow
                  key={item.id}
                  className={`hover:bg-muted/30 transition-colors ${
                    !item.aktif ? 'opacity-65 bg-muted/15' : ''
                  }`}
                >
                  <TableCell className="font-semibold text-foreground text-xs">
                    <div className="flex items-center gap-2">
                      <span>{item.nama}</span>
                      {item.is_penanggungjawab && (
                        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] gap-1 px-1.5 py-0 font-semibold">
                          <Star className="size-2.5 fill-amber-500 text-amber-500" />
                          Default TTD
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.nip}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="text-foreground font-medium">{item.jabatan}</div>
                    {item.pangkat_golongan && (
                      <div className="text-[11px] text-muted-foreground">
                        {item.pangkat_golongan}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {getPeranBadge(item.peran_tanda_tangan)}
                  </TableCell>
                  <TableCell className="text-xs">
                    <Badge
                      variant={item.aktif ? 'default' : 'outline'}
                      className={`text-[10px] font-semibold ${
                        item.aktif
                          ? 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {item.aktif ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <PegawaiRowActions
                      item={item}
                      onSetPenanggungJawab={onSetPenanggungJawab}
                      onEdit={onEdit}
                      onToggleAktif={onToggleAktif}
                      onDelete={onDelete}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
