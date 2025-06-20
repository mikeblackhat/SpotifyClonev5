"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BiPlus } from 'react-icons/bi';
import { FaPlay } from 'react-icons/fa';
import CollectionHeader from '@/components/collection/CollectionHeader';

// Datos de prueba para playlists
const mockPlaylists = [
  {
    id: 1,
    title: 'Tus me gusta',
    description: 'Tus canciones favoritas',
    image: '/images/liked-songs.jpg',
    songs: 124,
    duration: '8h 42m',
    owner: 'Tú',
    public: false
  },
  {
    id: 2,
    title: 'Mix diario 2',
    description: 'Tus favoritas de los últimos días, todas juntas',
    image: '/images/daily-mix.jpg',
    songs: 50,
    duration: '3h 15m',
    owner: 'Spotify',
    public: true
  },
  {
    id: 3,
    title: 'Tus Top Hits 2024',
    description: 'Las canciones que más has escuchado este año',
    image: '/images/top-2024.jpg',
    songs: 100,
    duration: '6h 30m',
    owner: 'Spotify',
    public: true
  },
];

export default function PlaylistsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPlaylists = mockPlaylists.filter(playlist =>
    playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 text-white">
      <CollectionHeader
        title="Playlists"
        searchPlaceholder="Buscar en tus playlists"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
        {/* Tarjeta de crear nueva playlist */}
        <motion.div 
          className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer group flex flex-col items-center justify-center h-48"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-white/20">
            <BiPlus className="text-3xl text-white" />
          </div>
          <h3 className="font-medium text-center">Crear playlist</h3>
        </motion.div>

        {/* Lista de playlists */}
        {filteredPlaylists.map((playlist) => (
          <motion.div 
            key={playlist.id}
            className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative mb-4">
              <img 
                src={playlist.image} 
                alt={playlist.title}
                className="w-full aspect-square object-cover rounded-md mb-2"
              />
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:scale-110">
                <FaPlay className="text-black ml-0.5" />
              </button>
            </div>
            <h3 className="font-medium truncate">{playlist.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2 h-10">{playlist.description}</p>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>{playlist.songs} canciones</span>
              {playlist.owner === 'Tú' && (
                <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">Privada</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
