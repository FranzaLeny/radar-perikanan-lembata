import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  Droplets,
  ArrowRight,
  ShieldCheck,
  Scale,
  QrCode,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Background Lighting Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />

      {/* Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
            <APP_CONFIG.logo.Icon className="size-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wider font-heading">{APP_CONFIG.name}</h1>
            <p className="text-xs text-muted-foreground font-medium">{APP_CONFIG.institution.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button size="sm" className="gap-2 font-medium">
              <span>Masuk Sistem</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-5xl mx-auto px-6 py-12 sm:py-20 text-center relative z-10 flex flex-col items-center">
        <Badge variant="secondary" className="gap-1.5 px-3.5 py-1 mb-6 text-xs font-semibold">
          <ShieldCheck className="size-3.5" />
          <span>Sistem Informasi Mutu Air Budidaya Perikanan Terpadu</span>
        </Badge>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight leading-tight max-w-4xl">
          Standar Mutu Air Budidaya Andal untuk{' '}
          <span className="text-foreground">
            Kesejahteraan Pembudidaya Lembata
          </span>
        </h2>

        <p className="text-muted-foreground text-sm sm:text-base mt-6 max-w-2xl leading-relaxed">
          Platform digitalisasi pengujian mutu air kolam pembudidaya (Pokdakan) berbasis validasi otomatis standar SNI & Kepmen-KP, pelabelan QR Code terintegrasi, dan penerbitan Lembar Hasil Uji (LHU) resmi.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto gap-2 font-semibold shadow-xs">
              <span>Buka Dashboard Petugas</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/verifikasi/preview">
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 font-medium">
              <QrCode className="size-4 text-muted-foreground" />
              <span>Simulasi Verifikasi QR</span>
            </Button>
          </Link>
        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-left w-full">
          <Card className="border-border bg-card/60 backdrop-blur-xs shadow-xs">
            <CardContent className="p-6">
              <div className="p-2.5 rounded-xl bg-muted text-foreground w-fit mb-3">
                <Scale className="size-5" />
              </div>
              <h3 className="font-bold text-sm font-heading">Validasi Baku Mutu Otomatis</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Kalkulasi status kelayakan per parameter (Suhu, pH, DO, Salinitas, Amonia, Nitrit) dievaluasi secara otomatis dan akurat.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/60 backdrop-blur-xs shadow-xs">
            <CardContent className="p-6">
              <div className="p-2.5 rounded-xl bg-muted text-foreground w-fit mb-3">
                <QrCode className="size-5" />
              </div>
              <h3 className="font-bold text-sm font-heading">Integritas QR Code Unik</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Setiap botol sampel dan lembar LHU dilengkapi barcode QR anti-pemalsuan yang dapat diverifikasi secara publik oleh siapa saja.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/60 backdrop-blur-xs shadow-xs">
            <CardContent className="p-6">
              <div className="p-2.5 rounded-xl bg-muted text-foreground w-fit mb-3">
                <TrendingUp className="size-5" />
              </div>
              <h3 className="font-bold text-sm font-heading">Analisis Tren & Peringatan</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Visualisasi grafik tren fluktuasi kualitas air kolam memberikan deteksi dini sebelum terjadi mortalitas ikan budidaya.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border py-6 text-center text-xs text-muted-foreground relative z-10 space-y-1">
        <p>{APP_CONFIG.author.copyrightText} — Versi {APP_CONFIG.version}</p>
        <p className="font-medium text-muted-foreground">{APP_CONFIG.author.credit}</p>
      </footer>
    </div>
  );
}
