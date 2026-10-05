'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { loginSchema } from '@/lib/validations/auth';
import { authClient } from '@/lib/auth-client';
import { APP_CONFIG } from '@/lib/constants';
import { toFieldErrors } from '@/lib/utils';
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
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { getCandidateEmails } from '../utils';
import { LoginHeader } from './login-header';
import { LoginDemoPills } from './login-demo-pills';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  useEffect(() => {
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
    } catch {
      setErrorMessage('Terjadi gangguan jaringan atau server.');
      toast.error('Terjadi gangguan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border bg-card shadow-xl backdrop-blur-xs">
      <LoginHeader />

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
            <FieldLabel htmlFor="email">Alamat Email</FieldLabel>
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
            <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
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
                  title={
                    showPassword
                      ? 'Sembunyikan kata sandi'
                      : 'Tampilkan kata sandi'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <FieldError errors={toFieldErrors(fieldErrors.password)} />
          </Field>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2 font-semibold shadow-xs cursor-pointer"
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

        <LoginDemoPills onSelect={handleDemoSelect} />
      </CardContent>

      <CardFooter className="pt-2 pb-4 border-t border-border flex items-center justify-center text-xs text-muted-foreground">
        <span>{APP_CONFIG.author.credit}</span>
      </CardFooter>
    </Card>
  );
}
