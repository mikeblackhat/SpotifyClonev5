'use client';

import { FiUser, FiHeart, FiPlus } from 'react-icons/fi';
import { FaPlay } from 'react-icons/fa';
import { ProfileHeaderProps } from './types';

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 mb-4">
        <div className="w-32 h-32 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-48 xl:h-48 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full md:rounded-md shadow-2xl flex items-center justify-center">
          <FiUser className="text-4xl md:text-5xl lg:text-6xl text-white/80" />
        </div>
        <div className="w-full md:flex-1 text-center md:text-left">
          <p className="text-xs md:text-sm font-semibold text-green-500 mb-1 md:mb-2">PERFIL</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 break-words overflow-visible">
            {user.name}
          </h1>
          
          {/* Fila para el correo y los botones */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full mb-2 gap-3 md:gap-4">
            {user.email && (
              <p className="text-xs md:text-sm text-gray-400 truncate max-w-full">
                {user.email}
              </p>
            )}
            
            <div className="flex items-center gap-2 md:gap-3">
              <button className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 md:py-2.5 px-4 md:px-5 rounded-full text-xs md:text-sm flex items-center gap-1.5 transition-transform transform hover:scale-105 whitespace-nowrap">
                <FaPlay className="text-sm md:text-base" />
                <span className="hidden md:inline">Reproducir</span>
              </button>
              <button className="bg-transparent border border-gray-600 hover:border-white text-white font-bold py-2 md:py-2.5 px-3 md:px-4 rounded-full text-xs md:text-sm flex items-center gap-1.5 transition-all whitespace-nowrap">
                <FiPlus className="text-sm md:text-base" />
                <span className="hidden md:inline">Seguir</span>
              </button>
              <button className="text-gray-400 hover:text-white p-1.5 md:p-2 rounded-full hover:bg-white/10 transition-colors">
                <FiHeart className="text-lg md:text-xl" />
              </button>
            </div>
          </div>
          
          {/* Fila para los contadores */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-4 lg:gap-6 text-xs md:text-sm text-gray-400">
            <span>{user.followers.toLocaleString()} seguidores</span>
            <span className="hidden md:inline">•</span>
            <span>{user.following} siguiendo</span>
            <span className="hidden md:inline">•</span>
            <span>{user.playlists} listas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
