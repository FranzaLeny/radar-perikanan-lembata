'use server';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { penggunaSchema, type PenggunaInput } from '@/lib/validations/pengguna';
import { getCurrentUser } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createPenggunaAction(formData: FormData | Record<string, unknown>) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return { success: false, message: 'Akses ditolak: Hanya admin yang diizinkan.' };
  }

  const rawData = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

  // Validasi Zod Server-Side (WAJIB)
  const validation = penggunaSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Data pengguna tidak valid.',
    };
  }

  const { nama, email, role, aktif, password } = validation.data;

  // Cek duplikasi email
  const existing = await db.query.user.findFirst({
    where: eq(schema.user.email, email.toLowerCase().trim()),
  });

  if (existing) {
    return {
      success: false,
      errors: { email: ['Alamat email ini sudah terdaftar'] },
      message: 'Email sudah digunakan.',
    };
  }

  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  try {
    const [newUser] = await db
      .insert(schema.user)
      .values({
        id: userId,
        name: nama,
        email: email.toLowerCase().trim(),
        role,
        aktif: aktif ?? true,
        emailVerified: true,
      })
      .returning();

    // Buat credential account
    await db.insert(schema.account).values({
      id: `acc_${userId}`,
      accountId: userId,
      providerId: 'credential',
      userId: userId,
      password: password || 'password123',
    });

    revalidatePath('/pengguna');
    return {
      success: true,
      data: newUser,
      message: `Pengguna ${nama} (${role}) berhasil ditambahkan. Password default: ${password || 'password123'}`,
    };
  } catch (error) {
    console.error('Error createPenggunaAction:', error);
    return {
      success: false,
      message: 'Gagal membuat pengguna baru.',
    };
  }
}

export async function toggleStatusPenggunaAction(userId: string, currentStatus: boolean) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return { success: false, message: 'Akses ditolak.' };
  }

  if (admin.id === userId) {
    return { success: false, message: 'Anda tidak dapat menonaktifkan akun Anda sendiri.' };
  }

  try {
    await db
      .update(schema.user)
      .set({ aktif: !currentStatus })
      .where(eq(schema.user.id, userId));

    revalidatePath('/pengguna');
    return {
      success: true,
      message: `Status pengguna berhasil diubah menjadi: ${!currentStatus ? 'Aktif' : 'Nonaktif'}.`,
    };
  } catch (error) {
    console.error('Error toggleStatusPenggunaAction:', error);
    return { success: false, message: 'Gagal mengubah status pengguna.' };
  }
}

export async function updateRolePenggunaAction(userId: string, newRole: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return { success: false, message: 'Akses ditolak.' };
  }

  try {
    await db
      .update(schema.user)
      .set({ role: newRole })
      .where(eq(schema.user.id, userId));

    revalidatePath('/pengguna');
    return { success: true, message: `Role berhasil diperbarui menjadi ${newRole}.` };
  } catch (error) {
    console.error('Error updateRolePenggunaAction:', error);
    return { success: false, message: 'Gagal mengubah role pengguna.' };
  }
}
