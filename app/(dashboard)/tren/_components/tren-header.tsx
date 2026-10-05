import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function TrenHeader() {
  return (
    <div>
      <Badge
        variant="secondary"
        className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-xs font-semibold uppercase tracking-wider"
      >
        <TrendingUp className="size-3" />
        <span>Analisis & Visualisasi Tren</span>
      </Badge>
      <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
        Visualisasi Tren Mutu Air Lapangan
      </h1>
      <p className="text-xs text-muted-foreground mt-1">
        Pantau perubahan kualitas air dari waktu ke waktu per parameter terhadap ambang batas baku mutu resmi.
      </p>
    </div>
  );
}
