import type React from 'react';
import { ViewTransition } from 'react';

/**
 * DirectionalTransition: Digunakan pada halaman hierarkis (List -> Form/Detail)
 * Merespon tipe 'nav-forward' dan 'nav-back' dengan transisi horizontal slide.
 */
export function DirectionalTransition({
	children,
	className
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<ViewTransition
			default='none'
			enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}
			exit={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}
		>
			<div className={className}>{children}</div>
		</ViewTransition>
	);
}

/**
 * LateralTransition: Digunakan pada halaman lateral/sibling (Dashboard, Tren, Master Data)
 * Menggunakan crossfade murni agar tidak menimbulkan efek kedalaman spasial semu.
 */
export function LateralTransition({
	children,
	className
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<ViewTransition default='none' enter='fade-in' exit='fade-out'>
			<div className={className}>{children}</div>
		</ViewTransition>
	);
}

/**
 * SuspenseReveal: Digunakan untuk membungkus konten async saat data selesai dimuat dari Suspense.
 */
export function SuspenseReveal({
	children,
	className
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<ViewTransition default='none' enter='slide-up'>
			<div className={className}>{children}</div>
		</ViewTransition>
	);
}
