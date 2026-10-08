import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Script untuk menghasilkan BETTER_AUTH_SECRET yang aman secara kriptografis (32 bytes / 256 bits).
 *
 * Cara Penggunaan:
 * 1. Menampilkan secret ke terminal:
 *    bun run scripts/generate-secret.ts
 *
 * 2. Menghasilkan dan langsung menulis/memperbarui file .env.local:
 *    bun run scripts/generate-secret.ts --write
 */

function generateSecret(): string {
	return randomBytes(32).toString('hex');
}

const args = process.argv.slice(2);
const shouldWrite = args.includes('--write') || args.includes('-w');

const secret = generateSecret();

console.log('\n🔐 ========================================================');
console.log('   BETTER_AUTH_SECRET Generator — RADAR Lembata');
console.log('========================================================\n');
console.log(`Key Baru yang Dihasilkan:`);
console.log(`\x1b[32m${secret}\x1b[0m\n`);
console.log(`Contoh format untuk .env atau .env.local:`);
console.log(`\x1b[36mBETTER_AUTH_SECRET=${secret}\x1b[0m\n`);

if (shouldWrite) {
	const envLocalPath = resolve(process.cwd(), '.env.local');
	const envPath = resolve(process.cwd(), '.env');
	const targetPath = existsSync(envLocalPath)
		? envLocalPath
		: existsSync(envPath)
			? envPath
			: envLocalPath;

	let content = existsSync(targetPath) ? readFileSync(targetPath, 'utf-8') : '';

	if (content.includes('BETTER_AUTH_SECRET=')) {
		content = content.replace(/BETTER_AUTH_SECRET=.*(\r?\n|$)/g, `BETTER_AUTH_SECRET=${secret}$1`);
	} else {
		content = `${content.trimEnd()}\n\n# Better Auth Secret Key (Generated)\nBETTER_AUTH_SECRET=${secret}\n`;
	}

	writeFileSync(targetPath, content, 'utf-8');
	console.log(`✅ Berhasil menulis BETTER_AUTH_SECRET ke file: ${targetPath}`);
} else {
	console.log(`💡 Tip: Jalankan \x1b[33mbun run auth:secret --write\x1b[0m untuk otomatis menyimpan ke file .env.local.`);
}

console.log('========================================================\n');
