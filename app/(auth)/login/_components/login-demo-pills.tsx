import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LoginDemoPillsProps {
  onSelect: (email: string) => void;
}

export function LoginDemoPills({ onSelect }: LoginDemoPillsProps) {
  return (
    <div className="pt-4 border-t border-border space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <ShieldCheck className="size-3.5 text-muted-foreground" />
        <span>Akses Cepat Akun Demo (Uji Coba)</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSelect('admin@sipeka.lembata.go.id')}
          className="h-auto p-2.5 flex flex-col items-start justify-start text-left w-full font-normal group cursor-pointer"
        >
          <div className="w-full font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
            <span>Administrator</span>
            <Badge variant="outline" className="text-xs py-0 px-1 font-mono">
              ADM
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate w-full">
            admin@sipeka...
          </p>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => onSelect('pengelola@sipeka.lembata.go.id')}
          className="h-auto p-2.5 flex flex-col items-start justify-start text-left w-full font-normal group cursor-pointer"
        >
          <div className="w-full font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
            <span>Pengelola Mutu</span>
            <Badge variant="outline" className="text-xs py-0 px-1 font-mono">
              PM
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate w-full">
            pengelola@sipeka...
          </p>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => onSelect('petugas@sipeka.lembata.go.id')}
          className="h-auto p-2.5 flex flex-col items-start justify-start text-left w-full font-normal group cursor-pointer"
        >
          <div className="w-full font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
            <span>Petugas Lapangan</span>
            <Badge variant="outline" className="text-xs py-0 px-1 font-mono">
              PL
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate w-full">
            petugas@sipeka...
          </p>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => onSelect('kadin@sipeka.lembata.go.id')}
          className="h-auto p-2.5 flex flex-col items-start justify-start text-left w-full font-normal group cursor-pointer"
        >
          <div className="w-full font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
            <span>Kepala Dinas</span>
            <Badge variant="outline" className="text-xs py-0 px-1 font-mono">
              KD
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate w-full">
            kadin@sipeka...
          </p>
        </Button>
      </div>
    </div>
  );
}
