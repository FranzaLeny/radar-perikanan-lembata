import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'petugas_lapangan',
      },
      aktif: {
        type: 'boolean',
        defaultValue: true,
      },
    },
  },
});

export type UserRole = 'admin' | 'pengelola_mutu' | 'petugas_lapangan' | 'kepala_dinas';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  aktif: boolean;
}

/**
 * Server-side helper untuk mendapatkan sesi user saat ini.
 * Memeriksa Better Auth session cookie atau session token.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('better-auth.session_token')?.value || 
                         cookieStore.get('sipeka_auth_user')?.value;

    if (!sessionToken) {
      return null;
    }

    // Jika custom cookie terpasang langsung
    if (sessionToken.startsWith('{')) {
      try {
        const parsed = JSON.parse(sessionToken);
        return parsed as CurrentUser;
      } catch {
        // ignore
      }
    }

    // Cek di database session
    const sessionRecord = await db.query.session.findFirst({
      where: eq(schema.session.token, sessionToken),
    });

    if (sessionRecord && new Date(sessionRecord.expiresAt) > new Date()) {
      const userRecord = await db.query.user.findFirst({
        where: eq(schema.user.id, sessionRecord.userId),
      });

      if (userRecord && userRecord.aktif) {
        return {
          id: userRecord.id,
          name: userRecord.name,
          email: userRecord.email,
          role: (userRecord.role as UserRole) || 'petugas_lapangan',
          aktif: userRecord.aktif,
        };
      }
    }

    return null;
  } catch (error: any) {
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error('Error saat getCurrentUser:', error);
    return null;
  }
}
