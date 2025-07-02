'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiSearch, FiBook, FiMusic } from 'react-icons/fi';
import { FaSpotify } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';

const MobileBottomNav = () => {
  const pathname = usePathname();
  
  // Verificar si la ruta actual coincide con el enlace
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 sm:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {/* Inicio */}
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center flex-1 h-full ${isActive('/') ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}
        >
          <FiHome className="text-xl mb-0.5" />
          <span className="text-xs">Inicio</span>
        </Link>
        
        {/* Buscar */}
        <Link 
          href="/search" 
          className={`flex flex-col items-center justify-center flex-1 h-full ${isActive('/search') ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}
        >
          <FiSearch className="text-xl mb-0.5" />
          <span className="text-xs">Buscar</span>
        </Link>
        
        {/* Biblioteca */}
        <Link 
          href="/collection/playlists" 
          className={`flex flex-col items-center justify-center flex-1 h-full ${isActive('/collection/playlists') ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}
        >
          <FiBook className="text-xl mb-0.5" />
          <span className="text-xs">Tu biblioteca</span>
        </Link>

                {/* Premium */}
                <Link 
          href="/premium" 
          className={`flex flex-col items-center justify-center flex-1 h-full ${isActive('/premium') ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}
        >
          <FaSpotify className="text-xl mb-0.5" />
          <span className="text-xs">Premium</span>
        </Link>
        
         {/* Crear lista */}
         <Link 
          href="/create-playlist"
          className="flex flex-col items-center justify-center flex-1 h-full text-gray-400 hover:text-white transition-colors"
        >
          <div className="bg-white text-black rounded-full p-1.5 mb-0.5">
            <IoMdAdd className="text-lg" />
          </div>
          <span className="text-xs">Crear</span>
        </Link>

      </div>
    </nav>
  );
};

export default MobileBottomNav;
