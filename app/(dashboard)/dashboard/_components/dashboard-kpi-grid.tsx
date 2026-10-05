import React from 'react';
import {
  CheckCircle2,
  AlertOctagon,
  MapPin,
  FileCheck2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { DashboardKpiProps } from '../types';

export function DashboardKpiGrid({
  complianceRate,
  normalCount,
  totalUjiCount,
  criticalCount,
  warningCount,
  totalPokdakan,
  totalIk,
}: DashboardKpiProps) {
  return (
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
          <div className="p-2 rounded-lg bg-muted text-foreground">
            <MapPin className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-heading text-foreground">
              {totalPokdakan}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
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
          <div className="p-2 rounded-lg bg-muted text-foreground">
            <FileCheck2 className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-heading text-foreground">
              {totalIk}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              SOP Terverifikasi
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Terkoneksi ke sistem QR Code publik
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
