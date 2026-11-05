import { desc } from 'drizzle-orm';

import { LateralTransition } from '@/components/transitions/page-transition';
import { db } from '@/db';
import { masterPegawai } from '@/db/schema';
import { APP_CONFIG } from '@/lib/constants';
import { PegawaiClient } from './client';

export const metadata = {
	title: `Master Pegawai & Pejabat Penandatangan — ${APP_CONFIG.name}`,
	description:
		'Kelola data ASN, personil dinas, petugas penguji lapangan, dan pejabat penandatangan resmi LHU.'
};

export default async function PegawaiPage() {
	const pegawaiList = await db.select().from(masterPegawai).orderBy(desc(masterPegawai.createdAt));

	return (
		<LateralTransition>
			<PegawaiClient initialList={pegawaiList} />
		</LateralTransition>
	);
}
