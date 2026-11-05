import type { Metadata } from 'next';

import { LateralTransition } from '@/components/transitions/page-transition';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { LokasiKolamClient } from './client';

export const metadata: Metadata = {
	title: 'Master Data Lokasi Kolam Budidaya',
	description: 'Basis data kolam sentra budidaya Pokdakan, komoditas ikan, dan titik GPS se-Lembata.'
};

export default async function LokasiKolamPage() {
	const lokasiList = await db.query.lokasiKolam.findMany({
		orderBy: [schema.lokasiKolam.kecamatan, schema.lokasiKolam.nama_pokdakan]
	});

	return (
		<LateralTransition>
			<LokasiKolamClient initialList={lokasiList} />
		</LateralTransition>
	);
}
