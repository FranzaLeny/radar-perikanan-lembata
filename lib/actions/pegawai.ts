'use server';

import { db } from '@/db';
import { masterPegawai } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface PegawaiItem {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  pangkat_golongan: string | null;
  aktif: boolean;
  peran_tanda_tangan: string;
  createdAt: Date;
}

export async function getPegawaiListAction(): Promise<PegawaiItem[]> {
  try {
    const list = await db
      .select()
      .from(masterPegawai)
      .where(eq(masterPegawai.aktif, true))
      .orderBy(asc(masterPegawai.nama));
    return list;
  } catch (err) {
    console.error('[getPegawaiListAction] Error:', err);
    return [];
  }
}

export async function getAllPegawaiAction(): Promise<PegawaiItem[]> {
  try {
    const list = await db
      .select()
      .from(masterPegawai)
      .orderBy(desc(masterPegawai.createdAt));
    return list;
  } catch (err) {
    console.error('[getAllPegawaiAction] Error:', err);
    return [];
  }
}

export async function createPegawaiAction(formData: {
  nip: string;
  nama: string;
  jabatan: string;
  pangkat_golongan?: string;
  peran_tanda_tangan?: string;
}) {
  try {
    const nipClean = formData.nip.replace(/\s+/g, '');
    if (!nipClean || !formData.nama || !formData.jabatan) {
      return { success: false, message: 'NIP, Nama, dan Jabatan wajib diisi.' };
    }

    const [created] = await db
      .insert(masterPegawai)
      .values({
        nip: nipClean,
        nama: formData.nama.trim(),
        jabatan: formData.jabatan.trim(),
        pangkat_golongan: formData.pangkat_golongan?.trim() || null,
        peran_tanda_tangan: formData.peran_tanda_tangan || 'penguji',
        aktif: true,
      })
      .returning();

    revalidatePath('/pengujian/baru');
    revalidatePath('/laporan');
    return { success: true, data: created, message: 'Pegawai berhasil didaftarkan.' };
  } catch (err: unknown) {
    console.error('[createPegawaiAction] Error:', err);
    return { success: false, message: 'Gagal mendaftarkan pegawai. Pastikan NIP unik.' };
  }
}
