'use client';

import { Check, Download, FileCode, FileImage } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu';

type QrDownloadButtonProps = {
	qrDataUrl: string;
	qrSvgString?: string;
	fileNamePrefix: string;
	label?: string;
};

export function QrDownloadButton({
	qrDataUrl,
	qrSvgString,
	fileNamePrefix,
	label = 'Unduh QR Code'
}: QrDownloadButtonProps) {
	const [downloaded, setDownloaded] = useState<string | null>(null);

	const handleDownloadPng = () => {
		try {
			const link = document.createElement('a');
			link.href = qrDataUrl;
			link.download = `QR-${fileNamePrefix}.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			setDownloaded('png');
			toast.success(`QR Code PNG (${fileNamePrefix}) berhasil diunduh.`);
			setTimeout(() => setDownloaded(null), 2000);
		} catch {
			toast.error('Gagal mengunduh file PNG.');
		}
	};

	const handleDownloadSvg = () => {
		try {
			if (!qrSvgString) {
				toast.error('Format SVG tidak tersedia.');
				return;
			}
			const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `QR-${fileNamePrefix}.svg`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			setDownloaded('svg');
			toast.success(`QR Code SVG (${fileNamePrefix}) berhasil diunduh.`);
			setTimeout(() => setDownloaded(null), 2000);
		} catch {
			toast.error('Gagal mengunduh file SVG.');
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium shadow-xs focus-visible:ring-1 focus-visible:outline-none'>
				{downloaded ? (
					<Check className='size-3.5 text-emerald-600' />
				) : (
					<Download className='text-muted-foreground size-3.5' />
				)}
				<span>{downloaded ? 'Terunduh' : label}</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-44'>
				<DropdownMenuItem className='cursor-pointer gap-2 text-xs' onClick={handleDownloadPng}>
					<FileImage className='text-muted-foreground size-3.5' />
					<span>Format PNG (High-Res)</span>
				</DropdownMenuItem>
				{qrSvgString && (
					<DropdownMenuItem className='cursor-pointer gap-2 text-xs' onClick={handleDownloadSvg}>
						<FileCode className='text-muted-foreground size-3.5' />
						<span>Format Vektor SVG</span>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
