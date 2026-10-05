import { asc, desc, eq } from 'drizzle-orm';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { DokumenMutuClient } from './client';

export default async function DokumenMutuPage() {
	// 1. Ambil daftar Dokumen Mutu beserta relasi Kategori
	const dokumenList = await db.query.instruksiKerja.findMany({
		with: { kategoriDokumen: true },
		orderBy: [desc(schema.instruksiKerja.createdAt)]
	});

	// 2. Ambil daftar Kategori Dokumen Mutu yang aktif
	const kategoriList = await db.query.kategoriDokumenMutu.findMany({
		orderBy: [asc(schema.kategoriDokumenMutu.urutan), asc(schema.kategoriDokumenMutu.nama_kategori)]
	});

	// 3. Ambil daftar parameter unik dari master baku mutu aktif untuk dropdown 1 IK = 1 parameter
	const activeBakuMutu = await db.query.masterBakuMutu.findMany({
		where: eq(schema.masterBakuMutu.aktif, true),
		orderBy: [asc(schema.masterBakuMutu.parameter)]
	});

	const parameterList = Array.from(new Set(activeBakuMutu.map((bm) => bm.parameter)));

	// Fallback jika belum ada parameter
	if (parameterList.length === 0) {
		parameterList.push(
			'Suhu',
			'pH',
			'DO (Oksigen Terlarut)',
			'Amonia (NH₃-N)',
			'Nitrit (NO₂-N)',
			'Kecerahan / Turbiditas'
		);
	}

	return (
		<DokumenMutuClient
			initialList={dokumenList}
			kategoriList={kategoriList}
			parameterList={parameterList}
		/>
	);
}
