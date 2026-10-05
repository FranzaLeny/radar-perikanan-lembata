import { z } from 'zod';
import { uuidSchema } from './shared';

export const kategoriDokumenSchema = z.object({
  kode_kategori: z
    .string()
    .min(1, { message: 'Kode kategori wajib diisi' })
    .max(20, { message: 'Kode kategori maksimal 20 karakter' })
    .transform((val) => val.toUpperCase().trim()),
  nama_kategori: z
    .string()
    .min(2, { message: 'Nama kategori minimal 2 karakter' })
    .max(100, { message: 'Nama kategori maksimal 100 karakter' })
    .trim(),
  deskripsi: z.string().max(500).optional().or(z.literal('')),
  urutan: z.preprocess((val) => (val === '' ? 0 : Number(val)), z.number().int().default(0)),
  aktif: z.boolean().default(true),
});

export const dokumenMutuSchema = z.object({
  kategori_id: uuidSchema,
  kode_dokumen: z
    .string()
    .min(2, { message: 'Kode dokumen minimal 2 karakter' })
    .max(50, { message: 'Kode dokumen maksimal 50 karakter' })
    .trim(),
  judul: z
    .string()
    .min(3, { message: 'Judul dokumen minimal 3 karakter' })
    .max(255, { message: 'Judul dokumen maksimal 255 karakter' })
    .trim(),
  parameter_uji: z.string().max(50).optional().nullable(),
  metode_pengujian: z.string().max(150).optional().nullable(),
  deskripsi: z.string().max(1000).optional().or(z.literal('')),
  file_path: z.string().min(1, { message: 'File dokumen atau tautan PDF wajib diisi' }),
  versi: z.coerce.number().int().positive().default(1),
  aktif: z.boolean().default(true),
});

export type KategoriDokumenInput = z.infer<typeof kategoriDokumenSchema>;
export type DokumenMutuInput = z.infer<typeof dokumenMutuSchema>;
