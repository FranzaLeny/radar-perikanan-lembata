import { z } from 'zod';

export const pegawaiSchema = z.object({
  nip: z
    .string()
    .min(1, { message: 'NIP wajib diisi' })
    .max(30, { message: 'NIP maksimal 30 karakter' })
    .transform((v) => v.replace(/\s+/g, '')),
  nama: z
    .string()
    .min(1, { message: 'Nama pegawai wajib diisi' })
    .max(150, { message: 'Nama maksimal 150 karakter' }),
  jabatan: z
    .string()
    .min(1, { message: 'Jabatan wajib diisi' })
    .max(150, { message: 'Jabatan maksimal 150 karakter' }),
  pangkat_golongan: z.string().max(100).optional().or(z.literal('')),
  peran_tanda_tangan: z.enum(['penguji', 'pengelola_mutu', 'kepala_dinas']).default('penguji'),
  is_penanggungjawab: z.boolean().optional().default(false),
});

export type PegawaiInput = z.infer<typeof pegawaiSchema>;
