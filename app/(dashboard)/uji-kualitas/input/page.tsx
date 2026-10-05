import { desc, eq } from 'drizzle-orm';
import { ArrowLeft, TestTube2 } from 'lucide-react';
import Link from 'next/link';

import { FormUjiLapangan } from '@/components/form-uji-lapangan';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';

export default async function InputUjiKualitasPage({
	searchParams
}: {
	searchParams: Promise<{ ik_id?: string; lokasi_id?: string }>;
}) {
	const { ik_id, lokasi_id } = await searchParams;
	const user = await getCurrentUser();

	const [lokasiList, ikList, bakuMutuList, pegawaiList] = await Promise.all([
		db.query.lokasiKolam.findMany({
			orderBy: [schema.lokasiKolam.kecamatan, schema.lokasiKolam.nama_pokdakan]
		}),
		db.query.instruksiKerja.findMany({
			with: { kategoriDokumen: true },
			orderBy: [desc(schema.instruksiKerja.createdAt)]
		}),
		// Muat semua baku mutu (aktif diutamakan, riwayat/arsip tetap tersedia sesuai kebutuhan uji)
		db.query.masterBakuMutu.findMany({
			orderBy: [desc(schema.masterBakuMutu.aktif), schema.masterBakuMutu.parameter]
		}),
		// Muat master pegawai aktif untuk penguji dan penandatangan LHU
		db.query.masterPegawai.findMany({
			where: eq(schema.masterPegawai.aktif, true),
			orderBy: [schema.masterPegawai.nama]
		})
	]);

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<Link href='/uji-kualitas'>
						<Button
							className='mb-2 gap-1.5 text-muted-foreground text-xs hover:text-foreground'
							size='sm'
							variant='ghost'
						>
							<ArrowLeft className='size-4' />
							<span>Kembali ke Riwayat Pengujian</span>
						</Button>
					</Link>
					<div className='flex items-center gap-2'>
						<Badge
							className='gap-1.5 px-2.5 font-semibold uppercase tracking-wider'
							variant='secondary'
						>
							<TestTube2 className='size-3' />
							<span>Entri Sampling Lapangan</span>
						</Badge>
					</div>
					<h1 className='mt-1.5 font-bold font-heading text-2xl text-foreground tracking-tight'>
						Formulir Pengujian Kualitas Air
					</h1>
					<p className='mt-1 text-muted-foreground text-xs'>
						Input hasil parameter fisika & kimia air budidaya. Pengguna bebas menentukan parameter yang
						diukur, menambah lokasi kolam baru secara instan, dan memilih SOP terarsip atau manual.
					</p>
				</div>
			</div>

			<FormUjiLapangan
				bakuMutuList={bakuMutuList}
				currentOfficerName={user?.name || 'Petugas Uji Lapangan'}
				ikList={ikList}
				lokasiList={lokasiList}
				pegawaiList={pegawaiList}
				prefilledIkId={ik_id}
				prefilledLokasiId={lokasi_id}
			/>
		</div>
	);
}
