import React from 'react';
import Link from 'next/link';
import { TestTube2, ArrowRight, Printer } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BadgeStatus } from '@/components/badge-status';
import type { RecentUjiItem } from '../types';

interface DashboardRecentTestsCardProps {
  items: RecentUjiItem[];
}

export function DashboardRecentTestsCard({
  items,
}: DashboardRecentTestsCardProps) {
  return (
    <Card className="lg:col-span-2 border-border bg-card shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TestTube2 className="size-4 text-muted-foreground" />
            <span>Hasil Uji Mutu Air Terbaru</span>
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            10 riwayat pengujian sampel laboratorium terakhir
          </CardDescription>
        </div>
        <Link href="/uji-kualitas">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs text-foreground font-semibold h-7 px-2 cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="size-3" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="pt-4 p-0 sm:p-6">
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold">Sampel</TableHead>
                <TableHead className="text-xs font-semibold">Pokdakan</TableHead>
                <TableHead className="text-xs font-semibold">Tanggal</TableHead>
                <TableHead className="text-xs font-semibold text-center">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-right">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground text-xs"
                  >
                    Belum ada rekaman data uji kualitas air.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((u) => {
                  const tgl = new Date(u.tanggal_pengambilan).toLocaleDateString(
                    'id-ID',
                    {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }
                  );

                  return (
                    <TableRow key={u.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs font-medium text-foreground">
                        {u.nomor_sampel}
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className="font-semibold text-foreground">
                          {u.lokasi?.nama_pokdakan || 'Pokdakan'}
                        </span>
                        <span className="text-xs text-muted-foreground block">
                          {u.lokasi?.kecamatan || 'Lembata'}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {tgl}
                      </TableCell>
                      <TableCell className="text-center">
                        <BadgeStatus
                          status={u.kesimpulan || 'NORMAL'}
                          size="sm"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/laporan/${u.id}/cetak`}>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Cetak LHU"
                              className="size-7 cursor-pointer"
                            >
                              <Printer className="size-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
