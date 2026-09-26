import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc } from 'drizzle-orm';
import { InstruksiKerjaClient } from './client';

export default async function InstruksiKerjaPage() {
  const ikList = await db.query.instruksiKerja.findMany({
    orderBy: [desc(schema.instruksiKerja.createdAt)],
  });

  return <InstruksiKerjaClient initialList={ikList} />;
}
