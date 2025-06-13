'use client';

import { FiUser, FiHeart, FiPlus } from 'react-icons/fi';
import { FaPlay } from 'react-icons/fa';
import { ProfileHeaderProps } from './types';

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-end gap-6 mb-4">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-500 rounded-md shadow-2xl flex items-center justify-center">
          <FiUser className="text-6xl text-white/80" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-green-500 mb-2">PERFIL</p>
          <h1 className="text-6xl font-bold mb-2">{user.name}</h1>
          
          {/* Fila para el correo y los botones */}
          <div className="flex items-center justify-between w-full mb-2">
            {user.email && <p className="text-gray-400 text-sm">{user.email}</p>}
            
            <div className="flex items-center gap-4">
              <button className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-8 rounded-full text-sm flex items-center gap-2 transition-transform transform hover:scale-105">
                <FaPlay className="text-lg" />
                Reproducir
              </button>
              <button className="bg-transparent border border-gray-600 hover:border-white text-white font-bold py-3 px-6 rounded-full text-sm flex items-center gap-2 transition-all">
                <FiPlus className="text-lg" />
                Seguir
              </button>
              <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                <FiHeart className="text-xl" />
              </button>
            </div>
          </div>
          
          {/* Fila para los contadores */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>{user.followers.toLocaleString()} seguidores</span>
            <span>{user.following} siguiendo</span>
            <span>{user.playlists} listas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
