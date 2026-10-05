import React from 'react';
import {
  MoreVertical,
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserItem } from '../types';

interface PenggunaRowActionsProps {
  user: UserItem;
  isSelf: boolean;
  onOpenEditRole: (u: UserItem) => void;
  onToggleBan: (u: UserItem) => void;
  onDelete: (u: UserItem) => void;
}

export function PenggunaRowActions({
  user,
  isSelf,
  onOpenEditRole,
  onToggleBan,
  onDelete,
}: PenggunaRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center rounded-md size-7 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors focus-visible:outline-none"
        title="Menu Tindakan"
      >
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs">Aksi Pengguna</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onOpenEditRole(user)}>
            <ShieldCheck className="size-3.5 mr-2 text-primary" />
            <span>Ubah Wewenang Role</span>
          </DropdownMenuItem>
          {!isSelf && (
            <DropdownMenuItem onClick={() => onToggleBan(user)}>
              {user.aktif ? (
                <>
                  <UserX className="size-3.5 mr-2 text-amber-600" />
                  <span>Nonaktifkan Akun</span>
                </>
              ) : (
                <>
                  <UserCheck className="size-3.5 mr-2 text-emerald-600" />
                  <span>Aktifkan Kembali</span>
                </>
              )}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        {!isSelf && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {user.isUsed ? (
                <DropdownMenuItem
                  onClick={() => onDelete(user)}
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
                  onClick={() => onDelete(user)}
                  variant="destructive"
                  className="text-xs gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Trash2 className="size-3.5 mr-2" />
                  <span>Hapus Akun</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
