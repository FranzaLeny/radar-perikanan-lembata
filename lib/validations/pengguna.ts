import { z } from 'zod';
import { userRoleEnum } from './auth';

export const penggunaSchema = z.object({
  nama: z.string().min(2, { message: 'Nama pengguna minimal 2 karakter' }).max(100),
  email: z.string().email({ message: 'Format alamat email tidak valid' }),
  role: userRoleEnum,
  aktif: z.boolean().default(true),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }).optional().or(z.literal('')),
});

export type PenggunaInput = z.infer<typeof penggunaSchema>;
