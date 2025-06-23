"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Providers } from './providers';
import { memo } from 'react';
import { Sidebar, Topbar, Rightbar, SignupBanner } from "@/components";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import React, { useState, useEffect } from "react";
import { PlayerProvider } from "@/contexts/PlayerContext";
import PlayerBar from "@/components/player/PlayerBar";

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
    <PlayerProvider>
      <div className="flex flex-col min-h-0 min-w-0 h-full w-full overflow-hidden">
        <div className="z-50 relative">
          <Topbar />
        </div>
        {/* Contenedor principal que cambia de fila a columna en móviles */}
        <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden relative">
          {/* Sidebar solo visible en md y superiores */}
          <div className="hidden md:flex h-full">
            <Sidebar />
          </div>
          
          {/* Contenido principal */}
          <main 
            className={`min-h-0 min-w-0 overflow-y-auto custom-scrollbar flex-1 px-1 md:px-2 pt-1 md:pt-1.5 pb-32 sm:pb-24 backdrop-blur-md bg-black/70 ${
              showRightbar ? 'lg:mr-64 xl:mr-80' : ''
            }`}
            style={{ 
              width: '100%',
              maxWidth: '100%',
              paddingBottom: '8rem' // Más espacio para el reproductor en móviles
            }}
          >
            <div className="min-h-[calc(100vh-10rem)]">
              {children}
            </div>
          </main>
          {isLoggedIn && showRightbar && (
            <div 
              className="hidden lg:flex fixed top-0 right-0 h-full w-64 lg:w-72 xl:w-80 bg-neutral-900/80 backdrop-blur-md z-40 overflow-y-auto transform transition-all duration-300 ease-in-out"
              style={{ 
                paddingTop: '64px',
                boxShadow: '-4px 0 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              <Rightbar />
            </div>
          )}
        </div>
        
        {/* Contenedor fijo en la parte inferior */}
        {isLoggedIn ? (
          <div className="fixed bottom-16 left-0 right-0 z-40 sm:bottom-0 sm:pb-0">
            <PlayerBar />
          </div>
        ) : (
          <div className="fixed bottom-0 left-0 right-0 z-40">
            <SignupBanner />
          </div>
        )}
        {isLoggedIn && <MobileBottomNav />}
      </div>
    </PlayerProvider>
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
        </Providers>
      </body>
    </html>
  );
}
