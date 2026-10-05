import React from 'react';
import { Compass, Fish } from 'lucide-react';
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
import { LokasiRowActions } from './lokasi-row-actions';
import type { LokasiItem } from '../types';

interface LokasiTableProps {
  items: LokasiItem[];
  searchTerm: string;
  onClearSearch: () => void;
  onEdit: (item: LokasiItem) => void;
  onToggleAktif: (item: LokasiItem) => void;
  onDelete: (item: LokasiItem) => void;
}

export function LokasiTable({
  items,
  searchTerm,
  onClearSearch,
  onEdit,
  onToggleAktif,
  onDelete,
}: LokasiTableProps) {
  return (
    <Card className="border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">Nama Pokdakan</TableHead>
              <TableHead className="text-xs font-semibold">Penanggung Jawab / Pemilik</TableHead>
              <TableHead className="text-xs font-semibold">Wilayah (Kec./Desa)</TableHead>
              <TableHead className="text-xs font-semibold">Komoditas Utama</TableHead>
              <TableHead className="text-xs font-semibold">Titik Koordinat</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                  {searchTerm ? (
                    <div className="space-y-1.5">
                      <p>Tidak ada lokasi yang cocok dengan pencarian &ldquo;{searchTerm}&rdquo;.</p>
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
                    <p>Belum ada data lokasi kolam dalam kategori ini.</p>
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
                    {item.nama_pokdakan}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium text-xs">
                    {item.pemilik}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="text-foreground font-medium">{item.kecamatan}</div>
                    <div className="text-xs text-muted-foreground">Desa {item.desa}</div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <Badge variant="secondary" className="gap-1 text-xs font-normal">
                      <Fish className="size-3 text-muted-foreground" />
                      {item.komoditas_ikan || 'Campuran'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {item.titik_koordinat ? (
                      <a
                        href={`https://maps.google.com/?q=${item.titik_koordinat}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs text-foreground hover:underline"
                        title="Buka di Google Maps"
                      >
                        <Compass className="size-3.5 text-muted-foreground" />
                        <span>{item.titik_koordinat}</span>
                      </a>
                    ) : (
                      <span className="text-muted-foreground font-mono text-xs">-</span>
                    )}
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
                    <LokasiRowActions
                      item={item}
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
