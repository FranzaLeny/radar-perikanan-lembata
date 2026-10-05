import { desc, eq } from 'drizzle-orm';
import { ArrowLeft, TestTube2 } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { FormUjiLapangan } from '@/components/form-uji-lapangan';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';

export const metadata = { title: 'Edit Hasil Uji Kualitas Air — SIPEKA' };

export default async function EditUjiKualitasPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const user = await getCurrentUser();

	const [uji, lokasiList, ikList, bakuMutuList, pegawaiList] = await Promise.all([
		db.query.ujiKualitasAir.findFirst({
			where: eq(schema.ujiKualitasAir.id, id),
			with: { detailParameters: true }
		}),
		db.query.lokasiKolam.findMany({
			orderBy: [schema.lokasiKolam.kecamatan, schema.lokasiKolam.nama_pokdakan]
		}),
		db.query.instruksiKerja.findMany({
			with: { kategoriDokumen: true },
			orderBy: [desc(schema.instruksiKerja.createdAt)]
		}),
		db.query.masterBakuMutu.findMany({
			orderBy: [desc(schema.masterBakuMutu.aktif), schema.masterBakuMutu.parameter]
		}),
		db.query.masterPegawai.findMany({
			where: eq(schema.masterPegawai.aktif, true),
			orderBy: [schema.masterPegawai.nama]
		})
	]);

	if (!uji) {
		notFound();
	}

	// Hanya status 'draft' yang boleh diedit
	if (uji.status !== 'draft') {
		redirect('/laporan');
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<Link href='/laporan'>
						<Button
							className='mb-2 gap-1.5 text-muted-foreground text-xs hover:text-foreground'
							size='sm'
							variant='ghost'
						>
							<ArrowLeft className='size-4' />
							<span>Kembali ke Pusat Laporan</span>
						</Button>
					</Link>
					<div className='flex items-center gap-2'>
						<Badge
							className='gap-1.5 px-2.5 py-0.5 font-semibold text-xs uppercase tracking-wider'
							variant='secondary'
						>
							<TestTube2 className='size-3' />
							<span>Mode Edit Dokumen Draft</span>
						</Badge>
						<Badge className='font-mono text-xs' variant='outline'>
							{uji.nomor_sampel}
						</Badge>
					</div>
					<h1 className='mt-1.5 font-bold font-heading text-2xl text-foreground tracking-tight'>
						Perbarui Data Pengujian Kualitas Air
					</h1>
					<p className='mt-1 text-muted-foreground text-xs'>
						Ubah data parameter lapangan, catatan observasi, atau penandatangan sebelum dokumen difinalkan
						dan diarsipkan.
					</p>
				</div>
			</div>

			<FormUjiLapangan
				bakuMutuList={bakuMutuList}
				currentOfficerName={user?.name || 'Petugas Uji Lapangan'}
				existingUji={{
					id: uji.id,
					nomor_sampel: uji.nomor_sampel,
					lokasi_id: uji.lokasi_id || '',
					sop_id: uji.sop_id,
					ik_id: uji.ik_id,
					suhu_lingkungan: uji.suhu_lingkungan,
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
						ik_id: dp.ik_id || undefined,
						nilai_hasil: dp.nilai_hasil,
						nilai_min_terapkan: dp.nilai_min_terapkan,
						nilai_max_terapkan: dp.nilai_max_terapkan,
						catatan_ambang: dp.catatan_ambang
					}))
				}}
				ikList={ikList}
				lokasiList={lokasiList}
				mode='edit'
				pegawaiList={pegawaiList}
			/>
		</div>
	);
}
