import { ShieldAlert } from 'lucide-react';
import { headers } from 'next/headers';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { auth, getCurrentUser } from '@/lib/auth';
import { PenggunaClient } from './client';

export default async function PenggunaPage() {
	const user = await getCurrentUser();

	if (user?.role !== 'admin') {
		return (
			<div className='mx-auto my-12 max-w-md rounded-2xl border border-rose-500/30 bg-slate-900 p-8 text-center'>
				<ShieldAlert className='mx-auto mb-3 h-12 w-12 text-rose-400' />
				<h2 className='font-bold text-lg text-white'>Akses Ditolak (403 Forbidden)</h2>
				<p className='mt-2 text-slate-400 text-xs'>
					Halaman Manajemen Pengguna ini hanya dapat diakses oleh akun dengan peran Administrator.
				</p>
			</div>
		);
	}

	const reqHeaders = await headers();

	const [{ users }, allUji] = await Promise.all([
		auth.api.listUsers({
			query: { limit: 500, sortBy: 'name', sortDirection: 'asc' },
			headers: reqHeaders
		}),
		db.select({ petugas_uji: schema.ujiKualitasAir.petugas_uji }).from(schema.ujiKualitasAir)
	]);

	const enrichedUsers = users.map((u) => {
		const uName = (u.name || '').trim().toLowerCase();
		const uEmail = (u.email || '').trim().toLowerCase();
		const uId = (u.id || '').trim().toLowerCase();
		const count = allUji.filter((uji) => {
			const p = uji.petugas_uji?.trim().toLowerCase();
			return p === uName || p === uEmail || p === uId;
		}).length;

		return {
			id: u.id,
			name: u.name,
			email: u.email,
			role: u.role || 'petugas_lapangan',
			aktif: !u.banned,
			banned: u.banned ?? false,
			createdAt: new Date(u.createdAt),
			transactionCount: count,
			isUsed: count > 0
		};
	});

	return <PenggunaClient currentUserId={user.id} initialUsers={enrichedUsers} />;
}
