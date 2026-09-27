'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_CONFIG } from '@/lib/constants';
import { SearchForm } from '@/components/search-form';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { QuickThemeToggle } from '@/components/theme-toggle';
import {
  Droplets,
  PlusIcon,
  MinusIcon,
  LayoutDashboard,
  TestTube2,
  TrendingUp,
  FileSpreadsheet,
  FileCheck2,
  Scale,
  MapPin,
  Users2,
  Users,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import type { CurrentUser } from '@/lib/auth';

interface SubMenuItem {
  title: string;
  url: string;
  isActive: boolean;
}

interface NavCollapsibleItem {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  subItems: SubMenuItem[];
}

function CollapsibleSubMenu({ item }: { item: NavCollapsibleItem }) {
  const [open, setOpen] = React.useState(item.isActive);

  React.useEffect(() => {
    if (item.isActive) {
      setOpen(true);
    }
  }, [item.isActive]);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={item.isActive}
          render={<CollapsibleTrigger />}
        >
          {item.icon && <item.icon className="size-4" />}
          <span className="font-medium text-xs">{item.title}</span>
          <PlusIcon className="ml-auto size-3.5 group-aria-expanded/menu-button:hidden opacity-70" />
          <MinusIcon className="ml-auto size-3.5 hidden group-aria-expanded/menu-button:block opacity-70" />
        </SidebarMenuButton>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.subItems.map((sub) => (
              <SidebarMenuSubItem key={sub.title}>
                <SidebarMenuSubButton
                  isActive={sub.isActive}
                  render={<Link href={sub.url} />}
                >
                  <span className="text-xs">{sub.title}</span>
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

export function AppSidebar({ user, ...props }: AppSidebarProps) {
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
          },
        },
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
          isActive: pathname === '/dashboard',
        },
        {
          title: 'Analisis Tren Mutu',
          url: '/tren',
          icon: TrendingUp,
          isActive: pathname === '/tren',
        },
      ],
    },
    {
      title: 'Operasional & Uji',
      items: [
        {
          title: 'Uji Kualitas Air',
          icon: TestTube2,
          isActive: pathname.startsWith('/uji-kualitas'),
          subItems: [
            {
              title: 'Daftar Hasil Uji',
              url: '/uji-kualitas',
              isActive: pathname === '/uji-kualitas',
            },
            {
              title: 'Input Uji Lapangan',
              url: '/uji-kualitas/input',
              isActive: pathname === '/uji-kualitas/input',
            },
          ],
        },
        {
          title: 'Instruksi Kerja (IK)',
          icon: FileCheck2,
          isActive: pathname.startsWith('/instruksi-kerja'),
          subItems: [
            {
              title: 'Jadwal Sampel & SOP',
              url: '/instruksi-kerja',
              isActive: pathname === '/instruksi-kerja',
            },
          ],
        },
      ],
    },
    {
      title: 'Master Data',
      roles: ['admin', 'pengelola_mutu', 'kepala_dinas'],
      items: [
        {
          title: 'Lokasi Kolam',
          url: '/lokasi-kolam',
          icon: MapPin,
          isActive: pathname === '/lokasi-kolam',
        },
        {
          title: 'Baku Mutu Air',
          url: '/baku-mutu',
          icon: Scale,
          isActive: pathname === '/baku-mutu',
        },
        {
          title: 'Pegawai & Pejabat TTD',
          url: '/pegawai',
          icon: Users,
          isActive: pathname === '/pegawai',
        },
        {
          title: 'Manajemen Pengguna',
          url: '/pengguna',
          icon: Users2,
          isActive: pathname === '/pengguna',
          roles: ['admin'],
        },
      ],
    },
    {
      title: 'Laporan & Dokumen',
      items: [
        {
          title: 'Laporan Hasil Uji (LHU)',
          url: '/laporan',
          icon: FileSpreadsheet,
          isActive: pathname === '/laporan',
        },
        {
          title: 'Rekapitulasi Tahunan',
          url: '/laporan/rekap-tahunan',
          icon: FileSpreadsheet,
          isActive: pathname === '/laporan/rekap-tahunan',
        },
        {
          title: 'Verifikasi Publik QR',
          url: '/verifikasi/sample-preview',
          icon: ShieldCheck,
          isActive: pathname.startsWith('/verifikasi'),
        },
      ],
    },
  ];

  const roleLabels: Record<string, string> = {
    admin: 'Administrator',
    pengelola_mutu: 'Pengelola Mutu',
    petugas_lapangan: 'Petugas Lapangan',
    kepala_dinas: 'Kepala Dinas',
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <div className="flex aspect-square size-9 items-center justify-center shrink-0">
                <img
                  src={APP_CONFIG.logo.app}
                  alt={APP_CONFIG.name}
                  className="size-8 object-contain rounded-md drop-shadow-xs"
                />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-heading font-semibold text-sm tracking-tight text-foreground">
                  {APP_CONFIG.name}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
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
                <SidebarGroupLabel className="text-xs font-semibold tracking-wider uppercase text-muted-foreground/80">
                  {group.title}
                </SidebarGroupLabel>
                <SidebarMenu>
                  {visibleItems.map((item) => {
                    if ('subItems' in item && item.subItems && item.subItems.length > 0) {
                      return (
                        <CollapsibleSubMenu
                          key={item.title}
                          item={item as NavCollapsibleItem}
                        />
                      );
                    }

                    const itemUrl = 'url' in item ? (item.url as string) : '#';

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          isActive={item.isActive}
                          render={<Link href={itemUrl} />}
                        >
                          {item.icon && <item.icon className="size-4" />}
                          <span className="font-medium text-xs">{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>
            );
          })}
      </SidebarContent>

      <SidebarFooter className="border-t p-3 bg-muted/20">
        <div className="flex items-center gap-2.5">
          <Link href="/profil" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity" title="Buka Profil">
            <Avatar className="size-8 ring-1 ring-border">
              <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'PL'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold truncate text-foreground">
                {user?.name || 'Petugas Laboratorium'}
              </span>
              <span className="text-xs text-muted-foreground truncate uppercase font-medium">
                {roleLabels[userRole] || userRole}
              </span>
            </div>
          </Link>
          <QuickThemeToggle />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Keluar dari sistem"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
