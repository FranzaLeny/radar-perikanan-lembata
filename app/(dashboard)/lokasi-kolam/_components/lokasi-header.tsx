import React from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LokasiHeaderProps {
  onOpenAdd: () => void;
}

export function LokasiHeader({ onOpenAdd }: LokasiHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Badge
          variant="secondary"
          className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-xs font-semibold uppercase tracking-wider"
        >
          <MapPin className="size-3" />
          <span>Master Data Wilayah</span>
        </Badge>
        <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
          Lokasi Kolam Pembudidaya (Pokdakan)
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Kelola data kelompok pembudidaya ikan, sebaran titik kolam pemantauan, dan komoditas per kecamatan di Kabupaten Lembata.
        </p>
      </div>

      <Button onClick={onOpenAdd} className="gap-2 shadow-xs self-start sm:self-auto cursor-pointer">
        <Plus className="size-4" />
        <span>Tambah Lokasi Kolam</span>
      </Button>
    </div>
  );
}
