import React from 'react';
import { Shield, Mail, CheckCircle2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { CurrentUser } from '@/lib/auth';

interface ProfilInfoCardProps {
  user: CurrentUser;
}

export function ProfilInfoCard({ user }: ProfilInfoCardProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30">
            Administrator
          </Badge>
        );
      case 'pengelola_mutu':
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
            Pengelola Mutu
          </Badge>
        );
      case 'kepala_dinas':
        return (
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            Kepala Dinas
          </Badge>
        );
      default:
        return (
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            Petugas Lapangan
          </Badge>
        );
    }
  };

  return (
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
  );
}
