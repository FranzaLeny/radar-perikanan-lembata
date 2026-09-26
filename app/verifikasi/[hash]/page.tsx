import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Droplets,
  Calendar,
  Building2,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';

export default async function PublicVerificationPage({
  params,
  searchParams,
}: {
  params: Promise<{ hash: string }>;
  searchParams?: Promise<{ info?: string; preview?: string; detail?: string }>;
}) {
  const { hash } = await params;
  const search = searchParams ? await searchParams : {};
  const showInfoOnly = search.info === 'true' || search.preview === 'true' || search.detail === 'true';

  const ik = await db.query.instruksiKerja.findFirst({
    where: eq(schema.instruksiKerja.qr_code_hash, hash),
  });

  if (!ik) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-6">
          <div className="size-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4 border border-destructive/20">
            <ShieldCheck className="size-8" />
          </div>
          <CardTitle className="text-xl font-heading mb-2">QR Code Tidak Terdaftar</CardTitle>
          <CardDescription className="text-xs leading-relaxed">
            Kode QR atau hash verifikasi ini tidak ditemukan dalam basis data resmi Dinas Perikanan Kabupaten Lembata.
          </CardDescription>
          <div className="mt-6 flex justify-center">
            <Link href="/login">
              <Button size="sm" variant="outline">
                <span>Masuk ke SIPEKA</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Jika file_path merupakan tautan eksternal (http:// atau https://) dan bukan mode pratinjau/info,
  // langsung redirect pemindai QR / browser ke tautan dokumen resmi tersebut.
  if (!showInfoOnly && ik.file_path && (ik.file_path.startsWith('http://') || ik.file_path.startsWith('https://'))) {
    redirect(ik.file_path);
  }

  // Ambil parameter baku mutu aktif untuk ditampilkan sebagai referensi
  const bakuMutuList = await db.query.masterBakuMutu.findMany({
    where: eq(schema.masterBakuMutu.aktif, true),
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Decorative Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar with Brand & Theme Toggle */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between py-2 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
            <Droplets className="size-4" />
          </div>
          <span className="font-extrabold text-sm tracking-wider font-heading">SIPEKA</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto my-auto relative z-10 py-6">
        <Card className="border-primary/20 shadow-2xl">
          {/* Top Seal */}
          <CardHeader className="flex flex-col items-center text-center pb-6 border-b border-border">
            <Badge variant="outline" className="gap-1.5 px-3 py-1 mb-3 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>Dokumen Resmi Terverifikasi Keabsahannya</span>
            </Badge>

            <div className="flex items-center justify-center size-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 mb-3">
              <Droplets className="size-7" />
            </div>

            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight font-heading">
              PEMERINTAH KABUPATEN LEMBATA
            </CardTitle>
            <p className="text-xs uppercase font-semibold text-primary mt-0.5 tracking-wider">
              DINAS PERIKANAN — SISTEM SIPEKA
            </p>
          </CardHeader>

          {/* IK Detail Section */}
          <CardContent className="py-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold">
                {ik.kode_ik}
              </span>
              <Badge variant="secondary" className="text-xs font-semibold">
                Versi Dokumen: {ik.versi}.0
              </Badge>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground leading-snug font-heading">
                {ik.judul}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Kategori: <span className="text-foreground font-medium">{ik.kategori || 'Standar Operasional Prosedur'}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <Calendar className="size-3.5 text-primary" />
                  Tanggal Diterbitkan
                </span>
                <span className="font-semibold text-foreground">
                  {new Date(ik.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <Building2 className="size-3.5 text-primary" />
                  Otoritas Pengesah
                </span>
                <span className="font-semibold text-foreground truncate block">
                  Dinas Perikanan Lembata
                </span>
              </div>
            </div>

            {/* Standard Water Quality Parameters */}
            <div className="mt-6 pt-5 border-t border-border">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="size-3.5" />
                Parameter Baku Mutu Acuan (PP No. 22/2021)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {bakuMutuList.map((bm) => (
                  <div
                    key={bm.id}
                    className="p-2.5 rounded-xl bg-muted/30 border border-border text-xs"
                  >
                    <p className="font-semibold text-foreground">{bm.parameter}</p>
                    <p className="text-primary font-mono text-xs mt-0.5 font-medium">
                      {bm.nilai_min !== null && bm.nilai_max !== null
                        ? `${bm.nilai_min} - ${bm.nilai_max} ${bm.satuan}`
                        : bm.nilai_min !== null
                          ? `≥ ${bm.nilai_min} ${bm.satuan}`
                          : bm.nilai_max !== null
                            ? `≤ ${bm.nilai_max} ${bm.satuan}`
                            : `-`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          {/* Action Footer */}
          <CardFooter className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground font-mono truncate">
              HASH ID: {ik.qr_code_hash}
            </span>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {ik.file_path && (
                <a
                  href={ik.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button size="sm" variant="outline" className="gap-2 font-medium w-full sm:w-auto">
                    <ExternalLink className="size-3.5 text-primary" />
                    <span>Buka Tautan Dokumen</span>
                  </Button>
                </a>
              )}

              <Link href={`/uji-kualitas/input?ik_id=${ik.id}`} className="w-full sm:w-auto">
                <Button size="sm" className="gap-2 font-medium w-full sm:w-auto">
                  <span>Input Uji via SOP Ini</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground py-4 relative z-10 space-y-1">
        <p>© 2026 Dinas Perikanan Kabupaten Lembata • Nusa Tenggara Timur</p>
        <p className="text-xs text-muted-foreground/80">
          SIPEKA — Sistem Pemantauan Kualitas Air Budidaya Berkelanjutan
        </p>
        <p className="font-medium text-muted-foreground">with ❤️ by MHLB</p>
      </footer>
    </div>
  );
}
