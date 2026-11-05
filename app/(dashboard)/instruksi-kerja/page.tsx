import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Instruksi Kerja Pengujian Mutu',
	description: 'Katalog Instruksi Kerja teknis parameter mutu air kolam budidaya.'
};

export default function InstruksiKerjaPage() {
	redirect('/dokumen-mutu');
}
