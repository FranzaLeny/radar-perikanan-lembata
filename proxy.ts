import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { auth } from './lib/auth';
export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// 1. Rute publik yang bebas diakses siapa saja
	if (
		pathname.startsWith('/verifikasi') || // Verifikasi QR Publik (Wajib Terbuka)
		pathname.startsWith('/api/auth') || // Endpoint BetterAuth API
		pathname.startsWith('/_next') ||
		pathname.startsWith('/static') ||
		pathname === '/favicon.ico' ||
		pathname.includes('.') // file statis
	) {
		return NextResponse.next();
	}

	if (pathname.startsWith('/login')) {
		const session = await auth.api.getSession({ headers: request.headers });
		if (session) {
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}
	}

	// Cek apakah ada cookie session token BetterAuth (mendukung HTTP lokal maupun HTTPS __Secure- prefix)
	const hasSession = request.cookies
		.getAll()
		.some(
			(c) => c.name.endsWith(process.env.SESSION_TOKEN_NAME || 'session_token') && Boolean(c.value)
		);

	// Jika mengakses root '/' -> arahkan ke '/dashboard' atau '/login'
	if (pathname === '/') {
		return NextResponse.redirect(new URL(hasSession ? '/dashboard' : '/login', request.url));
	}

	// 2. Proteksi rute internal (Dashboard dan Modul)
	if (!hasSession) {
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('callbackUrl', pathname);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] };
