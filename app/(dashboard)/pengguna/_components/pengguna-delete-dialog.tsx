'use client';

import { AlertTriangle, Info, Loader2, ShieldAlert, Trash2, UserX } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/shadcn/dialog';
import { BRAND_NAME } from '@/lib/constants';
import type { UserItem } from '../types';

type PenggunaDeleteDialogProps = {
	deleteUser: UserItem | null;
	isDeleteDialogOpen: boolean;
	onDeleteOpenChange: (open: boolean) => void;
	onConfirmDelete: () => void;
	isDeleting: boolean;
	cannotDeleteUser: UserItem | null;
	onCannotDeleteClose: () => void;
	onDeactivateFromInfo: () => void;
};

export function PenggunaDeleteDialog({
	deleteUser,
	isDeleteDialogOpen,
	onDeleteOpenChange,
	onConfirmDelete,
	isDeleting,
	cannotDeleteUser,
	onCannotDeleteClose,
	onDeactivateFromInfo
}: PenggunaDeleteDialogProps) {
	return (
		<>
			{/* Dialog Modal Konfirmasi Hapus Pengguna (Untuk user yang belum terpakai) */}
			<Dialog onOpenChange={onDeleteOpenChange} open={isDeleteDialogOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle className='flex items-center gap-2 text-destructive'>
							<Trash2 className='size-4' />
							<span>Konfirmasi Hapus Akun Pengguna</span>
						</DialogTitle>
						<DialogDescription className='text-xs'>
							Tindakan ini akan menghapus akun <strong>{deleteUser?.name}</strong> ({deleteUser?.email})
							beserta seluruh hak akses login secara permanen dari database.
						</DialogDescription>
					</DialogHeader>

					<div className='space-y-1 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-muted-foreground text-xs'>
						<p className='flex items-center gap-1.5 font-semibold text-destructive'>
							<AlertTriangle className='size-3.5' /> Informasi Penghapusan:
						</p>
						<p>
							Akun ini belum memiliki riwayat pengujian kualitas air, sehingga aman untuk dihapus secara
							permanen. Tindakan ini tidak dapat dibatalkan.
						</p>
					</div>

					<DialogFooter className='pt-2'>
						<Button
							disabled={isDeleting}
							onClick={() => onDeleteOpenChange(false)}
							type='button'
							variant='outline'
						>
							Batal
						</Button>
						<Button disabled={isDeleting} onClick={onConfirmDelete} type='button' variant='destructive'>
							{isDeleting ? (
								<>
									<Loader2 className='mr-1.5 size-3.5 animate-spin' />
									Menghapus...
								</>
							) : (
								'Ya, Hapus Akun'
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Dialog Modal Info Pengguna Tidak Bisa Dihapus Karena Terlanjur Dipakai */}
			<Dialog onOpenChange={(open) => !open && onCannotDeleteClose()} open={!!cannotDeleteUser}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle className='flex items-center gap-2 text-amber-500'>
							<ShieldAlert className='size-4' />
							<span>Akun Tidak Dapat Dihapus</span>
						</DialogTitle>
						<DialogDescription className='text-xs'>
							Akun <strong>{cannotDeleteUser?.name}</strong> ({cannotDeleteUser?.email}) terikat dengan
							data transaksi riwayat pengujian.
						</DialogDescription>
					</DialogHeader>

					<div className='space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-foreground text-xs'>
						<p className='flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400'>
							<Info className='size-3.5' /> Terdaftar dalam {cannotDeleteUser?.transactionCount || 1} Data
							Pengujian
						</p>
						<p className='text-muted-foreground'>
							Untuk menjaga integritas <strong>Audit Trail</strong> dan keabsahan lembar hasil uji (LHU)
							laboratorium, akun yang sudah pernah digunakan dalam pencatatan pengujian{' '}
							<strong>tidak boleh dihapus</strong>.
						</p>
						<p className='text-muted-foreground'>
							Sesuai standar operasional, akun ini <strong>hanya dapat dinonaktifkan</strong> agar tidak
							dapat lagi login atau melakukan aktivitas apapun di sistem {BRAND_NAME}.
						</p>
					</div>

					<DialogFooter className='flex-col gap-2 pt-2 sm:flex-row'>
						<Button onClick={onCannotDeleteClose} type='button' variant='outline'>
							Tutup
						</Button>
						{cannotDeleteUser?.aktif && (
							<Button
								className='bg-amber-600 text-white hover:bg-amber-700'
								onClick={onDeactivateFromInfo}
								type='button'
							>
								<UserX className='mr-1.5 size-3.5' />
								Nonaktifkan Akun Ini
							</Button>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
