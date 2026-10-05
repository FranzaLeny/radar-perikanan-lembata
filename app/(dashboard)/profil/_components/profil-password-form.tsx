import React, { useState } from 'react';
import { KeyRound, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldLabel,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

export function ProfilPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Masukkan kata sandi saat ini');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Kata sandi baru minimal 8 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi kata sandi baru tidak cocok');
      return;
    }

    setIsChanging(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (!error) {
        toast.success('Kata sandi berhasil diubah');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(error.message || 'Gagal mengubah kata sandi');
      }
    } catch {
      toast.error('Terjadi kesalahan sistem saat mengubah kata sandi');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Card className="border-border bg-card/60 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <KeyRound className="size-4 text-muted-foreground" /> Keamanan Kata Sandi
        </CardTitle>
        <CardDescription className="text-xs">
          Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="current-pwd">Kata Sandi Saat Ini</FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Lock className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                id="current-pwd"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama"
                required
              />
            </InputGroup>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="new-pwd">Kata Sandi Baru</FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Lock className="size-4 text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput
                  id="new-pwd"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  required
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-pwd">
                Konfirmasi Kata Sandi Baru
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Lock className="size-4 text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput
                  id="confirm-pwd"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  required
                />
              </InputGroup>
            </Field>
          </div>

          <Button
            type="submit"
            size="sm"
            variant="default"
            disabled={isChanging}
            className="text-xs cursor-pointer"
          >
            {isChanging ? (
              <>
                <Loader2 className="size-3.5 mr-2 animate-spin" /> Memperbarui...
              </>
            ) : (
              'Perbarui Kata Sandi'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
