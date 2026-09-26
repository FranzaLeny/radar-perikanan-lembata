import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc } from 'drizzle-orm';
import {
  FileSpreadsheet,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { LaporanTableClient } from './laporan-table-client';
export default async function LaporanHubPage() {
  const [allUji, allPokdakan] = await Promise.all([
    db.query.ujiKualitasAir.findMany({
      orderBy: [desc(schema.ujiKualitasAir.tanggal_pengambilan)],
      with: {
        lokasi: true,
      },
    }),
    db.query.lokasiKolam.findMany(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">
          <FileSpreadsheet className="size-4" />
          <span>Modul Pelaporan & Diseminasi</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
          Pusat Laporan & Rekapitulasi Mutu Air
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Penerbitan Lembar Hasil Uji (LHU) resmi dan rekapitulasi kepatuhan mutu tahunan untuk Dinas Perikanan Kabupaten Lembata.
        </p>
      </div>

      {/* Featured Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Rekap Tahunan */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="size-10 rounded-xl bg-muted text-foreground flex items-center justify-center mb-2">
              <FileSpreadsheet className="size-5" />
            </div>
            <CardTitle className="text-base font-heading">
              Matriks Rekapitulasi Tahunan Mutu Air (2026)
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Tabel matriks kepatuhan kualitas air per Pokdakan per bulan untuk bahan evaluasi kepala dinas dan laporan pertanggungjawaban program perikanan budidaya.
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-2">
            <Link href="/laporan/rekap-tahunan" className="w-full sm:w-auto">
              <Button size="sm" className="gap-2 font-medium w-full sm:w-auto">
                <span>Buka Matriks Rekap Tahunan</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Card 2: Laporan Evaluasi Terkini */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mb-2">
              <TrendingUp className="size-5" />
            </div>
            <CardTitle className="text-base font-heading">
              Analisis Fluktuasi Parameter
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Lihat visualisasi pergerakan parameter utama (Suhu, pH, DO, Amonia, Nitrit) terhadap batas aman regulasi PP No. 22 Tahun 2021.
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-2">
            <Link href="/tren" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="gap-2 font-medium w-full sm:w-auto">
                <span>Buka Analisis Grafik Tren</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Tabel Penerbitan LHU Siap Cetak (Interaktif dengan Pencarian Lokasi & Kode Sampel) */}
      <LaporanTableClient initialList={allUji} />
    </div>
  );
}
