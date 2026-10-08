/** biome-ignore-all lint/suspicious/noConsole: <log> */
import { $ } from 'bun';

import postgres from 'postgres';

async function resetDatabase() {
	// biome-ignore lint/style/noNonNullAssertion: <DATABASE_URL>
	const conn = process.env.DATABASE_URL!;
	const sql = postgres(conn);

	console.log('\n🧹 ========================================================');
	console.log('   RESET TOTAL DATABASE — RADAR Kabupaten Lembata');
	console.log('========================================================\n');

	try {
		console.log('1. Menghapus semua tabel lama dari schema public...');
		await sql.unsafe(`
			DROP TABLE IF EXISTS
				"detail_uji_parameter",
				"uji_kualitas_air",
				"instruksi_kerja",
				"lokasi_kolam",
				"master_pegawai",
				"master_baku_mutu",
				"kategori_dokumen_mutu",
				"session",
				"account",
				"verification",
				"user"
			CASCADE;
		`);
		console.log('   ✓ Seluruh tabel public berhasil dibersihkan.');

		// Coba bersihkan tabel migrasi drizzle jika ada
		try {
			await sql.unsafe(`DROP TABLE IF EXISTS drizzle.__drizzle_migrations CASCADE;`);
			console.log('   ✓ Tabel riwayat migrasi drizzle berhasil dibersihkan.');
		} catch {
			// Lewati jika ownership dibatasi oleh cloud
		}
	} catch (err) {
		console.warn('   ⚠️ Catatan saat pembersihan tabel:', err);
	} finally {
		await sql.end();
	}

	console.log('\n2. Menginisialisasi struktur schema database (drizzle-kit push)...');
	await $`bunx drizzle-kit push`;
	console.log('   ✓ Schema database berhasil diperbarui.');

	console.log('\n3. Menanam master data awal (db/seed.ts)...');
	await $`bun run db/seed.ts`;
	console.log('   ✓ Master data awal berhasil ditanam.');

	console.log('\n4. Menanam akun demo pengguna (db/seed-demo.ts)...');
	await $`bun run db/seed-demo.ts`;
	console.log('   ✓ Akun demo berhasil ditanam.');

	console.log('\n========================================================');
	console.log('🎉 Reset Database Berhasil & Sistem Siap Digunakan!');
	console.log('========================================================\n');
}

resetDatabase().catch((err) => {
	console.error('❌ Terjadi kesalahan saat mereset database:', err);
	process.exit(1);
});
