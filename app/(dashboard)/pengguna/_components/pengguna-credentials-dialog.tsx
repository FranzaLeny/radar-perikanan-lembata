'use client';

import { Eye, EyeOff, KeyRound, Loader2, Lock, Mail, User } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/shadcn/dialog';
import { Field, FieldDescription, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/shadcn/input-group';
import { updateUserCredentials } from '@/lib/actions/pengguna';
import type { UserItem } from '../types';

type PenggunaCredentialsDialogProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	selectedUser: UserItem | null;
	isSelf?: boolean;
	onSuccess: (updatedUser: { id: string; name: string; email: string }) => void;
};

export function PenggunaCredentialsDialog({
	isOpen,
	onOpenChange,
	selectedUser,
	isSelf = false,
	onSuccess
}: PenggunaCredentialsDialogProps) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (selectedUser) {
			setName(selectedUser.name);
			setEmail(selectedUser.email);
			setNewPassword('');
			setConfirmPassword('');
			setShowPassword(false);
		}
	}, [selectedUser]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedUser) return;

		if (!name.trim()) {
			toast.error('Nama lengkap tidak boleh kosong');
			return;
		}

		if (!email.trim() || !email.includes('@')) {
			toast.error('Alamat email harus valid');
			return;
		}

		if (newPassword) {
			if (newPassword.length < 8) {
				toast.error('Kata sandi baru minimal 8 karakter');
				return;
			}
			if (newPassword !== confirmPassword) {
				toast.error('Konfirmasi kata sandi baru tidak cocok');
				return;
			}
		}

		setIsSubmitting(true);
		try {
			const res = await updateUserCredentials({
				userId: selectedUser.id,
				name: name.trim(),
				email: email.trim().toLowerCase(),
				newPassword: newPassword ? newPassword.trim() : undefined
			});

			if (res.success && res.data) {
				toast.success(res.message);
				onSuccess(res.data);
				onOpenChange(false);
			} else {
				toast.error(res.error || res.message || 'Gagal memperbarui kredensial');
			}
		} catch {
			toast.error('Terjadi kesalahan koneksi saat memperbarui kredensial');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={isOpen}>
			<DialogContent className='sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<KeyRound className='size-5 text-primary' />
						<span>Ubah Email & Kata Sandi Pengguna</span>
					</DialogTitle>
					<DialogDescription className='text-xs'>
						Sebagai Administrator, Anda dapat mengganti email dan menyetel kata sandi baru secara langsung
						untuk pengguna ini{' '}
						{isSelf && (
							<Badge className='ml-1 text-[10px]' variant='secondary'>
								Akun Anda
							</Badge>
						)}
						.
					</DialogDescription>
				</DialogHeader>

				<form className='space-y-4 py-2' onSubmit={handleSubmit}>
					<Field>
						<FieldLabel htmlFor='edit-user-name'>Nama Lengkap *</FieldLabel>
						<InputGroup>
							<InputGroupAddon align='inline-start'>
								<User className='size-4 text-muted-foreground' />
							</InputGroupAddon>
							<InputGroupInput
								id='edit-user-name'
								onChange={(e) => setName(e.target.value)}
								placeholder='Nama lengkap pengguna'
								required
								value={name}
							/>
						</InputGroup>
					</Field>

					<Field>
						<FieldLabel htmlFor='edit-user-email'>Alamat Email *</FieldLabel>
						<InputGroup>
							<InputGroupAddon align='inline-start'>
								<Mail className='size-4 text-muted-foreground' />
							</InputGroupAddon>
							<InputGroupInput
								id='edit-user-email'
								onChange={(e) => setEmail(e.target.value)}
								placeholder='nama@radar.lembata.go.id'
								required
								type='email'
								value={email}
							/>
						</InputGroup>
						<FieldDescription>Alamat email digunakan untuk masuk ke dalam sistem.</FieldDescription>
					</Field>

					<div className='space-y-3.5 rounded-lg border border-border/70 bg-muted/40 p-3.5'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-1.5 font-semibold text-foreground text-xs'>
								<Lock className='size-3.5 text-primary' />
								<span>Atur Kata Sandi Baru (Opsional)</span>
							</div>
							<Button
								className='h-7 text-muted-foreground text-xs'
								onClick={() => setShowPassword(!showPassword)}
								size='sm'
								type='button'
								variant='ghost'
							>
								{showPassword ? (
									<>
										<EyeOff className='mr-1 size-3.5' /> Sembunyikan
									</>
								) : (
									<>
										<Eye className='mr-1 size-3.5' /> Tampilkan
									</>
								)}
							</Button>
						</div>

						<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
							<Field>
								<FieldLabel htmlFor='edit-user-new-pwd'>Kata Sandi Baru</FieldLabel>
								<Input
									autoComplete='new-password'
									id='edit-user-new-pwd'
									onChange={(e) => setNewPassword(e.target.value)}
									placeholder='Minimal 8 karakter'
									type={showPassword ? 'text' : 'password'}
									value={newPassword}
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor='edit-user-confirm-pwd'>Konfirmasi Kata Sandi</FieldLabel>
								<Input
									autoComplete='new-password'
									id='edit-user-confirm-pwd'
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder='Ulangi kata sandi baru'
									type={showPassword ? 'text' : 'password'}
									value={confirmPassword}
								/>
							</Field>
						</div>
						<p className='text-[11px] text-muted-foreground'>
							💡 Kosongkan bagian kata sandi jika hanya ingin mengganti nama atau email saja.
						</p>
					</div>

					<DialogFooter className='pt-3'>
						<Button
							disabled={isSubmitting}
							onClick={() => onOpenChange(false)}
							type='button'
							variant='outline'
						>
							Batal
						</Button>
						<Button disabled={isSubmitting} type='submit'>
							{isSubmitting ? (
								<>
									<Loader2 className='mr-1.5 size-3.5 animate-spin' />
									Menyimpan...
								</>
							) : (
								'Simpan Kredensial'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
