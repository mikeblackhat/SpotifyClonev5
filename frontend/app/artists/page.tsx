'use client';

import React, { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { useSongs } from '@/contexts/SongContext';
import { ArtistsCarousel } from '@/components/shared/carousels/ArtistsCarousel';
import { Artist } from '@/contexts/SongContext';

export default function ArtistsPage() {
  const { artists, fetchArtists, isLoading } = useSongs();
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar artistas al montar el componente
  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  // Filtrar artistas según el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredArtists(artists);
    } else {
      const filtered = artists.filter(artist =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredArtists(filtered);
    }
  }, [searchTerm, artists]);

  // Actualizar artistas filtrados cuando cambia la lista de artistas
  useEffect(() => {
    setFilteredArtists(artists);
  }, [artists]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Explorar Artistas</h1>
        
        {/* Barra de búsqueda */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Buscar artistas..."
              className="w-full bg-neutral-800 text-white px-4 py-3 rounded-full pl-12 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {/* Lista de artistas */}
        {isLoading && filteredArtists.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-full aspect-square rounded-full bg-neutral-800 animate-pulse mb-3"></div>
                <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredArtists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredArtists.map((artist) => (
              <div 
                key={artist.id} 
                className="group flex flex-col cursor-pointer p-4 rounded-lg transition-colors hover:bg-neutral-800/50"
                onClick={() => window.location.href = `/artist/${artist.id}`}
              >
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-4 group-hover:shadow-lg transition-all duration-300">
                  <img 
                    src={artist.image || '/images/default-artist.jpg'} 
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/default-artist.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <button 
                      className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Lógica para reproducir artista
                      }}
                    >
                      <FaPlay className="text-black ml-1" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold truncate" title={artist.name}>
                  {artist.name}
                </h3>
                <p className="text-sm text-gray-400 truncate">Artista</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No se encontraron artistas</h3>
            <p className="text-gray-400">Intenta con otro término de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}
