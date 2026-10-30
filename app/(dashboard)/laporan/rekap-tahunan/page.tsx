import { db } from '@/db';
import { lokasiKolam, masterPegawai } from '@/db/schema';
import { generateQrDataUrl } from '@/lib/qr';
import { RekapTahunanClient } from './rekap-tahunan-client';
export const instant = false;
export default async function RekapTahunanPage() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
	const url = new URL('/laporan/rekap-tahunan', baseUrl);
	const qrDataUrl = await generateQrDataUrl(url.href);

	const [allPokdakan, allUji, allPegawai] = await Promise.all([
		db.query.lokasiKolam.findMany({ orderBy: [lokasiKolam.kecamatan, lokasiKolam.nama_pokdakan] }),
		db.query.ujiKualitasAir.findMany({ with: { lokasi: true } }),
		db.query.masterPegawai.findMany({ orderBy: [masterPegawai.nama] })
	]);

	return (
		<RekapTahunanClient
			allPegawai={allPegawai}
			allPokdakan={allPokdakan}
			allUji={allUji}
			qrDataUrl={qrDataUrl}
		/>
	);
}
