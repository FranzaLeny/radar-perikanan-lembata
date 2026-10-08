'use client';

import { cn } from 'cn';
import {
	FileCheck2,
	FileSpreadsheet,
	LayoutDashboard,
	LogOut,
	MapPin,
	MinusIcon,
	PlusIcon,
	Scale,
	ShieldCheck,
	TestTube2,
	TrendingUp,
	Users,
	Users2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

import { SearchForm } from '@/components/search-form';
import { Avatar, AvatarFallback } from '@/components/shadcn/avatar';
import { Button } from '@/components/shadcn/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from '@/components/shadcn/collapsible';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail
} from '@/components/shadcn/sidebar';
import { QuickThemeToggle } from '@/components/theme-toggle';
import type { CurrentUser } from '@/lib/auth';
import { authClient } from '@/lib/auth-client';
import { APP_CONFIG } from '@/lib/constants';

type SubMenuItem = { title: string; url: string; isActive: boolean };

type NavCollapsibleItem = {
	title: string;
	icon?: React.ComponentType<{ className?: string }>;
	isActive: boolean;
	subItems: SubMenuItem[];
};

function CollapsibleSubMenu({ item }: { item: NavCollapsibleItem }) {
	const [open, setOpen] = React.useState(item.isActive);

	React.useEffect(() => {
		if (item.isActive) {
			setOpen(true);
		}
	}, [item.isActive]);

	return (
		<Collapsible className='group/collapsible' onOpenChange={setOpen} open={open}>
			<SidebarMenuItem>
				<SidebarMenuButton isActive={item.isActive} render={<CollapsibleTrigger />}>
					{item.icon && <item.icon className='size-4' />}
					<span className='font-medium'>{item.title}</span>
					<PlusIcon className='ml-auto size-3.5 opacity-70 group-aria-expanded/menu-button:hidden' />
					<MinusIcon className='ml-auto hidden size-3.5 opacity-70 group-aria-expanded/menu-button:block' />
				</SidebarMenuButton>
				<CollapsibleContent>
					<SidebarMenuSub>
						{item.subItems.map((sub) => (
							<SidebarMenuSubItem key={sub.title}>
								<SidebarMenuSubButton isActive={sub.isActive} render={<Link href={sub.url} />}>
									{sub.title}
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user?: CurrentUser | null;
}

export function AppSidebar({ user, className, ...props }: AppSidebarProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [isLoggingOut, setIsLoggingOut] = React.useState(false);

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						router.push('/login');
						router.refresh();
					}
				}
			});
		} catch {
			router.push('/login');
		} finally {
			setIsLoggingOut(false);
		}
	};

	const userRole = user?.role || 'petugas_lapangan';

	const navGroups = [
		{
			title: 'Ringkasan & Analitik',
			items: [
				{
					title: 'Dashboard Utama',
					url: '/dashboard',
					icon: LayoutDashboard,
					isActive: pathname === '/dashboard'
				},
				{ title: 'Analisis Tren Mutu', url: '/tren', icon: TrendingUp, isActive: pathname === '/tren' }
			]
		},
		{
			title: 'Operasional & Uji',
			items: [
				{
					title: 'Uji Kualitas Air',
					icon: TestTube2,
					isActive: pathname.startsWith('/uji-kualitas'),
					subItems: [
						{ title: 'Daftar Hasil Uji', url: '/uji-kualitas', isActive: pathname === '/uji-kualitas' },
						{
							title: 'Input Uji Lapangan',
							url: '/uji-kualitas/input',
							isActive: pathname === '/uji-kualitas/input'
						}
					]
				},
				{
					title: 'Dokumen Mutu',
					icon: FileCheck2,
					isActive: pathname.startsWith('/dokumen-mutu') || pathname.startsWith('/instruksi-kerja'),
					subItems: [
						{
							title: 'Katalog Dokumen Mutu',
							url: '/dokumen-mutu',
							isActive: pathname === '/dokumen-mutu' || pathname === '/instruksi-kerja'
						},
						{
							title: 'Kategori Dokumen',
							url: '/dokumen-mutu/kategori',
							isActive: pathname === '/dokumen-mutu/kategori'
						}
					]
				}
			]
		},
		{
			title: 'Master Data',
			roles: ['admin', 'pengelola_mutu', 'kepala_dinas'],
			items: [
				{
					title: 'Lokasi Kolam',
					url: '/lokasi-kolam',
					icon: MapPin,
					isActive: pathname === '/lokasi-kolam'
				},
				{ title: 'Baku Mutu Air', url: '/baku-mutu', icon: Scale, isActive: pathname === '/baku-mutu' },
				{
					title: 'Pegawai & Pejabat TTD',
					url: '/pegawai',
					icon: Users,
					isActive: pathname === '/pegawai'
				},
				{
					title: 'Manajemen Pengguna',
					url: '/pengguna',
					icon: Users2,
					isActive: pathname === '/pengguna',
					roles: ['admin']
				}
			]
		},
		{
			title: 'Laporan & Dokumen',
			items: [
				{
					title: 'Laporan Hasil Uji (LHU)',
					url: '/laporan',
					icon: FileSpreadsheet,
					isActive: pathname === '/laporan'
				},
				{
					title: 'Rekapitulasi Tahunan',
					url: '/laporan/rekap-tahunan',
					icon: FileSpreadsheet,
					isActive: pathname === '/laporan/rekap-tahunan'
				},
				{
					title: 'Verifikasi Publik QR',
					url: '/verifikasi/sample-preview',
					icon: ShieldCheck,
					isActive: pathname.startsWith('/verifikasi')
				}
			]
		}
	];

	const roleLabels: Record<string, string> = {
		admin: 'Administrator',
		pengelola_mutu: 'Pengelola Mutu',
		petugas_lapangan: 'Petugas Lapangan',
		kepala_dinas: 'Kepala Dinas'
	};

	return (
		<Sidebar className={cn('no-print print:hidden', className)} {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton render={<Link href='/dashboard' />} size='lg'>
							<div className='flex aspect-square size-9 shrink-0 items-center justify-center'>
								<Image
									alt={APP_CONFIG.name}
									className='size-8 rounded-md object-contain drop-shadow-xs'
									height={32}
									priority
									src={APP_CONFIG.logo.app}
									width={32}
								/>
							</div>
							<div className='flex flex-col gap-0.5 leading-none'>
								<span className='font-bold font-heading text-foreground text-md tracking-tight'>
									{APP_CONFIG.name}
								</span>
								<span className='font-medium text-muted-foreground text-xs'>
									{APP_CONFIG.institution.shortName}
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<SearchForm />
			</SidebarHeader>

			<SidebarContent>
				{navGroups
					.filter((group) => !group.roles || group.roles.includes(userRole))
					.map((group) => {
						const visibleItems = group.items.filter(
							(item) => !('roles' in item) || (item.roles as string[]).includes(userRole)
						);

						if (visibleItems.length === 0) return null;

						return (
							<SidebarGroup key={group.title}>
								<SidebarGroupLabel className='font-semibold text-muted-foreground/80 uppercase tracking-wider'>
									{group.title}
								</SidebarGroupLabel>
								<SidebarMenu>
									{visibleItems.map((item) => {
										if ('subItems' in item && item.subItems && item.subItems.length > 0) {
											return <CollapsibleSubMenu item={item as NavCollapsibleItem} key={item.title} />;
										}

										const itemUrl = 'url' in item ? (item.url as string) : '#';

										return (
											<SidebarMenuItem key={item.title}>
												<SidebarMenuButton isActive={item.isActive} render={<Link href={itemUrl} />}>
													{item.icon && <item.icon className='size-4' />}
													<span className='font-medium'>{item.title}</span>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							</SidebarGroup>
						);
					})}
			</SidebarContent>

			<SidebarFooter className='border-t bg-muted/20 p-3'>
				<div className='flex items-center gap-2.5'>
					<Link
						className='flex min-w-0 flex-1 items-center gap-2.5 transition-opacity hover:opacity-80'
						href='/profil'
						title='Buka Profil'
					>
						<Avatar className='size-8 ring-1 ring-border'>
							<AvatarFallback className='bg-muted font-semibold text-foreground text-xs'>
								{user?.name ? user.name.substring(0, 2).toUpperCase() : 'PL'}
							</AvatarFallback>
						</Avatar>
						<div className='flex min-w-0 flex-1 flex-col'>
							<span className='truncate font-semibold text-foreground text-xs'>
								{user?.name || 'Petugas Laboratorium'}
							</span>
							<span className='truncate font-medium text-muted-foreground text-xs uppercase'>
								{roleLabels[userRole] || userRole}
							</span>
						</div>
					</Link>
					<QuickThemeToggle />
					<Button
						className='text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
						disabled={isLoggingOut}
						onClick={handleLogout}
						size='icon-sm'
						title='Keluar dari sistem'
						variant='ghost'
					>
						<LogOut className='size-4' />
					</Button>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
