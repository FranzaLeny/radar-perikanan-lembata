import React from 'react';
import { Thermometer, History } from 'lucide-react';
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
import { BakuMutuRowActions } from './baku-mutu-row-actions';
import type { BakuMutuItem } from '../types';

interface BakuMutuTableProps {
  items: BakuMutuItem[];
  searchTerm: string;
  onClearSearch: () => void;
  onRevise: (item: BakuMutuItem) => void;
  onToggleAktif: (item: BakuMutuItem) => void;
  onDelete: (item: BakuMutuItem) => void;
}

export function BakuMutuTable({
  items,
  searchTerm,
  onClearSearch,
  onRevise,
  onToggleAktif,
  onDelete,
}: BakuMutuTableProps) {
  return (
    <Card className="border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">Parameter Uji</TableHead>
              <TableHead className="text-xs font-semibold">Satuan</TableHead>
              <TableHead className="text-xs font-semibold">Ambang Batas Baku Mutu</TableHead>
              <TableHead className="text-xs font-semibold">Nomor Regulasi (LHU)</TableHead>
              <TableHead className="text-xs font-semibold">Dasar Regulasi Lengkap</TableHead>
              <TableHead className="text-xs font-semibold">Status Versi</TableHead>
              <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                  {searchTerm ? (
                    <div className="space-y-1.5">
                      <p>Tidak ada parameter yang cocok dengan pencarian &ldquo;{searchTerm}&rdquo;.</p>
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
                    <p>Tidak ada parameter pada kategori ini.</p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const isDinamisSuhu = item.tipe_ambang_batas === 'deviasi_suhu_lingkungan';

                return (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-semibold text-foreground text-xs">
                      {item.parameter}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {item.satuan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {isDinamisSuhu ? (
                        <div className="space-y-1">
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 text-[11px] gap-1"
                          >
                            <Thermometer className="size-3" />
                            <span>Deviasi ±{item.deviasi_toleransi || '2.00'}°C dari Suhu Udara</span>
                          </Badge>
                          {item.nilai_min && item.nilai_max && (
                            <p className="text-[11px] text-muted-foreground font-mono">
                              Acuan kisaran: {item.nilai_min} – {item.nilai_max} {item.satuan}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="font-mono font-medium text-foreground">
                          {item.nilai_min !== null && item.nilai_max !== null
                            ? `${item.nilai_min} – ${item.nilai_max}`
                            : item.nilai_min !== null
                            ? `≥ ${item.nilai_min}`
                            : item.nilai_max !== null
                            ? `≤ ${item.nilai_max}`
                            : '-'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="secondary" className="font-semibold text-xs">
                        {item.nomor_regulasi || 'PP No. 22/2021'}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="text-xs text-muted-foreground max-w-xs truncate"
                      title={item.dasar_regulasi || ''}
                    >
                      {item.dasar_regulasi || '-'}
                    </TableCell>
                    <TableCell>
                      {item.aktif ? (
                        <Badge
                          variant="outline"
                          className="border-emerald-300 text-emerald-800 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs gap-1"
                        >
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          <span>Berlaku</span>
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <History className="size-3 text-muted-foreground" />
                          <span>Arsip</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <BakuMutuRowActions
                        item={item}
                        onRevise={onRevise}
                        onToggleAktif={onToggleAktif}
                        onDelete={onDelete}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
