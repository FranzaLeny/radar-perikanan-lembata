import React from 'react';
import Link from 'next/link';
import { TestTube2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function UjiHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Badge
          variant="secondary"
          className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-xs font-semibold uppercase tracking-wider"
        >
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
        <Button className="gap-2 shadow-xs self-start sm:self-auto cursor-pointer">
          <Plus className="size-4" />
          <span>Input Hasil Uji Baru</span>
        </Button>
      </Link>
    </div>
  );
}
