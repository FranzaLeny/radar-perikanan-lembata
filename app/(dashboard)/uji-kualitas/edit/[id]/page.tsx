import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { FormUjiLapangan } from '@/components/form-uji-lapangan';
import { getCurrentUser } from '@/lib/auth';
import { TestTube2, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Edit Hasil Uji Kualitas Air — SIPEKA',
};

export default async function EditUjiKualitasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  const [uji, lokasiList, ikList, bakuMutuList, pegawaiList] = await Promise.all([
    db.query.ujiKualitasAir.findFirst({
      where: eq(schema.ujiKualitasAir.id, id),
      with: {
        detailParameters: true,
      },
    }),
    db.query.lokasiKolam.findMany({
      orderBy: [schema.lokasiKolam.kecamatan, schema.lokasiKolam.nama_pokdakan],
    }),
    db.query.instruksiKerja.findMany({
      orderBy: [desc(schema.instruksiKerja.createdAt)],
    }),
    db.query.masterBakuMutu.findMany({
      orderBy: [desc(schema.masterBakuMutu.aktif), schema.masterBakuMutu.parameter],
    }),
    db.query.masterPegawai.findMany({
      where: eq(schema.masterPegawai.aktif, true),
      orderBy: [schema.masterPegawai.nama],
    }),
  ]);

  if (!uji) {
    notFound();
  }

  // Hanya status 'draft' yang boleh diedit
  if (uji.status !== 'draft') {
    redirect('/laporan');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/laporan">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="size-4" />
              <span>Kembali ke Pusat Laporan</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider">
              <TestTube2 className="size-3" />
              <span>Mode Edit Dokumen Draft</span>
            </Badge>
            <Badge variant="outline" className="text-xs font-mono">
              {uji.nomor_sampel}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading mt-1.5">
            Perbarui Data Pengujian Kualitas Air
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Ubah data parameter lapangan, catatan observasi, atau penandatangan sebelum dokumen difinalkan dan diarsipkan.
          </p>
        </div>
      </div>

      <FormUjiLapangan
        mode="edit"
        existingUji={{
          id: uji.id,
          nomor_sampel: uji.nomor_sampel,
          lokasi_id: uji.lokasi_id || '',
          ik_id: uji.ik_id,
          tanggal_pengambilan: uji.tanggal_pengambilan,
          petugas_uji: uji.petugas_uji,
          penguji_pegawai_id: uji.penguji_pegawai_id,
          penandatangan_pegawai_id: uji.penandatangan_pegawai_id,
          catatan_lapangan: uji.catatan_lapangan,
          kesimpulan_umum: uji.kesimpulan_umum,
          saran_rekomendasi_lapangan: uji.saran_rekomendasi_lapangan,
          status: uji.status,
          detailParameters: uji.detailParameters?.map((dp) => ({
            baku_mutu_id: dp.baku_mutu_id || '',
            nilai_hasil: dp.nilai_hasil,
          })),
        }}
        lokasiList={lokasiList}
        ikList={ikList}
        bakuMutuList={bakuMutuList}
        pegawaiList={pegawaiList}
        currentOfficerName={user?.name || 'Petugas Uji Lapangan'}
      />
    </div>
  );
}
