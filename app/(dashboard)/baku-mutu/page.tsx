import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc } from 'drizzle-orm';
import { BakuMutuClient } from './client';

export default async function BakuMutuPage() {
  const bakuMutuList = await db.query.masterBakuMutu.findMany({
    orderBy: [desc(schema.masterBakuMutu.aktif), schema.masterBakuMutu.parameter],
  });

  return <BakuMutuClient initialList={bakuMutuList} />;
}
