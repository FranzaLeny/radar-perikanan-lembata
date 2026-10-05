import React from 'react';
import { Search, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group';
import type { KategoriItem, DokumenMutuItem } from '../types';

interface DokumenFilterBarProps {
  selectedKategoriTab: string;
  onTabChange: (val: string) => void;
  kategoriList: KategoriItem[];
  list: DokumenMutuItem[];
  filteredCount: number;
  totalCount: number;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onResetSearch: () => void;
}

export function DokumenFilterBar({
  selectedKategoriTab,
  onTabChange,
  kategoriList,
  list,
  filteredCount,
  totalCount,
  searchTerm,
  onSearchChange,
  onResetSearch,
}: DokumenFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <Tabs value={selectedKategoriTab} onValueChange={onTabChange}>
        <TabsList className="h-9">
          <TabsTrigger value="all" className="text-xs gap-1.5">
            <span>Semua Dokumen</span>
            <Badge variant="secondary" className="text-[11px] px-1 py-0">
              {totalCount}
            </Badge>
          </TabsTrigger>
          {kategoriList.map((kat) => {
            const count = list.filter(
              (d) =>
                d.kategoriDokumen?.kode_kategori === kat.kode_kategori ||
                d.kategori_id === kat.id ||
                d.kode_ik.startsWith(`${kat.kode_kategori}-`)
            ).length;

            return (
              <TabsTrigger key={kat.id} value={kat.kode_kategori} className="text-xs gap-1.5">
                <span>{kat.nama_kategori}</span>
                <Badge variant="outline" className="text-[11px] px-1 py-0">
                  {count}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <InputGroup className="w-full sm:w-72">
          <InputGroupAddon align="inline-start">
            <Search className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari kode, judul, metode, parameter..."
          />
          {searchTerm && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                size="icon-xs"
                onClick={onResetSearch}
                title="Hapus pencarian"
              >
                <X className="size-3.5" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        {filteredCount < totalCount ? (
          <Badge variant="secondary" className="text-xs py-0.5 shrink-0">
            {filteredCount} dari {totalCount}
          </Badge>
        ) : null}
      </div>
    </div>
  );
}
