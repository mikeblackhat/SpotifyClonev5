"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiHomeAlt, BiSearchAlt2, BiUserPlus, BiExpandAlt, BiPlus, BiMusic } from 'react-icons/bi';
import { RiPlayListFill } from 'react-icons/ri';
import { IoMdClose } from 'react-icons/io';
import { useSession } from 'next-auth/react';
import { Search, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

// Components
import SidebarHeader from './components/SidebarHeader';
import PlaylistList from './components/PlaylistList';
import FooterLinks from './components/FooterLinks';
import NavItem from './components/NavItem';

// Types
import { Playlist, SidebarContentProps } from './types';

// Estilos para ocultar la barra de desplazamiento
const scrollbarStyles = `
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }`;



const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const { status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const pathname = usePathname();

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const isLargeScreen = window.innerWidth >= 1024;
            setIsCollapsed(!isLargeScreen);
        };

        // Set initial state
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Clean up event listener
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            if (sidebarRef.current) {
                const scrolled = sidebarRef.current.scrollTop > 0;
                setIsScrolled(scrolled);
            }
        };

        const currentRef = sidebarRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <motion.div 
            className="flex flex-col h-full w-full bg-black/60 backdrop-blur-xl overflow-hidden no-scrollbar"
            style={{
                boxShadow: '4px 0 10px -5px rgba(0, 0, 0, 0.2)',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)'
            }}
            initial={{ width: 300 }}
            animate={{ 
                width: isCollapsed ? 72 : 300,
                transition: { 
                    duration: 0.25, 
                    ease: [0.4, 0, 0.2, 1],
                    bounce: 0.1
                }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <style jsx global>{scrollbarStyles}</style>
            <SidebarContent 
                isCollapsed={isCollapsed}
                isHovered={isHovered}
                isAuthenticated={isAuthenticated}
                setIsCollapsed={setIsCollapsed}
                pathname={pathname}
            />
        </motion.div>
    );
};

const SidebarContent: React.FC<SidebarContentProps> = ({
    isCollapsed,
    isHovered,
    isAuthenticated,
    setIsCollapsed,
    pathname
}) => {
    const [activeTab, setActiveTab] = useState<string>('playlists');
    const [searchQuery, setSearchQuery] = useState<string>('');
    
    // Initialize playlists with random song counts
    const [playlists] = useState<Playlist[]>(() => [
        { id: 1, name: "Tus me gusta" },
        { id: 2, name: "Corridos Tumbados" },
        { id: 3, name: "Selección Natural" },
        { id: 4, name: "Mix diario 2" },
        { id: 5, name: "Your Top Songs 2024" },
    ].map(playlist => ({
        ...playlist,
        songCount: Math.floor(Math.random() * 100) + 1
    })));

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(prev => !prev);
    }, [setIsCollapsed]);

    const handleTabChange = useCallback((tab: string) => {
        setActiveTab(tab);
    }, []);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    const filteredPlaylists = useMemo(() => {
        if (!searchQuery.trim()) return playlists;
        return playlists.filter(playlist =>
            playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [playlists, searchQuery]);

    // Render playlist item with proper image handling
    const renderPlaylistItem = useCallback((playlist: Playlist) => {
        // Generate a consistent random image URL for each playlist
        const imageUrl = `https://picsum.photos/seed/playlist-${playlist.id}/200/200`;
        
        return (
            <div key={playlist.id} className="flex items-center justify-between p-2 hover:bg-white/10 rounded-md cursor-pointer">
                <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0">
                        <img 
                            src={imageUrl}
                            alt={playlist.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                                // Fallback to a solid color if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMxZDFkMWQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+UGxheWxpc3Q8L3RleHQ+PC9zdmc+'
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-8">
                        <span className="text-sm font-medium text-white line-clamp-1">{playlist.name}</span>
                        <span className="text-xs text-gray-400">{playlist.songCount} songs</span>
                    </div>
                </div>
                <button 
                    className="text-gray-400 hover:text-white p-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Handle more options click
                    }}
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>
        );
    }, []);

    const renderSidebarContent = useMemo(() => {
        if (!isAuthenticated) {
            return (
                <>
                    <div className="flex items-center justify-between p-4">
                        <h3 className="text-lg font-bold text-white">Tu biblioteca</h3>
                        <button className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors" 
                                aria-label="Crear playlist" title="Crear playlist">
                            <BiPlus className="text-lg" />
                        </button>
                    </div>
                    
                    <div className="bg-[#181818] rounded-lg p-4 mx-4 mb-4">
                        <h4 className="text-white font-bold mb-1">Crea tu primera playlist</h4>
                        <p className="text-gray-400 text-sm mb-3">¡Es muy fácil! Te vamos a ayudar</p>
                        <button className="bg-white text-black font-bold rounded-full px-4 py-2 text-sm hover:scale-105 transition-transform">
                            Crear playlist
                        </button>
                    </div>
                    
                    <div className="bg-[#181818] rounded-lg p-4 mx-4 mb-4">
                        <h4 className="text-white font-bold mb-1">Busquemos algunos podcasts para seguir</h4>
                        <p className="text-gray-400 text-sm mb-3">Te mantendremos al tanto de los nuevos episodios.</p>
                        <button className="bg-white text-black font-bold rounded-full px-4 py-2 text-sm hover:scale-105 transition-transform">
                            Explorar podcasts
                        </button>
                    </div>
                    
                    <div className="mt-auto p-4 pt-6 border-t border-white/10">
                        <div className="text-xs text-gray-400 flex flex-wrap gap-x-4 gap-y-1 mb-4">
                            <span>Legal</span>
                            <span>Seguridad y Centro de Privacidad</span>
                            <span>Política de Privacidad</span>
                            <span>Cookies</span>
                            <span>Sobre los anuncios</span>
                            <span>Accesibilidad</span>
                        </div>
                        <button className="flex items-center gap-2 border border-gray-400 rounded-full px-4 py-2 text-white text-sm hover:bg-white/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25M12 18.75V21M4.219 4.219l1.591 1.591M18.19 18.189l1.59 1.591M21 12h-2.25M5.25 12H3M4.219 19.781l1.591-1.591M18.189 5.811l1.591-1.591" />
                            </svg>
                            <span>Español de Latinoamérica</span>
                        </button>
                    </div>
                </>
            );
        }

        return (
            <div className="flex flex-col h-full p-2 lg:p-4 pb-20 overflow-hidden">
                {isCollapsed ? (
                    <div className="flex flex-col items-center mt-6 gap-8">
                        <button
                            onClick={toggleCollapse}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            aria-label="Expandir menú"
                            title="Expandir menú"
                        >
                            <BiExpandAlt className="text-xl" />
                        </button>
                        <div className="w-8 h-px bg-white/10"></div>
                        <Link href="/" className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Inicio">
                            <BiHomeAlt className="text-xl" />
                        </Link>
                        <Link href="/search" className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Buscar">
                            <BiSearchAlt2 className="text-xl" />
                        </Link>
                        <Link href="/artists" className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Artistas">
                            <BiUserPlus className="text-xl" />
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mt-2 px-2 lg:px-4">
                            <div className="flex items-center justify-between mb-2 lg:mb-4">
                                <div className="flex items-center gap-2">
                                    <RiPlayListFill className="text-gray-400 text-lg" />
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:block">
                                        Tu biblioteca
                                    </h3>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button 
                                        className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                        aria-label="Crear playlist"
                                        title="Crear playlist"
                                    >
                                        <BiPlus className="text-lg" />
                                    </button>
                                    <button
                                        onClick={toggleCollapse}
                                        className="p-1.5 -mr-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                        aria-label="Minimizar menú"
                                        title="Minimizar menú"
                                    >
                                        <IoMdClose className="text-lg" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {!isCollapsed && (
                            <>
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
                                        onChange={handleSearchChange}
                                        aria-label="Buscar en tu biblioteca"
                                    />
                                </motion.div>

                                <div className="flex gap-2 mb-5 overflow-x-auto pb-2 px-3 -mx-1 scrollbar-hide">
                                    <button 
                                        className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 text-xs rounded-full border ${activeTab === 'playlists' ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'}`}
                                        onClick={() => handleTabChange('playlists')}
                                    >
                                        Playlists
                                    </button>
                                    <button 
                                        className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 text-xs rounded-full border ${activeTab === 'artists' ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'}`}
                                        onClick={() => handleTabChange('artists')}
                                    >
                                        Artistas
                                    </button>
                                    <button 
                                        className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 text-xs rounded-full border ${activeTab === 'albums' ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'}`}
                                        onClick={() => handleTabChange('albums')}
                                    >
                                        Álbumes
                                    </button>
                                </div>
                            </>
                        )}

                        {isAuthenticated && !isCollapsed && (
                            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
                                <AnimatePresence>
                                    {playlists
                                        .filter(playlist =>
                                            playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((playlist, index) => (
                                            <motion.div
                                                key={playlist.id}
                                                className="group flex items-center p-3 rounded-md hover:bg-white/10 cursor-pointer mb-2"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className={`w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded flex-shrink-0 flex items-center justify-center`}>
                                                    <BiMusic className="text-white text-xl" />
                                                </div>
                                                <div className="ml-3 overflow-hidden">
                                                    <h4 className="text-sm font-medium text-white truncate">
                                                        {playlist.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        Playlist • {playlist.songCount || 0} canciones
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }, [isAuthenticated, isCollapsed, searchQuery, activeTab, playlists, toggleCollapse, handleSearchChange, handleTabChange]);

    if (!isAuthenticated) {
        // Sidebar para usuarios no autenticados - siempre expandido sin efectos
        return (
            <aside className="hidden sm:flex flex-col bg-black/60 backdrop-blur-xl border-r border-white/10 shadow-2xl select-none overflow-hidden flex-shrink-0 pt-1 w-[240px] md:w-[280px]">
                <div className="flex flex-col h-full p-2 lg:p-4 pb-20 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Tu biblioteca</h3>
                        <button className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors" aria-label="Crear playlist" title="Crear playlist">
                            <BiPlus className="text-lg" />
                        </button>
                    </div>
                    
                    <div className="bg-[#181818] rounded-lg p-4 mb-4">
                        <h4 className="text-white font-bold mb-1">Crea tu primera playlist</h4>
                        <p className="text-gray-400 text-sm mb-3">¡Es muy fácil! Te vamos a ayudar</p>
                        <button className="bg-white text-black font-bold rounded-full px-4 py-2 text-sm hover:scale-105 transition-transform">
                            Crear playlist
                        </button>
                    </div>
                    
                    <div className="bg-[#181818] rounded-lg p-4 mb-4">
                        <h4 className="text-white font-bold mb-1">Busquemos algunos podcasts para seguir</h4>
                        <p className="text-gray-400 text-sm mb-3">Te mantendremos al tanto de los nuevos episodios.</p>
                        <button className="bg-white text-black font-bold rounded-full px-4 py-2 text-sm hover:scale-105 transition-transform">
                            Explorar podcasts
                        </button>
                    </div>
                    
                    <div className="mt-auto pt-4">
                        <div className="text-xs text-gray-400 flex flex-wrap gap-x-4 gap-y-1 mb-4">
                            <span>Legal</span>
                            <span>Seguridad y Centro de Privacidad</span>
                            <span>Política de Privacidad</span>
                            <span>Cookies</span>
                            <span>Sobre los anuncios</span>
                            <span>Accesibilidad</span>
                        </div>
                        <button className="flex items-center gap-2 border border-gray-400 rounded-full px-4 py-2 text-white text-sm hover:bg-white/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25M12 18.75V21M4.219 4.219l1.591 1.591M18.19 18.189l1.59 1.591M21 12h-2.25M5.25 12H3M4.219 19.781l1.591-1.591M18.189 5.811l1.591-1.591" />
                            </svg>
                            <span>Español de Latinoamérica</span>
                        </button>
                    </div>
                </div>
            </aside>
        );
    }

    // No need for duplicate resize handler, using the one in the main Sidebar component

    const sidebarContent = useMemo(() => (
        <div className="flex flex-col h-full p-2 lg:p-4 pb-20">
            {/* Expand Button - Only shown when collapsed */}
            {isCollapsed ? (
                <div className="flex flex-col items-center mt-4 gap-6">
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Expandir menú"
                        title="Expandir menú"
                    >
                        <BiExpandAlt className="text-xl" />
                    </button>
                    <div className="w-8 h-px bg-white/10"></div>
                    <Link href="/" className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Inicio">
                        <BiHomeAlt className="text-xl" />
                    </Link>
                    <Link href="/search" className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Buscar">
                        <BiSearchAlt2 className="text-xl" />
                    </Link>
                    <Link href="/artists" className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Artistas">
                        <BiUserPlus className="text-xl" />
                    </Link>
                </div>
            ) : (
                <>
                    {isAuthenticated && (
                        <div className="mt-2 px-2 lg:px-4">
                            <div className="flex items-center justify-between mb-2 lg:mb-4">
                                <div className="flex items-center gap-2">
                                    <RiPlayListFill className="text-gray-400 text-lg" />
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:block">
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
                        </div>
                    )}
                </>
            )}

            {!isCollapsed && isAuthenticated && (
                <>
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

                    {/* Filtros de búsqueda */}
                    <div className="flex gap-2 mb-5 overflow-x-auto pb-2 px-3 -mx-1 scrollbar-hide">
                        <button 
                            className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 text-xs rounded-full border ${activeTab === 'playlists' ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'}`}
                            onClick={() => setActiveTab('playlists')}
                        >
                            Playlists
                        </button>
                        <button 
                            className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 text-xs rounded-full border ${activeTab === 'artists' ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'}`}
                            onClick={() => setActiveTab('artists')}
                        >
                            Artistas
                        </button>
                        <button 
                            className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 text-xs rounded-full border ${activeTab === 'albums' ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'}`}
                            onClick={() => setActiveTab('albums')}
                        >
                            Álbumes
                        </button>
                    </div>
                </>
            )}

            {/* Playlist List - Only show when authenticated */}
            {isAuthenticated && !isCollapsed && (
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
    ), [isCollapsed, isAuthenticated, playlists, toggleCollapse]);



    useEffect(() => {
        const checkScreenSize = () => {
            const largeScreen = window.innerWidth >= 1024; // lg breakpoint
            setIsCollapsed(!largeScreen);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <motion.div className="flex h-full bg-black/0 text-gray-300">
            <style jsx global>{scrollbarStyles}</style>
            <motion.aside
                className={`flex flex-col ${isCollapsed ? 'w-[72px]' : 'w-[240px] md:w-[280px] lg:w-[320px]'} bg-black/60 backdrop-blur-xl border-r border-white/10 shadow-2xl select-none overflow-hidden flex-shrink-0 pt-1 transition-all duration-300 ease-in-out`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
            >
                {sidebarContent}
            </motion.aside>
        </motion.div>
    );
};

export default React.memo(Sidebar);
