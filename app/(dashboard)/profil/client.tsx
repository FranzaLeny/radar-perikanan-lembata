'use client';

import React from 'react';
import type { ProfilClientProps } from './types';
import { ProfilInfoCard } from './_components/profil-info-card';
import { ProfilPersonalForm } from './_components/profil-personal-form';
import { ProfilPasswordForm } from './_components/profil-password-form';

export * from './types';

export function ProfilClient({ user }: ProfilClientProps) {
  return (
    <div className="container max-w-5xl py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
          Profil Pengguna
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola informasi identitas akun dan keamanan kata sandi Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProfilInfoCard user={user} />

        <div className="md:col-span-2 space-y-6">
          <ProfilPersonalForm initialName={user.name} email={user.email} />
          <ProfilPasswordForm />
        </div>
      </div>
    </div>
  );
}
