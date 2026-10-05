import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group';
import type { StatusTabType, UjiLaporanItem } from '../types';

interface LaporanFilterBarProps {
  statusTab: StatusTabType;
  setStatusTab: (val: StatusTabType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  list: UjiLaporanItem[];
  isFiltered: boolean;
  onReset: () => void;
}

export function LaporanFilterBar({
  statusTab,
  setStatusTab,
  searchQuery,
  setSearchQuery,
  list,
  isFiltered,
  onReset,
}: LaporanFilterBarProps) {
  const allCount = list.length;
  const draftCount = list.filter((x) => (x.status || 'draft') === 'draft').length;
  const finalCount = list.filter((x) => x.status === 'final').length;
  const arsipCount = list.filter((x) => x.status === 'arsip').length;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <Tabs
        value={statusTab}
        onValueChange={(val) => setStatusTab((val as StatusTabType) || 'all')}
      >
        <TabsList>
          <TabsTrigger value="all" className="text-xs gap-1.5 cursor-pointer">
            <span>Semua Dokumen</span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {allCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="draft" className="text-xs gap-1.5 cursor-pointer">
            <span>Draft</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {draftCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="final" className="text-xs gap-1.5 cursor-pointer">
            <span>Final</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {finalCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="arsip" className="text-xs gap-1.5 cursor-pointer">
            <span>Arsip</span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {arsipCount}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <InputGroup className="w-full sm:w-72">
          <InputGroupAddon align="inline-start">
            <Search className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Pokdakan, nomor LHU, penguji..."
          />
          {searchQuery && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                size="icon-xs"
                onClick={() => setSearchQuery('')}
                title="Hapus pencarian"
              >
                <X className="size-3.5" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        {isFiltered && (
          <Button
            variant="ghost"
            size="xs"
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
