import { createHash } from 'node:crypto';

import QRCode from 'qrcode';

/**
 * Menghasilkan hash unik untuk Instruksi Kerja (IK) untuk verifikasi publik.
 */
export function generateIkHash(kodeIk: string): string {
	const payload = `${kodeIk}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
	return createHash('sha256').update(payload).digest('hex').substring(0, 32);
}

/**
 * Mendapatkan URL lengkap verifikasi QR publik.
 */
export function getVerificationUrl(hash: string): string {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
	return `${baseUrl}/verifikasi/${hash}`;
}

/**
 * Menghasilkan QR Code sebagai Data URL (Base64 PNG) untuk ditampilkan atau dicetak.
 */
export async function generateQrDataUrl(content: string): Promise<string> {
	try {
		return await QRCode.toDataURL(content, {
			errorCorrectionLevel: 'H',
			margin: 2,
			width: 280,
			color: {
				dark: '#034561', // Deep ocean teal for RADAR branding
				light: '#FFFFFF'
			}
		});
	} catch (error) {
		console.error('Gagal generate QR Code data URL:', error);
		throw error;
	}
}

/**
 * Menghasilkan QR Code sebagai SVG string
 */
export async function generateQrSvg(content: string): Promise<string> {
	try {
		return await QRCode.toString(content, {
			type: 'svg',
			errorCorrectionLevel: 'H',
			margin: 2,
			color: { dark: '#034561', light: '#FFFFFF' }
		});
	} catch (error) {
		console.error('Gagal generate QR Code SVG:', error);
		throw error;
	}
}
