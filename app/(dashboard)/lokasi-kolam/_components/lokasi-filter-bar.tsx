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
import type { FilterTab } from '../types';

interface LokasiFilterBarProps {
  filterTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  activeCount: number;
  inactiveCount: number;
  totalCount: number;
  filteredCount: number;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onResetSearch: () => void;
}

export function LokasiFilterBar({
  filterTab,
  onTabChange,
  activeCount,
  inactiveCount,
  totalCount,
  filteredCount,
  searchTerm,
  onSearchChange,
  onResetSearch,
}: LokasiFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <Tabs value={filterTab} onValueChange={(val) => onTabChange(val as FilterTab)}>
        <TabsList>
          <TabsTrigger value="active" className="text-xs gap-2">
            <span>Aktif Digunakan</span>
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {activeCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="inactive" className="text-xs gap-2">
            <span>Nonaktif / Arsip</span>
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              {inactiveCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="all" className="text-xs gap-2">
            <span>Semua Data</span>
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              {totalCount}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search Input */}
      <div className="flex items-center gap-2">
        <InputGroup className="w-full sm:w-72">
          <InputGroupAddon align="inline-start">
            <Search className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari Pokdakan, pemilik, desa..."
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
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant="secondary" className="text-xs py-0.5">
              {filteredCount} dari {totalCount}
            </Badge>
            <Button
              variant="ghost"
              size="xs"
              onClick={onResetSearch}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Reset
            </Button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline">
            Total: <strong className="text-foreground">{totalCount}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
