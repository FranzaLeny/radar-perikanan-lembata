import { z } from 'zod';

export const bakuMutuSchema = z
  .object({
    parameter: z.string().min(1, { message: 'Nama parameter baku mutu wajib diisi' }).max(50),
    satuan: z.string().min(1, { message: 'Satuan pengukuran wajib diisi' }).max(20),
    nilai_min: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
      z.number({ message: 'Nilai minimum harus berupa angka' }).nullable().optional()
    ),
    nilai_max: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
      z.number({ message: 'Nilai maksimum harus berupa angka' }).nullable().optional()
    ),
    nomor_regulasi: z
      .string()
      .min(1, { message: 'Nomor / singkatan regulasi wajib diisi (misal: PP No. 22/2021)' })
      .max(50),
    dasar_regulasi: z.string().max(500).optional().or(z.literal('')),
    tipe_ambang_batas: z.enum(['tetap', 'deviasi_suhu_lingkungan', 'manual_lapangan']).default('tetap'),
    deviasi_toleransi: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
      z.number({ message: 'Nilai toleransi deviasi harus berupa angka' }).nullable().optional()
    ),
    aktif: z.boolean().default(true),
    berlaku_sejak: z.string().optional().default(() => new Date().toISOString().split('T')[0]),
  })
  .refine(
    (data) => {
      if (
        data.tipe_ambang_batas === 'tetap' &&
        data.nilai_min !== null &&
        data.nilai_min !== undefined &&
        data.nilai_max !== null &&
        data.nilai_max !== undefined
      ) {
        return data.nilai_min <= data.nilai_max;
      }
      return true;
    },
    {
      message: 'Nilai minimum tidak boleh lebih besar dari nilai maksimum',
      path: ['nilai_min'],
    }
  );

export type BakuMutuInput = z.infer<typeof bakuMutuSchema>;
