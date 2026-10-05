import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';
import { ProfilClient } from './client';

export default async function ProfilPage() {
	const user = await getCurrentUser();

	if (!user) {
		redirect('/login');
	}

	return <ProfilClient user={user} />;
}
