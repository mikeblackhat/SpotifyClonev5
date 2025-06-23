"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FiMusic } from 'react-icons/fi';
import { FaPlay } from 'react-icons/fa';
import { ArtistsCarousel } from "../shared/carousels/ArtistsCarousel";
import { AlbumsCarousel } from "../shared/carousels/AlbumsCarousel";
import { PlaylistsCarousel } from "../shared/carousels/PlaylistsCarousel";
import GenresCarousel from "../browse/Genres/Carousel";
import useCarousel from "@/hooks/useCarousel";
import { useSampleData } from "@/hooks/useSampleData";
import { ImageWithFallback } from "../shared/ui/ImageWithFallback";
import { FaMusic } from 'react-icons/fa';

const HomeContent = () => {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  
  // Obtener datos de muestra
  const { popularSongs, popularArtists, popularAlbums, featuredPlaylists } = useSampleData();
  
  // Combinar datos para la sección de tendencias con tipos explícitos
  type TrendingItem = {
    id: string;
    type: 'song' | 'artist' | 'album';
    title: string;
    subtitle: string;
    imageUrl?: string;
  };

  const trendingItems: TrendingItem[] = [
    ...popularSongs.slice(0, 2).map((song, i) => ({
      id: song.id || `song-${i}-${Date.now()}`,
      type: 'song' as const,
      title: song.title,
      subtitle: song.artist,
      imageUrl: song.imageUrl
    })),
    ...popularArtists.slice(0, 2).map((artist, i) => ({
      id: artist.id || `artist-${i}-${Date.now()}`,
      type: 'artist' as const,
      title: artist.name,
      subtitle: artist.genre || 'Artista',
      imageUrl: artist.imageUrl
    })),
    ...popularAlbums.slice(0, 2).map((album, i) => ({
      id: album.id || `album-${i}-${Date.now()}`,
      type: 'album' as const,
      title: album.title,
      subtitle: album.artist,
      imageUrl: album.imageUrl
    }))
  ];
  
  // Configuración del carrusel de canciones
  const {
    carouselRef: songsCarouselRef,
    showPrevBtn: showSongsPrevBtn,
    showNextBtn: showSongsNextBtn,
    next: nextSong,
    prev: prevSong
  } = useCarousel({
    totalItems: 12,
    itemsPerPage: 6
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const renderWelcomeSection = (isAuthenticated: boolean) => (
    <div className="flex items-end gap-6 mb-8">
      <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-500 rounded-md shadow-2xl flex items-center justify-center">
        <FiMusic className="text-6xl text-white/80" />
      </div>
      <div className="flex-1">
        <p className="text-2xl font-semibold text-green-500 mb-4">
          {isAuthenticated ? 'BIENVENIDO' : 'BIENVENIDO A SPOTIFY'}
        </p>
        <h1 
          className="font-bold mb-6"
          style={{ 
            fontSize: '7.5rem',
            lineHeight: '1',
            background: 'linear-gradient(to right, #1DB954, #4CAF50)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {isAuthenticated ? `Hola, ${session?.user?.name || 'usuario'}` : 'Descubre nueva música'}
        </h1>
        <p className="text-gray-400 text-xl">
          {isAuthenticated ? 'Esto es lo que está sonando ahora mismo' : 'Inicia sesión para ver contenido personalizado'}
        </p>
      </div>
    </div>
  );

  const renderSongsCarousel = () => (
    <section className="mb-8 sm:mb-10">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer">
          {status === 'authenticated' ? 'Recientes' : 'Tendencias'}
        </h2>
        <button 
          className="text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors whitespace-nowrap"
          onClick={() => console.log('Ver todas las canciones')}
        >
          Ver todo
        </button>
      </div>
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            ref={songsCarouselRef}
            className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 transition-transform duration-300 ease-out overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-2 px-2"
            style={{ scrollBehavior: 'smooth' }}
          >
            {[1,2,3,4,5,6,7,8].map((n) => (
              <div 
                key={n} 
                className="group flex-shrink-0 w-[45%] xs:w-[30%] sm:w-[23%] md:w-[18%] lg:w-[15%] xl:w-[13%]"
              >
                <div className="bg-neutral-800/50 hover:bg-neutral-700/70 rounded-lg p-3 sm:p-4 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                  <div className="relative mb-3 sm:mb-4 flex-1">
                    <div className="w-full aspect-square rounded-md shadow-lg overflow-hidden group-hover:shadow-2xl transition-all duration-300">
                      <ImageWithFallback 
                        src={`https://picsum.photos/seed/song-${n}/400/400`}
                        alt={`Canción ${n}`}
                        className="w-full h-full object-cover"
                        gradientId={n * 40}
                        fallbackIcon={
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
                            <FiMusic className="text-3xl sm:text-4xl text-white/90" />
                          </div>
                        }
                      />
                    </div>
                    <button 
                      className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105"
                      onClick={() => console.log('Reproducir canción', n)}
                      aria-label={`Reproducir ${status === 'authenticated' ? popularSongs[n % popularSongs.length].title : `Canción ${n}`}`}
                    >
                      <FaPlay className="text-black text-xs sm:text-sm ml-0.5" />
                    </button>
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-bold text-white text-sm sm:text-base truncate leading-tight mb-0.5">
                      {status === 'authenticated' ? popularSongs[n % popularSongs.length].title : `Canción ${n}`}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">
                      {status === 'authenticated' ? popularSongs[n % popularSongs.length].artist : `Artista ${n}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {showSongsPrevBtn && (
          <button 
            onClick={prevSong}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-3 w-8 h-8 sm:w-10 sm:h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white z-10 transition-all shadow-lg"
            aria-label="Anterior"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {showSongsNextBtn && (
          <button 
            onClick={nextSong}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-3 w-8 h-8 sm:w-10 sm:h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white z-10 transition-all shadow-lg"
            aria-label="Siguiente"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );

  const renderTrendingSection = () => (
    <section className="mb-8 sm:mb-10">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer">
          {status === 'authenticated' ? 'Recomendaciones' : 'Tendencias'}
        </h2>
        <button 
          className="text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors whitespace-nowrap"
          onClick={() => console.log('Ver todas las tendencias')}
        >
          Ver todo
        </button>
      </div>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5">
        {trendingItems.map((item, index) => (
          <div 
            key={index} 
            className="group bg-neutral-800/50 hover:bg-neutral-700/70 rounded-lg p-3 sm:p-4 transition-all duration-300 hover:shadow-lg"
          >
            <div className="relative mb-3 sm:mb-4">
              <div className="w-full aspect-square rounded-md shadow-lg overflow-hidden group-hover:shadow-2xl transition-all duration-300">
                <ImageWithFallback 
                  src={item.imageUrl || `https://picsum.photos/seed/trending-${index}/400/400`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  fallbackIcon={
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
                      <FaMusic className="text-3xl sm:text-4xl text-white/90" />
                    </div>
                  }
                />
              </div>
              <button 
                className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105"
                onClick={() => console.log('Reproducir tendencia', index)}
                aria-label={`Reproducir ${item.title}`}
              >
                <FaPlay className="text-black text-xs sm:text-sm ml-0.5" />
              </button>
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base truncate leading-tight mb-0.5">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 truncate">
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="w-full min-h-screen px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-24 sm:pb-16 overflow-x-hidden bg-gradient-to-b from-neutral-900 to-black text-white">
      <div className="flex flex-col gap-6 sm:gap-8 max-w-[2000px] mx-auto">
        {/* Sección de canciones destacadas */}
        {renderSongsCarousel()}
        
        {/* Secciones de carruseles */}
        <div className="space-y-8 sm:space-y-10">
          <GenresCarousel 
            title={status === 'authenticated' ? 'Explorar géneros' : 'Géneros populares'}
            showAllText="Ver todo"
          />
          
          <ArtistsCarousel 
            title={status === 'authenticated' ? 'Tus artistas' : 'Artistas populares'}
            showAllText="Ver todo"
          />
          
          <AlbumsCarousel 
            title={status === 'authenticated' ? 'Álbumes para ti' : 'Álbumes populares'}
            showAllText="Ver todo"
          />
          
          <PlaylistsCarousel 
            title={status === 'authenticated' ? 'Hecho para ti' : 'Listas destacadas'}
            showAllText="Ver todo"
          />
        </div>
        
        {/* Sección de tendencias */}
        {renderTrendingSection()}
      </div>
    </div>
  );
};

export default HomeContent;
