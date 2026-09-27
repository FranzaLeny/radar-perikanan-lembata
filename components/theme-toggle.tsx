'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    // Cek pakai resolvedTheme: jika bukan dark maka ubah jadi dark, jika dark ubah jadi light
    if (resolvedTheme !== 'dark') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={`size-8 relative ${className || ''}`}
      onClick={handleToggle}
      title={mounted && resolvedTheme === 'dark' ? 'Ubah ke Mode Terang' : 'Ubah ke Mode Gelap'}
      aria-label={mounted && resolvedTheme === 'dark' ? 'Ubah ke Mode Terang' : 'Ubah ke Mode Gelap'}
      suppressHydrationWarning
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Ganti Tema</span>
    </Button>
  );
}

export const QuickThemeToggle = ThemeToggle;
