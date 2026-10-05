import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MasterBakuMutuItem } from '../types';

interface DashboardBakuMutuCardProps {
  items: MasterBakuMutuItem[];
}

export function DashboardBakuMutuCard({ items }: DashboardBakuMutuCardProps) {
  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShieldCheck className="size-4 text-muted-foreground" />
            <span>Baku Mutu Aktif (SNI/KKP)</span>
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Ambang batas mutu air acuan
          </CardDescription>
        </div>
        <Link href="/baku-mutu">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs text-foreground font-semibold h-7 px-2 cursor-pointer"
          >
            <span>Kelola</span>
            <ArrowRight className="size-3" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="pt-4 space-y-2.5">
        {items.map((bm) => (
          <div
            key={bm.id}
            className="p-3 rounded-xl bg-muted/30 border border-border flex items-center justify-between text-xs"
          >
            <div>
              <p className="font-semibold text-foreground">{bm.parameter}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ambang:{' '}
                <span className="font-mono text-foreground font-medium">
                  {bm.nilai_min !== null && bm.nilai_max !== null
                    ? `${bm.nilai_min} – ${bm.nilai_max}`
                    : bm.nilai_min !== null
                    ? `≥ ${bm.nilai_min}`
                    : bm.nilai_max !== null
                    ? `≤ ${bm.nilai_max}`
                    : '-'}
                </span>
              </p>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {bm.satuan}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
