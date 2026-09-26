import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import { TrenClient } from './client';

export default async function TrenPage() {
  const [bakuMutuList, lokasiList, allUjiWithDetails] = await Promise.all([
    db.query.masterBakuMutu.findMany({
      where: eq(schema.masterBakuMutu.aktif, true),
      orderBy: [schema.masterBakuMutu.parameter],
    }),
    db.query.lokasiKolam.findMany({
      orderBy: [schema.lokasiKolam.nama_pokdakan],
    }),
    db.query.ujiKualitasAir.findMany({
      orderBy: [asc(schema.ujiKualitasAir.tanggal_pengambilan)],
      with: {
        lokasi: true,
        detailParameters: {
          with: {
            bakuMutu: true,
          },
        },
      },
    }),
  ]);

  return (
    <TrenClient
      bakuMutuList={bakuMutuList}
      lokasiList={lokasiList}
      ujiList={allUjiWithDetails}
    />
  );
}
