'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginSchema } from '@/lib/validations/auth';
import { authClient } from '@/lib/auth-client';
import { APP_CONFIG } from '@/lib/constants';
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
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group';
import { toFieldErrors } from '@/lib/utils';
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  React.useEffect(() => {
    if (!isSessionPending && session?.user && !errorParam) {
      router.replace('/dashboard');
    }
  }, [session, isSessionPending, errorParam, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam === 'session_invalid'
      ? 'Sesi Anda telah kedaluwarsa atau akun tidak ditemukan dalam sistem. Silakan masuk kembali.'
      : errorParam === 'unauthorized'
      ? 'Akses ditolak: Anda tidak memiliki wewenang untuk halaman tersebut.'
      : null
  );
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
      const candidateEmails = getCandidateEmails(email);
      let isSuccess = false;
      let lastErrMsg = 'Email atau kata sandi tidak cocok.';

      for (const candEmail of candidateEmails) {
        const { data, error } = await authClient.signIn.email({
          email: candEmail,
          password,
        });

        if (!error && data) {
          isSuccess = true;
          break;
        }

        if (error) {
          lastErrMsg = error.message || lastErrMsg;
        }
      }

      if (isSuccess) {
        toast.success(`Berhasil masuk ke sistem ${APP_CONFIG.name}!`);
        router.push('/dashboard');
        router.refresh();
      } else {
        setErrorMessage(lastErrMsg);
        toast.error(lastErrMsg);
      }
    } catch (err: any) {
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
          <APP_CONFIG.logo.Icon className="size-7" />
        </div>
        <CardTitle className="text-2xl font-bold font-heading tracking-tight">
          {APP_CONFIG.name}
        </CardTitle>
        <CardDescription className="text-xs font-semibold text-foreground">
          {APP_CONFIG.fullName}
        </CardDescription>
        <p className="text-xs text-muted-foreground mt-1">
          {APP_CONFIG.institution.name}
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
          <Field>
            <FieldLabel htmlFor="email">
              Alamat Email
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Mail className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`nama@${APP_CONFIG.institution.emailDomain}`}
                autoComplete="email"
                required
              />
            </InputGroup>
            <FieldError errors={toFieldErrors(fieldErrors.email)} />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">
              Kata Sandi
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Lock className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="font-mono"
                autoComplete="current-password"
                required
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <FieldError errors={toFieldErrors(fieldErrors.password)} />
          </Field>

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
            <ShieldCheck className="size-3.5 text-muted-foreground" />
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
        <span>{APP_CONFIG.author.credit}</span>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function getCandidateEmails(input: string): string[] {
  const trimmed = input.toLowerCase().trim();
  const candidates = new Set<string>([trimmed]);

  // Variasi domain sipeka & minamutu
  candidates.add(trimmed.replace('@minamutu.lembata.go.id', '@sipeka.lembata.go.id'));
  candidates.add(trimmed.replace('@sipeka.lembata.go.id', '@minamutu.lembata.go.id'));

  // Variasi username pendek tanpa domain
  if (!trimmed.includes('@')) {
    if (trimmed === 'admin' || trimmed === 'administrator') {
      candidates.add('admin@sipeka.lembata.go.id');
      candidates.add('admin@minamutu.lembata.go.id');
    } else if (trimmed === 'pengelola' || trimmed === 'mutu') {
      candidates.add('pengelola@sipeka.lembata.go.id');
      candidates.add('mutu@minamutu.lembata.go.id');
      candidates.add('pengelola@minamutu.lembata.go.id');
      candidates.add('mutu@sipeka.lembata.go.id');
    } else if (trimmed === 'petugas') {
      candidates.add('petugas@sipeka.lembata.go.id');
      candidates.add('petugas@minamutu.lembata.go.id');
    } else if (trimmed === 'kadin' || trimmed === 'kadis' || trimmed === 'kepala') {
      candidates.add('kadin@sipeka.lembata.go.id');
      candidates.add('kadis@minamutu.lembata.go.id');
      candidates.add('kadin@minamutu.lembata.go.id');
      candidates.add('kadis@sipeka.lembata.go.id');
    } else {
      candidates.add(`${trimmed}@sipeka.lembata.go.id`);
      candidates.add(`${trimmed}@minamutu.lembata.go.id`);
    }
  }

  // Alias mutu <-> pengelola dan kadis <-> kadin
  if (trimmed.includes('mutu@')) {
    candidates.add(trimmed.replace('mutu@', 'pengelola@'));
    candidates.add(trimmed.replace('mutu@minamutu', 'pengelola@sipeka'));
  }
  if (trimmed.includes('pengelola@')) {
    candidates.add(trimmed.replace('pengelola@', 'mutu@'));
    candidates.add(trimmed.replace('pengelola@sipeka', 'mutu@minamutu'));
  }
  if (trimmed.includes('kadis@')) {
    candidates.add(trimmed.replace('kadis@', 'kadin@'));
    candidates.add(trimmed.replace('kadis@minamutu', 'kadin@sipeka'));
  }
  if (trimmed.includes('kadin@')) {
    candidates.add(trimmed.replace('kadin@', 'kadis@'));
    candidates.add(trimmed.replace('kadin@sipeka', 'kadis@minamutu'));
  }

  return Array.from(candidates);
}

