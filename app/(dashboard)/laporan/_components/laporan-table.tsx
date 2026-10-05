import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { BadgeStatus } from '@/components/badge-status';
import { APP_NAME } from '@/lib/constants';
import type { UjiLaporanItem } from '../types';
import { LaporanStatusBadge } from './laporan-status-badge';
import { LaporanRowActions } from './laporan-row-actions';

interface LaporanTableProps {
  items: UjiLaporanItem[];
  isFiltered: boolean;
  onResetFilter: () => void;
  onUpdateStatus: (item: UjiLaporanItem, newStatus: 'draft' | 'final' | 'arsip') => void;
  onDelete: (item: UjiLaporanItem) => void;
}

export function LaporanTable({
  items,
  isFiltered,
  onResetFilter,
  onUpdateStatus,
  onDelete,
}: LaporanTableProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[170px] text-xs font-semibold">
              Nomor LHU / Sampel
            </TableHead>
            <TableHead className="w-[120px] text-xs font-semibold">
              Tanggal Sampel
            </TableHead>
            <TableHead className="text-xs font-semibold">
              Pokdakan & Wilayah
            </TableHead>
            <TableHead className="w-[140px] text-xs font-semibold">
              Petugas Penguji
            </TableHead>
            <TableHead className="text-center w-[110px] text-xs font-semibold">
              Status Dokumen
            </TableHead>
            <TableHead className="text-center w-[110px] text-xs font-semibold">
              Status Mutu
            </TableHead>
            <TableHead className="text-right w-[150px] text-xs font-semibold">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-28 text-center text-muted-foreground text-xs">
                {isFiltered ? (
                  <div className="space-y-1.5">
                    <p>Tidak ada dokumen LHU yang cocok dengan filter pencarian ini.</p>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={onResetFilter}
                      className="cursor-pointer"
                    >
                      Reset Filter
                    </Button>
                  </div>
                ) : (
                  <p>Belum ada Lembar Hasil Uji (LHU) yang tercatat dalam sistem.</p>
                )}
              </TableCell>
            </TableRow>
          ) : (
            items.map((u) => (
              <TableRow key={u.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-semibold text-foreground text-xs">
                  LHU/{APP_NAME}/{u.nomor_sampel}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {new Date(u.tanggal_pengambilan).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-foreground text-xs">
                    {u.lokasi?.nama_pokdakan}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {u.lokasi?.desa}, {u.lokasi?.kecamatan}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {u.petugas_uji}
                </TableCell>
                <TableCell className="text-center">
                  <LaporanStatusBadge status={u.status} />
                </TableCell>
                <TableCell className="text-center">
                  <BadgeStatus status={u.kesimpulan || 'NORMAL'} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <LaporanRowActions
                    item={u}
                    onUpdateStatus={onUpdateStatus}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
