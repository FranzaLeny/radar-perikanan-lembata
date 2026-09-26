'use client';

import React from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PrintButton({ label = 'Cetak Dokumen' }: { label?: string }) {
  return (
    <Button
      variant="default"
      size="sm"
      onClick={() => window.print()}
      className="gap-2 shadow-xs cursor-pointer no-print font-medium"
    >
      <Printer className="size-4" />
      <span>{label}</span>
    </Button>
  );
}
