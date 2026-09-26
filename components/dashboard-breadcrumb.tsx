'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const routeLabels: Record<string, { parent?: string; title: string }> = {
  '/dashboard': { title: 'Dashboard Utama' },
  '/uji-kualitas': { parent: 'Operasional', title: 'Daftar Hasil Uji' },
  '/uji-kualitas/input': { parent: 'Uji Kualitas Air', title: 'Input Uji Lapangan' },
  '/instruksi-kerja': { parent: 'Operasional', title: 'Instruksi Kerja & Jadwal Sampel' },
  '/lokasi-kolam': { parent: 'Master Data', title: 'Lokasi Kolam Pembudidaya' },
  '/baku-mutu': { parent: 'Master Data', title: 'Baku Mutu Air SNI & KKP' },
  '/pengguna': { parent: 'Master Data', title: 'Manajemen Pengguna' },
  '/tren': { parent: 'Analitik', title: 'Grafik Tren Mutu Air' },
  '/laporan': { parent: 'Laporan', title: 'Laporan Hasil Uji (LHU)' },
  '/laporan/rekap-tahunan': { parent: 'Laporan', title: 'Rekapitulasi Tahunan' },
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const current = routeLabels[pathname] || { title: 'Sistem Informasi Mutu Air' };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard" className="text-xs">
            SIPEKA
          </BreadcrumbLink>
        </BreadcrumbItem>
        {current.parent && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <span className="text-xs text-muted-foreground">{current.parent}</span>
            </BreadcrumbItem>
          </>
        )}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-xs font-medium text-foreground">
            {current.title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
