import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

const connectionString =
	process.env.DATABASE_URL || 'postgresql://postgres:minamutu_dev_2026@localhost:5433/sipeka';

function createDb() {
	if (process.env.NODE_ENV === 'production' && connectionString.includes('neon.tech')) {
		// Production: Neon DB (serverless, HTTP-based)
		const sql = neon(connectionString);
		return drizzleNeon(sql, { schema });
	} else {
		// Development: PostgreSQL lokal via postgres-js
		const client = postgres(connectionString, { max: 10, idle_timeout: 20, connect_timeout: 10 });
		return drizzlePg(client, { schema });
	}
}

export const db = createDb();
export type AppDatabase = typeof db;
