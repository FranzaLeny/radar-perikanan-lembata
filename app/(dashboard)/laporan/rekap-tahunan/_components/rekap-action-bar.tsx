import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RekapActionBarProps {
  tahunAnggaran: number;
  filterTahun: boolean;
  onOpenSettings: () => void;
  onPrint: () => void;
}

export function RekapActionBar({
  tahunAnggaran,
  filterTahun,
  onOpenSettings,
  onPrint,
}: RekapActionBarProps) {
  return (
    <div className="print:hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-muted/40 p-4 rounded-xl border border-border">
      <div className="flex items-center gap-3">
        <Link href="/laporan">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs cursor-pointer">
            <ArrowLeft className="size-4" />
            <span>Kembali ke Laporan</span>
          </Button>
        </Link>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono font-bold">
            TA {tahunAnggaran}
          </Badge>
          {filterTahun && (
            <Badge variant="secondary" className="text-[11px]">
              Tersaring Tahun Ini
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSettings}
          className="gap-2 text-xs cursor-pointer"
        >
          <Settings2 className="size-3.5" />
          <span>Pengaturan Cetak</span>
        </Button>

        <Button
          onClick={onPrint}
          size="sm"
          className="gap-2 text-xs font-semibold cursor-pointer shadow-xs"
        >
          <Printer className="size-3.5" />
          <span>Cetak Dokumen (A4 Landscape)</span>
        </Button>
      </div>
    </div>
  );
}
