import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  User,
  MapPin,
  ChevronDown,
  ChevronUp,
  Printer,
  TestTube2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BadgeStatus } from '@/components/badge-status';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { UjiItem } from '../types';
import { UjiRowDetail } from './uji-row-detail';

interface UjiTableProps {
  items: UjiItem[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}

export function UjiTable({
  items,
  expandedId,
  setExpandedId,
}: UjiTableProps) {
  return (
    <Card className="border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">
                Nomor Sampel
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Waktu Uji & Petugas
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Titik Kolam Pokdakan
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Ringkasan Parameter
              </TableHead>
              <TableHead className="text-xs font-semibold text-center">
                Kesimpulan Mutu
              </TableHead>
              <TableHead className="text-xs font-semibold text-right">
                LHU & Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-muted-foreground text-xs"
                >
                  <TestTube2 className="size-8 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="font-semibold text-foreground">
                    Belum ada data pengujian kualitas air.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Klik tombol &ldquo;Input Hasil Uji Baru&rdquo; untuk merekam
                    uji pertama.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                  <React.Fragment key={item.id}>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell className="font-mono font-semibold text-foreground text-xs">
                        {item.nomor_sampel}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="text-foreground font-medium flex items-center gap-1.5">
                          <Calendar className="size-3 text-muted-foreground" />
                          {new Date(item.tanggal_pengambilan).toLocaleDateString(
                            'id-ID',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </div>
                        <div className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                          <User className="size-3" />
                          {item.petugas_uji}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="text-foreground font-medium">
                          {item.lokasi?.nama_pokdakan || '-'}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="size-3 text-muted-foreground" />
                          {item.lokasi?.desa}, {item.lokasi?.kecamatan}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {item.detailParameters.slice(0, 3).map((dp) => (
                            <Badge
                              key={dp.id}
                              variant="secondary"
                              className="text-xs font-mono py-0 px-1.5"
                            >
                              {dp.bakuMutu?.parameter.split(' ')[0]}:{' '}
                              {dp.nilai_hasil}
                            </Badge>
                          ))}
                          {item.detailParameters.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs py-0 px-1 font-mono"
                            >
                              +{item.detailParameters.length - 3} lainnya
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <BadgeStatus
                          status={item.kesimpulan || 'NORMAL'}
                          size="sm"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              setExpandedId(isExpanded ? null : item.id)
                            }
                            title={
                              isExpanded
                                ? 'Tutup Rincian'
                                : 'Buka Rincian Parameter'
                            }
                            className="size-7 cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronUp className="size-3.5" />
                            ) : (
                              <ChevronDown className="size-3.5" />
                            )}
                          </Button>
                          <Link href={`/laporan/${item.id}/cetak`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs gap-1 cursor-pointer"
                            >
                              <Printer className="size-3.5" />
                              <span>LHU</span>
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Details Sub-Row */}
                    {isExpanded && (
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableCell colSpan={6} className="p-4">
                          <UjiRowDetail item={item} />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
