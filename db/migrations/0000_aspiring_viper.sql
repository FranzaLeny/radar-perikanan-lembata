CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "detail_uji_parameter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uji_id" uuid NOT NULL,
	"baku_mutu_id" uuid,
	"nilai_hasil" numeric(8, 2) NOT NULL,
	"status_kelayakan" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "instruksi_kerja" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kode_ik" varchar(50) NOT NULL,
	"judul" varchar(255) NOT NULL,
	"kategori" varchar(100),
	"file_path" varchar(255) NOT NULL,
	"qr_code_hash" varchar(255) NOT NULL,
	"versi" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "instruksi_kerja_kode_ik_unique" UNIQUE("kode_ik"),
	CONSTRAINT "instruksi_kerja_qr_code_hash_unique" UNIQUE("qr_code_hash")
);
--> statement-breakpoint
CREATE TABLE "lokasi_kolam" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama_pokdakan" varchar(150) NOT NULL,
	"pemilik" varchar(100) NOT NULL,
	"kecamatan" varchar(100) NOT NULL,
	"desa" varchar(100) NOT NULL,
	"titik_koordinat" varchar(100),
	"komoditas_ikan" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "master_baku_mutu" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parameter" varchar(50) NOT NULL,
	"satuan" varchar(20) NOT NULL,
	"nilai_min" numeric(8, 2),
	"nilai_max" numeric(8, 2),
	"dasar_regulasi" varchar(100),
	"aktif" boolean DEFAULT true NOT NULL,
	"berlaku_sejak" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "uji_kualitas_air" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nomor_sampel" varchar(50) NOT NULL,
	"lokasi_id" uuid,
	"ik_id" uuid,
	"tanggal_pengambilan" timestamp NOT NULL,
	"petugas_uji" varchar(100) NOT NULL,
	"catatan_lapangan" text,
	"kesimpulan" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uji_kualitas_air_nomor_sampel_unique" UNIQUE("nomor_sampel")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text DEFAULT 'petugas_lapangan' NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detail_uji_parameter" ADD CONSTRAINT "detail_uji_parameter_uji_id_uji_kualitas_air_id_fk" FOREIGN KEY ("uji_id") REFERENCES "public"."uji_kualitas_air"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detail_uji_parameter" ADD CONSTRAINT "detail_uji_parameter_baku_mutu_id_master_baku_mutu_id_fk" FOREIGN KEY ("baku_mutu_id") REFERENCES "public"."master_baku_mutu"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uji_kualitas_air" ADD CONSTRAINT "uji_kualitas_air_lokasi_id_lokasi_kolam_id_fk" FOREIGN KEY ("lokasi_id") REFERENCES "public"."lokasi_kolam"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uji_kualitas_air" ADD CONSTRAINT "uji_kualitas_air_ik_id_instruksi_kerja_id_fk" FOREIGN KEY ("ik_id") REFERENCES "public"."instruksi_kerja"("id") ON DELETE restrict ON UPDATE no action;