import { desc } from 'drizzle-orm';

import { DirectionalTransition } from '@/components/transitions/page-transition';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { UjiKualitasListClient } from './client';

export default async function UjiKualitasPage() {
	const ujiList = await db.query.ujiKualitasAir.findMany({
		orderBy: [desc(schema.ujiKualitasAir.tanggal_pengambilan)],
		with: { lokasi: true, instruksiKerja: true, detailParameters: { with: { bakuMutu: true } } }
	});

	return (
		<DirectionalTransition>
			<UjiKualitasListClient initialList={ujiList} />
		</DirectionalTransition>
	);
}
