import { Loader2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/shadcn/card';
import { Field, FieldDescription, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { updateUserCredentials } from '@/lib/actions/pengguna';
import type { CurrentUser } from '@/lib/auth';
import { authClient } from '@/lib/auth-client';

type ProfilPersonalFormProps = { user: CurrentUser };

export function ProfilPersonalForm({ user }: ProfilPersonalFormProps) {
	const router = useRouter();
	const [name, setName] = useState(user.name);
	const [email, setEmail] = useState(user.email);
	const [isUpdating, setIsUpdating] = useState(false);
	const isAdmin = user.role === 'admin';

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			toast.error('Nama lengkap tidak boleh kosong');
			return;
		}

		if (isAdmin && (!email.trim() || !email.includes('@'))) {
			toast.error('Format alamat email tidak valid');
			return;
		}

		setIsUpdating(true);
		try {
			if (isAdmin) {
				const res = await updateUserCredentials({
					userId: user.id,
					name: name.trim(),
					email: email.trim().toLowerCase()
				});

				if (res.success) {
					toast.success(res.message);
					router.refresh();
				} else {
					toast.error(res.error || res.message || 'Gagal memperbarui profil');
				}
			} else {
				const { error } = await authClient.updateUser({ name: name.trim() });

				if (!error) {
					toast.success('Profil berhasil diperbarui');
					router.refresh();
				} else {
					toast.error(error.message || 'Gagal memperbarui profil');
				}
			}
		} catch {
			toast.error('Terjadi kesalahan sistem saat memperbarui profil');
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<Card className='bg-card/60 backdrop-blur-md'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2 font-semibold'>
					<User className='size-4 text-muted-foreground' /> Informasi Pribadi
				</CardTitle>
				<CardDescription className='text-xs'>
					Perbarui nama lengkap dan informasi kontak akun Anda.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form className='space-y-4' onSubmit={handleUpdateProfile}>
					<Field>
						<FieldLabel htmlFor='nama'>Nama Lengkap</FieldLabel>
						<Input
							id='nama'
							onChange={(e) => setName(e.target.value)}
							placeholder='Nama lengkap Anda'
							required
							value={name}
						/>
					</Field>

					<Field>
						<div className='flex items-center justify-between'>
							<FieldLabel htmlFor='email'>Alamat Email</FieldLabel>
							{isAdmin ? (
								<Badge className='text-[10px]' variant='secondary'>
									Akses Admin
								</Badge>
							) : (
								<Badge className='text-[10px]' variant='outline'>
									Terkunci
								</Badge>
							)}
						</div>
						<Input
							className={!isAdmin ? 'cursor-not-allowed bg-muted/50 opacity-80' : ''}
							disabled={!isAdmin}
							id='email'
							onChange={(e) => setEmail(e.target.value)}
							placeholder='nama@radar.lembata.go.id'
							required
							type='email'
							value={email}
						/>
						<FieldDescription>
							{isAdmin
								? 'Sebagai Administrator, Anda dapat mengganti alamat email akun Anda sendiri secara langsung.'
								: 'Alamat email terdaftar tidak dapat diubah secara mandiri. Hubungi administrator untuk perubahan email.'}
						</FieldDescription>
					</Field>

					<Button className='cursor-pointer text-xs' disabled={isUpdating} size='sm' type='submit'>
						{isUpdating ? (
							<>
								<Loader2 className='mr-2 size-3.5 animate-spin' /> Menyimpan...
							</>
						) : (
							'Simpan Perubahan'
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
