import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ProfilClient } from './client';

export default async function ProfilPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return <ProfilClient user={user} />;
}
