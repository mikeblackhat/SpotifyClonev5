'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SongProvider } from '@/contexts/SongContext';

// Componente para manejar la autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  useEffect(() => {
    if (status === 'loading') return;
    
    // Si el usuario no está autenticado y no está en una página de autenticación
    if (status === 'unauthenticated' && !isAuthPage) {
      // No redirigimos automáticamente, pero podrías hacerlo aquí si lo deseas
      // router.push('/auth/signin');
    }
  }, [status, isAuthPage, router]);

  // No mostrar nada mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <SongProvider>
          {children}
        </SongProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
