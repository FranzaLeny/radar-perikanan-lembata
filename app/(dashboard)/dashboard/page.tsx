import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc, count, eq } from 'drizzle-orm';
import {
  TestTube2,
  CheckCircle2,
  AlertOctagon,
  MapPin,
  FileCheck2,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldCheck,
  Droplets,
  Printer,
} from 'lucide-react';
import Link from 'next/link';
import { BadgeStatus } from '@/components/badge-status';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export default async function DashboardMainPage() {
  // Query data statistik
  const [
    allUji,
    totalPokdakan,
    totalIk,
    bakuMutuAktif,
  ] = await Promise.all([
    db.query.ujiKualitasAir.findMany({
      orderBy: [desc(schema.ujiKualitasAir.tanggal_pengambilan)],
      limit: 5,
      with: {
        lokasi: true,
        detailParameters: {
          with: {
            bakuMutu: true,
          },
        },
      },
    }),
    db.select({ count: count() }).from(schema.lokasiKolam),
    db.select({ count: count() }).from(schema.instruksiKerja),
    db.query.masterBakuMutu.findMany({
      where: eq(schema.masterBakuMutu.aktif, true),
      limit: 5
    }),
  ]);

  // Hitung agregat kesimpulan
  const totalUjiCount = allUji.length;
  let normalCount = 0;
  let warningCount = 0;
  let criticalCount = 0;

  allUji.forEach((u) => {
    if (u.kesimpulan === 'NORMAL') normalCount++;
    else if (u.kesimpulan === 'PERINGATAN') warningCount++;
    else if (u.kesimpulan === 'KRITIS') criticalCount++;
  });

  const complianceRate =
    totalUjiCount > 0 ? Math.round((normalCount / totalUjiCount) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="relative overflow-hidden border-border bg-gradient-to-r from-card via-primary/5 to-card p-6 sm:p-8 shadow-xs">
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <Badge variant="outline" className="gap-1.5 px-3 py-1 mb-3 border-primary/30 bg-primary/10 text-primary text-xs font-semibold">
              <Droplets className="size-3.5" />
              <span>Dinas Perikanan Kabupaten Lembata</span>
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight leading-tight text-foreground">
              Sistem Pemantauan Kualitas Air Budidaya
              (SIPEKA)
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
              Monitoring parameter fisika-kimia kolam perikanan secara terintegrasi dengan validasi otomatis ambang batas baku mutu dan ketertelusuran QR Code.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Link href="/uji-kualitas/input">
              <Button className="gap-2 shadow-xs">
                <Plus className="size-4" />
                <span>Input Uji Baru</span>
              </Button>
            </Link>
            <Link href="/tren">
              <Button variant="outline" className="gap-2">
                <TrendingUp className="size-4" />
                <span>Analisis Tren</span>
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tingkat Kepatuhan */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Tingkat Kepatuhan Mutu
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-heading text-foreground">
                {complianceRate}%
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Kondisi Normal
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {normalCount} dari {totalUjiCount} pengujian dalam batas aman.
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Pengujian Kritis / Melebihi */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Sampel Perlu Perhatian
            </CardTitle>
            <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
              <AlertOctagon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-heading text-foreground">
                {criticalCount + warningCount}
              </span>
              <span className="text-xs text-destructive font-medium">
                Sampel Kritis/Waspada
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {criticalCount} Kritis • {warningCount} Peringatan
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Pokdakan Terpantau */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Titik Kolam Pokdakan
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <MapPin className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-heading text-foreground">
                {totalPokdakan[0]?.count || 0}
              </span>
              <span className="text-xs text-primary font-medium">
                Kelompok
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tersebar di 9 Kecamatan Kabupaten Lembata
            </p>
          </CardContent>
        </Card>

        {/* Card 4: SOP / IK Aktif */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Instruksi Kerja (IK)
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FileCheck2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-heading text-foreground">
                {totalIk[0]?.count || 0}
              </span>
              <span className="text-xs text-primary font-medium">
                SOP Terverifikasi
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Terkoneksi ke sistem QR Code publik
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Baku Mutu Acuan & Recent Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Standar Baku Mutu Aktif */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <span>Baku Mutu Aktif (SNI/KKP)</span>
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Ambang batas mutu air acuan
              </CardDescription>
            </div>
            <Link href="/baku-mutu">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary font-semibold h-7 px-2">
                <span>Kelola</span>
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="pt-4 space-y-2.5">
            {bakuMutuAktif.map((bm) => (
              <div
                key={bm.id}
                className="p-3 rounded-xl bg-muted/30 border border-border flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-foreground">{bm.parameter}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ambang:{' '}
                    <span className="font-mono text-primary font-medium">
                      {bm.nilai_min !== null && bm.nilai_max !== null
                        ? `${bm.nilai_min} – ${bm.nilai_max}`
                        : bm.nilai_min !== null
                          ? `≥ ${bm.nilai_min}`
                          : bm.nilai_max !== null
                            ? `≤ ${bm.nilai_max}`
                            : '-'}
                    </span>
                  </p>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  {bm.satuan}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Kolom Kanan: 10 Pengujian Terbaru */}
        <Card className="lg:col-span-2 border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TestTube2 className="size-4 text-primary" />
                <span>Hasil Uji Mutu Air Terbaru</span>
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                10 riwayat pengujian sampel laboratorium terakhir
              </CardDescription>
            </div>
            <Link href="/uji-kualitas">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary font-semibold h-7 px-2">
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
                    <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUji.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                        Belum ada rekaman data uji kualitas air.
                      </TableCell>
                    </TableRow>
                  ) : (
                    allUji.map((u) => {
                      const tgl = new Date(u.tanggal_pengambilan).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      });

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
                            <BadgeStatus status={u.kesimpulan || 'NORMAL'} size="sm" />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`/laporan/${u.id}/cetak`}>
                                <Button variant="ghost" size="icon-sm" title="Cetak LHU" className="size-7">
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
      </div>
    </div>
  );
}
