'use client';

import React, { useState, useMemo } from 'react';
import {
  Printer,
  Search,
  X,
  FileEdit,
  Trash2,
  CheckCircle,
  Archive,
  RotateCcw,
  MoreHorizontal,
  FileCheck2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BadgeStatus } from '@/components/badge-status';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group';
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
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  updateStatusUjiAction,
  deleteHasilUjiAction,
} from '@/lib/actions/uji-kualitas';

export interface UjiLaporanItem {
  id: string;
  nomor_sampel: string;
  tanggal_pengambilan: Date | string;
  petugas_uji: string;
  kesimpulan: string | null;
  status?: string;
  lokasi?: {
    nama_pokdakan: string;
    desa: string;
    kecamatan: string;
  } | null;
}

interface LaporanTableClientProps {
  initialList: UjiLaporanItem[];
}

export function LaporanTableClient({ initialList }: LaporanTableClientProps) {
  const router = useRouter();
  const [list, setList] = useState<UjiLaporanItem[]>(initialList);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'draft' | 'final' | 'arsip'>('all');

  const filteredList = useMemo(() => {
    let result = list;

    // Filter status tab
    if (statusTab !== 'all') {
      result = result.filter((item) => (item.status || 'draft') === statusTab);
    }

    // Filter search
    if (!searchQuery.trim()) return result;
    const query = searchQuery.toLowerCase().trim();

    return result.filter((item) => {
      const matchNomor = item.nomor_sampel.toLowerCase().includes(query);
      const matchLhu = `lhu/${APP_NAME.toLowerCase()}/${item.nomor_sampel}`.toLowerCase().includes(query);
      const matchPetugas = item.petugas_uji.toLowerCase().includes(query);
      const matchPokdakan = item.lokasi?.nama_pokdakan.toLowerCase().includes(query) ?? false;
      const matchDesa = item.lokasi?.desa.toLowerCase().includes(query) ?? false;
      const matchKecamatan = item.lokasi?.kecamatan.toLowerCase().includes(query) ?? false;
      const matchStatus = (item.kesimpulan || '').toLowerCase().includes(query);

      return (
        matchNomor ||
        matchLhu ||
        matchPetugas ||
        matchPokdakan ||
        matchDesa ||
        matchKecamatan ||
        matchStatus
      );
    });
  }, [list, searchQuery, statusTab]);

  const isFiltered = searchQuery.trim().length > 0 || statusTab !== 'all';

  const handleUpdateStatus = async (item: UjiLaporanItem, newStatus: 'draft' | 'final' | 'arsip') => {
    try {
      const res = await updateStatusUjiAction(item.id, newStatus);
      if (res.success) {
        setList((prev) =>
          prev.map((x) => (x.id === item.id ? { ...x, status: newStatus } : x))
        );
        toast.success(res.message);
      } else {
        toast.error(res.message || 'Gagal mengubah status.');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengubah status dokumen.');
    }
  };

  const handleDelete = async (item: UjiLaporanItem) => {
    if (!confirm(`Hapus laporan hasil uji sampel "${item.nomor_sampel}"? Dokumen draft yang dihapus tidak dapat dipulihkan.`)) return;

    try {
      const res = await deleteHasilUjiAction(item.id);
      if (res.success) {
        setList((prev) => prev.filter((x) => x.id !== item.id));
        toast.success(res.message);
      } else {
        toast.error(res.message || 'Gagal menghapus laporan.');
      }
    } catch {
      toast.error('Terjadi kesalahan saat menghapus laporan.');
    }
  };

  const renderStatusDokumenBadge = (status?: string) => {
    const s = status || 'draft';
    switch (s) {
      case 'final':
        return (
          <Badge className="bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25 text-[11px] gap-1 font-semibold">
            <CheckCircle className="size-3 text-emerald-600 dark:text-emerald-400" />
            Final
          </Badge>
        );
      case 'arsip':
        return (
          <Badge variant="secondary" className="text-[11px] gap-1 text-muted-foreground">
            <Archive className="size-3" />
            Arsip
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-[11px] gap-1 font-semibold"
          >
            <FileEdit className="size-3" />
            Draft
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
        <div>
          <CardTitle className="text-base font-heading">
            Daftar Lembar Hasil Uji (LHU) Siap Cetak
          </CardTitle>
          <CardDescription className="text-xs">
            Kelola siklus status dokumen (Draft &rarr; Final &rarr; Arsip) dan penerbitan Laporan Hasil Uji resmi.
          </CardDescription>
        </div>

        {/* Indikator Counter */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isFiltered ? (
            <Badge variant="secondary" className="gap-1.5 text-xs py-0.5">
              <span>Menampilkan {filteredList.length} dari {list.length} Dokumen</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="font-mono text-xs">
              {list.length} Dokumen Terdaftar
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tabs Status & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <Tabs value={statusTab} onValueChange={(val) => setStatusTab(val as 'all' | 'draft' | 'final' | 'arsip')}>
            <TabsList>
              <TabsTrigger value="all" className="text-xs gap-1.5">
                <span>Semua Dokumen</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {list.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="draft" className="text-xs gap-1.5">
                <span>Draft</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {list.filter((x) => (x.status || 'draft') === 'draft').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="final" className="text-xs gap-1.5">
                <span>Final</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {list.filter((x) => x.status === 'final').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="arsip" className="text-xs gap-1.5">
                <span>Arsip</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {list.filter((x) => x.status === 'arsip').length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <InputGroup className="w-full sm:w-72">
              <InputGroupAddon align="inline-start">
                <Search className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Pokdakan, nomor LHU, penguji..."
              />
              {searchQuery && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    onClick={() => setSearchQuery('')}
                    title="Hapus pencarian"
                  >
                    <X className="size-3.5" />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>

            {isFiltered && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  setSearchQuery('');
                  setStatusTab('all');
                }}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Tabel Data */}
        <div className="rounded-xl overflow-hidden border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[170px] text-xs font-semibold">Nomor LHU / Sampel</TableHead>
                <TableHead className="w-[120px] text-xs font-semibold">Tanggal Sampel</TableHead>
                <TableHead className="text-xs font-semibold">Pokdakan & Wilayah</TableHead>
                <TableHead className="w-[140px] text-xs font-semibold">Petugas Penguji</TableHead>
                <TableHead className="text-center w-[110px] text-xs font-semibold">Status Dokumen</TableHead>
                <TableHead className="text-center w-[110px] text-xs font-semibold">Status Mutu</TableHead>
                <TableHead className="text-right w-[150px] text-xs font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-28 text-center text-muted-foreground text-xs">
                    {isFiltered ? (
                      <div className="space-y-1.5">
                        <p>Tidak ada dokumen LHU yang cocok dengan filter pencarian ini.</p>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => {
                            setSearchQuery('');
                            setStatusTab('all');
                          }}
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
                filteredList.map((u) => {
                  const currentStatus = u.status || 'draft';
                  const isDraft = currentStatus === 'draft';
                  const isFinal = currentStatus === 'final';
                  const isArsip = currentStatus === 'arsip';

                  return (
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
                        <div className="font-medium text-foreground text-xs">{u.lokasi?.nama_pokdakan}</div>
                        <div className="text-xs text-muted-foreground">
                          {u.lokasi?.desa}, {u.lokasi?.kecamatan}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{u.petugas_uji}</TableCell>
                      <TableCell className="text-center">
                        {renderStatusDokumenBadge(u.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <BadgeStatus status={u.kesimpulan || 'NORMAL'} size="sm" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/laporan/${u.id}/cetak`}>
                            <Button size="xs" variant="default" className="gap-1 font-medium cursor-pointer h-7 px-2">
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
                                onClick={() => router.push(`/laporan/${u.id}/cetak`)}
                                className="cursor-pointer"
                              >
                                <Printer className="size-3.5 mr-2" />
                                Cetak Lembar LHU
                              </DropdownMenuItem>

                              {isDraft && (
                                <DropdownMenuItem
                                  onClick={() => router.push(`/uji-kualitas/edit/${u.id}`)}
                                  className="cursor-pointer"
                                >
                                  <FileEdit className="size-3.5 mr-2 text-blue-600" />
                                  Edit Data Uji (Draft)
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />

                              {isDraft && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(u, 'final')}>
                                  <FileCheck2 className="size-3.5 mr-2 text-emerald-600" />
                                  Finalkan Dokumen
                                </DropdownMenuItem>
                              )}

                              {isFinal && (
                                <>
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(u, 'arsip')}>
                                    <Archive className="size-3.5 mr-2 text-amber-600" />
                                    Arsipkan Dokumen
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(u, 'draft')}>
                                    <RotateCcw className="size-3.5 mr-2 text-blue-600" />
                                    Kembalikan ke Draft
                                  </DropdownMenuItem>
                                </>
                              )}

                              {isArsip && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(u, 'final')}>
                                  <RotateCcw className="size-3.5 mr-2 text-emerald-600" />
                                  Kembalikan ke Final
                                </DropdownMenuItem>
                              )}

                              {isDraft && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => handleDelete(u)}
                                  >
                                    <Trash2 className="size-3.5 mr-2" />
                                    Hapus Laporan (Draft)
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
