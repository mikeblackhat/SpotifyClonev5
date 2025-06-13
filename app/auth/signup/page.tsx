'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import SignUpView from '@/app/views/SignUpView';

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams() || new URLSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const { data: session } = useSession();

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (session) {
      router.push(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  return <SignUpView />;
}
