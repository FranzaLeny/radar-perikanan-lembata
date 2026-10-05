import React from 'react';
import { Search, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UjiFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedKecamatan: string;
  setSelectedKecamatan: (kec: string) => void;
  selectedKesimpulan: string;
  setSelectedKesimpulan: (kes: string) => void;
  filteredCount: number;
  totalCount: number;
  onReset: () => void;
}

export function UjiFilterBar({
  searchTerm,
  setSearchTerm,
  selectedKecamatan,
  setSelectedKecamatan,
  selectedKesimpulan,
  setSelectedKesimpulan,
  filteredCount,
  totalCount,
  onReset,
}: UjiFilterBarProps) {
  const isFiltered =
    searchTerm.trim() !== '' ||
    selectedKecamatan !== 'SEMUA' ||
    selectedKesimpulan !== 'SEMUA';

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardContent className="p-3.5 space-y-3 text-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <InputGroup className="flex-1">
            <InputGroupAddon align="inline-start">
              <Search className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nomor sampel, Pokdakan, desa, atau petugas..."
            />
            {searchTerm && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  onClick={() => setSearchTerm('')}
                  title="Hapus pencarian"
                >
                  <X className="size-3.5" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground text-xs whitespace-nowrap">
                Kecamatan:
              </span>
              <Select
                value={selectedKecamatan}
                onValueChange={(val) => val && setSelectedKecamatan(val)}
              >
                <SelectTrigger size="sm" className="w-[140px]">
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
              <span className="text-muted-foreground text-xs whitespace-nowrap">
                Status:
              </span>
              <Select
                value={selectedKesimpulan}
                onValueChange={(val) => val && setSelectedKesimpulan(val)}
              >
                <SelectTrigger size="sm" className="w-[130px]">
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
        {isFiltered && (
          <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                Menampilkan{' '}
                <strong className="text-foreground">{filteredCount}</strong>{' '}
                dari{' '}
                <strong className="text-foreground">{totalCount}</strong> data
                pengujian
                <span className="text-muted-foreground font-medium ml-1">
                  (Hasil Filter)
                </span>
              </span>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={onReset}
              className="h-6 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
