'use client';

import { FiMusic } from 'react-icons/fi';
import { FaPlay } from 'react-icons/fa';
import { PlaylistsSectionProps } from './types';

function PlaylistsSection({ user }: PlaylistsSectionProps) {
  const playlists = [
    { id: 1, name: user.topPlaylist || 'Tus Mezclas', tracks: 42 },
    { id: 2, name: 'Éxitos del verano', tracks: 35 },
    { id: 3, name: 'Rock Clásico', tracks: 28 },
    { id: 4, name: 'Pop Hits 2024', tracks: 31 }
  ];

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Tus playlists destacadas</h2>
        <button className="text-sm text-gray-400 hover:text-white">Ver todo</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="bg-white/5 rounded-md p-4 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="relative mb-4">
              <div className="aspect-square w-full bg-gradient-to-br from-purple-600 to-blue-500 rounded-md flex items-center justify-center">
                <FiMusic className="text-4xl text-white/80" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black transform hover:scale-105">
                    <FaPlay className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
            <h3 className="font-bold text-white mb-1 truncate">{playlist.name}</h3>
            <p className="text-sm text-gray-400">{playlist.tracks} canciones • {user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaylistsSection;
