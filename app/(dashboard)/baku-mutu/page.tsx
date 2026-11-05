import { desc } from 'drizzle-orm';
import type { Metadata } from 'next';

import { LateralTransition } from '@/components/transitions/page-transition';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { BakuMutuClient } from './client';

export const metadata: Metadata = {
	title: 'Standar Regulasi Baku Mutu Air',
	description: 'Daftar ambang batas parameter kualitas air mengacu Permen KKP 75/2016 & PP 22/2021.'
};

export default async function BakuMutuPage() {
	const bakuMutuList = await db.query.masterBakuMutu.findMany({
		orderBy: [desc(schema.masterBakuMutu.aktif), schema.masterBakuMutu.parameter]
	});

	return (
		<LateralTransition>
			<BakuMutuClient initialList={bakuMutuList} />
		</LateralTransition>
	);
}
