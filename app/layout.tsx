"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Providers } from './providers';
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Rightbar from "@/components/Rightbar";
import FooterPlayer from "@/components/FooterPlayer";
import React, { useState, useEffect } from "react";
import SignupBanner from "@/components/SignupBanner";

const font = Figtree({ subsets: ["latin"] });

// Componente que maneja la lógica de autenticación
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [showRightbar, setShowRightbar] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const isLoggedIn = status === 'authenticated';
  
  // Mostrar rightbar cuando el usuario está autenticado
  useEffect(() => {
    console.log('Auth status changed:', { status, isLoggedIn });
    if (isLoggedIn) {
      console.log('User is authenticated, showing rightbar');
      setShowRightbar(true);
    } else {
      setShowRightbar(false);
    }
  }, [status, isLoggedIn]);
  
  // Debug logs
  console.log('AuthenticatedLayout - Status:', status);
  console.log('AuthenticatedLayout - isLoggedIn:', isLoggedIn);
  console.log('AuthenticatedLayout - showRightbar:', showRightbar);
  console.log('AuthenticatedLayout - Session:', session);
  
  // Si es una página de autenticación, mostramos solo el contenido
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  // Debug logs
  console.log('Authentication status:', status);
  console.log('isLoggedIn:', isLoggedIn);
  console.log('showRightbar:', showRightbar);
  
  // Para páginas que requieren autenticación
  return (
    <div className="flex flex-col min-h-0 min-w-0 h-full w-full overflow-hidden">
      <Topbar />
      <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden">
        <Sidebar />
        <main 
          className={`min-h-0 min-w-0 overflow-y-auto custom-scrollbar flex-1 px-1 md:px-2 pt-1 md:pt-1.5 backdrop-blur-md bg-black/70 ${isLoggedIn ? 'pr-0' : 'w-full'}`}
          style={{ width: isLoggedIn && showRightbar ? 'calc(100% - 340px)' : '100%' }}
        >
          {children}
        </main>
        {isLoggedIn && <Rightbar />}
      </div>
      <FooterPlayer showRightbar={showRightbar} setShowRightbar={isLoggedIn ? setShowRightbar : () => {}} />
    </div>
  );
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={font.className}>
      <body className={font.className + " bg-black"}>
        <Providers>
          <AuthenticatedLayout>
            {children}
          </AuthenticatedLayout>
          <SignupBanner />
        </Providers>
      </body>
    </html>
  );
}
