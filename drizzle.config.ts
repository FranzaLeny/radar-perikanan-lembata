import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: ['./db/schema.ts', './db/auth-schema.ts'],
	out: './db/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL || 'postgresql://postgres:minamutu_dev_2026@localhost:5433/sipeka'
	}
});
