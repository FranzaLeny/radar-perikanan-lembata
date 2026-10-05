'use client';

import { ProfilInfoCard } from './_components/profil-info-card';
import { ProfilPasswordForm } from './_components/profil-password-form';
import { ProfilPersonalForm } from './_components/profil-personal-form';
import type { ProfilClientProps } from './types';

export * from './types';

export function ProfilClient({ user }: ProfilClientProps) {
	return (
		<div className='container max-w-5xl space-y-8 py-8'>
			<div>
				<h1 className='font-bold font-heading text-2xl text-foreground tracking-tight'>
					Profil Pengguna
				</h1>
				<p className='mt-1 text-muted-foreground text-sm'>
					Kelola informasi identitas akun dan keamanan kata sandi Anda.
				</p>
			</div>

			<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
				<ProfilInfoCard user={user} />

				<div className='space-y-6 md:col-span-2'>
					<ProfilPersonalForm email={user.email} initialName={user.name} />
					<ProfilPasswordForm />
				</div>
			</div>
		</div>
	);
}
