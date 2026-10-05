import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Loader2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field';

interface ProfilPersonalFormProps {
  initialName: string;
  email: string;
}

export function ProfilPersonalForm({
  initialName,
  email,
}: ProfilPersonalFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Nama lengkap tidak boleh kosong');
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await authClient.updateUser({
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
      setIsUpdating(false);
    }
  };

  return (
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
            <FieldLabel htmlFor="nama">Nama Lengkap</FieldLabel>
            <Input
              id="nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap Anda"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Alamat Email (Terkunci)</FieldLabel>
            <Input
              id="email"
              value={email}
              disabled
              className="bg-muted/50 cursor-not-allowed opacity-80"
            />
            <FieldDescription>
              Alamat email terdaftar tidak dapat diubah secara mandiri. Hubungi administrator untuk perubahan email.
            </FieldDescription>
          </Field>

          <Button
            type="submit"
            size="sm"
            disabled={isUpdating}
            className="text-xs cursor-pointer"
          >
            {isUpdating ? (
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
  );
}
