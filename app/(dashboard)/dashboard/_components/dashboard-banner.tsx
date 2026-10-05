import React from 'react';
import Link from 'next/link';
import { Droplets, Plus, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { APP_CONFIG } from '@/lib/constants';

export function DashboardBanner() {
  return (
    <Card className="border-border bg-card p-6 sm:p-8 shadow-xs">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <Badge
            variant="secondary"
            className="gap-1.5 px-3 py-1 mb-3 text-xs font-semibold"
          >
            <Droplets className="size-3.5" />
            <span>{APP_CONFIG.institution.name}</span>
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight leading-tight text-foreground">
            {APP_CONFIG.fullName} ({APP_CONFIG.name})
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
            Monitoring parameter fisika-kimia kolam perikanan secara terintegrasi dengan validasi otomatis ambang batas baku mutu dan ketertelusuran QR Code.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
          <Link href="/uji-kualitas/input">
            <Button className="gap-2 shadow-xs cursor-pointer">
              <Plus className="size-4" />
              <span>Input Uji Baru</span>
            </Button>
          </Link>
          <Link href="/tren">
            <Button variant="outline" className="gap-2 cursor-pointer">
              <TrendingUp className="size-4" />
              <span>Analisis Tren</span>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
