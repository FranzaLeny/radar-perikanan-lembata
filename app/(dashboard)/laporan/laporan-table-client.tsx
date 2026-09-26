'use client';

import React, { useState, useMemo } from 'react';
import {
  Printer,
  Search,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { BadgeStatus } from '@/components/badge-status';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

export interface UjiLaporanItem {
  id: string;
  nomor_sampel: string;
  tanggal_pengambilan: Date | string;
  petugas_uji: string;
  kesimpulan: string | null;
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return initialList;
    const query = searchQuery.toLowerCase().trim();

    return initialList.filter((item) => {
      const matchNomor = item.nomor_sampel.toLowerCase().includes(query);
      const matchLhu = `lhu/sipeka/${item.nomor_sampel}`.toLowerCase().includes(query);
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
  }, [initialList, searchQuery]);

  const isFiltered = searchQuery.trim().length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
        <div>
          <CardTitle className="text-base font-heading">
            Daftar Lembar Hasil Uji (LHU) Siap Cetak
          </CardTitle>
          <CardDescription className="text-xs">
            Cari berdasarkan lokasi kolam, kecamatan, desa, nomor LHU, kode sampel, atau petugas penguji.
          </CardDescription>
        </div>

        {/* Indikator Counter Komparasi */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isFiltered ? (
            <Badge variant="secondary" className="gap-1.5 text-xs py-0.5">
              <span>Menampilkan {filteredList.length} dari {initialList.length} Dokumen</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="font-mono text-xs">
              {initialList.length} Dokumen Terdaftar
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <InputGroup className="flex-1">
            <InputGroupAddon align="inline-start">
              <Search className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari lokasi Pokdakan, desa, kecamatan, nomor LHU (SMP-XXXX), atau penguji..."
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
              onClick={() => setSearchQuery('')}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Reset
            </Button>
          )}
        </div>

        {/* Tabel Data */}
        <div className="rounded-xl overflow-hidden border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[180px] text-xs">Nomor LHU / Sampel</TableHead>
                <TableHead className="w-[130px] text-xs">Tanggal Sampel</TableHead>
                <TableHead className="text-xs">Pokdakan & Wilayah</TableHead>
                <TableHead className="w-[150px] text-xs">Petugas Penguji</TableHead>
                <TableHead className="text-center w-[120px] text-xs">Status Mutu</TableHead>
                <TableHead className="text-right w-[110px] text-xs">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-28 text-center text-muted-foreground text-xs">
                    {isFiltered ? (
                      <div className="space-y-1.5">
                        <p>Tidak ada dokumen LHU yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.</p>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setSearchQuery('')}
                          className="cursor-pointer"
                        >
                          Kosongkan Pencarian
                        </Button>
                      </div>
                    ) : (
                      <p>Belum ada Lembar Hasil Uji (LHU) yang tercatat dalam sistem.</p>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredList.map((u) => (
                  <TableRow key={u.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono font-semibold text-foreground text-xs">
                      LHU/SIPEKA/{u.nomor_sampel}
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
                      <BadgeStatus status={u.kesimpulan || 'NORMAL'} size="sm" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/laporan/${u.id}/cetak`}>
                        <Button size="xs" variant="default" className="gap-1.5 font-medium cursor-pointer">
                          <Printer className="size-3" />
                          <span>Cetak LHU</span>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
