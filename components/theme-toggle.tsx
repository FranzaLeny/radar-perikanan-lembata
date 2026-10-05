'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/components/shadcn/button';

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
			aria-label={mounted && resolvedTheme === 'dark' ? 'Ubah ke Mode Terang' : 'Ubah ke Mode Gelap'}
			className={`relative size-8 ${className || ''}`}
			onClick={handleToggle}
			size='icon-sm'
			suppressHydrationWarning
			title={mounted && resolvedTheme === 'dark' ? 'Ubah ke Mode Terang' : 'Ubah ke Mode Gelap'}
			variant='ghost'
		>
			<Sun className='size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
			<Moon className='absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
			<span className='sr-only'>Ganti Tema</span>
		</Button>
	);
}

export const QuickThemeToggle = ThemeToggle;
