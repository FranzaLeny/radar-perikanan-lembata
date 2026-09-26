import { z } from 'zod';
import { kodeIkSchema } from './shared';

export const instruksiKerjaSchema = z.object({
  kode_ik: kodeIkSchema,
  judul: z.string()
    .min(3, { message: 'Judul IK minimal 3 karakter' })
    .max(255, { message: 'Judul IK maksimal 255 karakter' }),
  kategori: z.string().max(100).optional().or(z.literal('')),
  file_path: z.string().min(1, { message: 'File dokumen/SOP wajib diunggah atau diisi pathnya' }),
  versi: z.coerce.number().int().positive().default(1),
});

export type InstruksiKerjaInput = z.infer<typeof instruksiKerjaSchema>;
