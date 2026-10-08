/** biome-ignore-all lint/suspicious/noConsole: <console> */
import postgres from 'postgres';

async function resetAuth() {
	// biome-ignore lint/style/noNonNullAssertion: <DATABASE_URL>
	const conn = process.env.DATABASE_URL!;
	const sql = postgres(conn);
	console.log('Menghapus tabel auth lama jika ada...');
	await sql.unsafe('DROP TABLE IF EXISTS "session", "account", "verification", "user" CASCADE;');
	console.log('Tabel auth lama berhasil dihapus.');
	await sql.end();
}

resetAuth().catch(console.error);
