import { desc } from 'drizzle-orm';
import type { Metadata } from 'next';

import { DirectionalTransition } from '@/components/transitions/page-transition';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { UjiKualitasListClient } from './client';

export const metadata: Metadata = {
	title: 'Riwayat Log Pengujian Kualitas Air',
	description:
		'Daftar hasil pengujian sampel lapangan dan evaluasi kepatuhan baku mutu kolam budidaya.'
};

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
