import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { LokasiKolamClient } from './client';

export default async function LokasiKolamPage() {
  const lokasiList = await db.query.lokasiKolam.findMany({
    orderBy: [schema.lokasiKolam.kecamatan, schema.lokasiKolam.nama_pokdakan],
  });

  return <LokasiKolamClient initialList={lokasiList} />;
}
