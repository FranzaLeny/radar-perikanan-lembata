import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { FormUjiLapangan } from '@/components/form-uji-lapangan';
import { getCurrentUser } from '@/lib/auth';
import { TestTube2, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function InputUjiKualitasPage({
  searchParams,
}: {
  searchParams: Promise<{ ik_id?: string; lokasi_id?: string }>;
}) {
  const { ik_id, lokasi_id } = await searchParams;
  const user = await getCurrentUser();

  const [lokasiList, ikList, bakuMutuList, pegawaiList] = await Promise.all([
    db.query.lokasiKolam.findMany({
      orderBy: [schema.lokasiKolam.kecamatan, schema.lokasiKolam.nama_pokdakan],
    }),
    db.query.instruksiKerja.findMany({
      orderBy: [desc(schema.instruksiKerja.createdAt)],
    }),
    // Muat semua baku mutu (aktif diutamakan, riwayat/arsip tetap tersedia sesuai kebutuhan uji)
    db.query.masterBakuMutu.findMany({
      orderBy: [desc(schema.masterBakuMutu.aktif), schema.masterBakuMutu.parameter],
    }),
    // Muat master pegawai aktif untuk penguji dan penandatangan LHU
    db.query.masterPegawai.findMany({
      where: eq(schema.masterPegawai.aktif, true),
      orderBy: [schema.masterPegawai.nama],
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/uji-kualitas">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="size-4" />
              <span>Kembali ke Riwayat Pengujian</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider">
              <TestTube2 className="size-3" />
              <span>Entri Sampling Lapangan</span>
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading mt-1.5">
            Formulir Pengujian Kualitas Air
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Input hasil parameter fisika & kimia air budidaya. Pengguna bebas menentukan parameter yang diukur, menambah lokasi kolam baru secara instan, dan memilih SOP terarsip atau manual.
          </p>
        </div>
      </div>

      <FormUjiLapangan
        lokasiList={lokasiList}
        ikList={ikList}
        bakuMutuList={bakuMutuList}
        pegawaiList={pegawaiList}
        prefilledIkId={ik_id}
        prefilledLokasiId={lokasi_id}
        currentOfficerName={user?.name || 'Petugas Uji Lapangan'}
      />
    </div>
  );
}
