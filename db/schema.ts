import { pgTable, uuid, varchar, text, integer, numeric, boolean, date, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
// 1. MASTER INSTRUKSI KERJA (IK)
// ==========================================
export const instruksiKerja = pgTable('instruksi_kerja', {
  id: uuid('id').defaultRandom().primaryKey(),
  kode_ik: varchar('kode_ik', { length: 50 }).notNull().unique(),
  judul: varchar('judul', { length: 255 }).notNull(),
  kategori: varchar('kategori', { length: 100 }),
  file_path: varchar('file_path', { length: 255 }).notNull(),
  qr_code_hash: varchar('qr_code_hash', { length: 255 }).notNull().unique(),
  versi: integer('versi').notNull().default(1),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ==========================================
// 2. MASTER LOKASI KOLAM
// ==========================================
export const lokasiKolam = pgTable('lokasi_kolam', {
  id: uuid('id').defaultRandom().primaryKey(),
  nama_pokdakan: varchar('nama_pokdakan', { length: 150 }).notNull(),
  pemilik: varchar('pemilik', { length: 100 }).notNull(),
  kecamatan: varchar('kecamatan', { length: 100 }).notNull(),
  desa: varchar('desa', { length: 100 }).notNull(),
  titik_koordinat: varchar('titik_koordinat', { length: 100 }),
  komoditas_ikan: varchar('komoditas_ikan', { length: 50 }),
});

// ==========================================
// 3. MASTER BAKU MUTU (Versioned)
// ==========================================
export const masterBakuMutu = pgTable('master_baku_mutu', {
  id: uuid('id').defaultRandom().primaryKey(),
  parameter: varchar('parameter', { length: 50 }).notNull(),
  satuan: varchar('satuan', { length: 20 }).notNull(),
  nilai_min: numeric('nilai_min', { precision: 8, scale: 2 }),
  nilai_max: numeric('nilai_max', { precision: 8, scale: 2 }),
  dasar_regulasi: varchar('dasar_regulasi', { length: 100 }),
  aktif: boolean('aktif').notNull().default(true),
  berlaku_sejak: date('berlaku_sejak').notNull().defaultNow(),
});

// ==========================================
// 4. MASTER PEGAWAI DINAS PERIKANAN
// ==========================================
export const masterPegawai = pgTable('master_pegawai', {
  id: uuid('id').defaultRandom().primaryKey(),
  nip: varchar('nip', { length: 30 }).notNull().unique(),
  nama: varchar('nama', { length: 150 }).notNull(),
  jabatan: varchar('jabatan', { length: 150 }).notNull(),
  pangkat_golongan: varchar('pangkat_golongan', { length: 100 }),
  aktif: boolean('aktif').notNull().default(true),
  peran_tanda_tangan: varchar('peran_tanda_tangan', { length: 50 }).notNull().default('penguji'), // 'penguji', 'pengelola_mutu', 'kepala_dinas'
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ==========================================
// 5. PENGUJIAN & LOG KUALITAS AIR
// ==========================================
export const ujiKualitasAir = pgTable('uji_kualitas_air', {
  id: uuid('id').defaultRandom().primaryKey(),
  nomor_sampel: varchar('nomor_sampel', { length: 50 }).notNull().unique(),
  lokasi_id: uuid('lokasi_id').references(() => lokasiKolam.id, { onDelete: 'restrict' }),
  ik_id: uuid('ik_id').references(() => instruksiKerja.id, { onDelete: 'restrict' }),
  tanggal_pengambilan: timestamp('tanggal_pengambilan', { mode: 'date' }).notNull(),
  petugas_uji: varchar('petugas_uji', { length: 100 }).notNull(),
  penguji_pegawai_id: uuid('penguji_pegawai_id').references(() => masterPegawai.id, { onDelete: 'set null' }),
  penandatangan_pegawai_id: uuid('penandatangan_pegawai_id').references(() => masterPegawai.id, { onDelete: 'set null' }),
  catatan_lapangan: text('catatan_lapangan'),
  kesimpulan: varchar('kesimpulan', { length: 20 }), // 'NORMAL', 'PERINGATAN', 'KRITIS'
  kesimpulan_umum: text('kesimpulan_umum'),
  saran_rekomendasi_lapangan: text('saran_rekomendasi_lapangan'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ==========================================
// 6. DETAIL PARAMETER PER PENGUJIAN
// ==========================================
export const detailUjiParameter = pgTable('detail_uji_parameter', {
  id: uuid('id').defaultRandom().primaryKey(),
  uji_id: uuid('uji_id')
    .notNull()
    .references(() => ujiKualitasAir.id, { onDelete: 'cascade' }),
  baku_mutu_id: uuid('baku_mutu_id').references(() => masterBakuMutu.id, { onDelete: 'restrict' }),
  nilai_hasil: numeric('nilai_hasil', { precision: 8, scale: 2 }).notNull(),
  status_kelayakan: varchar('status_kelayakan', { length: 20 }), // 'MEMENUHI', 'MELEBIHI', 'DIBAWAH'
});

// ==========================================
// 7. RELATIONS
// ==========================================
export const masterPegawaiRelations = relations(masterPegawai, ({ many }) => ({
  ujiSebagaiPenguji: many(ujiKualitasAir, { relationName: 'ujiPenguji' }),
  ujiSebagaiPenandatangan: many(ujiKualitasAir, { relationName: 'ujiPenandatangan' }),
}));

export const instruksiKerjaRelations = relations(instruksiKerja, ({ many }) => ({
  ujiList: many(ujiKualitasAir),
}));

export const lokasiKolamRelations = relations(lokasiKolam, ({ many }) => ({
  ujiList: many(ujiKualitasAir),
}));

export const masterBakuMutuRelations = relations(masterBakuMutu, ({ many }) => ({
  detailList: many(detailUjiParameter),
}));

export const ujiKualitasAirRelations = relations(ujiKualitasAir, ({ one, many }) => ({
  lokasi: one(lokasiKolam, {
    fields: [ujiKualitasAir.lokasi_id],
    references: [lokasiKolam.id],
  }),
  instruksiKerja: one(instruksiKerja, {
    fields: [ujiKualitasAir.ik_id],
    references: [instruksiKerja.id],
  }),
  pengujiPegawai: one(masterPegawai, {
    fields: [ujiKualitasAir.penguji_pegawai_id],
    references: [masterPegawai.id],
    relationName: 'ujiPenguji',
  }),
  penandatanganPegawai: one(masterPegawai, {
    fields: [ujiKualitasAir.penandatangan_pegawai_id],
    references: [masterPegawai.id],
    relationName: 'ujiPenandatangan',
  }),
  detailParameters: many(detailUjiParameter),
}));

export const detailUjiParameterRelations = relations(detailUjiParameter, ({ one }) => ({
  uji: one(ujiKualitasAir, {
    fields: [detailUjiParameter.uji_id],
    references: [ujiKualitasAir.id],
  }),
  bakuMutu: one(masterBakuMutu, {
    fields: [detailUjiParameter.baku_mutu_id],
    references: [masterBakuMutu.id],
  }),
}));

// ==========================================
// 7. BETTER AUTH SCHEMAS
// ==========================================
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  role: text('role').notNull().default('petugas_lapangan'), // admin, pengelola_mutu, petugas_lapangan, kepala_dinas
  aktif: boolean('aktif').notNull().default(true),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
