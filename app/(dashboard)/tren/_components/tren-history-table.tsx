import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { BadgeStatus } from '@/components/badge-status';
import type { DetailRow } from '../types';

interface TrenHistoryTableProps {
  parameterName: string;
  satuan: string;
  rows: DetailRow[];
}

export function TrenHistoryTable({
  parameterName,
  satuan,
  rows,
}: TrenHistoryTableProps) {
  return (
    <Card className="border-border bg-card shadow-xs overflow-hidden">
      <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Riwayat Titik Uji Parameter: {parameterName}
        </CardTitle>
        <span className="text-xs text-muted-foreground font-mono">
          Total {rows.length} titik pengukuran
        </span>
      </CardHeader>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">
                Nomor Sampel
              </TableHead>
              <TableHead className="text-xs font-semibold">Pokdakan</TableHead>
              <TableHead className="text-xs font-semibold">
                Waktu Pengambilan
              </TableHead>
              <TableHead className="text-xs font-semibold font-mono">
                Nilai Pengukuran
              </TableHead>
              <TableHead className="text-xs font-semibold text-center">
                Status Kelayakan
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground text-xs"
                >
                  Belum ada data untuk parameter ini pada filter terpilih.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono font-semibold text-foreground text-xs">
                    {row.nomor_sampel}
                  </TableCell>
                  <TableCell className="font-medium text-foreground text-xs">
                    {row.pokdakan}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {row.tanggal}
                  </TableCell>
                  <TableCell className="font-mono font-bold text-foreground text-xs">
                    {row.nilai} {satuan}
                  </TableCell>
                  <TableCell className="text-center">
                    <BadgeStatus status={row.status} size="sm" />
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
