import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Toaster } from '@/components/shadcn/sonner';
import { TooltipProvider } from '@/components/shadcn/tooltip';
import { ThemeProvider } from '@/components/theme-provider';
import { SITE_METADATA } from '@/lib/constants';
import { cn } from '@/lib/utils';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = SITE_METADATA;

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			className={cn('h-full font-sans antialiased', geistSans.variable, geistMono.variable)}
			lang='id'
			suppressHydrationWarning
		>
			<body className='flex min-h-full flex-col font-sans'>
				<ThemeProvider attribute='class' defaultTheme='system' disableTransitionOnChange enableSystem>
					<TooltipProvider>
						{children}
						<Toaster closeButton position='top-right' richColors />
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
