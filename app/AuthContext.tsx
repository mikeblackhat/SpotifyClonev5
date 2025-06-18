'use client';

import { ReactNode } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

// Hook personalizado para usar la sesión
export const useAuth = () => {
  return useSession();
};
