import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasSession = request.cookies
		.getAll()
		.some(
			(c) => c.name.endsWith(process.env.SESSION_TOKEN_NAME || 'session_token') && Boolean(c.value)
		);
	if (!hasSession && pathname !== '/login') {
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('callbackUrl', pathname);
		return NextResponse.redirect(loginUrl);
	}
	return NextResponse.next();
}

export const config = {
	matcher: [
		'/baku-mutu/:path*',
		'/dashboard/:path*',
		'/dokumen-mutu/:path*',
		'/instruksi-kerja/:path*',
		'/laporan/:path*',
		'/lokasi-kolam/:path*',
		'/pegawai/:path*',
		'/pengguna/:path*',
		'/profil/:path*',
		'/tren/:path*',
		'/uji-kualitas/:path*'
	]
};
