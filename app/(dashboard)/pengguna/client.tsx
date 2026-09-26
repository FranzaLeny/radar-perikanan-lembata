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
  Trash2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group';
import { toFieldErrors } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
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
import { authClient } from '@/lib/auth-client';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  aktif: boolean;
  banned?: boolean | null;
  createdAt: Date;
  transactionCount?: number;
  isUsed?: boolean;
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

  // Hapus User Modal State
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<UserItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cannotDeleteInfoUser, setCannotDeleteInfoUser] = useState<UserItem | null>(null);

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
      const { error } = await authClient.admin.setRole({
        userId: selectedUserForRole.id,
        role: selectedRole as any,
      });

      if (!error) {
        setUsers(
          users.map((u) => (u.id === selectedUserForRole.id ? { ...u, role: selectedRole } : u))
        );
        toast.success('Wewenang role berhasil diubah.');
        setIsRoleModalOpen(false);
        setSelectedUserForRole(null);
      } else {
        toast.error(error.message || 'Gagal mengubah wewenang role.');
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
      const { data, error } = await authClient.admin.createUser({
        email: email.toLowerCase().trim(),
        password: password || 'password123',
        name: nama,
        role: role as any,
      });

      if (!error && data) {
        const u = data.user as any;
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
        setUsers([createdUser, ...users]);
        toast.success(`Pengguna ${nama} (${role}) berhasil ditambahkan.`);
        setIsModalOpen(false);
      } else {
        toast.error(error?.message || 'Gagal membuat pengguna baru.');
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
      if (user.aktif) {
        const { error } = await authClient.admin.banUser({
          userId: user.id,
          banReason: 'Dinonaktifkan oleh administrator',
        });
        if (!error) {
          setUsers(
            users.map((u) => (u.id === user.id ? { ...u, aktif: false, banned: true } : u))
          );
          toast.success(`Akun "${user.name}" berhasil dinonaktifkan.`);
        } else {
          toast.error(error.message || 'Gagal menonaktifkan akun.');
        }
      } else {
        const { error } = await authClient.admin.unbanUser({
          userId: user.id,
        });
        if (!error) {
          setUsers(
            users.map((u) => (u.id === user.id ? { ...u, aktif: true, banned: false } : u))
          );
          toast.success(`Akun "${user.name}" berhasil diaktifkan kembali.`);
        } else {
          toast.error(error.message || 'Gagal mengaktifkan akun.');
        }
      }
    } catch {
      toast.error('Gagal memperbarui status akun.');
    }
  };

  const handleOpenDelete = (user: UserItem) => {
    setSelectedUserForDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleShowCannotDelete = (user: UserItem) => {
    setCannotDeleteInfoUser(user);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUserForDelete) return;

    if (selectedUserForDelete.isUsed) {
      setIsDeleteDialogOpen(false);
      setCannotDeleteInfoUser(selectedUserForDelete);
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await authClient.admin.removeUser({
        userId: selectedUserForDelete.id,
      });

      if (!error) {
        setUsers(users.filter((u) => u.id !== selectedUserForDelete.id));
        toast.success(`Akun "${selectedUserForDelete.name}" berhasil dihapus.`);
        setIsDeleteDialogOpen(false);
        setSelectedUserForDelete(null);
      } else {
        toast.error(error.message || 'Gagal menghapus pengguna.');
      }
    } catch {
      toast.error('Terjadi kesalahan sistem saat menghapus pengguna.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeactivateFromInfo = async () => {
    if (!cannotDeleteInfoUser) return;
    const u = cannotDeleteInfoUser;
    setCannotDeleteInfoUser(null);
    await handleToggleStatus(u);
  };

  const getRoleBadge = (r: string) => {
    switch (r) {
      case 'admin':
        return <Badge variant="default" className="text-xs">Administrator</Badge>;
      case 'pengelola_mutu':
        return <Badge variant="secondary" className="text-xs">Pengelola Mutu</Badge>;
      case 'petugas_lapangan':
        return <Badge variant="outline" className="text-xs">Petugas Lapangan</Badge>;
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
          <Badge variant="secondary" className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-xs font-semibold uppercase tracking-wider">
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
        <InputGroup className="flex-1 max-w-md">
          <InputGroupAddon align="inline-start">
            <Search className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama pengguna, email, atau role..."
          />
          {searchTerm && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                size="icon-xs"
                onClick={() => setSearchTerm('')}
                title="Hapus pencarian"
              >
                <X className="size-3.5" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

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
                          <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
                            {u.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span>{u.name}</span>
                          {u.isUsed && (
                            <span className="text-[10px] text-amber-500 font-normal">
                              • Tercatat di {u.transactionCount} data uji
                            </span>
                          )}
                        </div>
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
                              <KeyRound className="size-3.5 text-muted-foreground" />
                              <span>Ubah Wewenang (Role)</span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          {u.id !== currentUserId && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                <DropdownMenuItem
                                  onClick={() => handleToggleStatus(u)}
                                  className="text-xs gap-2 cursor-pointer"
                                >
                                  {u.aktif ? (
                                    <>
                                      <UserX className="size-3.5 text-amber-600 dark:text-amber-400" />
                                      <span className="text-amber-600 dark:text-amber-400">Nonaktifkan Akun</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="size-3.5 text-emerald-600" />
                                      <span className="text-emerald-600">Aktifkan Akun</span>
                                    </>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                {u.isUsed ? (
                                  <DropdownMenuItem
                                    onClick={() => handleShowCannotDelete(u)}
                                    className="text-xs gap-2 cursor-pointer text-muted-foreground hover:text-foreground"
                                  >
                                    <Trash2 className="size-3.5 text-muted-foreground/60" />
                                    <div className="flex flex-col text-left">
                                      <span className="text-muted-foreground">Hapus Akun</span>
                                      <span className="text-[10px] text-amber-500 font-normal">
                                        Terkunci (Hanya bisa dinonaktifkan)
                                      </span>
                                    </div>
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => handleOpenDelete(u)}
                                    variant="destructive"
                                    className="text-xs gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                  >
                                    <Trash2 className="size-3.5" />
                                    <span>Hapus Akun</span>
                                  </DropdownMenuItem>
                                )}
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
              <ShieldCheck className="size-4 text-muted-foreground" />
              <span>Ubah Wewenang Akses Pengguna</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ubah hak akses wewenang sistem SIPEKA untuk akun <strong>{selectedUserForRole?.name}</strong> ({selectedUserForRole?.email}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitRoleChange} className="space-y-4 py-2">
            <Field>
              <FieldLabel htmlFor="edit-role">
                Pilih Wewenang Baru (Role RBAC)
              </FieldLabel>
              <Select
                value={selectedRole}
                onValueChange={(val) => {
                  if (val) setSelectedRole(val);
                }}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petugas_lapangan">Petugas Lapangan (Input & Scan Data)</SelectItem>
                  <SelectItem value="pengelola_mutu">Pengelola Mutu (Kelola SOP & Baku Mutu)</SelectItem>
                  <SelectItem value="kepala_dinas">Kepala Dinas (Dashboard & Approve LHU)</SelectItem>
                  <SelectItem value="admin">Administrator (Akses Penuh Sistem)</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                Perubahan wewenang akan langsung aktif saat pengguna melakukan aksi berikutnya di sistem.
              </FieldDescription>
            </Field>

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
              <Users2 className="size-4 text-muted-foreground" />
              <span>Registrasi Akun Pengguna Baru</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Buat kredensial akun baru untuk petugas atau pimpinan di Dinas Perikanan Lembata.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <Field>
              <FieldLabel htmlFor="nama">
                Nama Lengkap *
              </FieldLabel>
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
              <FieldLabel htmlFor="email">
                Alamat Email Resmi *
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
                  placeholder="nama@sipeka.lembata.go.id"
                />
              </InputGroup>
              <FieldError errors={toFieldErrors(fieldErrors.email)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="role">
                Peran / Wewenang Akses (Role RBAC) *
              </FieldLabel>
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
              <FieldLabel htmlFor="password">
                Kata Sandi Sementara *
              </FieldLabel>
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

      {/* Dialog Modal Konfirmasi Hapus Pengguna (Untuk user yang belum terpakai) */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="size-4" />
              <span>Konfirmasi Hapus Akun Pengguna</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tindakan ini akan menghapus akun <strong>{selectedUserForDelete?.name}</strong> ({selectedUserForDelete?.email}) beserta seluruh hak akses login secara permanen dari database.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-destructive flex items-center gap-1.5">
              <AlertTriangle className="size-3.5" /> Informasi Penghapusan:
            </p>
            <p>
              Akun ini belum memiliki riwayat pengujian kualitas air, sehingga aman untuk dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Menghapus...
                </>
              ) : (
                'Ya, Hapus Akun'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Modal Info Pengguna Tidak Bisa Dihapus Karena Terlanjur Dipakai */}
      <Dialog open={!!cannotDeleteInfoUser} onOpenChange={(open) => !open && setCannotDeleteInfoUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-500">
              <ShieldAlert className="size-4" />
              <span>Akun Tidak Dapat Dihapus</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Akun <strong>{cannotDeleteInfoUser?.name}</strong> ({cannotDeleteInfoUser?.email}) terikat dengan data transaksi riwayat pengujian.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-foreground space-y-2">
            <p className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Info className="size-3.5" /> Terdaftar dalam {cannotDeleteInfoUser?.transactionCount || 1} Data Pengujian
            </p>
            <p className="text-muted-foreground">
              Untuk menjaga integritas <strong>Audit Trail</strong> dan keabsahan lembar hasil uji (LHU) laboratorium, akun yang sudah pernah digunakan dalam pencatatan pengujian <strong>tidak boleh dihapus</strong>.
            </p>
            <p className="text-muted-foreground">
              Sesuai standar operasional, akun ini <strong>hanya dapat dinonaktifkan</strong> agar tidak dapat lagi login atau melakukan aktivitas apapun di sistem SIPEKA/MINAMUTU.
            </p>
          </div>

          <DialogFooter className="pt-2 flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCannotDeleteInfoUser(null)}
            >
              Tutup
            </Button>
            {cannotDeleteInfoUser?.aktif && (
              <Button
                type="button"
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={handleDeactivateFromInfo}
              >
                <UserX className="size-3.5 mr-1.5" />
                Nonaktifkan Akun Ini
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
