import { z } from 'zod';

export const lokasiKolamSchema = z.object({
	nama_pokdakan: z
		.string()
		.min(1, { message: 'Nama kelompok pembudidaya (Pokdakan) wajib diisi' })
		.max(150, { message: 'Nama Pokdakan maksimal 150 karakter' }),
	pemilik: z
		.string()
		.min(1, { message: 'Nama pemilik / penanggung jawab wajib diisi' })
		.max(100, { message: 'Nama pemilik maksimal 100 karakter' }),
	kecamatan: z
		.string()
		.min(1, { message: 'Kecamatan wajib diisi' })
		.max(100, { message: 'Kecamatan maksimal 100 karakter' }),
	desa: z
		.string()
		.min(1, { message: 'Desa/Kelurahan wajib diisi' })
		.max(100, { message: 'Desa/Kelurahan maksimal 100 karakter' }),
	titik_koordinat: z
		.string()
		.regex(/^-?\d{1,3}\.\d+,\s*-?\d{1,3}\.\d+$/, {
			message: 'Format titik koordinat harus: [latitude], [longitude] (contoh: -8.37123, 123.54123)'
		})
		.optional()
		.or(z.literal('')),
	komoditas_ikan: z.string().max(50).optional().or(z.literal(''))
});

export type LokasiKolamInput = z.infer<typeof lokasiKolamSchema>;
