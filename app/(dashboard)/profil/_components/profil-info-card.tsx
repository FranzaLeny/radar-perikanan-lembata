import { CheckCircle2, Mail, Shield } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/shadcn/avatar';
import { Badge } from '@/components/shadcn/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/shadcn/card';
import type { CurrentUser } from '@/lib/auth';

type ProfilInfoCardProps = { user: CurrentUser };

export function ProfilInfoCard({ user }: ProfilInfoCardProps) {
	const getRoleBadge = (role: string) => {
		switch (role) {
			case 'admin':
				return <Badge className='border-rose-500/30 bg-rose-500/20 text-rose-300'>Administrator</Badge>;
			case 'pengelola_mutu':
				return (
					<Badge className='border-amber-500/30 bg-amber-500/20 text-amber-300'>Pengelola Mutu</Badge>
				);
			case 'kepala_dinas':
				return (
					<Badge className='border-purple-500/30 bg-purple-500/20 text-purple-300'>Kepala Dinas</Badge>
				);
			default:
				return (
					<Badge className='border-emerald-500/30 bg-emerald-500/20 text-emerald-300'>
						Petugas Lapangan
					</Badge>
				);
		}
	};

	return (
		<Card className='bg-card/60 backdrop-blur-md'>
			<CardHeader className='pb-2 text-center'>
				<Avatar className='mx-auto size-20 border-2 border-border shadow-md'>
					<AvatarFallback className='bg-muted font-bold text-foreground text-xl'>
						{user.name.slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<CardTitle className='mt-3 font-bold text-lg'>{user.name}</CardTitle>
				<CardDescription className='text-xs'>{user.email}</CardDescription>
				<div className='mt-2 flex justify-center'>{getRoleBadge(user.role)}</div>
			</CardHeader>
			<CardContent className='space-y-4 border-border/50 border-t pt-4 text-xs'>
				<div className='flex items-center justify-between py-1'>
					<span className='flex items-center gap-2 text-muted-foreground'>
						<Shield className='size-3.5' /> Status Akun
					</span>
					<span className='flex items-center gap-1 font-semibold text-emerald-500'>
						<CheckCircle2 className='size-3.5' /> Aktif
					</span>
				</div>
				<div className='flex items-center justify-between py-1'>
					<span className='flex items-center gap-2 text-muted-foreground'>
						<Mail className='size-3.5' /> Penyedia Autentikasi
					</span>
					<span className='font-medium'>BetterAuth Credential</span>
				</div>
			</CardContent>
		</Card>
	);
}
