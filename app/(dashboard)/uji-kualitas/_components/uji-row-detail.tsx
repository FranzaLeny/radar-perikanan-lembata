import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BadgeStatus } from '@/components/badge-status';
import type { UjiItem } from '../types';

interface UjiRowDetailProps {
  item: UjiItem;
}

export function UjiRowDetail({ item }: UjiRowDetailProps) {
  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="py-2.5 px-4 border-b">
        <CardTitle className="text-xs font-semibold flex items-center justify-between">
          <span>Rincian Lengkap Hasil Uji Sampel #{item.nomor_sampel}</span>
          <span className="text-muted-foreground font-normal">
            SOP: {item.instruksiKerja?.kode_ik || '-'} •{' '}
            {item.instruksiKerja?.judul || '-'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs mb-3">
          {item.detailParameters.map((dp) => (
            <div
              key={dp.id}
              className="p-2.5 rounded-lg border border-border bg-muted/40"
            >
              <p className="font-semibold text-foreground text-xs">
                {dp.bakuMutu?.parameter}
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-base font-bold font-mono text-foreground">
                  {dp.nilai_hasil}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {dp.bakuMutu?.satuan}
                </span>
              </div>
              <div className="mt-1.5">
                <BadgeStatus
                  status={dp.status_kelayakan || 'NORMAL'}
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
        {item.catatan_lapangan && (
          <div className="text-xs text-muted-foreground border-t pt-2">
            <span className="font-semibold text-foreground">
              Catatan Petugas:{' '}
            </span>
            {item.catatan_lapangan}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
