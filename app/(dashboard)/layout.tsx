import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { DashboardBreadcrumb } from '@/components/dashboard-breadcrumb';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 no-print bg-background/95 backdrop-blur-xs sticky top-0 z-20 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DashboardBreadcrumb />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/15 print:p-0 print:bg-white overflow-auto">
          {children}
        </main>
        <footer className="border-t border-border py-3 px-6 text-center text-xs text-muted-foreground no-print bg-background/80 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Dinas Perikanan Kabupaten Lembata • SIPEKA</p>
          <p className="font-medium text-muted-foreground">with ❤️ by MHLB</p>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
