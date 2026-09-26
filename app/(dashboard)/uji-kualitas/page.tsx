import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc } from 'drizzle-orm';
import { UjiKualitasListClient } from './client';

export default async function UjiKualitasPage() {
  const ujiList = await db.query.ujiKualitasAir.findMany({
    orderBy: [desc(schema.ujiKualitasAir.tanggal_pengambilan)],
    with: {
      lokasi: true,
      instruksiKerja: true,
      detailParameters: {
        with: {
          bakuMutu: true,
        },
      },
    },
  });

  return <UjiKualitasListClient initialList={ujiList} />;
}
