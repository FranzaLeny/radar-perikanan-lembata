import { KeyRound, Loader2, Lock } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/shadcn/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/shadcn/card';
import { Field, FieldLabel } from '@/components/shadcn/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/shadcn/input-group';
import { authClient } from '@/lib/auth-client';

export function ProfilPasswordForm() {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isChanging, setIsChanging] = useState(false);

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!currentPassword) {
			toast.error('Masukkan kata sandi saat ini');
			return;
		}
		if (newPassword.length < 8) {
			toast.error('Kata sandi baru minimal 8 karakter');
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error('Konfirmasi kata sandi baru tidak cocok');
			return;
		}

		setIsChanging(true);
		try {
			const { error } = await authClient.changePassword({
				currentPassword,
				newPassword,
				revokeOtherSessions: true
			});

			if (!error) {
				toast.success('Kata sandi berhasil diubah');
				setCurrentPassword('');
				setNewPassword('');
				setConfirmPassword('');
			} else {
				toast.error(error.message || 'Gagal mengubah kata sandi');
			}
		} catch {
			toast.error('Terjadi kesalahan sistem saat mengubah kata sandi');
		} finally {
			setIsChanging(false);
		}
	};

	return (
		<Card className='bg-card/60 backdrop-blur-md'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2 font-semibold'>
					<KeyRound className='size-4 text-muted-foreground' /> Keamanan Kata Sandi
				</CardTitle>
				<CardDescription className='text-xs'>
					Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form className='space-y-4' onSubmit={handleChangePassword}>
					<Field>
						<FieldLabel htmlFor='current-pwd'>Kata Sandi Saat Ini</FieldLabel>
						<InputGroup>
							<InputGroupAddon align='inline-start'>
								<Lock className='size-4 text-muted-foreground' />
							</InputGroupAddon>
							<InputGroupInput
								id='current-pwd'
								onChange={(e) => setCurrentPassword(e.target.value)}
								placeholder='Masukkan kata sandi lama'
								required
								type='password'
								value={currentPassword}
							/>
						</InputGroup>
					</Field>

					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<Field>
							<FieldLabel htmlFor='new-pwd'>Kata Sandi Baru</FieldLabel>
							<InputGroup>
								<InputGroupAddon align='inline-start'>
									<Lock className='size-4 text-muted-foreground' />
								</InputGroupAddon>
								<InputGroupInput
									id='new-pwd'
									onChange={(e) => setNewPassword(e.target.value)}
									placeholder='Minimal 8 karakter'
									required
									type='password'
									value={newPassword}
								/>
							</InputGroup>
						</Field>

						<Field>
							<FieldLabel htmlFor='confirm-pwd'>Konfirmasi Kata Sandi Baru</FieldLabel>
							<InputGroup>
								<InputGroupAddon align='inline-start'>
									<Lock className='size-4 text-muted-foreground' />
								</InputGroupAddon>
								<InputGroupInput
									id='confirm-pwd'
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder='Ulangi kata sandi baru'
									required
									type='password'
									value={confirmPassword}
								/>
							</InputGroup>
						</Field>
					</div>

					<Button
						className='cursor-pointer text-xs'
						disabled={isChanging}
						size='sm'
						type='submit'
						variant='default'
					>
						{isChanging ? (
							<>
								<Loader2 className='mr-2 size-3.5 animate-spin' /> Memperbarui...
							</>
						) : (
							'Perbarui Kata Sandi'
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
