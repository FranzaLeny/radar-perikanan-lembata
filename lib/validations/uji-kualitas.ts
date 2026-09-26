import { z } from 'zod';
import { uuidSchema } from './shared';

export const detailParameterInputSchema = z.object({
  baku_mutu_id: uuidSchema,
  nilai_hasil: z.coerce
    .number({
      message: 'Nilai hasil uji harus berupa angka',
    })
    .min(-9999, { message: 'Nilai hasil uji terlalu kecil' })
    .max(99999, { message: 'Nilai hasil uji terlalu besar' }),
  // Catatan: status_kelayakan dihitung secara server-side, dilarang diterima dari client!
});

export const inputUjiKualitasSchema = z.object({
  nomor_sampel: z.string()
    .min(1, { message: 'Nomor sampel wajib diisi' })
    .max(50, { message: 'Nomor sampel maksimal 50 karakter' }),
  lokasi_id: uuidSchema,
  tipe_sop: z.enum(['arsip', 'manual']).default('arsip'),
  ik_id: z.string().uuid().optional().nullable(),
  sop_manual_kode: z.string().max(50).optional().nullable(),
  sop_manual_judul: z.string().max(255).optional().nullable(),
  tanggal_pengambilan: z.coerce.date({
    message: 'Tanggal pengambilan sampel tidak valid',
  }),
  petugas_uji: z.string()
    .min(1, { message: 'Nama petugas penguji wajib diisi' })
    .max(100, { message: 'Nama petugas penguji maksimal 100 karakter' }),
  penguji_pegawai_id: z.string().uuid().optional().nullable(),
  penandatangan_pegawai_id: z.string().uuid().optional().nullable(),
  catatan_lapangan: z.string().max(1000).optional().or(z.literal('')),
  kesimpulan_umum: z.string().max(2000).optional().or(z.literal('')),
  saran_rekomendasi_lapangan: z.string().max(2000).optional().or(z.literal('')),
  detail_parameter: z.array(detailParameterInputSchema)
    .min(1, { message: 'Minimal harus ada 1 parameter kualitas air yang diuji' }),
  // Catatan: kesimpulan ('NORMAL' | 'PERINGATAN' | 'KRITIS') dihitung otomatis oleh server
}).refine(
  (data) => {
    if (data.tipe_sop === 'manual') {
      return Boolean(data.sop_manual_judul && data.sop_manual_judul.trim().length > 0);
    }
    return Boolean(data.ik_id);
  },
  {
    message: 'Pilih SOP terarsip atau isi judul metodologi pengujian manual',
    path: ['ik_id'],
  }
);

export const filterUjiSchema = z.object({
  kecamatan: z.string().optional(),
  desa: z.string().optional(),
  pokdakan: z.string().optional(),
  komoditas: z.string().optional(),
  kesimpulan: z.enum(['SEMUA', 'NORMAL', 'PERINGATAN', 'KRITIS']).optional(),
  tanggal_mulai: z.coerce.date().optional(),
  tanggal_akhir: z.coerce.date().optional(),
}).refine(
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
