import { Loader2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import { Field, FieldDescription, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { authClient } from '@/lib/auth-client';

type ProfilPersonalFormProps = { initialName: string; email: string };

export function ProfilPersonalForm({ initialName, email }: ProfilPersonalFormProps) {
	const router = useRouter();
	const [name, setName] = useState(initialName);
	const [isUpdating, setIsUpdating] = useState(false);

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			toast.error('Nama lengkap tidak boleh kosong');
			return;
		}

		setIsUpdating(true);
		try {
			const { error } = await authClient.updateUser({ name: name.trim() });

			if (!error) {
				toast.success('Profil berhasil diperbarui');
				router.refresh();
			} else {
				toast.error(error.message || 'Gagal memperbarui profil');
			}
		} catch {
			toast.error('Terjadi kesalahan sistem');
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
					Perbarui nama lengkap yang akan ditampilkan pada dokumen dan riwayat aktivitas.
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
						<FieldLabel htmlFor='email'>Alamat Email (Terkunci)</FieldLabel>
						<Input
							className='cursor-not-allowed bg-muted/50 opacity-80'
							disabled
							id='email'
							value={email}
						/>
						<FieldDescription>
							Alamat email terdaftar tidak dapat diubah secara mandiri. Hubungi administrator untuk
							perubahan email.
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
