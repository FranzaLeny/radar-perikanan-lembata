import postgres from 'postgres';

async function resetAuth() {
	const conn =
		process.env.DATABASE_URL || 'postgresql://postgres:minamutu_dev_2026@localhost:5433/sipeka';
	const sql = postgres(conn);
	console.log('Menghapus tabel auth lama jika ada...');
	await sql.unsafe('DROP TABLE IF EXISTS "session", "account", "verification", "user" CASCADE;');
	console.log('Tabel auth lama berhasil dihapus.');
	await sql.end();
}

resetAuth().catch(console.error);
