import { asc } from 'drizzle-orm';
import type { Metadata } from 'next';

import { DirectionalTransition } from '@/components/transitions/page-transition';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { KategoriDokumenClient } from './client';

export const metadata: Metadata = {
	title: 'Kelola Kategori Dokumen Mutu',
	description: 'Struktur tingkatan standarisasi dokumen mutu laboratorium pengujian air perikanan.'
};

export default async function KategoriDokumenPage() {
	const kategoriList = await db.query.kategoriDokumenMutu.findMany({
		orderBy: [
			asc(schema.kategoriDokumenMutu.tingkatan),
			asc(schema.kategoriDokumenMutu.nama_kategori)
		]
	});

	return (
		<DirectionalTransition>
			<KategoriDokumenClient initialList={kategoriList} />
		</DirectionalTransition>
	);
}
