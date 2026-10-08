import { relations } from 'drizzle-orm';
import {
	boolean,
	date,
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';

// ==========================================
// 1. MASTER KATEGORI DOKUMEN MUTU
// ==========================================
export const kategoriDokumenMutu = pgTable('kategori_dokumen_mutu', {
	id: uuid('id').defaultRandom().primaryKey(),
	kode_kategori: varchar('kode_kategori', { length: 20 }).notNull().unique(), // 'PM', 'PP', 'SOP', 'IK', 'FR'
	nama_kategori: varchar('nama_kategori', { length: 100 }).notNull(), // 'Pedoman Mutu', 'Prosedur Pelaksanaan', 'Standar Operasional Prosedur', 'Instruksi Kerja', 'Formulir'
	deskripsi: text('deskripsi'),
	tingkatan: integer('tingkatan').notNull().default(1), // 1 = Pedoman/Arsip, 2 = General/SOP Induk Pengujian, 3 = Parameter Uji / IK, 4+ = Formulir/Arsip
	aktif: boolean('aktif').notNull().default(true),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
});

// ==========================================
// 2. MASTER DOKUMEN MUTU & INSTRUKSI KERJA (IK)
// ==========================================
export const instruksiKerja = pgTable('instruksi_kerja', {
	id: uuid('id').defaultRandom().primaryKey(),
	kode_ik: varchar('kode_ik', { length: 50 }).notNull().unique(),
	judul: varchar('judul', { length: 255 }).notNull(),
	kategori: varchar('kategori', { length: 100 }), // Legacy category text
	kategori_id: uuid('kategori_id').references(() => kategoriDokumenMutu.id, {
		onDelete: 'set null'
	}),
	parameter_uji: varchar('parameter_uji', { length: 50 }), // Khusus IK pengujian parameter: 'Suhu', 'pH', 'DO', dll.
	metode_pengujian: varchar('metode_pengujian', { length: 150 }), // Khusus IK: 'SNI 6989.11:2019', 'SNI 06-6989.23-2005', dll.
	deskripsi: text('deskripsi'),
	file_path: varchar('file_path', { length: 255 }).notNull(),
	qr_code_hash: varchar('qr_code_hash', { length: 255 }).notNull().unique(),
	versi: integer('versi').notNull().default(1),
	aktif: boolean('aktif').notNull().default(true),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
});

// Alias Dokumen Mutu
export const dokumenMutu = instruksiKerja;

// ==========================================
// 3. MASTER LOKASI KOLAM
// ==========================================
export const lokasiKolam = pgTable('lokasi_kolam', {
	id: uuid('id').defaultRandom().primaryKey(),
	nama_pokdakan: varchar('nama_pokdakan', { length: 150 }).notNull(),
	pemilik: varchar('pemilik', { length: 100 }).notNull(),
	kecamatan: varchar('kecamatan', { length: 100 }).notNull(),
	desa: varchar('desa', { length: 100 }).notNull(),
	titik_koordinat: varchar('titik_koordinat', { length: 100 }),
	komoditas_ikan: varchar('komoditas_ikan', { length: 50 }),
	aktif: boolean('aktif').notNull().default(true)
});

// ==========================================
// 4. MASTER BAKU MUTU (Versioned & Dynamic Threshold Support)
// ==========================================
export const masterBakuMutu = pgTable('master_baku_mutu', {
	id: uuid('id').defaultRandom().primaryKey(),
	parameter: varchar('parameter', { length: 50 }).notNull(),
	satuan: varchar('satuan', { length: 20 }).notNull(),
	nilai_min: numeric('nilai_min', { precision: 8, scale: 2 }),
	nilai_max: numeric('nilai_max', { precision: 8, scale: 2 }),
	nomor_regulasi: varchar('nomor_regulasi', { length: 50 }).notNull().default('PP No. 22/2021'),
	dasar_regulasi: varchar('dasar_regulasi', { length: 255 }),
	tipe_ambang_batas: varchar('tipe_ambang_batas', { length: 30 }).notNull().default('tetap'), // 'tetap' | 'deviasi_suhu_lingkungan' | 'manual_lapangan'
	deviasi_toleransi: numeric('deviasi_toleransi', { precision: 5, scale: 2 }), // contoh: 2.00 untuk ± 2°C
	aktif: boolean('aktif').notNull().default(true),
	berlaku_sejak: date('berlaku_sejak').notNull().defaultNow()
});

// ==========================================
// 5. MASTER PEGAWAI DINAS PERIKANAN
// ==========================================
export const masterPegawai = pgTable('master_pegawai', {
	id: uuid('id').defaultRandom().primaryKey(),
	nip: varchar('nip', { length: 30 }).notNull().unique(),
	nama: varchar('nama', { length: 150 }).notNull(),
	jabatan: varchar('jabatan', { length: 150 }).notNull(),
	pangkat_golongan: varchar('pangkat_golongan', { length: 100 }),
	aktif: boolean('aktif').notNull().default(true),
	peran_tanda_tangan: varchar('peran_tanda_tangan', { length: 50 }).notNull().default('penguji'), // 'penguji', 'pengelola_mutu', 'kepala_dinas'
	is_penanggungjawab: boolean('is_penanggungjawab').notNull().default(false),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
});

// ==========================================
// 6. PENGUJIAN & LOG KUALITAS AIR
// ==========================================
export const ujiKualitasAir = pgTable('uji_kualitas_air', {
	id: uuid('id').defaultRandom().primaryKey(),
	nomor_sampel: varchar('nomor_sampel', { length: 50 }).notNull().unique(),
	lokasi_id: uuid('lokasi_id').references(() => lokasiKolam.id, { onDelete: 'restrict' }),
	ik_id: uuid('ik_id').references(() => instruksiKerja.id, { onDelete: 'set null' }), // SOP umum induk (opsional)
	sop_id: uuid('sop_id').references(() => instruksiKerja.id, { onDelete: 'set null' }),
	suhu_lingkungan: numeric('suhu_lingkungan', { precision: 5, scale: 2 }), // Pengukuran suhu lingkungan (°C)
	tanggal_pengambilan: timestamp('tanggal_pengambilan', { mode: 'date' }).notNull(),
	petugas_uji: varchar('petugas_uji', { length: 100 }).notNull(),
	penguji_pegawai_id: uuid('penguji_pegawai_id').references(() => masterPegawai.id, {
		onDelete: 'set null'
	}),
	penandatangan_pegawai_id: uuid('penandatangan_pegawai_id').references(() => masterPegawai.id, {
		onDelete: 'set null'
	}),
	catatan_lapangan: text('catatan_lapangan'),
	kesimpulan: varchar('kesimpulan', { length: 20 }), // 'NORMAL', 'PERINGATAN', 'KRITIS'
	kesimpulan_umum: text('kesimpulan_umum'),
	saran_rekomendasi_lapangan: text('saran_rekomendasi_lapangan'),
	status: varchar('status', { length: 20 }).notNull().default('draft'), // 'draft' | 'final' | 'arsip'
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
});

// ==========================================
// 7. DETAIL PARAMETER PER PENGUJIAN
// ==========================================
export const detailUjiParameter = pgTable('detail_uji_parameter', {
	id: uuid('id').defaultRandom().primaryKey(),
	uji_id: uuid('uji_id')
		.notNull()
		.references(() => ujiKualitasAir.id, { onDelete: 'cascade' }),
	baku_mutu_id: uuid('baku_mutu_id').references(() => masterBakuMutu.id, { onDelete: 'restrict' }),
	ik_id: uuid('ik_id').references(() => instruksiKerja.id, { onDelete: 'restrict' }), // IK wajib per parameter
	metode_pengujian: varchar('metode_pengujian', { length: 150 }), // Snapshot nama metode dari IK
	nomor_regulasi: varchar('nomor_regulasi', { length: 50 }), // Snapshot nomor regulasi
	nilai_hasil: numeric('nilai_hasil', { precision: 8, scale: 2 }).notNull(),
	nilai_min_terapkan: numeric('nilai_min_terapkan', { precision: 8, scale: 2 }), // Snapshot ambang batas efektif min
	nilai_max_terapkan: numeric('nilai_max_terapkan', { precision: 8, scale: 2 }), // Snapshot ambang batas efektif max
	is_ambang_dinamis: boolean('is_ambang_dinamis').notNull().default(false),
	catatan_ambang: varchar('catatan_ambang', { length: 150 }),
	status_kelayakan: varchar('status_kelayakan', { length: 20 }) // 'MEMENUHI', 'MELEBIHI', 'DIBAWAH'
});

// ==========================================
// 8. RELATIONS
// ==========================================
export const kategoriDokumenMutuRelations = relations(kategoriDokumenMutu, ({ many }) => ({
	dokumenList: many(instruksiKerja)
}));

export const masterPegawaiRelations = relations(masterPegawai, ({ many }) => ({
	ujiSebagaiPenguji: many(ujiKualitasAir, { relationName: 'ujiPenguji' }),
	ujiSebagaiPenandatangan: many(ujiKualitasAir, { relationName: 'ujiPenandatangan' })
}));

export const instruksiKerjaRelations = relations(instruksiKerja, ({ one, many }) => ({
	kategoriDokumen: one(kategoriDokumenMutu, {
		fields: [instruksiKerja.kategori_id],
		references: [kategoriDokumenMutu.id]
	}),
	ujiList: many(ujiKualitasAir),
	detailUjiList: many(detailUjiParameter)
}));

export const lokasiKolamRelations = relations(lokasiKolam, ({ many }) => ({
	ujiList: many(ujiKualitasAir)
}));

export const masterBakuMutuRelations = relations(masterBakuMutu, ({ many }) => ({
	detailList: many(detailUjiParameter)
}));

export const ujiKualitasAirRelations = relations(ujiKualitasAir, ({ one, many }) => ({
	lokasi: one(lokasiKolam, { fields: [ujiKualitasAir.lokasi_id], references: [lokasiKolam.id] }),
	instruksiKerja: one(instruksiKerja, {
		fields: [ujiKualitasAir.ik_id],
		references: [instruksiKerja.id]
	}),
	sop: one(instruksiKerja, { fields: [ujiKualitasAir.sop_id], references: [instruksiKerja.id] }),
	pengujiPegawai: one(masterPegawai, {
		fields: [ujiKualitasAir.penguji_pegawai_id],
		references: [masterPegawai.id],
		relationName: 'ujiPenguji'
	}),
	penandatanganPegawai: one(masterPegawai, {
		fields: [ujiKualitasAir.penandatangan_pegawai_id],
		references: [masterPegawai.id],
		relationName: 'ujiPenandatangan'
	}),
	detailParameters: many(detailUjiParameter)
}));

export const detailUjiParameterRelations = relations(detailUjiParameter, ({ one }) => ({
	uji: one(ujiKualitasAir, { fields: [detailUjiParameter.uji_id], references: [ujiKualitasAir.id] }),
	bakuMutu: one(masterBakuMutu, {
		fields: [detailUjiParameter.baku_mutu_id],
		references: [masterBakuMutu.id]
	}),
	ik: one(instruksiKerja, { fields: [detailUjiParameter.ik_id], references: [instruksiKerja.id] })
}));

// ==========================================
// 9. BETTER AUTH SCHEMAS (Auto-generated by @better-auth/cli)
// ==========================================
export * from './auth-schema';
