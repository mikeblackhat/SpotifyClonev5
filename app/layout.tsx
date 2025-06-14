"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Providers } from './providers';
import { memo } from 'react';
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Rightbar from "@/components/Rightbar";
import FooterPlayer from "@/components/FooterPlayer";
import React, { useState, useEffect } from "react";
import SignupBanner from "@/components/SignupBanner";

const font = Figtree({ subsets: ["latin"] });

// Componente que maneja la lógica de autenticación
const AuthenticatedLayout = memo(function AuthenticatedLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [showRightbar, setShowRightbar] = useState(false);
  const { status } = useSession({
    required: false,
  });
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const isLoggedIn = status === 'authenticated';
  
  // Mostrar rightbar cuando el usuario está autenticado
  useEffect(() => {
    setShowRightbar(isLoggedIn);
  }, [isLoggedIn]);
  
  // Si es una página de autenticación, mostramos solo el contenido
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  // Para páginas que requieren autenticación
  return (
    <div className="flex flex-col min-h-0 min-w-0 h-full w-full overflow-hidden">
      <div className="z-50 relative">
        <Topbar />
      </div>
      <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden relative">
        <Sidebar />
        <main 
          className={`min-h-0 min-w-0 overflow-y-auto custom-scrollbar flex-1 px-1 md:px-2 pt-1 md:pt-1.5 pb-24 backdrop-blur-md bg-black/70 ${showRightbar ? 'md:mr-80' : ''}`}
          style={{ 
            width: showRightbar ? 'calc(100% - 320px)' : '100%',
            paddingBottom: '6rem' // Asegura espacio para el footer
          }}
        >
          <div className="min-h-[calc(100vh-10rem)]">
            {children}
          </div>
        </main>
        {isLoggedIn && showRightbar && (
          <div 
            className="fixed top-0 right-0 h-full w-80 bg-neutral-900/80 backdrop-blur-md z-40 overflow-y-auto"
            style={{ paddingTop: '64px' }}
          >
            <Rightbar />
          </div>
        )}
      </div>
      {isLoggedIn && (
        <FooterPlayer 
          showRightbar={showRightbar} 
          setShowRightbar={setShowRightbar} 
        />
      )}
    </div>
  );
});

AuthenticatedLayout.displayName = 'AuthenticatedLayout';



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
