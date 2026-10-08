import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: ['./db/schema.ts', './db/auth-schema.ts'],
	out: './db/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: <DATABASE_URL>
		url: process.env.DATABASE_URL!
	}
});
