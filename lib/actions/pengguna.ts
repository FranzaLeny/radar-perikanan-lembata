'use server';

import { hashPassword } from 'better-auth/crypto';
import { and, eq, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';

export type UpdateCredentialsInput = {
	userId: string;
	name?: string;
	email?: string;
	newPassword?: string;
};

export type ActionResponse = {
	success: boolean;
	message: string;
	error?: string;
	data?: { id: string; name: string; email: string };
};

/**
 * Server Action khusus Administrator untuk memperbarui kredensial pengguna
 * (Nama, Email, dan Password) untuk pengguna manapun termasuk akun admin itu sendiri.
 */
export async function updateUserCredentials(
	input: UpdateCredentialsInput
): Promise<ActionResponse> {
	try {
		const currentUser = await getCurrentUser();

		if (currentUser?.role !== 'admin') {
			return {
				success: false,
				message: 'Akses ditolak',
				error: 'Hanya Administrator yang memiliki wewenang untuk mengubah kredensial pengguna.'
			};
		}

		const { userId, name, email, newPassword } = input;

		if (!userId) {
			return { success: false, message: 'Validasi gagal', error: 'ID Pengguna wajib disertakan.' };
		}

		// Cari pengguna target di database
		const targetUser = await db.query.user.findFirst({ where: eq(schema.user.id, userId) });

		if (!targetUser) {
			return {
				success: false,
				message: 'Pengguna tidak ditemukan',
				error: 'Data akun pengguna tidak ditemukan dalam basis data sistem.'
			};
		}

		const updates: { name?: string; email?: string; emailVerified?: boolean; updatedAt?: Date } = {};

		// 1. Validasi & Penyiapan Nama
		if (name !== undefined) {
			const cleanName = name.trim();
			if (!cleanName) {
				return {
					success: false,
					message: 'Validasi gagal',
					error: 'Nama lengkap pengguna tidak boleh kosong.'
				};
			}
			updates.name = cleanName;
		}

		// 2. Validasi & Penyiapan Email
		if (email !== undefined) {
			const cleanEmail = email.trim().toLowerCase();
			if (!cleanEmail?.includes('@')) {
				return { success: false, message: 'Validasi gagal', error: 'Format alamat email tidak valid.' };
			}

			// Periksa apakah email sudah dipakai oleh user lain
			const existingEmailUser = await db.query.user.findFirst({
				where: and(eq(schema.user.email, cleanEmail), ne(schema.user.id, userId))
			});

			if (existingEmailUser) {
				return {
					success: false,
					message: 'Email sudah terdaftar',
					error: `Alamat email "${cleanEmail}" sudah digunakan oleh pengguna lain.`
				};
			}

			updates.email = cleanEmail;
			updates.emailVerified = true;
		}

		// 3. Simpan perubahan profil/email ke tabel user
		if (Object.keys(updates).length > 0) {
			updates.updatedAt = new Date();
			await db.update(schema.user).set(updates).where(eq(schema.user.id, userId));
		}

		// 4. Update Password (jika diberikan)
		if (newPassword && newPassword.trim().length > 0) {
			const cleanPassword = newPassword.trim();
			if (cleanPassword.length < 8) {
				return {
					success: false,
					message: 'Validasi gagal',
					error: 'Kata sandi baru minimal harus 8 karakter.'
				};
			}

			const hashedPassword = await hashPassword(cleanPassword);

			// Cek apakah akun credential sudah ada di tabel account
			const existingAccount = await db.query.account.findFirst({
				where: and(eq(schema.account.userId, userId), eq(schema.account.providerId, 'credential'))
			});

			if (existingAccount) {
				await db
					.update(schema.account)
					.set({ password: hashedPassword, updatedAt: new Date() })
					.where(eq(schema.account.id, existingAccount.id));
			} else {
				await db
					.insert(schema.account)
					.values({
						accountId: userId,
						providerId: 'credential',
						userId: userId,
						password: hashedPassword
					});
			}
		}

		revalidatePath('/pengguna');
		revalidatePath('/profil');

		return {
			success: true,
			message: `Kredensial akun "${updates.name || targetUser.name}" berhasil diperbarui.`,
			data: {
				id: userId,
				name: updates.name || targetUser.name,
				email: updates.email || targetUser.email
			}
		};
	} catch (error) {
		console.error('Error saat updateUserCredentials:', error);
		return {
			success: false,
			message: 'Terjadi kesalahan sistem',
			error: error instanceof Error ? error.message : 'Gagal memperbarui kredensial pengguna.'
		};
	}
}
