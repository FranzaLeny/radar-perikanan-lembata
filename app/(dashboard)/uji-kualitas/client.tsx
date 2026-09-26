'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TestTube2,
  Plus,
  Printer,
  Calendar,
  User,
  MapPin,
  Search,
  Eye,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { BadgeStatus } from '@/components/badge-status';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DetailParameterItem {
  id: string;
  nilai_hasil: string;
  status_kelayakan: string | null;
  bakuMutu: {
    parameter: string;
    satuan: string;
    nilai_min: string | null;
    nilai_max: string | null;
  } | null;
}

interface UjiItem {
  id: string;
  nomor_sampel: string;
  tanggal_pengambilan: Date;
  petugas_uji: string;
  catatan_lapangan: string | null;
  kesimpulan: string | null;
  lokasi: {
    nama_pokdakan: string;
    pemilik: string;
    kecamatan: string;
    desa: string;
    komoditas_ikan: string | null;
  } | null;
  instruksiKerja: {
    kode_ik: string;
    judul: string;
  } | null;
  detailParameters: DetailParameterItem[];
}

export function UjiKualitasListClient({ initialList }: { initialList: UjiItem[] }) {
  const [list, setList] = useState<UjiItem[]>(initialList);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('SEMUA');
  const [selectedKesimpulan, setSelectedKesimpulan] = useState('SEMUA');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = list.filter((item) => {
    const matchesSearch =
      item.nomor_sampel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.petugas_uji.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.lokasi && item.lokasi.nama_pokdakan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.lokasi && item.lokasi.desa.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesKecamatan =
      selectedKecamatan === 'SEMUA' ||
      (item.lokasi && item.lokasi.kecamatan === selectedKecamatan);

    const matchesKesimpulan =
      selectedKesimpulan === 'SEMUA' ||
      item.kesimpulan === selectedKesimpulan;

    return matchesSearch && matchesKecamatan && matchesKesimpulan;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-primary border-primary/30 bg-primary/5 text-xs font-semibold uppercase tracking-wider">
            <TestTube2 className="size-3" />
            <span>Pengujian Mutu Air</span>
          </Badge>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Log & Riwayat Pengujian Kualitas Air
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Daftar hasil uji lapangan dan laboratorium dengan evaluasi otomatis kesimpulan mutu air kolam.
          </p>
        </div>

        <Link href="/uji-kualitas/input">
          <Button className="gap-2 shadow-xs self-start sm:self-auto">
            <Plus className="size-4" />
            <span>Input Hasil Uji Baru</span>
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-3.5 space-y-3 text-xs">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nomor sampel, Pokdakan, desa, atau petugas..."
                className="pl-8 pr-8 text-xs"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-xs whitespace-nowrap">Kecamatan:</span>
                <Select
                  value={selectedKecamatan}
                  onValueChange={(val) => setSelectedKecamatan(val || 'SEMUA')}
                >
                  <SelectTrigger className="h-8 w-[140px] text-xs">
                    <SelectValue placeholder="Pilih Wilayah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEMUA">Semua Wilayah</SelectItem>
                    <SelectItem value="Nubatukan">Nubatukan</SelectItem>
                    <SelectItem value="Ile Ape">Ile Ape</SelectItem>
                    <SelectItem value="Ile Ape Timur">Ile Ape Timur</SelectItem>
                    <SelectItem value="Lebatukan">Lebatukan</SelectItem>
                    <SelectItem value="Buyasuri">Buyasuri</SelectItem>
                    <SelectItem value="Omesuri">Omesuri</SelectItem>
                    <SelectItem value="Wulandoni">Wulandoni</SelectItem>
                    <SelectItem value="Atadei">Atadei</SelectItem>
                    <SelectItem value="Nagawutung">Nagawutung</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-xs whitespace-nowrap">Status:</span>
                <Select
                  value={selectedKesimpulan}
                  onValueChange={(val) => setSelectedKesimpulan(val || 'SEMUA')}
                >
                  <SelectTrigger className="h-8 w-[130px] text-xs">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEMUA">Semua Status</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="PERINGATAN">Peringatan</SelectItem>
                    <SelectItem value="KRITIS">Kritis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Indikator Komparasi Filter */}
          {(searchTerm.trim() !== '' || selectedKecamatan !== 'SEMUA' || selectedKesimpulan !== 'SEMUA') && (
            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  Menampilkan <strong className="text-foreground">{filtered.length}</strong> dari{' '}
                  <strong className="text-foreground">{initialList.length}</strong> data pengujian
                  <span className="text-primary font-medium ml-1">(Hasil Filter)</span>
                </span>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedKecamatan('SEMUA');
                  setSelectedKesimpulan('SEMUA');
                }}
                className="h-6 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Reset Filter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold">Nomor Sampel</TableHead>
                <TableHead className="text-xs font-semibold">Waktu Uji & Petugas</TableHead>
                <TableHead className="text-xs font-semibold">Titik Kolam Pokdakan</TableHead>
                <TableHead className="text-xs font-semibold">Ringkasan Parameter</TableHead>
                <TableHead className="text-xs font-semibold text-center">Kesimpulan Mutu</TableHead>
                <TableHead className="text-xs font-semibold text-right">LHU & Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground text-xs">
                    <TestTube2 className="size-8 mx-auto mb-2 opacity-40 text-primary" />
                    <p className="font-semibold text-foreground">Belum ada data pengujian kualitas air.</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Klik tombol &ldquo;Input Hasil Uji Baru&rdquo; untuk merekam uji pertama.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => {
                  const isExpanded = expandedId === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      <TableRow className="hover:bg-muted/30">
                        <TableCell className="font-mono font-bold text-primary text-xs">
                          {item.nomor_sampel}
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="text-foreground font-medium flex items-center gap-1.5">
                            <Calendar className="size-3 text-primary" />
                            {new Date(item.tanggal_pengambilan).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
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
                            <MapPin className="size-3 text-primary" />
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
                                {dp.bakuMutu?.parameter.split(' ')[0]}: {dp.nilai_hasil}
                              </Badge>
                            ))}
                            {item.detailParameters.length > 3 && (
                              <Badge variant="outline" className="text-xs py-0 px-1 font-mono">
                                +{item.detailParameters.length - 3} lainnya
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <BadgeStatus status={item.kesimpulan || 'NORMAL'} size="sm" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setExpandedId(isExpanded ? null : item.id)}
                              title={isExpanded ? 'Tutup Rincian' : 'Buka Rincian Parameter'}
                              className="size-7"
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
                                className="h-7 text-xs gap-1"
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
                            <Card className="border-border bg-card shadow-xs">
                              <CardHeader className="py-2.5 px-4 border-b">
                                <CardTitle className="text-xs font-semibold flex items-center justify-between">
                                  <span>Rincian Lengkap Hasil Uji Sampel #{item.nomor_sampel}</span>
                                  <span className="text-muted-foreground font-normal">
                                    SOP: {item.instruksiKerja?.kode_ik || '-'} • {item.instruksiKerja?.judul || '-'}
                                  </span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs mb-3">
                                  {item.detailParameters.map((dp) => (
                                    <div
                                      key={dp.id}
                                      className="p-2.5 rounded-lg border border-border bg-muted/40"
                                    >
                                      <p className="font-semibold text-foreground text-xs">
                                        {dp.bakuMutu?.parameter}
                                      </p>
                                      <div className="flex items-baseline justify-between mt-1">
                                        <span className="text-base font-bold font-mono text-primary">
                                          {dp.nilai_hasil}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-mono">
                                          {dp.bakuMutu?.satuan}
                                        </span>
                                      </div>
                                      <div className="mt-1.5">
                                        <BadgeStatus
                                          status={dp.status_kelayakan || 'NORMAL'}
                                          size="sm"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {item.catatan_lapangan && (
                                  <div className="text-xs text-muted-foreground border-t pt-2">
                                    <span className="font-semibold text-foreground">Catatan Petugas: </span>
                                    {item.catatan_lapangan}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
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
    </div>
  );
}
