'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSongs } from '@/contexts/SongContext';
import { Artist, Album, Song } from '@/contexts/SongContext';
import Image from 'next/image';
import { FaPlay, FaPause, FaEllipsisH, FaMusic, FaClock } from 'react-icons/fa';
import { BsFillPeopleFill, BsMusicNoteList } from 'react-icons/bs';
import { MdAlbum } from 'react-icons/md';

interface ArtistWithDetails extends Artist {
  albums: Album[];
  songs: Song[];
}

// Componente para mostrar mientras se carga
const ArtistSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white p-4 md:p-8">
    <div className="max-w-7xl mx-auto">
      <div className="animate-pulse">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-md bg-neutral-800"></div>
          <div className="mt-4 md:mt-0 w-full">
            <div className="h-12 bg-neutral-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Componente de error
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white flex items-center justify-center p-4">
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">Error</h2>
      <p className="text-gray-400 mb-6">{error}</p>
      <button 
        onClick={onRetry}
        className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition"
      >
        Reintentar
      </button>
    </div>
  </div>
);

// Cache para almacenar los artistas cargados
const artistCache = new Map<string, ArtistWithDetails>();

export default function ArtistPage() {
  const { artistId } = useParams<{ artistId: string }>();
  const router = useRouter();
  const { fetchArtist, setCurrentSong, currentSong, artists: contextArtists } = useSongs();
  
  const [artist, setArtist] = useState<ArtistWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Buscar el artista en el contexto primero
  const artistFromContext = React.useMemo(() => {
    return Array.isArray(contextArtists) 
      ? contextArtists.find(a => a.id === artistId)
      : null;
  }, [contextArtists, artistId]);

  // Cargar datos del artista
  useEffect(() => {
    let isMounted = true;
    
    const loadArtistData = async () => {
      if (!artistId) return;
      
      // Verificar si ya tenemos los datos en caché
      if (artistCache.has(artistId)) {
        if (isMounted) {
          setArtist(artistCache.get(artistId) || null);
          setIsLoading(false);
        }
        return;
      }
      
      // Verificar si tenemos datos básicos del contexto
      if (artistFromContext && !artist) {
        const basicArtist: ArtistWithDetails = {
          ...artistFromContext,
          albums: [],
          songs: []
        };
        if (isMounted) {
          setArtist(basicArtist);
        }
      }
      
      try {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }
        
        const data = await fetchArtist(artistId);
        
        if (isMounted) {
          // Almacenar en caché
          artistCache.set(artistId, data);
          setArtist(data);
        }
      } catch (err) {
        console.error('Error al cargar el artista:', err);
        if (isMounted) {
          setError('No se pudo cargar la información del artista');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadArtistData();
    
    return () => {
      isMounted = false;
    };
  }, [artistId, fetchArtist, artistFromContext, artist]);
  
  // Manejar recarga de datos
  const handleRetry = () => {
    if (artistId) {
      artistCache.delete(artistId);
    }
    setArtist(null);
    setError(null);
    setIsLoading(true);
  };

  // Función para reproducir la canción
  const handlePlaySong = React.useCallback((song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    // Aquí iría la lógica para reproducir la canción en el reproductor
  }, [setCurrentSong]);

  // Función para formatear la duración de la canción
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  // Mostrar estado de carga
  if (isLoading) {
    return <ArtistSkeleton />;
  }

  // Mostrar estado de error
  if (error || !artist) {
    return (
      <ErrorState 
        error={error || 'No se pudo cargar la información del artista'} 
        onRetry={handleRetry} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado del artista */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-md overflow-hidden shadow-2xl">
            <Image
              src={artist.image || '/images/default-artist.jpg'}
              alt={artist.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/default-artist.jpg';
              }}
            />
          </div>
          
          <div className="text-center md:text-left mt-4 md:mt-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{artist.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <BsFillPeopleFill className="text-green-500" />
                <span>{artist.followers?.toLocaleString() || '0'} seguidores</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MdAlbum className="text-green-500" />
                <span>{artist.albums?.length || 0} álbumes</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <BsMusicNoteList className="text-green-500" />
                <span>{artist.songs?.length || 0} canciones</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => artist.songs?.length > 0 && handlePlaySong(artist.songs[0])}
            className="bg-green-500 text-black rounded-full px-8 py-3 font-bold hover:bg-green-400 transition flex items-center gap-2"
          >
            <FaPlay /> Reproducir
          </button>
          <button className="bg-transparent border border-gray-600 text-white rounded-full px-6 py-3 font-medium hover:border-white transition flex items-center gap-2">
            Seguir
          </button>
          <button className="text-gray-400 hover:text-white ml-auto">
            <FaEllipsisH size={20} />
          </button>
        </div>

        {/* Sección de canciones populares */}
        {artist.songs && artist.songs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Populares</h2>
            <div className="bg-neutral-900 bg-opacity-40 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800 text-left text-gray-400 text-sm">
                    <th className="p-4 w-12">#</th>
                    <th className="p-4">TÍTULO</th>
                    <th className="p-4 text-right"><FaClock className="inline" /></th>
                  </tr>
                </thead>
                <tbody>
                  {artist.songs.slice(0, 5).map((song, index) => (
                    <tr 
                      key={song.id} 
                      className="hover:bg-white hover:bg-opacity-10 cursor-pointer"
                      onClick={() => handlePlaySong(song)}
                    >
                      <td className="p-4 text-gray-400">{index + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-700 rounded overflow-hidden">
                            <Image
                              src={song.image || '/images/default-song.jpg'}
                              alt={song.title}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/default-song.jpg';
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-medium">{song.title}</div>
                            <div className="text-sm text-gray-400">{song.album?.title || 'Álbum desconocido'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right text-gray-400">
                        {formatDuration(song.duration || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sección de álbumes */}
        {artist.albums && artist.albums.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Álbumes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {artist.albums.map((album) => (
                <div 
                  key={album.id} 
                  className="group cursor-pointer"
                  onClick={() => router.push(`/album/${album.id}`)}
                >
                  <div className="relative aspect-square mb-3 group-hover:scale-105 transition-transform">
                    <Image
                      src={album.thumbnail || '/images/default-album.jpg'}
                      alt={album.title}
                      fill
                      className="object-cover rounded-md shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/default-album.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <FaPlay className="text-black ml-1" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold truncate" title={album.title}>
                    {album.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {new Date(album.releaseDate || Date.now()).getFullYear()} • Álbum
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sección de artistas similares (opcional) */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Los fans también disfrutan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="group flex flex-col items-center text-center cursor-pointer">
                <div className="relative w-full aspect-square rounded-full overflow-hidden mb-3 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-neutral-800 animate-pulse"></div>
                </div>
                <div className="h-4 bg-neutral-800 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-neutral-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
