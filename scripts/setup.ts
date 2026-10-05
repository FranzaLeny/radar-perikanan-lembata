import { $ } from 'bun';
import { copyFileSync, existsSync } from 'fs';

const LOG_PREFIX = '[SIPEKA Setup]';

async function setup() {
  console.log(`\n======================================================`);
  console.log(`${LOG_PREFIX} 🚀 Memulai Setup Otomatis SIPEKA...`);
  console.log(`======================================================\n`);

  // 1. Setup .env.local
  if (!existsSync('.env.local')) {
    console.log(`${LOG_PREFIX} 📄 Membuat file .env.local dari .env.example...`);
    copyFileSync('.env.example', '.env.local');
    console.log(`${LOG_PREFIX} ✅ .env.local berhasil dibuat.`);
  } else {
    console.log(`${LOG_PREFIX} ℹ️ .env.local sudah tersedia.`);
  }

  // 2. Cek & Jalankan Docker PostgreSQL
  console.log(`${LOG_PREFIX} 🐳 Memeriksa Docker & PostgreSQL container...`);
  let dockerOk = false;
  try {
    await $`docker compose up -d`;
    dockerOk = true;
    console.log(`${LOG_PREFIX} ✅ Container sipeka-db berhasil dijalankan.`);
  } catch {
    console.warn(`\n${LOG_PREFIX} ⚠️ Docker daemon tidak dapat dihubungi secara langsung.`);
    console.warn(`${LOG_PREFIX} 💡 TIPS: Pastikan aplikasi "Docker Desktop" sudah dibuka/dijalankan di Windows.`);
    console.warn(`${LOG_PREFIX} Jika Anda menggunakan PostgreSQL eksternal / Neon DB, Anda dapat langsung mengatur DATABASE_URL di .env.local.\n`);
  }

  if (dockerOk) {
    console.log(`${LOG_PREFIX} ⏳ Menunggu PostgreSQL siap menerima koneksi...`);
    let ready = false;
    for (let i = 0; i < 30; i++) {
      try {
        await $`docker exec sipeka-db pg_isready -U postgres`.quiet();
        ready = true;
        break;
      } catch {
        await Bun.sleep(1000);
      }
    }
    if (!ready) {
      console.warn(`${LOG_PREFIX} ⚠️ PostgreSQL belum siap dalam 30 detik. Melanjutkan migrasi jika DB sudah dapat diakses...`);
    } else {
      console.log(`${LOG_PREFIX} ✅ PostgreSQL siap.`);
    }
  }

  // 3. Sinkronisasi Schema Database
  console.log(`${LOG_PREFIX} 🔄 Menjalankan push skema database Drizzle...`);
  try {
    await $`bunx drizzle-kit push`;
    console.log(`${LOG_PREFIX} ✅ Skema database berhasil disinkronkan.`);
  } catch (err) {
    console.warn(`${LOG_PREFIX} ⚠️ Gagal push skema via drizzle-kit. Error:`, err);
    console.log(`${LOG_PREFIX} Mencoba generate migrasi...`);
    try {
      await $`bunx drizzle-kit generate`;
      await $`bunx drizzle-kit migrate`;
      console.log(`${LOG_PREFIX} ✅ Migrasi berhasil dijalankan.`);
    } catch {
      console.error(`${LOG_PREFIX} ❌ Gagal migrasi: Pastikan database PostgreSQL aktif.`);
    }
  }

  // 4. Seed Data Awal
  console.log(`${LOG_PREFIX} 🌱 Menjalankan seeding data awal baku mutu & pengguna...`);
  try {
    await $`bun run db/seed.ts`;
    console.log(`${LOG_PREFIX} ✅ Seeding data awal sukses.`);
  } catch {
    console.warn(`${LOG_PREFIX} ⚠️ Gagal seeding data: Pastikan database sudah terhubung.`);
  }

  console.log(`\n======================================================`);
  console.log(`${LOG_PREFIX} 🎉 Setup Selesai!`);
  console.log(`${LOG_PREFIX} Untuk menjalankan web server:`);
  console.log(`   bun run dev`);
  console.log(`\nAkun Login Default (Testing):`);
  console.log(`   Admin       : admin@sipeka.lembata.go.id  (pwd: password123)`);
  console.log(`   Mutu        : pengelola@sipeka.lembata.go.id   (pwd: password123)`);
  console.log(`   Petugas Uji : petugas@sipeka.lembata.go.id (pwd: password123)`);
  console.log(`   Kadis       : kadin@sipeka.lembata.go.id   (pwd: password123)`);
  console.log(`======================================================\n`);
}

setup().catch((err) => {
  console.error(`${LOG_PREFIX} ❌ Terjadi kesalahan fatal pada setup:`, err);
  process.exit(1);
});
