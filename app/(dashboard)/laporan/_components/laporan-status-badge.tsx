import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Archive, FileEdit } from 'lucide-react';

interface LaporanStatusBadgeProps {
  status?: string;
}

export function LaporanStatusBadge({ status }: LaporanStatusBadgeProps) {
  const s = status || 'draft';
  switch (s) {
    case 'final':
      return (
        <Badge className="bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25 text-[11px] gap-1 font-semibold">
          <CheckCircle className="size-3 text-emerald-600 dark:text-emerald-400" />
          Final
        </Badge>
      );
    case 'arsip':
      return (
        <Badge variant="secondary" className="text-[11px] gap-1 text-muted-foreground">
          <Archive className="size-3" />
          Arsip
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-[11px] gap-1 font-semibold"
        >
          <FileEdit className="size-3" />
          Draft
        </Badge>
      );
  }
}
