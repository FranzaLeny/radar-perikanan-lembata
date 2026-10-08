'use client';

import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/shadcn/alert';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardFooter } from '@/components/shadcn/card';
import { Field, FieldError, FieldLabel } from '@/components/shadcn/field';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput
} from '@/components/shadcn/input-group';
import { authClient } from '@/lib/auth-client';
import { APP_CONFIG } from '@/lib/constants';
import { toFieldErrors } from '@/lib/utils';
import { loginSchema } from '@/lib/validations/auth';
import { getCandidateEmails } from '../utils';
import { LoginDemoPills } from './login-demo-pills';
import { LoginHeader } from './login-header';

export function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const errorParam = searchParams.get('error');
	const { data: session, isPending: isSessionPending } = authClient.useSession();

	useEffect(() => {
		if (!isSessionPending && session?.user && !errorParam) {
			router.replace('/dashboard');
		}
	}, [session, isSessionPending, errorParam, router]);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
	const [errorMessage, setErrorMessage] = useState<string | null>(
		errorParam === 'session_invalid'
			? 'Sesi Anda telah kedaluwarsa atau akun tidak ditemukan dalam sistem. Silakan masuk kembali.'
			: errorParam === 'unauthorized'
				? 'Akses ditolak: Anda tidak memiliki wewenang untuk halaman tersebut.'
				: null
	);
	const [isLoading, setIsLoading] = useState(false);

	const handleDemoSelect = (demoEmail: string) => {
		setEmail(demoEmail);
		setPassword('');
		setFieldErrors({});
		setErrorMessage(null);
		toast.info(`Akun demo ${demoEmail} dipilih. Klik 'Masuk ke Dashboard' untuk melanjutkan.`);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);
		setFieldErrors({});

		const effectivePassword =
			password.trim() || process.env.NEXT_PUBLIC_DEFAULT_PASSWORD || 'password123';

		// 1. Validasi Client-Side dengan Zod
		const validation = loginSchema.safeParse({ email, password: effectivePassword });
		if (!validation.success) {
			setFieldErrors(validation.error.flatten().fieldErrors);
			return;
		}

		setIsLoading(true);
		try {
			const candidateEmails = getCandidateEmails(email);
			let isSuccess = false;
			let lastErrMsg = 'Email atau kata sandi tidak cocok.';

			for (const candEmail of candidateEmails) {
				const { data, error } = await authClient.signIn.email({
					email: candEmail,
					password: effectivePassword
				});

				if (!error && data) {
					isSuccess = true;
					break;
				}

				if (error) {
					lastErrMsg = error.message || lastErrMsg;
				}
			}

			if (isSuccess) {
				toast.success(`Berhasil masuk ke sistem ${APP_CONFIG.name}!`);
				router.push('/dashboard');
				router.refresh();
			} else {
				setErrorMessage(lastErrMsg);
				toast.error(lastErrMsg);
			}
		} catch {
			setErrorMessage('Terjadi gangguan jaringan atau server.');
			toast.error('Terjadi gangguan jaringan.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className='shadow-xl backdrop-blur-xs'>
			<LoginHeader />

			<CardContent className='space-y-4'>
				{errorMessage && (
					<Alert variant='destructive'>
						<AlertCircle className='size-4' />
						<AlertTitle>Gagal Masuk</AlertTitle>
						<AlertDescription>{errorMessage}</AlertDescription>
					</Alert>
				)}

				<form className='space-y-4' onSubmit={handleSubmit}>
					<Field>
						<FieldLabel htmlFor='email'>Alamat Email</FieldLabel>
						<InputGroup>
							<InputGroupAddon align='inline-start'>
								<Mail className='size-4 text-muted-foreground' />
							</InputGroupAddon>
							<InputGroupInput
								autoComplete='email'
								id='email'
								onChange={(e) => setEmail(e.target.value)}
								placeholder={`nama@${APP_CONFIG.institution.emailDomain}`}
								required
								type='email'
								value={email}
							/>
						</InputGroup>
						<FieldError errors={toFieldErrors(fieldErrors.email)} />
					</Field>

					<Field>
						<FieldLabel htmlFor='password'>Kata Sandi</FieldLabel>
						<InputGroup>
							<InputGroupAddon align='inline-start'>
								<Lock className='size-4 text-muted-foreground' />
							</InputGroupAddon>
							<InputGroupInput
								autoComplete='current-password'
								id='password'
								onChange={(e) => setPassword(e.target.value)}
								placeholder={email ? '•••••••• (Otomatis untuk akun demo)' : '••••••••'}
								type={showPassword ? 'text' : 'password'}
								value={password}
							/>
							<InputGroupAddon align='inline-end'>
								<InputGroupButton
									onClick={() => setShowPassword(!showPassword)}
									size='icon-xs'
									title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
									type='button'
								>
									{showPassword ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
								</InputGroupButton>
							</InputGroupAddon>
						</InputGroup>
						<FieldError errors={toFieldErrors(fieldErrors.password)} />
					</Field>

					<Button
						className='w-full cursor-pointer gap-2 font-semibold shadow-xs'
						disabled={isLoading}
						type='submit'
					>
						{isLoading ? (
							<>
								<Loader2 className='size-4 animate-spin' />
								<span>Memproses Otentikasi...</span>
							</>
						) : (
							<>
								<span>Masuk ke Dashboard</span>
								<ArrowRight className='size-4' />
							</>
						)}
					</Button>
				</form>

				<LoginDemoPills onSelect={handleDemoSelect} />
			</CardContent>

			<CardFooter className='flex items-center justify-center border-border border-t pt-2 pb-4 text-muted-foreground text-xs'>
				<span>{APP_CONFIG.author.credit}</span>
			</CardFooter>
		</Card>
	);
}
