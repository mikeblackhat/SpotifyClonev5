"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Providers } from './providers';
import { memo } from 'react';
import { Sidebar, Topbar, Rightbar, SignupBanner, MobileBottomNav } from "@/components";
import React, { useState, useEffect } from "react";
import { PlayerProvider, usePlayer } from "@/contexts/PlayerContext";
import { GenreProvider } from "@/contexts/GenreContext";
import PlayerBar from "@/components/player/PlayerBar";

// Componente auxiliar para manejar el contenido del reproductor
const PlayerContent = ({ 
  children, 
  showRightbar, 
  shouldShowRightbar 
}: { 
  children: React.ReactNode;
  showRightbar: boolean;
  shouldShowRightbar: boolean;
}) => {
  const { currentSong } = usePlayer();
  
  return (
    <>
      <div style={{
        width: currentSong && showRightbar ? 'calc(100% - 20rem)' : '100%',
        transition: 'width 300ms ease-in-out'
      }}>
        {children}
      </div>
      
      {/* Rightbar */}
      {currentSong && (
        <div className={`fixed right-0 top-16 bottom-0 w-80 bg-black/80 backdrop-blur-lg z-30 transition-transform duration-300 ${
          showRightbar ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <Rightbar showRightbar={showRightbar} onClose={() => {
            // Disparar evento para ocultar el rightbar
            document.dispatchEvent(new CustomEvent('toggleRightbar', { detail: false }));
          }} />
        </div>
      )}
    </>
  );
};

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
  
  // Controlar la visibilidad del rightbar
  const shouldShowRightbar = showRightbar;
  
  // Manejar el evento para mostrar/ocultar el rightbar
  useEffect(() => {
    const handleToggleRightbar = (event: CustomEvent) => {
      setShowRightbar(event.detail);
    };

    // Escuchar eventos personalizados para mostrar/ocultar el rightbar
    document.addEventListener('toggleRightbar', handleToggleRightbar as EventListener);
    
    // Mostrar rightbar cuando el usuario está autenticado
    setShowRightbar(isLoggedIn);

    return () => {
      document.removeEventListener('toggleRightbar', handleToggleRightbar as EventListener);
    };
  }, [isLoggedIn]);
  
  // Si es una página de autenticación, mostramos solo el contenido
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  // Para páginas que requieren autenticación
  return (
    <PlayerProvider>
      <GenreProvider>
        <div className="flex flex-col min-h-screen w-full bg-black">
          {/* Topbar fijo */}
          <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md">
            <Topbar />
          </header>

          {/* Contenido principal con sidebar */}
          <div className="flex flex-1 pt-16">
            {/* Sidebar fijo */}
            <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-64 z-40">
              <Sidebar />
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 md:ml-64 pl-4">
              <PlayerContent 
                showRightbar={showRightbar} 
                shouldShowRightbar={shouldShowRightbar}
              >
                <div className="h-full overflow-y-auto px-6">
                  {children}
                </div>
              </PlayerContent>
            </main>
          </div>
          
          {/* PlayerBar fijo en la parte inferior */}
          <footer className="fixed bottom-0 left-0 right-0 h-20 z-40">
            {isLoggedIn ? <PlayerBar /> : <SignupBanner />}
          </footer>
          
          {/* Navegación móvil */}
          {isLoggedIn && <MobileBottomNav />}
        </div>
      </GenreProvider>
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
