'use client';

import React, { useState } from 'react';
import {
  Users2,
  Plus,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Lock,
  Loader2,
  Search,
  X,
  MoreVertical,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { penggunaSchema } from '@/lib/validations/pengguna';
import {
  createPenggunaAction,
  toggleStatusPenggunaAction,
  updateRolePenggunaAction,
} from '@/lib/actions/pengguna';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  aktif: boolean;
  createdAt: Date;
}

export function PenggunaClient({
  initialUsers,
  currentUserId,
}: {
  initialUsers: UserItem[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ubah Role Modal State
  const [selectedUserForRole, setSelectedUserForRole] = useState<UserItem | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Form State Tambah
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'pengelola_mutu' | 'petugas_lapangan' | 'kepala_dinas'>('petugas_lapangan');
  const [password, setPassword] = useState('password123');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleOpenAdd = () => {
    setNama('');
    setEmail('');
    setRole('petugas_lapangan');
    setPassword('password123');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditRole = (user: UserItem) => {
    setSelectedUserForRole(user);
    setSelectedRole(user.role);
    setIsRoleModalOpen(true);
  };

  const handleSubmitRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForRole || !selectedRole) return;
    setIsUpdatingRole(true);
    try {
      const res = await updateRolePenggunaAction(selectedUserForRole.id, selectedRole);
      if (res.success) {
        setUsers(
          users.map((u) => (u.id === selectedUserForRole.id ? { ...u, role: selectedRole } : u))
        );
        toast.success(res.message || 'Wewenang role berhasil diubah.');
        setIsRoleModalOpen(false);
        setSelectedUserForRole(null);
      } else {
        toast.error(res.message || 'Gagal mengubah wewenang role.');
      }
    } catch {
      toast.error('Gagal memperbarui wewenang role pengguna.');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // 1. Validasi Zod Client-Side
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
      const res = await createPenggunaAction({
        nama,
        email,
        role,
        aktif: true,
        password,
      });

      if (res.success && res.data) {
        setUsers([res.data as UserItem, ...users]);
        toast.success(res.message || 'Akun pengguna berhasil dibuat.');
        setIsModalOpen(false);
      } else {
        if (res.errors) {
          setFieldErrors(res.errors as Record<string, string[]>);
        }
        toast.error(res.message || 'Gagal membuat pengguna baru.');
      }
    } catch {
      toast.error('Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: UserItem) => {
    const actionName = user.aktif ? 'menonaktifkan' : 'mengaktifkan';
    if (!confirm(`Konfirmasi ${actionName} akun "${user.name}"?`)) return;

    try {
      const res = await toggleStatusPenggunaAction(user.id, !user.aktif);
      if (res.success) {
        setUsers(
          users.map((u) => (u.id === user.id ? { ...u, aktif: !user.aktif } : u))
        );
        toast.success(res.message || `Status akun berhasil diubah.`);
      } else {
        toast.error(res.message || 'Gagal mengubah status akun.');
      }
    } catch {
      toast.error('Gagal memperbarui status akun.');
    }
  };

  const getRoleBadge = (r: string) => {
    switch (r) {
      case 'admin':
        return <Badge variant="default" className="text-xs">Administrator</Badge>;
      case 'pengelola_mutu':
        return <Badge variant="secondary" className="text-xs">Pengelola Mutu</Badge>;
      case 'petugas_lapangan':
        return <Badge variant="outline" className="border-primary/40 text-primary text-xs">Petugas Lapangan</Badge>;
      case 'kepala_dinas':
        return <Badge variant="outline" className="border-amber-400 text-amber-600 dark:text-amber-400 text-xs">Kepala Dinas</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{r}</Badge>;
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase().trim();
    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.role.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-primary border-primary/30 bg-primary/5 text-xs font-semibold uppercase tracking-wider">
            <Users2 className="size-3" />
            <span>Manajemen Akses & RBAC</span>
          </Badge>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Manajemen Akun Pengguna & Petugas
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Pengelolaan wewenang verifikasi hasil uji, approval lembar LHU, dan operator lapangan sistem SIPEKA.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 shadow-xs self-start sm:self-auto cursor-pointer">
          <Plus className="size-4" />
          <span>Tambah Pengguna Baru</span>
        </Button>
      </div>

      {/* Search Bar & Indikator Komparasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama pengguna, email, atau role..."
            className="pl-8 pr-8 text-xs h-8"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              title="Hapus pencarian"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          {filteredUsers.length < users.length ? (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs py-0.5">
                Menampilkan {filteredUsers.length} dari {users.length} pengguna (Hasil Filter)
              </Badge>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setSearchTerm('')}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Reset
              </Button>
            </div>
          ) : (
            <span className="text-muted-foreground">
              Total: <strong className="text-foreground">{users.length}</strong> pengguna terdaftar
            </span>
          )}
        </div>
      </div>

      {/* Users Table Card */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold">Nama Lengkap</TableHead>
                <TableHead className="text-xs font-semibold">Alamat Email</TableHead>
                <TableHead className="text-xs font-semibold">Wewenang Role</TableHead>
                <TableHead className="text-xs font-semibold text-center">Status Akun</TableHead>
                <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                    {searchTerm ? (
                      <div className="space-y-1.5">
                        <p>Tidak ada pengguna yang cocok dengan pencarian &ldquo;{searchTerm}&rdquo;.</p>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setSearchTerm('')}
                          className="cursor-pointer"
                        >
                          Kosongkan Pencarian
                        </Button>
                      </div>
                    ) : (
                      <p>Belum ada data pengguna yang terdaftar.</p>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => (
                <TableRow key={u.id} className="hover:bg-muted/30">
                  <TableCell className="font-semibold text-foreground text-xs">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7 ring-1 ring-border">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(u.role)}
                  </TableCell>
                  <TableCell className="text-center">
                    {u.aktif ? (
                      <Badge variant="outline" className="border-emerald-300 text-emerald-800 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs gap-1">
                        <UserCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Aktif</span>
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs gap-1">
                        <UserX className="size-3" />
                        <span>Nonaktif</span>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex items-center justify-center rounded-md size-8 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        title="Menu Aksi Pengguna"
                      >
                        <MoreVertical className="size-4" />
                        <span className="sr-only">Aksi Pengguna</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="text-xs">Kelola Akun</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleOpenEditRole(u)}
                            className="text-xs gap-2 cursor-pointer"
                          >
                            <KeyRound className="size-3.5 text-primary" />
                            <span>Ubah Wewenang (Role)</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        {u.id !== currentUserId && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() => handleToggleStatus(u)}
                                variant={u.aktif ? "destructive" : "default"}
                                className="text-xs gap-2 cursor-pointer"
                              >
                                {u.aktif ? (
                                  <>
                                    <UserX className="size-3.5 text-destructive" />
                                    <span className="text-destructive">Nonaktifkan Akun</span>
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="size-3.5 text-emerald-600" />
                                    <span>Aktifkan Akun</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dialog Modal Ubah Role Pengguna */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <span>Ubah Wewenang Akses Pengguna</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ubah hak akses wewenang sistem SIPEKA untuk akun <strong>{selectedUserForRole?.name}</strong> ({selectedUserForRole?.email}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitRoleChange} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-role" className="text-xs font-medium">
                Pilih Wewenang Baru (Role RBAC)
              </Label>
              <Select
                value={selectedRole}
                onValueChange={(val) => {
                  if (val) setSelectedRole(val);
                }}
              >
                <SelectTrigger id="edit-role" className="w-full h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petugas_lapangan">Petugas Lapangan (Input & Scan Data)</SelectItem>
                  <SelectItem value="pengelola_mutu">Pengelola Mutu (Kelola SOP & Baku Mutu)</SelectItem>
                  <SelectItem value="kepala_dinas">Kepala Dinas (Dashboard & Approve LHU)</SelectItem>
                  <SelectItem value="admin">Administrator (Akses Penuh Sistem)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Perubahan wewenang akan langsung aktif saat pengguna melakukan aksi berikutnya di sistem.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRoleModalOpen(false)}
                disabled={isUpdatingRole}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isUpdatingRole}>
                {isUpdatingRole ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1.5" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Perubahan Role'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Modal Tambah User */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users2 className="size-4 text-primary" />
              <span>Registrasi Akun Pengguna Baru</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Buat kredensial akun baru untuk petugas atau pimpinan di Dinas Perikanan Lembata.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="nama" className="text-xs font-medium">
                Nama Lengkap <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Yohanes Lewoleba"
                className="h-9 text-xs"
              />
              {fieldErrors.nama && (
                <p className="text-xs text-destructive">{fieldErrors.nama[0]}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">
                Alamat Email Resmi <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@sipeka.lembata.go.id"
                  className="pl-9 h-9 text-xs"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-medium">
                Peran / Wewenang Akses (Role RBAC) <span className="text-destructive">*</span>
              </Label>
              <Select
                value={role}
                onValueChange={(val) => {
                  if (val) {
                    setRole(
                      val as
                        | 'admin'
                        | 'pengelola_mutu'
                        | 'petugas_lapangan'
                        | 'kepala_dinas'
                    );
                  }
                }}
              >
                <SelectTrigger id="role" className="w-full h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petugas_lapangan">Petugas Lapangan (Input & Scan Data)</SelectItem>
                  <SelectItem value="pengelola_mutu">Pengelola Mutu (Kelola SOP & Baku Mutu)</SelectItem>
                  <SelectItem value="kepala_dinas">Kepala Dinas (Dashboard & Approve LHU)</SelectItem>
                  <SelectItem value="admin">Administrator (Akses Penuh Sistem)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium">
                Kata Sandi Sementara <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 font-mono h-9 text-xs"
                />
              </div>
              <p className="text-xs text-muted-foreground">Default: password123</p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
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
    </div>
  );
}
