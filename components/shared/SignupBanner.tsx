"use client";

import { memo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const SignupBanner = memo(function SignupBanner() {
  const { status } = useSession({
    required: false,
  });
  
  if (status !== 'unauthenticated') {
    return null;
  }
  
  return (
    <div className="w-full bg-gradient-to-r from-purple-700 via-blue-600 to-blue-400 text-white px-3 py-2 sm:px-4 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-3 text-xs sm:text-sm fixed bottom-0 left-0 z-40">
      <span className="font-semibold text-xs sm:text-sm">Muestra de Spotify</span>
      <span className="flex-1 text-center sm:text-left px-1 text-xs sm:text-sm line-clamp-2 sm:line-clamp-1">
        Regístrate para acceder a canciones y podcasts ilimitados con anuncios. Sin tarjeta de crédito.
      </span>
      <Link 
        href="/auth/signup" 
        className="bg-white text-black font-bold rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-neutral-200 transition whitespace-nowrap"
      >
        Regístrate gratis
      </Link>
    </div>
  );
});

SignupBanner.displayName = 'SignupBanner';

export default SignupBanner;
