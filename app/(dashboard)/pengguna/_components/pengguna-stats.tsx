import React from 'react';
import { ShieldAlert, ShieldCheck, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { UserItem } from '../types';

interface PenggunaStatsProps {
  users: UserItem[];
}

export function PenggunaStats({ users }: PenggunaStatsProps) {
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const mutuCount = users.filter((u) => u.role === 'pengelola_mutu').length;
  const lapanganCount = users.filter((u) => u.role === 'petugas_lapangan').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="pt-4 pb-3">
          <p className="text-xs text-muted-foreground font-medium">Total Akun</p>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">{totalUsers}</p>
        </CardContent>
      </Card>
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">Administrator</p>
            <ShieldAlert className="size-3.5 text-rose-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            {adminCount}
          </p>
        </CardContent>
      </Card>
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">Pengelola Mutu</p>
            <ShieldCheck className="size-3.5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {mutuCount}
          </p>
        </CardContent>
      </Card>
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">Petugas Lapangan</p>
            <UserCheck className="size-3.5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {lapanganCount}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
