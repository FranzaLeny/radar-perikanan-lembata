import React from 'react';
import { desc, count, eq } from 'drizzle-orm';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { DashboardBanner } from './_components/dashboard-banner';
import { DashboardKpiGrid } from './_components/dashboard-kpi-grid';
import { DashboardBakuMutuCard } from './_components/dashboard-baku-mutu-card';
import { DashboardRecentTestsCard } from './_components/dashboard-recent-tests-card';

export default async function DashboardMainPage() {
  // Query data statistik
  const [allUji, totalPokdakan, totalIk, bakuMutuAktif] = await Promise.all([
    db.query.ujiKualitasAir.findMany({
      orderBy: [desc(schema.ujiKualitasAir.tanggal_pengambilan)],
      limit: 5,
      with: {
        lokasi: true,
        detailParameters: {
          with: {
            bakuMutu: true,
          },
        },
      },
    }),
    db.select({ count: count() }).from(schema.lokasiKolam),
    db.select({ count: count() }).from(schema.instruksiKerja),
    db.query.masterBakuMutu.findMany({
      where: eq(schema.masterBakuMutu.aktif, true),
      limit: 5,
    }),
  ]);

  // Hitung agregat kesimpulan
  const totalUjiCount = allUji.length;
  let normalCount = 0;
  let warningCount = 0;
  let criticalCount = 0;

  allUji.forEach((u) => {
    if (u.kesimpulan === 'NORMAL') normalCount++;
    else if (u.kesimpulan === 'PERINGATAN') warningCount++;
    else if (u.kesimpulan === 'KRITIS') criticalCount++;
  });

  const complianceRate =
    totalUjiCount > 0 ? Math.round((normalCount / totalUjiCount) * 100) : 100;

  return (
    <div className="space-y-6">
      <DashboardBanner />

      <DashboardKpiGrid
        complianceRate={complianceRate}
        normalCount={normalCount}
        totalUjiCount={totalUjiCount}
        criticalCount={criticalCount}
        warningCount={warningCount}
        totalPokdakan={totalPokdakan[0]?.count || 0}
        totalIk={totalIk[0]?.count || 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardBakuMutuCard items={bakuMutuAktif} />
        <DashboardRecentTestsCard items={allUji} />
      </div>
    </div>
  );
}
