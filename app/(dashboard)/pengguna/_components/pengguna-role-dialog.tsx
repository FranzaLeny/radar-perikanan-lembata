'use client';

import { Loader2, ShieldCheck } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/shadcn/select';
import { authClient } from '@/lib/auth-client';
import type { UserItem, UserRole } from '../types';

type PenggunaRoleDialogProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	selectedUser: UserItem | null;
	onSuccess: (userId: string, newRole: string) => void;
};

export function PenggunaRoleDialog({
	isOpen,
	onOpenChange,
	selectedUser,
	onSuccess
}: PenggunaRoleDialogProps) {
	const [selectedRole, setSelectedRole] = useState<string>('');
	const [isUpdatingRole, setIsUpdatingRole] = useState(false);

	useEffect(() => {
		if (selectedUser) {
			setSelectedRole(selectedUser.role);
		}
	}, [selectedUser]);

	const handleSubmitRoleChange = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedUser || !selectedRole) return;

		setIsUpdatingRole(true);
		try {
			const { error } = await authClient.admin.setRole({
				userId: selectedUser.id,
				role: selectedRole as 'user' | 'admin' | ('user' | 'admin')[]
			});

			if (!error) {
				onSuccess(selectedUser.id, selectedRole);
				toast.success('Wewenang role berhasil diubah.');
				onOpenChange(false);
			} else {
				toast.error(error.message || 'Gagal mengubah wewenang role.');
			}
		} catch {
			toast.error('Gagal memperbarui wewenang role pengguna.');
		} finally {
			setIsUpdatingRole(false);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={isOpen}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<ShieldCheck className='size-4 text-primary' />
						<span>Ubah Hak Akses & Peran Pengguna</span>
					</DialogTitle>
					<DialogDescription className='text-xs'>
						Perbarui wewenang role RBAC untuk <strong>{selectedUser?.name}</strong> ({selectedUser?.email}
						).
					</DialogDescription>
				</DialogHeader>

				<form className='space-y-4 py-2' onSubmit={handleSubmitRoleChange}>
					<Field>
						<FieldLabel htmlFor='edit-role'>Pilih Wewenang Akses Baru *</FieldLabel>
						<Select
							onValueChange={(val) => {
								if (val) setSelectedRole(val as UserRole);
							}}
							value={selectedRole}
						>
							<SelectTrigger id='edit-role'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='petugas_lapangan'>Petugas Lapangan (Input & Scan Data)</SelectItem>
								<SelectItem value='pengelola_mutu'>Pengelola Mutu (Kelola SOP & Baku Mutu)</SelectItem>
								<SelectItem value='kepala_dinas'>Kepala Dinas (Dashboard & Approve LHU)</SelectItem>
								<SelectItem value='admin'>Administrator (Akses Penuh Sistem)</SelectItem>
							</SelectContent>
						</Select>
						<FieldDescription>
							Perubahan role akan langsung berlaku pada sesi login berikutnya.
						</FieldDescription>
					</Field>

					<DialogFooter className='pt-2'>
						<Button
							disabled={isUpdatingRole}
							onClick={() => onOpenChange(false)}
							type='button'
							variant='outline'
						>
							Batal
						</Button>
						<Button disabled={isUpdatingRole} type='submit'>
							{isUpdatingRole ? (
								<>
									<Loader2 className='mr-1.5 size-3.5 animate-spin' />
									Menyimpan...
								</>
							) : (
								'Simpan Perubahan Role'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
