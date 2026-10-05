import React from 'react';
import { ShieldAlert, ShieldCheck, UserCheck, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PenggunaRowActions } from './pengguna-row-actions';
import type { UserItem } from '../types';

interface PenggunaTableProps {
  users: UserItem[];
  currentUserId: string;
  searchTerm: string;
  onClearSearch: () => void;
  onOpenEditRole: (u: UserItem) => void;
  onToggleBan: (u: UserItem) => void;
  onDelete: (u: UserItem) => void;
}

export function PenggunaTable({
  users,
  currentUserId,
  searchTerm,
  onClearSearch,
  onOpenEditRole,
  onToggleBan,
  onDelete,
}: PenggunaTableProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[11px] gap-1 font-semibold">
            <ShieldAlert className="size-3" />
            Administrator
          </Badge>
        );
      case 'pengelola_mutu':
        return (
          <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 text-[11px] gap-1 font-semibold">
            <ShieldCheck className="size-3" />
            Pengelola Mutu
          </Badge>
        );
      case 'kepala_dinas':
        return (
          <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30 text-[11px] gap-1 font-semibold">
            <Shield className="size-3" />
            Kepala Dinas
          </Badge>
        );
      case 'petugas_lapangan':
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground text-[11px] gap-1">
            <UserCheck className="size-3" />
            Petugas Lapangan
          </Badge>
        );
    }
  };

  return (
    <Card className="border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">Nama & Email Pengguna</TableHead>
              <TableHead className="text-xs font-semibold">Peran / Hak Akses</TableHead>
              <TableHead className="text-xs font-semibold">Status Keaktifan</TableHead>
              <TableHead className="text-xs font-semibold">Terdaftar</TableHead>
              <TableHead className="text-xs font-semibold">Penggunaan</TableHead>
              <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                  {searchTerm ? (
                    <div className="space-y-1.5">
                      <p>Tidak ada pengguna yang cocok dengan pencarian &ldquo;{searchTerm}&rdquo;.</p>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={onClearSearch}
                        className="cursor-pointer"
                      >
                        Kosongkan Pencarian
                      </Button>
                    </div>
                  ) : (
                    <p>Belum ada data pengguna dalam kategori ini.</p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const isSelf = user.id === currentUserId;

                return (
                  <TableRow
                    key={user.id}
                    className={`hover:bg-muted/30 transition-colors ${
                      !user.aktif ? 'opacity-60 bg-muted/15' : ''
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 text-xs font-semibold">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.name
                              ? user.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join('')
                                  .toUpperCase()
                              : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground text-xs">{user.name}</span>
                            {isSelf && (
                              <Badge variant="secondary" className="text-[10px] py-0 px-1 font-normal">
                                Anda
                              </Badge>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-xs">
                      <Badge
                        variant={user.aktif ? 'default' : 'outline'}
                        className={`text-[10px] font-semibold ${
                          user.aktif
                            ? 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {user.aktif ? 'Aktif' : 'Dinonaktifkan'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-xs">
                      {user.isUsed ? (
                        <Badge
                          variant="secondary"
                          className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 text-[10px] font-mono"
                        >
                          {user.transactionCount} Pengujian
                        </Badge>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">Belum Ada</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <PenggunaRowActions
                        user={user}
                        isSelf={isSelf}
                        onOpenEditRole={onOpenEditRole}
                        onToggleBan={onToggleBan}
                        onDelete={onDelete}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
