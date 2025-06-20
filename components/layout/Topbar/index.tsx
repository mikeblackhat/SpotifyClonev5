'use client';

import { useState, useRef, useEffect, ReactNode } from "react";
import { FiSearch, FiUser, FiHelpCircle, FiSettings } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatName } from "@/lib/utils";
import { BsSpotify } from "react-icons/bs";
import { GrInstallOption } from "react-icons/gr";

// Componente para los enlaces del menú móvil
const MenuLink = ({ 
  href, 
  icon, 
  title, 
  subtitle, 
  onClick 
}: { 
  href: string; 
  icon: ReactNode; 
  title: string; 
  subtitle: string; 
  onClick: () => void 
}) => (
  <Link 
    href={href}
    className="flex items-center gap-4 px-4 py-3 text-gray-200 hover:bg-neutral-800 hover:text-white transition-colors rounded-lg mx-1 group"
    onClick={onClick}
  >
    <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center group-hover:bg-neutral-600 transition-colors">
      {icon}
    </div>
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-xs text-neutral-400">{subtitle}</p>
    </div>
  </Link>
);

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

  // Efecto para cerrar el menú al hacer clic fuera de él o al hacer scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Si el clic fue fuera del menú, cerrarlo
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    // Cerrar menú al hacer scroll
    const handleScroll = () => setOpen(false);

    // Agregar los event listeners solo cuando el menú está abierto
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
    }

    // Limpiar los event listeners al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  return (
    // Contenedor relativo para posicionar el menú
    <div className="relative" ref={menuRef}>
      {/* Botón del avatar del usuario */}
      <button
        className={`flex items-center justify-center rounded-full overflow-hidden w-9 h-9 hover:opacity-90 transition-all duration-200 ${open ? 'ring-2 ring-white' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir menú de usuario"
        aria-expanded={open}
      >
        {session?.user?.image ? (
          <img 
            src={session.user.image} 
            alt="Foto de perfil" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {getUserInitial()}
          </div>
        )}
      </button>
      
      {/* Menú para móviles (sm) - Panel lateral */}
      <div 
        className={`lg:hidden fixed left-0 top-0 h-screen w-72 bg-neutral-900 border-r border-neutral-700 shadow-2xl z-50 transition-all duration-300 ease-in-out transform ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Contenido del menú móvil */}
        <div className="p-5 border-b border-neutral-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-700 border-2 border-neutral-600">
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Foto de perfil" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  {getUserInitial()}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">{session?.user ? formatName(session.user.name) : 'Usuario'}</h2>
              <p className="text-neutral-400 text-sm">{session?.user?.email || ''}</p>
            </div>
          </div>
        </div>

        <div className="p-3 overflow-y-auto h-[calc(100vh-100px)]">
          <Link 
            href="/profile" 
            className="flex items-center gap-4 px-4 py-3 text-gray-200 hover:bg-neutral-800 hover:text-white transition-colors rounded-lg mx-1 group"
            onClick={() => setOpen(false)}
          >
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center group-hover:bg-neutral-600 transition-colors">
              <FiUser className="text-lg" />
            </div>
            <div>
              <p className="font-medium">Perfil</p>
              <p className="text-xs text-neutral-400">Tu información personal</p>
            </div>
          </Link>
          
          <Link 
            href="/account" 
            className="flex items-center gap-4 px-4 py-3 text-gray-200 hover:bg-neutral-800 hover:text-white transition-colors rounded-lg mx-1 mt-1 group"
            onClick={() => setOpen(false)}
          >
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center group-hover:bg-neutral-600 transition-colors">
              <FiSettings className="text-lg" />
            </div>
            <div>
              <p className="font-medium">Cuenta</p>
              <p className="text-xs text-neutral-400">Configuración y privacidad</p>
            </div>
          </Link>
          
          <Link 
            href="/help" 
            className="flex items-center gap-4 px-4 py-3 text-gray-200 hover:bg-neutral-800 hover:text-white transition-colors rounded-lg mx-1 mt-1 group"
            onClick={() => setOpen(false)}
          >
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center group-hover:bg-neutral-600 transition-colors">
              <FiHelpCircle className="text-lg" />
            </div>
            <div>
              <p className="font-medium">Ayuda</p>
              <p className="text-xs text-neutral-400">Soporte y preguntas frecuentes</p>
            </div>
          </Link>
          
          <div className="border-t border-neutral-800 my-3 mx-3"></div>
          
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-3 text-gray-200 hover:bg-neutral-800 hover:text-white transition-colors rounded-lg mx-1 flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center group-hover:bg-neutral-600 transition-colors">
              <IoMdClose className="text-lg" />
            </div>
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Menú para escritorio (lg) - Modal */}
      <div 
        className={`hidden lg:block fixed right-0 top-16 w-64 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-50 transition-all duration-200 transform origin-top-right ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
      >
        {session?.user && (
          <div className="p-4 border-b border-neutral-700">
            <p className="text-white font-medium text-sm">{formatName(session.user.name)}</p>
            <p className="text-neutral-400 text-xs">{session.user.email || ''}</p>
          </div>
        )}
        <Link 
          href="/profile" 
          className="block px-4 py-2 text-sm text-gray-200 hover:bg-neutral-800 hover:text-white transition-colors"
          onClick={() => setOpen(false)}
        >
          <FiUser className="inline mr-2" /> Perfil
        </Link>
        <Link 
          href="/account" 
          className="block px-4 py-2 text-sm text-gray-200 hover:bg-neutral-800 hover:text-white transition-colors"
          onClick={() => setOpen(false)}
        >
          <FiSettings className="inline mr-2" /> Cuenta
        </Link>
        <Link 
          href="/help" 
          className="block px-4 py-2 text-sm text-gray-200 hover:bg-neutral-800 hover:text-white transition-colors"
          onClick={() => setOpen(false)}
        >
          <FiHelpCircle className="inline mr-2" /> Ayuda
        </Link>
        <div className="border-t border-neutral-700 my-1"></div>
        <button
          onClick={handleSignOut}
          className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <IoMdClose className="inline mr-2" /> Cerrar sesión
        </button>
      </div>
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
    <header className="w-full h-14 sm:h-16 px-3 sm:px-4 md:px-6 flex items-center justify-between bg-gradient-to-b from-neutral-950/90 to-transparent sticky top-0 z-30 backdrop-blur-md">
      {/* Contenido del lado izquierdo - Logo */}
      <div className="flex items-center">
        <BsSpotify className="text-white text-xl sm:text-2xl flex-shrink-0 md:mr-4" />
      </div>
      {/* Buscador */}
      <div className="flex-1 max-w-2xl mx-2 sm:mx-4 md:mx-6">
        <div className="flex items-center justify-end sm:justify-center w-full">
          <div className="hidden sm:flex items-center w-full max-w-md">
            <Link 
              href="/" 
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 transition mr-2"
              aria-label="Inicio"
            >
              <IoHomeOutline size={18} className="text-white" />
            </Link>
            <div className="flex items-center bg-neutral-900 rounded-full px-3 py-1.5 sm:py-2 w-full">
              <FiSearch size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="¿Qué quieres reproducir?"
                className="bg-transparent outline-none text-white placeholder-gray-400 flex-1 text-xs sm:text-sm min-w-0 ml-2"
                aria-label="Buscar música"
              />
            </div>
          </div>
          
          {/* Botón de búsqueda en móvil */}
          <Link 
            href="/search" 
            className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 transition"
            aria-label="Buscar"
          >
            <FiSearch size={18} className="text-white" />
          </Link>
        </div>
      </div>
      {/* Botones y perfil */}
      <div className="flex items-center gap-1 sm:gap-2 relative">
        <Link 
          href="/premium" 
          className="hidden sm:inline-flex bg-white text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm hover:bg-neutral-200 transition transform hover:scale-105 items-center justify-center whitespace-nowrap"
        >
          <span className="hidden sm:inline">Explorar Premium</span>
          <span className="sm:hidden">Premium</span>
        </Link>
        <button 
          onClick={handleInstallApp}
          className="hidden sm:flex bg-neutral-800 text-white p-1.5 sm:px-3 sm:py-1.5 rounded-full font-semibold text-sm hover:bg-neutral-700 transition items-center gap-1 sm:gap-2 transform hover:scale-105"
          aria-label="Instalar aplicación"
          title="Instalar aplicación"
        >
          <GrInstallOption className="text-sm sm:text-base" />
          <span className="hidden sm:inline">Instalar</span>
        </button>
        
        {!isLoading && !session ? (
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            <Link 
              href="/auth/signup"
              className="text-white font-bold px-3 sm:px-4 py-2 rounded-full text-sm hover:bg-neutral-200 hover:text-black transition transform hover:scale-105 inline-flex items-center justify-center whitespace-nowrap"
            >
              Regístrate
            </Link>
            <Link 
              href="/auth/signin"
              className="bg-white text-black px-4 sm:px-5 py-2 rounded-full font-bold text-sm hover:bg-neutral-200 transition transform hover:scale-105 inline-flex items-center justify-center whitespace-nowrap"
            >
              Entrar
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* Contenido del lado derecho - Avatar y botones */}
            <div className="flex items-center gap-2">
              {/* Vista móvil (sm) */}
              <div className="flex sm:hidden items-center gap-2">
                <UserMenu />
                <button 
                  className="bg-black/30 text-white font-medium text-sm px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/10 hover:scale-105 transition-all duration-200 active:scale-95"
                  onClick={() => router.push('/browse')}
                >
                  Música
                </button>
                <button 
                  className="bg-black/30 text-white font-medium text-sm px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/10 hover:scale-105 transition-all duration-200 active:scale-95"
                  onClick={() => router.push('/podcasts')}
                >
                  Podcasts
                </button>
                <button 
                  className="bg-black/30 text-white font-medium text-sm px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/10 hover:scale-105 transition-all duration-200 active:scale-95"
                  onClick={() => router.push('/playlists')}
                >
                  Listas
                </button>
                <button 
                  className="bg-black/30 text-white font-medium text-sm px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/10 hover:scale-105 transition-all duration-200 active:scale-95"
                  onClick={() => router.push('/genres')}
                >
                  Géneros
                </button>
              </div>
              
              {/* Vista tablet/escritorio (sm+) */}
              <div className="hidden sm:flex items-center gap-2">
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Exportar el componente directamente
export default Topbar;
