import { ThemeToggle } from '@/components/theme-toggle';
import { APP_CONFIG } from '@/lib/constants';
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-125 h-125 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <main className="w-full max-w-md relative z-10">
        {children}
      </main>

      <footer className="mt-8 text-center text-xs text-muted-foreground relative z-10 space-y-1">
        <p>© {APP_CONFIG.author.copyrightYear} {APP_CONFIG.institution.name} • {APP_CONFIG.name} {APP_CONFIG.versionLabel}</p>
        <p>{APP_CONFIG.fullName}</p>
        <p className="font-medium text-foreground/80">{APP_CONFIG.author.shortCredit}</p>
      </footer>
    </div>
  );
}
