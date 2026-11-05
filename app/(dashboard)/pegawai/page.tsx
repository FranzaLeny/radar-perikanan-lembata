import { desc } from 'drizzle-orm';
import type { Metadata } from 'next';

import { LateralTransition } from '@/components/transitions/page-transition';
import { db } from '@/db';
import { masterPegawai } from '@/db/schema';
import { PegawaiClient } from './client';

export const metadata: Metadata = {
	title: 'Master Pegawai & Pejabat Penandatangan',
	description: 'Kelola data ASN dinas, personil penguji lapangan, dan pejabat pengesahan LHU resmi.'
};

export default async function PegawaiPage() {
	const pegawaiList = await db.select().from(masterPegawai).orderBy(desc(masterPegawai.createdAt));

	return (
		<LateralTransition>
			<PegawaiClient initialList={pegawaiList} />
		</LateralTransition>
	);
}
