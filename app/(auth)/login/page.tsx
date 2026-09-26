'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginSchema } from '@/lib/validations/auth';
import { loginAction } from '@/lib/actions/auth';
import {
  Droplets,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setFieldErrors({});
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    // 1. Validasi Client-Side dengan Zod
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setFieldErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginAction({ email, password });
      if (result.success) {
        toast.success('Berhasil masuk ke sistem SIPEKA!');
        router.push('/dashboard');
        router.refresh();
      } else {
        setErrorMessage(result.message || 'Gagal masuk. Periksa kembali email dan kata sandi.');
        toast.error(result.message || 'Gagal masuk.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Terjadi gangguan jaringan atau server.');
      toast.error('Terjadi gangguan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border bg-card shadow-xl backdrop-blur-xs">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto size-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs mb-3">
          <Droplets className="size-7" />
        </div>
        <CardTitle className="text-2xl font-bold font-heading tracking-tight">
          SIPEKA
        </CardTitle>
        <CardDescription className="text-xs font-semibold text-primary">
          Sistem Pemantauan Kualitas Air Budidaya
        </CardDescription>
        <p className="text-xs text-muted-foreground mt-1">
          Dinas Perikanan Kabupaten Lembata
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Gagal Masuk</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium">
              Alamat Email
            </Label>
            <div className="relative">
              <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sipeka.lembata.go.id"
                className="pl-10 text-xs h-10"
                autoComplete="email"
                required
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium">
              Kata Sandi
            </Label>
            <div className="relative">
              <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-10 text-xs font-mono h-10"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-sm cursor-pointer"
                title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2 font-semibold shadow-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Memproses Otentikasi...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>

        {/* Demo Fast Login Pills */}
        <div className="pt-4 border-t border-border space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>Akses Cepat Akun Demo (Uji Coba)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoSelect('admin@sipeka.lembata.go.id')}
              className="h-auto p-2.5 flex flex-col items-start justify-start text-left w-full font-normal group cursor-pointer"
            >
              <div className="w-full font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                <span>Administrator</span>
                <Badge variant="outline" className="text-xs py-0 px-1 font-mono">ADM</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate w-full">admin@sipeka...</p>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoSelect('pengelola@sipeka.lembata.go.id')}
              className="h-auto p-2.5 flex flex-col items-start justify-start text-left w-full font-normal group cursor-pointer"
            >
              <div className="w-full font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                <span>Pengelola Mutu</span>
                <Badge variant="outline" className="text-xs py-0 px-1 font-mono">PM</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate w-full">pengelola@sipeka...</p>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoSelect('petugas@sipeka.lembata.go.id')}
              className="h-auto p-2.5 flex flex-col items-start justify-start text-left w-full font-normal group cursor-pointer"
            >
              <div className="w-full font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                <span>Petugas Lapangan</span>
                <Badge variant="outline" className="text-xs py-0 px-1 font-mono">PL</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate w-full">petugas@sipeka...</p>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoSelect('kadin@sipeka.lembata.go.id')}
              className="h-auto p-2.5 flex flex-col items-start justify-start text-left w-full font-normal group cursor-pointer"
            >
              <div className="w-full font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                <span>Kepala Dinas</span>
                <Badge variant="outline" className="text-xs py-0 px-1 font-mono">KD</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate w-full">kadin@sipeka...</p>
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4 border-t border-border flex items-center justify-center text-xs text-muted-foreground">
        <span>with ❤️ by MHLB</span>
      </CardFooter>
    </Card>
  );
}
