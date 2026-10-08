/** biome-ignore-all lint/suspicious/noConsole: <> */
import { hashPassword } from 'better-auth/crypto';

import { generateIkHash } from '../lib/qr';
import {
	BAKU_MUTU,
	DOKUMEN_MUTU,
	KATEGORI_DATA,
	LOKASI_KOLAM,
	PEGAWAI_LIST,
	USERS_TO_SEED
} from './contants';
import { db } from './index';
import {
	account,
	instruksiKerja,
	kategoriDokumenMutu,
	lokasiKolam,
	masterBakuMutu,
	masterPegawai,
	user
} from './schema';

async function seed() {
	console.log('[RADAR Seed] 🌊 Memulai penyemaian master data awal...');

	// 0. Seed Kategori Dokumen Mutu
	console.log('[RADAR Seed] Menanam kategori dokumen mutu...');
	for (const k of KATEGORI_DATA) {
		await db
			.insert(kategoriDokumenMutu)
			.values({
				kode_kategori: k.kode_kategori,
				nama_kategori: k.nama_kategori,
				deskripsi: k.deskripsi,
				tingkatan: k.tingkatan,
				aktif: k.aktif
			})
			.onConflictDoNothing();
	}

	// Dapatkan map id kategori dari database
	const categories = await db.select().from(kategoriDokumenMutu);
	const categoryMap = new Map(categories.map((c) => [c.kode_kategori, c.id]));

	// 1. Seed Master Baku Mutu
	console.log('[RADAR Seed] Menanam parameter baku mutu...');
	for (const bm of BAKU_MUTU) {
		await db.insert(masterBakuMutu).values(bm).onConflictDoNothing();
	}

	// 2. Seed Dokumen Mutu & Instruksi Kerja (IK)
	console.log('[RADAR Seed] Menanam Dokumen Mutu & Instruksi Kerja...');
	for (const doc of DOKUMEN_MUTU) {
		const qrHash = generateIkHash(doc.kode_ik);
		const catKode =
			typeof doc.kategori === 'string'
				? doc.kategori
				: doc.kategori === 1
					? 'PM'
					: doc.kategori === 2
						? 'PP'
						: doc.kategori === 3
							? 'SOP'
							: doc.kategori === 4
								? 'IK'
								: 'FR';
		const catId = categoryMap.get(catKode);
		const catName =
			KATEGORI_DATA.find((k) => k.kode_kategori === catKode)?.nama_kategori || 'Instruksi Kerja';

		await db
			.insert(instruksiKerja)
			.values({
				kode_ik: doc.kode_ik,
				judul: doc.judul,
				kategori: catName,
				kategori_id: catId,
				parameter_uji: 'parameter_uji' in doc ? (doc.parameter_uji as string) : null,
				metode_pengujian: 'metode_pengujian' in doc ? (doc.metode_pengujian as string) : null,
				file_path: doc.file_path,
				qr_code_hash: qrHash,
				versi: doc.versi
			})
			.onConflictDoNothing();
	}

	// 3. Seed Lokasi Kolam Pembudidaya
	console.log('[RADAR Seed] Menanam master data lokasi kolam / Pokdakan...');
	for (const kolam of LOKASI_KOLAM) {
		await db.insert(lokasiKolam).values(kolam).onConflictDoNothing();
	}

	// 4. Seed Master Pegawai Dinas Perikanan
	console.log('[RADAR Seed] Menanam master pegawai Dinas Perikanan Lembata...');
	for (const p of PEGAWAI_LIST) {
		await db.insert(masterPegawai).values(p).onConflictDoNothing();
	}

	// 5. Seed Akun Default Sistem
	console.log('[RADAR Seed] Menanam akun pengguna default...');
	const defaultPassword = process.env.DEFAULT_PASSWORD || 'password123';
	const hashedPassword = await hashPassword(defaultPassword);

	for (const u of USERS_TO_SEED) {
		const [seededUser] = await db
			.insert(user)
			.values({ name: u.name, email: u.email, role: u.role, banned: false, emailVerified: true })

			.onConflictDoUpdate({
				target: user.email,
				set: { name: u.name, role: u.role, banned: false, emailVerified: true }
			})
			.returning();

		await db
			.insert(account)
			.values({
				accountId: seededUser.id,
				providerId: 'credential',
				userId: seededUser.id,
				password: hashedPassword
			})
			.onConflictDoUpdate({
				target: account.accountId,
				set: { password: hashedPassword, providerId: 'credential' }
			});
	}

	console.log('[RADAR Seed] ✅ Penyemaian master data awal selesai!');
	process.exit(0);
}

seed().catch((err) => {
	console.error('[RADAR Seed] ❌ Gagal penyemaian data:', err);
	process.exit(1);
});
