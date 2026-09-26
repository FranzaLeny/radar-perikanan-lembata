import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Rute publik yang bebas diakses siapa saja
  if (
    pathname.startsWith('/verifikasi') || // Verifikasi QR Publik (Wajib Terbuka)
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.') // file statis seperti css, js, svg, png
  ) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get('better-auth.session_token')?.value;
  const userCookie = request.cookies.get('sipeka_auth_user')?.value;

  // Jika mengakses halaman login
  if (pathname === '/login') {
    if (sessionToken && userCookie) {
      // Jika sudah login, redirect ke dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Jika mengakses root '/' -> arahkan ke '/dashboard' atau '/login'
  if (pathname === '/') {
    if (sessionToken && userCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. Proteksi rute internal (Dashboard dan Modul)
  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Role-Based Access Control (RBAC)
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      const role = user.role;

      // /pengguna (Manajemen User) HANYA untuk role 'admin'
      if (pathname.startsWith('/pengguna') && role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
      }

      // /instruksi-kerja, /baku-mutu, /lokasi-kolam untuk admin dan pengelola_mutu
      if (
        (pathname.startsWith('/instruksi-kerja') ||
          pathname.startsWith('/baku-mutu') ||
          pathname.startsWith('/lokasi-kolam')) &&
        role !== 'admin' &&
        role !== 'pengelola_mutu' &&
        role !== 'kepala_dinas' // Kadis boleh melihat (view)
      ) {
        if (pathname.includes('/input') || pathname.includes('/tambah') || pathname.includes('/edit')) {
          return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
        }
      }
    } catch {
      // jika cookie korup, paksa login ulang
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
