'use client';

import { useState, useRef, useEffect } from "react";
import { FiSearch, FiUser, FiHelpCircle, FiSettings } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import Notifications from "./Notifications";
import { GrInstallOption } from "react-icons/gr";
import { BsSpotify } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Componente de menú de usuario que muestra el avatar y el menú desplegable
const UserMenu = () => {
  const router = useRouter();
  // Obtener la sesión del usuario y su estado actual
  const { data: session, status } = useSession();
  // Estado para controlar si el menú está abierto o cerrado
  const [open, setOpen] = useState(false);
  // Referencia al contenedor del menú para detectar clics fuera de él
  const menuRef = useRef<HTMLDivElement>(null);
  
  const handleSignOut = async () => {
    try {
      // Cerrar sesión con NextAuth y redirigir a la página de inicio
      await signOut({ 
        redirect: true,
        callbackUrl: '/' 
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // En caso de error, redirigir a la página de inicio
      window.location.href = '/';
    }
  };
  
  // Función para formatear el nombre con la primera letra en mayúscula
  const formatName = (name: string | null | undefined) => {
    if (!name) return 'Usuario';
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Obtener la primera letra del nombre o email para el avatar
  const getUserInitial = () => {
    if (session?.user?.name) {
      return formatName(session.user.name).charAt(0);
    }
    if (session?.user?.email) {
      return session.user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };
  
  // Si el usuario no ha iniciado sesión, no mostrar el menú de usuario
  if (status === 'unauthenticated') {
    return null;
  }

  // Efecto para cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si el clic fue fuera del menú, cerrarlo
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    // Agregar el event listener solo cuando el menú está abierto
    if (open) document.addEventListener("mousedown", handleClickOutside);
    // Limpiar el event listener al desmontar el componente
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    // Contenedor relativo para posicionar el menú desplegable
    <div className="relative" ref={menuRef}>
      {/* Botón del avatar del usuario */}
      <button
        className="flex items-center justify-center rounded-full overflow-hidden w-9 h-9 hover:opacity-90 transition-opacity"
        onClick={() => setOpen((o) => !o)} // Alternar estado abierto/cerrado
        aria-label="Abrir menú de usuario"
      >
        {session?.user?.image ? (
          // Mostrar imagen de perfil si está disponible
          <img 
            src={session.user.image} 
            alt="Foto de perfil" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          // Mostrar inicial en un círculo de color si no hay imagen
          <div className="w-full h-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {getUserInitial()}
          </div>
        )}
      </button>
      {/* Menú desplegable que se muestra al hacer clic en el avatar */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg py-2 z-50 animate-fade-in flex flex-col">
          {session?.user && (
            /* Sección de información del usuario */
            <div className="px-4 py-3 border-b border-neutral-700">
              <p className="text-white font-medium text-sm">{formatName(session.user.name)}</p>
              <p className="text-neutral-400 text-xs">{session.user.email || ''}</p>
            </div>
          )}
          <Link 
            href="/profile" 
            className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-neutral-800 hover:text-white transition-colors"
            onClick={() => setOpen(false)}
          >
            <span className="text-lg"><FiUser /></span>
            <span>Perfil</span>
          </Link>
          
          <Link 
            href="/account" 
            className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-neutral-800 hover:text-white transition-colors"
            onClick={() => setOpen(false)}
          >
            <span className="text-lg"><FiUser /></span>
            <span>Cuenta</span>
          </Link>
          
          <Link 
            href="/help" 
            className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-neutral-800 hover:text-white transition-colors"
            onClick={() => setOpen(false)}
          >
            <span className="text-lg"><FiHelpCircle /></span>
            <span>Ayuda</span>
          </Link>
          
          <Link 
            href="/settings" 
            className="px-4 py-2 text-left text-sm text-white hover:bg-neutral-800 transition-colors"
            onClick={() => setOpen(false)}
          >
            Configuración
          </Link>
          <div className="border-t border-neutral-700 my-1"></div>
          <button 
            onClick={handleSignOut}
            className="px-4 py-2 text-left text-sm text-white hover:bg-neutral-800 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

const Topbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';
  
  const handleInstallApp = () => {
    // Verificar si estamos en un dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Para dispositivos móviles, redirigir a las tiendas de aplicaciones
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        window.open('https://apps.apple.com/app/spotify-music-and-podcasts/id324684580', '_blank');
      } else if (/Android/i.test(navigator.userAgent)) {
        window.open('https://play.google.com/store/apps/details?id=com.spotify.music&hl=es&gl=US', '_blank');
      }
    } else {
      // Para escritorio, ofrecer descarga de la aplicación de escritorio
      const userAgent = navigator.userAgent.toLowerCase();
      
      if (userAgent.includes('windows')) {
        window.open('https://download.scdn.co/SpotifySetup.exe', '_blank');
      } else if (userAgent.includes('mac')) {
        window.open('https://download.scdn.co/Spotify.dmg', '_blank');
      } else if (userAgent.includes('linux')) {
        window.open('https://www.spotify.com/es/download/linux/', '_blank');
      } else {
        // Si no se puede detectar el SO, redirigir a la página de descarga principal
        window.open('https://www.spotify.com/es/download/other/', '_blank');
      }
    }
  };
  return (
    <header className="w-full h-16 px-4 sm:px-6 flex items-center justify-between bg-gradient-to-b from-neutral-950/90 to-transparent sticky top-0 z-30 backdrop-blur-md">
      {/* Logo Spotify */}
      <div className="flex items-center gap-4 sm:gap-8">
        <BsSpotify className="text-white text-2xl flex-shrink-0" />
      </div>
      {/* Buscador centrado */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-2 sm:px-0">
        <div className="flex items-center gap-2 w-full">
          <Link 
            href="/" 
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 transition"
            aria-label="Inicio"
          >
            <IoHomeOutline size={20} className="text-white" />
          </Link>
          <div className="flex items-center bg-neutral-900 rounded-full px-3 py-2 flex-1 min-w-0">
            <span className="text-gray-400">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="¿Qué quieres reproducir?"
              className="bg-transparent outline-none text-white placeholder-gray-400 flex-1 text-sm min-w-0 ml-2"
              aria-label="Buscar música"
            />
          </div>
        </div>
      </div>
      {/* Botones y perfil */}
      <div className="flex items-center gap-1 sm:gap-2 relative">
        <Link 
          href="/premium" 
          className="hidden sm:inline-flex bg-white text-black px-3 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm hover:bg-neutral-200 transition transform hover:scale-105 items-center justify-center whitespace-nowrap"
        >
          <span className="hidden sm:inline">Explorar Premium</span>
          <span className="sm:hidden">Premium</span>
        </Link>
        <button 
          onClick={handleInstallApp}
          className="hidden sm:flex bg-neutral-800 text-white p-2 sm:px-3 sm:py-2 rounded-full font-semibold text-sm hover:bg-neutral-700 transition items-center gap-1 sm:gap-2 transform hover:scale-105"
          aria-label="Instalar aplicación"
        >
          <GrInstallOption className="text-sm sm:text-base" />
          <span className="hidden sm:inline">Instalar</span>
        </button>
        
        {!isLoading && !session ? (
          <div className="flex items-center gap-1 sm:gap-2">
            <Link 
              href="/auth/signup"
              className="text-white font-bold px-2 sm:px-4 py-2 rounded-full text-xs sm:text-sm hover:bg-neutral-200 hover:text-black transition transform hover:scale-105 inline-flex items-center justify-center whitespace-nowrap"
            >
              Regístrate
            </Link>
            <Link 
              href="/auth/signin"
              className="bg-white text-black px-3 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm hover:bg-neutral-200 transition transform hover:scale-105 inline-flex items-center justify-center whitespace-nowrap"
            >
              Entrar
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <Notifications />
            <UserMenu />
          </div>
        )}
      </div>
    </header>
  );
};

// Exportar el componente directamente
export default Topbar;
