'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiMusic } from 'react-icons/fi';
import { FaPlay, FaMusic } from 'react-icons/fa';
import { ArtistsCarousel } from '../../core/shared/carousels/ArtistsCarousel';
import { AlbumsCarousel } from '../../core/shared/carousels/AlbumsCarousel';
import { PlaylistsCarousel } from '../../core/shared/carousels/PlaylistsCarousel';
import GenresCarousel from '../browse/Genres/Carousel';
import { useSampleData } from '@/hooks/useSampleData';
import { ImageWithFallback } from '../../core/shared/ui/ImageWithFallback';
import type { 
  Song as MediaSong, 
  Artist as MediaArtist, 
  Album as MediaAlbum, 
  Playlist as MediaPlaylist 
} from '@/types/media';

// Tipos de datos locales
interface Song extends Omit<MediaSong, 'id'> {
  id: string;
  artist: string;
  imageUrl: string;
}

interface Artist extends Omit<MediaArtist, 'id'> {
  id: string;
  name: string;
  imageUrl: string;
}

interface Album extends Omit<MediaAlbum, 'id'> {
  id: string;
  artist: string;
  imageUrl: string;
}

interface Playlist extends Omit<MediaPlaylist, 'id'> {
  id: string;
  title: string;
  imageUrl: string;
}

const HomeContent = () => {
  const { data: session, status } = useSession();
  const [showRightbar, setShowRightbar] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  
  // Obtener datos de muestra con valores por defecto
  const { 
    popularSongs = [], 
    popularArtists = [], 
    popularAlbums = [], 
    featuredPlaylists = [] 
  } = useSampleData();
  
  // Efecto para manejar el responsive
  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1280;
      setShowRightbar(isLarge);
      setIsLargeScreen(isLarge);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Eliminamos los márgenes del sidebar y rightbar
  const contentWidth = '100%';

  // Renderizar la sección de canciones populares
  const renderSongsSection = () => (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Canciones populares</h2>
        <button className="text-sm text-gray-400 hover:text-white">Ver todo</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {popularSongs.slice(0, 6).map((song) => song && (
          <div key={song.id} className="group bg-neutral-800 p-3 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer">
            <div className="relative mb-3">
              <ImageWithFallback 
                src={song.imageUrl || ''}
                alt={song.title}
                className="w-full aspect-square object-cover rounded-md shadow-lg group-hover:shadow-xl transition-shadow"
                fallbackIcon={
                  <div className="w-full h-full flex items-center justify-center bg-neutral-800 rounded-md">
                    <FiMusic className="text-4xl text-neutral-600" />
                  </div>
                }
              />
              <button 
                className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  // Lógica para reproducir
                }}
                aria-label={`Reproducir ${song.title}`}
              >
                <FaPlay className="text-black text-sm" />
              </button>
            </div>
            <h3 className="font-medium text-white text-sm truncate">{song.title}</h3>
            <p className="text-xs text-gray-400 truncate">{song.artist}</p>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div 
      className="relative transition-all duration-300 bg-gradient-to-b from-neutral-900 to-black w-full overflow-hidden"
      style={{
        minHeight: 'calc(100vh - 64px)', // 64px es la altura del header
        padding: '1rem',
      }}
    >
      {/* Scroll personalizado */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #4d4d4d;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #666;
        }
      `}</style>
      
      <div className="w-full max-w-[1200px] mx-auto px-4 pb-2">
        <h1 className="text-xl font-bold text-white mb-4">
          {status === 'authenticated' ? 'Bienvenido de vuelta' : 'Descubre nueva música'}
        </h1>
        
        {/* Sección de canciones populares */}
        {renderSongsSection()}

        {/* Sección de géneros */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white">
              {status === 'authenticated' ? 'Explorar géneros' : 'Géneros populares'}
            </h2>
            <button className="text-sm text-gray-400 hover:text-white">Ver todo</button>
          </div>
          <GenresCarousel />
        </section>

        {/* Sección de artistas populares */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white">Artistas populares</h2>
            <button className="text-sm text-gray-400 hover:text-white">Ver todos</button>
          </div>
          <ArtistsCarousel title="Artistas populares" showAllText="Ver todos" artists={popularArtists} itemsPerPage={6} />
        </section>

        {/* Sección de álbumes populares */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white">Álbumes populares</h2>
            <button className="text-sm text-gray-400 hover:text-white">Ver todos</button>
          </div>
          <AlbumsCarousel title="Álbumes populares" showAllText="Ver todos" />
        </section>

        {/* Sección de playlists destacadas */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white">Playlists destacadas</h2>
            <button className="text-sm text-gray-400 hover:text-white">Ver todas</button>
          </div>
          <PlaylistsCarousel title="Playlists destacadas" showAllText="Ver todas" />
        </section>
      </div>
    </div>
  );
};

export default HomeContent;
