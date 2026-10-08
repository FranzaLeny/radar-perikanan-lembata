import { asc } from 'drizzle-orm';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { KategoriDokumenClient } from './client';

export default async function KategoriDokumenPage() {
	const kategoriList = await db.query.kategoriDokumenMutu.findMany({
		orderBy: [
			asc(schema.kategoriDokumenMutu.tingkatan),
			asc(schema.kategoriDokumenMutu.nama_kategori)
		]
	});

	return <KategoriDokumenClient initialList={kategoriList} />;
}
