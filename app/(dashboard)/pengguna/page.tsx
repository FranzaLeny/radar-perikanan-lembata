import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PenggunaClient } from './client';
import { ShieldAlert } from 'lucide-react';

export default async function PenggunaPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    return (
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-8 text-center max-w-md mx-auto my-12">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white">Akses Ditolak (403 Forbidden)</h2>
        <p className="text-xs text-slate-400 mt-2">
          Halaman Manajemen Pengguna ini hanya dapat diakses oleh akun dengan peran Administrator.
        </p>
      </div>
    );
  }

  const [users, allUji] = await Promise.all([
    db.query.user.findMany({
      orderBy: [schema.user.role, schema.user.name],
    }),
    db.select({
      petugas_uji: schema.ujiKualitasAir.petugas_uji,
    }).from(schema.ujiKualitasAir),
  ]);

  const enrichedUsers = users.map((u) => {
    const uName = u.name.trim().toLowerCase();
    const uEmail = u.email.trim().toLowerCase();
    const uId = u.id.trim().toLowerCase();
    const count = allUji.filter((uji) => {
      const p = uji.petugas_uji?.trim().toLowerCase();
      return p === uName || p === uEmail || p === uId;
    }).length;

    return {
      ...u,
      transactionCount: count,
      isUsed: count > 0,
    };
  });

  return <PenggunaClient initialUsers={enrichedUsers} currentUserId={user.id} />;
}
