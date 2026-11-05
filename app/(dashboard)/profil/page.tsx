import { redirect } from 'next/navigation';

import { LateralTransition } from '@/components/transitions/page-transition';
import { getCurrentUser } from '@/lib/auth';
import { ProfilClient } from './client';

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
