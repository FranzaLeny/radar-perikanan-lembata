'use client';

import React, { useState } from 'react';
import { CurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, KeyRound, Loader2, CheckCircle2, Lock } from 'lucide-react';

export function ProfilClient({ user }: { user: CurrentUser }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // State Ganti Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Nama lengkap tidak boleh kosong');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const { data, error } = await authClient.updateUser({
        name: name.trim(),
      });

      if (!error) {
        toast.success('Profil berhasil diperbarui');
        router.refresh();
      } else {
        toast.error(error.message || 'Gagal memperbarui profil');
      }
    } catch {
      toast.error('Terjadi kesalahan sistem');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

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

    setIsChangingPassword(true);
    try {
      const { data, error } = await authClient.changePassword({
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
      setIsChangingPassword(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30">Administrator</Badge>;
      case 'pengelola_mutu':
        return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">Pengelola Mutu</Badge>;
      case 'kepala_dinas':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Kepala Dinas</Badge>;
      default:
        return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Petugas Lapangan</Badge>;
    }
  };

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
          Profil Pengguna
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola informasi identitas akun dan keamanan kata sandi Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Ringkas Akun */}
        <Card className="border-border bg-card/60 backdrop-blur-md">
          <CardHeader className="text-center pb-2">
            <Avatar className="size-20 mx-auto border-2 border-border shadow-md">
              <AvatarFallback className="bg-muted text-foreground text-xl font-bold">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-3 text-lg font-bold">{user.name}</CardTitle>
            <CardDescription className="text-xs">{user.email}</CardDescription>
            <div className="mt-2 flex justify-center">{getRoleBadge(user.role)}</div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-xs border-t border-border/50">
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground flex items-center gap-2">
                <Shield className="size-3.5" /> Status Akun
              </span>
              <span className="font-semibold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Aktif
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground flex items-center gap-2">
                <Mail className="size-3.5" /> Penyedia Autentikasi
              </span>
              <span className="font-medium">BetterAuth Credential</span>
            </div>
          </CardContent>
        </Card>

        {/* Form Edit Profil & Ganti Password */}
        <div className="md:col-span-2 space-y-6">
          {/* Ubah Nama */}
          <Card className="border-border bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="size-4 text-muted-foreground" /> Informasi Pribadi
              </CardTitle>
              <CardDescription className="text-xs">
                Perbarui nama lengkap yang akan ditampilkan pada dokumen dan riwayat aktivitas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="nama">
                    Nama Lengkap
                  </FieldLabel>
                  <Input
                    id="nama"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">
                    Alamat Email (Terkunci)
                  </FieldLabel>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-muted/50 cursor-not-allowed opacity-80"
                  />
                  <FieldDescription>
                    Alamat email terdaftar tidak dapat diubah secara mandiri. Hubungi administrator untuk perubahan email.
                  </FieldDescription>
                </Field>

                <Button type="submit" size="sm" disabled={isUpdatingProfile} className="text-xs">
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="size-3.5 mr-2 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Ganti Kata Sandi */}
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
                  <FieldLabel htmlFor="current-pwd">
                    Kata Sandi Saat Ini
                  </FieldLabel>
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
                    <FieldLabel htmlFor="new-pwd">
                      Kata Sandi Baru
                    </FieldLabel>
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

                <Button type="submit" size="sm" variant="default" disabled={isChangingPassword} className="text-xs">
                  {isChangingPassword ? (
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
        </div>
      </div>
    </div>
  );
}
