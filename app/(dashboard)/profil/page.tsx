import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LateralTransition } from '@/components/transitions/page-transition';
import { getCurrentUser } from '@/lib/auth';
import { ProfilClient } from './client';

export const metadata: Metadata = {
	title: 'Profil Akun & Pengaturan Sandi',
	description: 'Informasi data diri petugas penguji serta pembaruan kredensial keamanan akun sistem.'
};

export default async function ProfilPage() {
	const user = await getCurrentUser();

	if (!user) {
		redirect('/login');
	}

	return (
		<LateralTransition>
			<ProfilClient user={user} />
		</LateralTransition>
	);
}
