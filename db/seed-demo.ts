/** biome-ignore-all lint/suspicious/noConsole: <> */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { hashPassword } from 'better-auth/crypto';

import { db } from './index';
import { account, user } from './schema';

type DemoUserItem = { name: string; email: string; role: string };

async function seedDemoUsers() {
	console.log('[RADAR Seed Demo] 🚀 Memulai seeding akun demo pengguna...');

	const jsonPath = resolve(process.cwd(), 'user-demo.json');
	if (!existsSync(jsonPath)) {
		console.error(`[RADAR Seed Demo] ❌ File ${jsonPath} tidak ditemukan.`);
		process.exit(1);
	}

	const rawData = readFileSync(jsonPath, 'utf-8');
	const demoUsers: DemoUserItem[] = JSON.parse(rawData);

	const defaultPassword = process.env.DEFAULT_PASSWORD || 'password123';
	const hashedPassword = await hashPassword(defaultPassword);

	for (const u of demoUsers) {
		const [targetUser] = await db
			.insert(user)
			.values({
				name: u.name,
				email: u.email.toLowerCase().trim(),
				role: u.role,
				banned: false,
				emailVerified: true
			})
			.returning()
			.onConflictDoUpdate({
				target: user.email,
				set: { role: u.role, banned: false, emailVerified: true, name: u.name }
			});

		await db
			.insert(account)
			.values({
				accountId: targetUser.id,
				providerId: 'credential',
				userId: targetUser.id,
				password: hashedPassword
			})
			.onConflictDoUpdate({
				target: account.accountId,
				set: { password: hashedPassword, providerId: 'credential' }
			});

		console.log(`  ✓ Akun demo [${u.role}]: ${u.email} siap digunakan.`);
	}

	console.log('[RADAR Seed Demo] ✅ Seeding akun demo pengguna selesai!');
	process.exit(0);
}

seedDemoUsers().catch((err) => {
	console.error('[RADAR Seed Demo] ❌ Gagal seeding demo users:', err);
	process.exit(1);
});
