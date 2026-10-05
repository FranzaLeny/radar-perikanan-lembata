import { z } from 'zod';
import { uuidSchema } from './shared';

export const detailParameterInputSchema = z.object({
  baku_mutu_id: uuidSchema,
  ik_id: uuidSchema, // Instruksi Kerja wajib dipilih per parameter
  nilai_hasil: z.coerce
    .number({
      message: 'Nilai hasil uji harus berupa angka',
    })
    .min(-9999, { message: 'Nilai hasil uji terlalu kecil' })
    .max(99999, { message: 'Nilai hasil uji terlalu besar' }),
  nilai_min_terapkan: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().nullable().optional()
  ),
  nilai_max_terapkan: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().nullable().optional()
  ),
  catatan_ambang: z.string().max(150).optional().nullable(),
  // Catatan: status_kelayakan dihitung secara server-side, dilarang diterima dari client!
});

export const inputUjiKualitasSchema = z.object({
  nomor_sampel: z
    .string()
    .min(1, { message: 'Nomor sampel wajib diisi' })
    .max(50, { message: 'Nomor sampel maksimal 50 karakter' }),
  lokasi_id: uuidSchema,
  
  // Field SOP Acuan Umum: Pilihan umum dan opsional (tidak wajib diisi)
  sop_id: z.string().uuid().optional().nullable(),
  ik_id: z.string().uuid().optional().nullable(), // Backwards compatibility field
  tipe_sop: z.enum(['arsip', 'manual', 'tanpa_sop']).default('arsip'),
  sop_manual_kode: z.string().max(50).optional().nullable(),
  sop_manual_judul: z.string().max(255).optional().nullable(),

  // Pengukuran Lingkungan Lapangan (misal suhu udara untuk kalkulasi deviasi suhu air)
  suhu_lingkungan: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number({ message: 'Suhu lingkungan harus berupa angka' }).nullable().optional()
  ),

  tanggal_pengambilan: z.coerce.date({
    message: 'Tanggal pengambilan sampel tidak valid',
  }),
  petugas_uji: z
    .string()
    .min(1, { message: 'Nama petugas penguji wajib diisi' })
    .max(100, { message: 'Nama petugas penguji maksimal 100 karakter' }),
  penguji_pegawai_id: z.string().uuid().optional().nullable(),
  penandatangan_pegawai_id: z.string().uuid().optional().nullable(),
  catatan_lapangan: z.string().max(1000).optional().or(z.literal('')),
  kesimpulan_umum: z.string().max(2000).optional().or(z.literal('')),
  saran_rekomendasi_lapangan: z.string().max(2000).optional().or(z.literal('')),
  detail_parameter: z
    .array(detailParameterInputSchema)
    .min(1, { message: 'Minimal harus ada 1 parameter kualitas air yang diuji' }),
  // Catatan: kesimpulan ('NORMAL' | 'PERINGATAN' | 'KRITIS') dihitung otomatis oleh server
});

export const filterUjiSchema = z
  .object({
    kecamatan: z.string().optional(),
    desa: z.string().optional(),
    pokdakan: z.string().optional(),
    komoditas: z.string().optional(),
    kesimpulan: z.enum(['SEMUA', 'NORMAL', 'PERINGATAN', 'KRITIS']).optional(),
    tanggal_mulai: z.coerce.date().optional(),
    tanggal_akhir: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (data.tanggal_mulai && data.tanggal_akhir) {
        return data.tanggal_mulai <= data.tanggal_akhir;
      }
      return true;
    },
    {
      message: 'Tanggal mulai harus lebih awal atau sama dengan tanggal akhir',
      path: ['tanggal_mulai'],
    }
  );

export const filterTrenSchema = z.object({
  lokasi_id: z.string().optional(),
  parameter: z.string().optional(),
  rentang: z.enum(['1bulan', '3bulan', '6bulan', '1tahun']).default('1tahun'),
});

export type DetailParameterInput = z.infer<typeof detailParameterInputSchema>;
export type InputUjiKualitas = z.infer<typeof inputUjiKualitasSchema>;
export type FilterUjiInput = z.infer<typeof filterUjiSchema>;
export type FilterTrenInput = z.infer<typeof filterTrenSchema>;
