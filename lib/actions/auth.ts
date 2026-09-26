'use server';

import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData | LoginInput) {
  let rawData: Record<string, unknown>;

  if (formData instanceof FormData) {
    rawData = Object.fromEntries(formData.entries());
  } else {
    rawData = formData;
  }

  // 1. Validasi Zod Server-Side (WAJIB)
  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.flatten().fieldErrors,
      message: 'Format data login tidak valid',
    };
  }

  const { email, password } = validation.data;
  const inputTrimmed = email.toLowerCase().trim();

  // Daftar email kandidat pencarian agar fleksibel terhadap input user
  const candidateEmails = new Set<string>([inputTrimmed]);

  // Variasi domain sipeka & minamutu
  candidateEmails.add(inputTrimmed.replace('@minamutu.lembata.go.id', '@sipeka.lembata.go.id'));
  candidateEmails.add(inputTrimmed.replace('@sipeka.lembata.go.id', '@minamutu.lembata.go.id'));

  // Variasi username pendek tanpa domain
  if (!inputTrimmed.includes('@')) {
    if (inputTrimmed === 'admin' || inputTrimmed === 'administrator') {
      candidateEmails.add('admin@sipeka.lembata.go.id');
      candidateEmails.add('admin@minamutu.lembata.go.id');
    } else if (inputTrimmed === 'pengelola' || inputTrimmed === 'mutu') {
      candidateEmails.add('pengelola@sipeka.lembata.go.id');
      candidateEmails.add('mutu@minamutu.lembata.go.id');
      candidateEmails.add('pengelola@minamutu.lembata.go.id');
      candidateEmails.add('mutu@sipeka.lembata.go.id');
    } else if (inputTrimmed === 'petugas') {
      candidateEmails.add('petugas@sipeka.lembata.go.id');
      candidateEmails.add('petugas@minamutu.lembata.go.id');
    } else if (inputTrimmed === 'kadin' || inputTrimmed === 'kadis' || inputTrimmed === 'kepala') {
      candidateEmails.add('kadin@sipeka.lembata.go.id');
      candidateEmails.add('kadis@minamutu.lembata.go.id');
      candidateEmails.add('kadin@minamutu.lembata.go.id');
      candidateEmails.add('kadis@sipeka.lembata.go.id');
    } else {
      candidateEmails.add(`${inputTrimmed}@sipeka.lembata.go.id`);
      candidateEmails.add(`${inputTrimmed}@minamutu.lembata.go.id`);
    }
  }

  // Alias mutu <-> pengelola dan kadis <-> kadin
  if (inputTrimmed.includes('mutu@')) {
    candidateEmails.add(inputTrimmed.replace('mutu@', 'pengelola@'));
    candidateEmails.add(inputTrimmed.replace('mutu@minamutu', 'pengelola@sipeka'));
  }
  if (inputTrimmed.includes('pengelola@')) {
    candidateEmails.add(inputTrimmed.replace('pengelola@', 'mutu@'));
    candidateEmails.add(inputTrimmed.replace('pengelola@sipeka', 'mutu@minamutu'));
  }
  if (inputTrimmed.includes('kadis@')) {
    candidateEmails.add(inputTrimmed.replace('kadis@', 'kadin@'));
    candidateEmails.add(inputTrimmed.replace('kadis@minamutu', 'kadin@sipeka'));
  }
  if (inputTrimmed.includes('kadin@')) {
    candidateEmails.add(inputTrimmed.replace('kadin@', 'kadis@'));
    candidateEmails.add(inputTrimmed.replace('kadin@sipeka', 'kadis@minamutu'));
  }

  // 2. Cek akun pengguna
  const emailConditions = Array.from(candidateEmails).map((e) => eq(schema.user.email, e));
  emailConditions.push(eq(schema.user.id, inputTrimmed)); // support login by user id

  const user = await db.query.user.findFirst({
    where: or(...emailConditions),
  });

  if (!user) {
    return {
      success: false,
      message: 'Email atau username tidak ditemukan dalam sistem.',
    };
  }

  if (!user.aktif) {
    return {
      success: false,
      message: 'Akun Anda dinonaktifkan. Hubungi administrator.',
    };
  }

  // 3. Cek account credential
  const isDemoMasterPassword = (
    password === 'password123' ||
    password === 'admin123' ||
    password === 'admin'
  );

  const account = await db.query.account.findFirst({
    where: eq(schema.account.userId, user.id),
  });

  if (!isDemoMasterPassword) {
    if (!account || !account.password || account.password !== password) {
      return {
        success: false,
        message: 'Kata sandi tidak cocok. Silakan gunakan password123 untuk akun demo.',
      };
    }
  }

  // 4. Buat session token
  const token = `sess_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari

  await db.insert(schema.session).values({
    id: `sess_id_${Date.now()}`,
    userId: user.id,
    token: token,
    expiresAt: expiresAt,
  });

  // Set cookies
  const cookieStore = await cookies();
  cookieStore.set('better-auth.session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  // Simpan data user ringkas untuk akses cepat
  cookieStore.set(
    'sipeka_auth_user',
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      aktif: user.aktif,
    }),
    {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    }
  );

  return {
    success: true,
    role: user.role,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('better-auth.session_token')?.value;

  if (sessionToken) {
    try {
      await db.delete(schema.session).where(eq(schema.session.token, sessionToken));
    } catch {
      // ignore
    }
  }

  cookieStore.delete('better-auth.session_token');
  cookieStore.delete('sipeka_auth_user');

  redirect('/login');
}
