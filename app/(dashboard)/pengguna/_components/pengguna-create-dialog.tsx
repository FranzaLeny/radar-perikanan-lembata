'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authClient } from '@/lib/auth-client';
import { APP_CONFIG } from '@/lib/constants';
import { toFieldErrors } from '@/lib/utils';
import { penggunaSchema } from '@/lib/validations/pengguna';
import { Loader2, Lock, Mail, Users2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { UserItem, UserRole } from '../types';

interface PenggunaCreateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newUser: UserItem) => void;
}

export function PenggunaCreateDialog({
  isOpen,
  onOpenChange,
  onSuccess,
}: PenggunaCreateDialogProps) {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('petugas_lapangan');
  const [password, setPassword] = useState('password123');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setNama('');
    setEmail('');
    setRole('petugas_lapangan');
    setPassword('password123');
    setFieldErrors({});
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const validation = penggunaSchema.safeParse({
      nama,
      email,
      role,
      aktif: true,
      password,
    });

    if (!validation.success) {
      setFieldErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await authClient.admin.createUser({
        email: email.toLowerCase().trim(),
        password: password || 'password123',
        name: nama,
        role: role as "user" | "admin" | ("user" | "admin")[],
      });

      if (!error && data) {
        const u = data.user;
        const createdUser: UserItem = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role || role,
          aktif: !u.banned,
          banned: u.banned ?? false,
          createdAt: new Date(u.createdAt),
          transactionCount: 0,
          isUsed: false,
        };

        onSuccess(createdUser);
        toast.success(`Akun untuk ${nama} berhasil didaftarkan.`);
        onOpenChange(false);
      } else {
        toast.error(error?.message || 'Gagal mendaftarkan pengguna.');
      }
    } catch {
      toast.error('Terjadi kesalahan sistem saat mendaftarkan akun.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users2 className="size-4 text-muted-foreground" />
            <span>Registrasi Akun Pengguna Baru</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Buat kredensial akun baru untuk petugas atau pimpinan di {APP_CONFIG.institution.shortName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <Field>
            <FieldLabel htmlFor="nama">Nama Lengkap *</FieldLabel>
            <Input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Yohanes Lewoleba"
            />
            <FieldError errors={toFieldErrors(fieldErrors.nama)} />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Alamat Email Resmi *</FieldLabel>
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
              />
            </InputGroup>
            <FieldError errors={toFieldErrors(fieldErrors.email)} />
          </Field>

          <Field>
            <FieldLabel htmlFor="role">Peran / Wewenang Akses (Role RBAC) *</FieldLabel>
            <Select
              value={role}
              onValueChange={(val) => {
                if (val) setRole(val as UserRole);
              }}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petugas_lapangan">Petugas Lapangan (Input & Scan Data)</SelectItem>
                <SelectItem value="pengelola_mutu">Pengelola Mutu (Kelola SOP & Baku Mutu)</SelectItem>
                <SelectItem value="kepala_dinas">Kepala Dinas (Dashboard & Approve LHU)</SelectItem>
                <SelectItem value="admin">Administrator (Akses Penuh Sistem)</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Kata Sandi Sementara *</FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Lock className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                id="password"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono"
              />
            </InputGroup>
            <FieldDescription>Default: password123</FieldDescription>
          </Field>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Menyimpan...
                </>
              ) : (
                'Daftarkan Pengguna'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
