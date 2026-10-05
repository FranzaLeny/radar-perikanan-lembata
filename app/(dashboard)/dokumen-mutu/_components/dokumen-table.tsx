import React from 'react';
import { TestTube2, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DokumenRowActions } from './dokumen-row-actions';
import type { DokumenMutuItem } from '../types';

interface DokumenTableProps {
  items: DokumenMutuItem[];
  searchTerm: string;
  onEdit: (item: DokumenMutuItem) => void;
  onToggleAktif: (item: DokumenMutuItem) => void;
  onDelete: (item: DokumenMutuItem) => void;
}

export function DokumenTable({
  items,
  searchTerm,
  onEdit,
  onToggleAktif,
  onDelete,
}: DokumenTableProps) {
  return (
    <Card className="border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold w-28">Kode Dokumen</TableHead>
              <TableHead className="text-xs font-semibold w-36">Kategori</TableHead>
              <TableHead className="text-xs font-semibold">Judul & Spesifikasi Metode</TableHead>
              <TableHead className="text-xs font-semibold text-center w-20">Versi</TableHead>
              <TableHead className="text-xs font-semibold text-center w-24">Status</TableHead>
              <TableHead className="text-xs font-semibold text-right w-24">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-xs">
                  {searchTerm ? (
                    <p>Tidak ada dokumen mutu yang cocok dengan &ldquo;{searchTerm}&rdquo;.</p>
                  ) : (
                    <p>Belum ada dokumen mutu pada kategori ini.</p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const isIK =
                  item.kategoriDokumen?.kode_kategori === 'IK' ||
                  item.kode_ik.startsWith('IK-') ||
                  Boolean(item.parameter_uji);

                return (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono font-bold text-xs text-foreground">
                      {item.kode_ik}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          isIK
                            ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {item.kategoriDokumen?.nama_kategori || item.kategori || 'Dokumen Mutu'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground leading-snug">{item.judul}</p>

                        {/* Khusus IK: Tampilkan Parameter & Metode Pengujian Resmi */}
                        {isIK ? (
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            {item.parameter_uji && (
                              <Badge
                                variant="outline"
                                className="text-[11px] bg-primary/5 text-primary border-primary/20 gap-1"
                              >
                                <TestTube2 className="size-2.5" />
                                <span>
                                  Parameter: <strong>{item.parameter_uji}</strong>
                                </span>
                              </Badge>
                            )}
                            {item.metode_pengujian && (
                              <Badge
                                variant="outline"
                                className="text-[11px] font-mono bg-muted/60 text-muted-foreground gap-1"
                              >
                                <BookOpen className="size-2.5" />
                                <span>{item.metode_pengujian}</span>
                              </Badge>
                            )}
                          </div>
                        ) : item.deskripsi ? (
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {item.deskripsi}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs">
                      <Badge variant="outline" className="text-[11px]">
                        v{item.versi}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={item.aktif !== false ? 'default' : 'outline'}
                        className={`text-[10px] font-semibold ${
                          item.aktif !== false
                            ? 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {item.aktif !== false ? 'Berlaku' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DokumenRowActions
                        item={item}
                        onEdit={onEdit}
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
