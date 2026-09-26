import { z } from 'zod';

export const userRoleEnum = z.enum(
  ['admin', 'pengelola_mutu', 'petugas_lapangan', 'kepala_dinas'],
  { message: 'Role harus salah satu dari: admin, pengelola_mutu, petugas_lapangan, kepala_dinas' }
);

export const loginSchema = z.object({
  email: z.string().min(1, { message: 'Email atau username wajib diisi' }),
  password: z.string().min(1, { message: 'Kata sandi wajib diisi' }),
});

export const registerSchema = loginSchema
  .extend({
    nama: z.string()
      .min(2, { message: 'Nama lengkap minimal 2 karakter' })
      .max(100, { message: 'Nama lengkap maksimal 100 karakter' }),
    role: userRoleEnum,
    konfirmasi_password: z.string(),
  })
  .refine((data) => data.password === data.konfirmasi_password, {
    message: 'Konfirmasi password tidak cocok dengan password',
    path: ['konfirmasi_password'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
