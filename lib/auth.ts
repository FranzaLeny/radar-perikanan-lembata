import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { headers } from 'next/headers';

import { db } from '@/db';
import * as authSchema from '@/db/auth-schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			user: authSchema.user,
			session: authSchema.session,
			account: authSchema.account,
			verification: authSchema.verification
		}
	}),
	emailAndPassword: { enabled: true, autoSignIn: true },
	user: { additionalFields: { role: { type: 'string', defaultValue: 'petugas_lapangan' } } },
	plugins: [admin({ defaultRole: 'petugas_lapangan' })]
});

export type UserRole = 'admin' | 'pengelola_mutu' | 'petugas_lapangan' | 'kepala_dinas';

export type CurrentUser = {
	id: string;
	name: string;
	email: string;
	image?: string | null;
	role: UserRole;
	aktif: boolean;
	banned?: boolean | null;
	banReason?: string | null;
};

/**
 * Server-side helper untuk mendapatkan sesi user saat ini.
 * Menggunakan Better Auth API getSession.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
	try {
		const session = await auth.api.getSession({ headers: await headers() });

		if (!session?.user) {
			return null;
		}

		const u = session.user;

		if (u.banned) {
			return null;
		}

		return {
			id: u.id,
			name: u.name,
			email: u.email,
			image: u.image ?? null,
			role: (u.role as UserRole) || 'petugas_lapangan',
			aktif: !u.banned,
			banned: u.banned ?? false,
			banReason: u.banReason ?? null
		};
	} catch (error) {
		if ((error as { digest?: string })?.digest === 'DYNAMIC_SERVER_USAGE') {
			throw error;
		}
		console.error('Error saat getCurrentUser:', error);
		return null;
	}
}
