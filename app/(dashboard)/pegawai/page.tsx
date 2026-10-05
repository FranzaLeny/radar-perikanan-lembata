import { desc } from 'drizzle-orm';

import { db } from '@/db';
import { masterPegawai } from '@/db/schema';
import { PegawaiClient } from './client';

export const metadata = {
	title: 'Master Pegawai & Pejabat Penandatangan — SIPEKA',
	description:
		'Kelola data ASN, personil dinas, petugas penguji lapangan, dan pejabat penandatangan resmi LHU.'
};

export default async function PegawaiPage() {
	const pegawaiList = await db.select().from(masterPegawai).orderBy(desc(masterPegawai.createdAt));

	return <PegawaiClient initialList={pegawaiList} />;
}
