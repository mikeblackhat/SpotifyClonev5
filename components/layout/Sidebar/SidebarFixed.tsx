"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { 
  BiExpandAlt, 
  BiSolidAlbum, 
  BiSolidPlaylist, 
  BiSearchAlt2,
  BiPlus,
  BiMusic
} from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const Sidebar: React.FC = () => {
  const pathname = usePathname() || '';
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Efecto para manejar el estado inicial basado en el tamaño de pantalla
  useEffect(() => {
    // Solo se ejecuta una vez al montar el componente
    const isLargeScreen = window.innerWidth >= 1024;
    if (isLargeScreen) {
      setIsCollapsed(false);
    }

    // Función para manejar cambios de tamaño
    const handleResize = () => {
      const isNowLarge = window.innerWidth >= 1024;
      if (isNowLarge !== isLargeScreen) {
        // Solo actualiza si cambió el estado de tamaño
        setIsCollapsed(!isNowLarge);
      }
    };
    
    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    // Limpiar el listener al desmontar el componente
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Array de dependencias vacío para que solo se ejecute una vez
  
  // Library navigation items
  const libraryItems = [
    { id: 'playlists', icon: <BiSolidPlaylist />, text: 'Playlists', href: '/collection/playlists' },
    { id: 'artists', icon: <FaHeart />, text: 'Artistas', href: '/collection/artists' },
    { id: 'albums', icon: <BiSolidAlbum />, text: 'Álbumes', href: '/collection/albums' },
  ];

  if (!isAuthenticated) {
    return (
      <motion.aside 
        className="hidden sm:flex flex-col bg-black/60 backdrop-blur-xl border-r border-white/10 shadow-2xl w-72 p-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-bold text-white mb-4">Inicia sesión</h3>
        <p className="text-gray-400 text-sm mb-4">
          Inicia sesión para ver tus playlists y música guardada.
        </p>
        <button className="bg-white text-black font-bold rounded-full px-6 py-2 text-sm hover:scale-105 transition-transform">
          Iniciar sesión
        </button>
      </motion.aside>
    );
  }

  return (
    <motion.aside
      className={`flex flex-col ${isCollapsed ? 'w-[72px]' : 'w-[240px] md:w-[280px] lg:w-[320px]'} bg-black/60 backdrop-blur-xl border-r border-white/10 shadow-2xl select-none overflow-hidden flex-shrink-0 transition-all duration-300 ease-in-out`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-full p-2 lg:p-4 pb-20">
        {isAuthenticated && (
          <div className="flex-1 flex flex-col">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'} mb-6`}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Tu biblioteca
                </h3>
              )}
              <div className={`flex ${isCollapsed ? 'flex-col-reverse space-y-2 space-y-reverse' : 'flex-row space-x-2'}`}>
                {/* Orden para móvil: X primero, + después */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
                    title={isCollapsed ? "Expandir menú" : "Contraer menú"}
                  >
                    {isCollapsed ? <BiExpandAlt className="text-xl" /> : <IoMdClose className="text-xl" />}
                  </button>
                </div>
                
                {/* Botón de añadir - visible en todas las vistas */}
                <button 
                  className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  aria-label="Crear playlist o carpeta"
                  title="Crear playlist o carpeta"
                >
                  <BiPlus className="text-xl" />
                </button>
                
                {/* Orden para pantallas md y lg: + primero, X después */}
                <div className="hidden md:block">
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
                    title={isCollapsed ? "Expandir menú" : "Contraer menú"}
                  >
                    {isCollapsed ? <BiExpandAlt className="text-xl" /> : <IoMdClose className="text-xl" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Library Navigation */}
            <nav className="space-y-2 mb-6">
              {libraryItems.map((item) => (
                <Link 
                  href={item.href} 
                  key={item.id}
                  className={`flex items-center p-2 rounded-md hover:bg-white/10 transition-colors ${pathname.includes(item.href) ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium">
                      {item.text}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Playlists Section - Only show when not collapsed */}
            {!isCollapsed && (
              <div className="flex-1 flex flex-col">
                <div className="relative mb-4">
                  <BiSearchAlt2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar en tu biblioteca"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 text-white text-sm rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white/10 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  {[
                    { id: 1, name: "Tus me gusta", songCount: 42 },
                    { id: 2, name: "Corridos Tumbados", songCount: 15 },
                    { id: 3, name: "Selección Natural", songCount: 28 },
                    { id: 4, name: "Mix diario 2", songCount: 36 },
                    { id: 5, name: "Your Top Songs 2024", songCount: 50 },
                  ]
                    .filter(playlist =>
                      playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((playlist) => (
                      <Link 
                        href={`/playlist/${playlist.id}`}
                        key={playlist.id}
                        className="flex items-center p-2 rounded-md hover:bg-white/10 group"
                      >
                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center mr-3 flex-shrink-0">
                          <BiMusic className="text-gray-400 group-hover:text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white truncate">
                            {playlist.name}
                          </h4>
                          <p className="text-xs text-gray-400">
                            {playlist.songCount} canciones
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
