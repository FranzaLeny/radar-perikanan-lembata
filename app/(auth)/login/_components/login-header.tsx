import React from 'react';
import Image from 'next/image';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { APP_CONFIG } from '@/lib/constants';

export function LoginHeader() {
  return (
    <CardHeader className="text-center pb-4">
      <div className="flex items-center justify-center gap-4 mb-3">
        <Image
          src={APP_CONFIG.logo.kabupaten}
          alt="Logo Pemerintah Kabupaten Lembata"
          width={56}
          height={56}
          priority
          className="h-14 w-auto object-contain drop-shadow-xs"
        />
        <div className="h-10 w-px bg-border/80" />
        <Image
          src={APP_CONFIG.logo.app}
          alt={`Logo ${APP_CONFIG.name}`}
          width={56}
          height={56}
          priority
          className="h-14 w-auto object-contain drop-shadow-xs"
        />
      </div>
      <CardTitle className="text-2xl font-bold font-heading tracking-tight">
        {APP_CONFIG.name}
      </CardTitle>
      <CardDescription className="text-xs font-semibold text-foreground">
        {APP_CONFIG.fullName}
      </CardDescription>
      <p className="text-xs text-muted-foreground mt-1">
        {APP_CONFIG.institution.name}
      </p>
    </CardHeader>
  );
}
