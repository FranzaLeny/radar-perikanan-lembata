import type { Metadata } from 'next';

import { LoginForm } from './_components/login-form';

export const metadata: Metadata = {
	title: 'Masuk Portal Petugas & Verifikator',
	description:
		'Autentikasi akun petugas lapangan, pengelola mutu, dan administrator Dinas Perikanan Kabupaten Lembata.'
};

export default async function LoginPage() {
	'use cache';
	return <LoginForm />;
}
