"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
    BiExpandAlt,
    BiSolidAlbum,
    BiSolidPlaylist,
    BiSearchAlt2,
    BiHomeAlt,
    BiPlus,
    BiMusic,
    BiLogIn,
    BiUserPlus
} from "react-icons/bi";
import { FaHeart, FaSpotify } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import { RiCompass3Line, RiPlayListFill } from "react-icons/ri";
import { BsCollectionPlayFill } from "react-icons/bs";

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
`;

interface NavItemProps {
    icon: React.ReactNode;
    text: string;
    isActive: boolean;
    collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, isActive, collapsed }) => {
    return (
        <motion.div
            className={`flex items-center ${isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'} ${collapsed ? 'justify-center w-12 h-12 rounded-full' : 'px-4 py-3 rounded-md'} 
      transition-colors cursor-pointer`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="text-xl">{icon}</span>
            {!collapsed && <span className="ml-4 text-sm font-medium">{text}</span>}
        </motion.div>
    );
};

interface Playlist {
    id: number;
    name: string;
    songCount?: number;
}

const Sidebar: React.FC = () => {
    const pathname = usePathname() || '';
    const { status } = useSession();
    const isAuthenticated = status === 'authenticated';

    if (!isAuthenticated) {
        // Sidebar minimalista para usuarios no autenticados
        return (
            <aside className="hidden md:flex flex-col w-[320px] bg-black/60 backdrop-blur-xl border-r border-white/10 shadow-2xl select-none overflow-hidden flex-shrink-0 pt-1">
                <div className="flex flex-col h-full p-4 pb-20">
                    {/* Título y botón + */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Tu biblioteca</h3>
                        <button className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors" aria-label="Crear playlist" title="Crear playlist">
                            <BiPlus className="text-lg" />
                        </button>
                    </div>
                    {/* Tarjeta: Crea tu primera playlist */}
                    <div className="bg-[#181818] rounded-lg p-4 mb-4">
                        <h4 className="text-white font-bold mb-1">Crea tu primera playlist</h4>
                        <p className="text-gray-400 text-sm mb-3">¡Es muy fácil! Te vamos a ayudar</p>
                        <button className="bg-white text-black font-bold rounded-full px-4 py-2 text-sm">Crear playlist</button>
                    </div>
                    {/* Tarjeta: Busquemos podcasts */}
                    <div className="bg-[#181818] rounded-lg p-4 mb-4">
                        <h4 className="text-white font-bold mb-1">Busquemos algunos podcasts para seguir</h4>
                        <p className="text-gray-400 text-sm mb-3">Te mantendremos al tanto de los nuevos episodios.</p>
                        <button className="bg-white text-black font-bold rounded-full px-4 py-2 text-sm">Explorar podcasts</button>
                    </div>
                    {/* Footer legal y selector de idioma */}
                    <div className="mt-auto pt-4">
                        <div className="text-xs text-gray-400 flex flex-wrap gap-x-4 gap-y-1 mb-4">
                            <span>Legal</span>
                            <span>Seguridad y Centro de Privacidad</span>
                            <span>Política de Privacidad</span>
                            <span>Cookies</span>
                            <span>Sobre los anuncios</span>
                            <span>Accesibilidad</span>
                            <span>Cookies</span>
                        </div>
                        <button className="flex items-center gap-2 border border-gray-400 rounded-full px-4 py-2 text-white text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25M12 18.75V21M4.219 4.219l1.591 1.591M18.19 18.189l1.59 1.591M21 12h-2.25M5.25 12H3M4.219 19.781l1.591-1.591M18.189 5.811l1.591-1.591" />
                            </svg>
                            Español de Latinoamérica
                        </button>
                    </div>
                </div>
            </aside>
        );
    }

    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('playlists');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [playlists, setPlaylists] = useState<Playlist[]>([
        { id: 1, name: "Tus me gusta" },
        { id: 2, name: "Corridos Tumbados" },
        { id: 3, name: "Selección Natural" },
        { id: 4, name: "Mix diario 2" },
        { id: 5, name: "Your Top Songs 2024" },
    ]);

    useEffect(() => {
        // Set random song counts on client side only
        setPlaylists(prevPlaylists =>
            prevPlaylists.map(playlist => ({
                ...playlist,
                songCount: Math.floor(Math.random() * 100) + 1
            }))
        );
    }, []);

    return (
        <motion.div
            className="flex h-full bg-black/0 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <style jsx global>{scrollbarStyles}</style>
            <motion.aside
                className={`hidden md:flex flex-col ${isCollapsed ? 'w-[80px]' : 'w-[320px]'} bg-black/60 backdrop-blur-xl border-r border-white/10 shadow-2xl select-none overflow-hidden flex-1 pt-1 transition-all duration-300 ease-in-out`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-col h-full">
                    {/* Expand Button - Only shown when collapsed */}
                    {isCollapsed && (
                        <div className="flex justify-center px-4 py-2">
                            <button
                                onClick={() => setIsCollapsed(false)}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                aria-label="Expandir menú"
                                title="Expandir menú"
                            >
                                <BiExpandAlt className="text-xl" />
                            </button>
                        </div>
                    )}
                    {/* Navigation */}
                    <div className={`px-4 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
                        <nav className="space-y-1">
                            <Link href="/">
                                <NavItem 
                                    icon={<BiHomeAlt />} 
                                    text="Inicio" 
                                    isActive={pathname === '/'} 
                                    collapsed={isCollapsed} 
                                />
                            </Link>
                            <Link href="/search">
                                <NavItem 
                                    icon={<BiSearchAlt2 />} 
                                    text="Buscar" 
                                    isActive={pathname === '/search'} 
                                    collapsed={isCollapsed} 
                                />
                            </Link>
                            {isAuthenticated ? (
                                <Link href="/collection">
                                    <NavItem 
                                        icon={<RiPlayListFill />} 
                                        text="Tu biblioteca" 
                                        isActive={pathname.startsWith('/collection')} 
                                        collapsed={isCollapsed} 
                                    />
                                </Link>
                            ) : (
                                <>
                                    <Link href="/auth/signin">
                                        <NavItem 
                                            icon={<BiLogIn />} 
                                            text="Iniciar sesión" 
                                            isActive={pathname === '/auth/signin'} 
                                            collapsed={isCollapsed} 
                                        />
                                    </Link>
                                    <Link href="/auth/signup">
                                        <NavItem 
                                            icon={<BiUserPlus />} 
                                            text="Registrarse" 
                                            isActive={pathname === '/auth/signup'} 
                                            collapsed={isCollapsed} 
                                        />
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>

                    {/* Playlist Section - Only show when authenticated */}
                    {!isCollapsed && isAuthenticated && (
                        <div className="mt-2 px-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <RiPlayListFill className="text-gray-400 text-lg" />
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Tu biblioteca
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                        aria-label="Crear playlist"
                                        title="Crear playlist"
                                    >
                                        <BiPlus className="text-lg" />
                                    </button>
                                    <button
                                        onClick={() => setIsCollapsed(true)}
                                        className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                        aria-label="Minimizar menú"
                                        title="Minimizar menú"
                                    >
                                        <IoMdClose className="text-lg" />
                                    </button>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <motion.div 
                                className="relative mb-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BiSearchAlt2 className="h-4 w-4 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full bg-white/10 rounded-md py-2 pl-10 pr-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-colors"
                                    placeholder="Buscar en tu biblioteca"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Buscar en tu biblioteca"
                                />
                            </motion.div>

                            {/* Tabs - Hidden on lg screens */}
                            <div className="lg:hidden">
                                <motion.div 
                                    className="flex gap-2 mb-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: 0.1 }}
                                >
                                    <button
                                        onClick={() => setActiveTab('playlists')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                            activeTab === 'playlists'
                                                ? 'bg-white text-black'
                                                : 'text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                        aria-pressed={activeTab === 'playlists'}
                                    >
                                        Playlists
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('artists')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                            activeTab === 'artists'
                                                ? 'bg-white text-black'
                                                : 'text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                        aria-pressed={activeTab === 'artists'}
                                    >
                                        Artistas
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    )}

                    {/* Playlist List - Only show when authenticated */}
                    {isAuthenticated && (
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
                            <AnimatePresence>
                                {playlists
                                    .filter(playlist =>
                                        playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((playlist, index) => (
                                        <motion.div
                                            key={playlist.id}
                                            className="group flex items-center p-2 rounded-md hover:bg-white/10 cursor-pointer"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className={`w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded flex-shrink-0 flex items-center justify-center`}>
                                                <BiMusic className="text-white text-xl" />
                                            </div>
                                            {!isCollapsed && (
                                                <div className="ml-3 overflow-hidden">
                                                    <h4 className="text-sm font-medium text-white truncate">
                                                        {playlist.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        Playlist • {playlist.songCount || 0} canciones
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.aside>
        </motion.div>
    );
}
export default Sidebar;
