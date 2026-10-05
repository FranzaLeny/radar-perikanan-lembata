import { desc } from 'drizzle-orm';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { BakuMutuClient } from './client';

export default async function BakuMutuPage() {
	const bakuMutuList = await db.query.masterBakuMutu.findMany({
		orderBy: [desc(schema.masterBakuMutu.aktif), schema.masterBakuMutu.parameter]
	});

	return <BakuMutuClient initialList={bakuMutuList} />;
}
