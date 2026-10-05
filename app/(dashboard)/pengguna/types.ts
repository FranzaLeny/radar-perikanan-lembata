export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  aktif: boolean;
  banned?: boolean | null;
  createdAt: Date;
  transactionCount?: number;
  isUsed?: boolean;
}

export type UserRole = 'admin' | 'pengelola_mutu' | 'petugas_lapangan' | 'kepala_dinas';

export type FilterTab = 'all' | 'active' | 'banned';
