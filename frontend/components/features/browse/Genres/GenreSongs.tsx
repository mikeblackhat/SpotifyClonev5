'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaPlay, FaPause, FaMusic } from 'react-icons/fa';
import { usePlayer } from '@/contexts/PlayerContext';
import { Song } from '@/types/media';
import { toast } from 'react-hot-toast';

interface GenreSongsProps {
  genreId: string;
}
interface SongArtist {
  id?: string;
  name: string;
}

interface SongAlbum {
  id?: string;
  title: string;
  image?: string;
}

interface SongItem {
  id: string;
  title: string;
  artist: SongArtist | string;
  album?: SongAlbum;
  duration?: number;
  url?: string;
  image?: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    songs: SongItem[];
    genre: {
      id: string;
      name: string;
      image?: string;
    };
  };
  error?: string;
}

export default function GenreSongs({ genreId }: GenreSongsProps) {
  const router = useRouter();
  const { currentSong, isPlaying, togglePlayPause, play, addToQueue, clearQueue } = usePlayer();
  const [songs, setSongs] = useState<SongItem[]>([]);
  const [genre, setGenre] = useState<{ id: string; name: string; image?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener las canciones del género
  useEffect(() => {
    const fetchGenreSongs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/genres/${genreId}/songs`);
        
        if (!response.ok) {
          throw new Error('Error al cargar las canciones del género');
        }
        
        const result: ApiResponse = await response.json();
        
        if (!result.success || !result.data) {
          throw new Error(result.error || 'Error al procesar la respuesta');
        }
        
        setSongs(result.data.songs || []);
        setGenre(result.data.genre);
      } catch (error) {
        console.error('Error al cargar las canciones del género:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
        toast.error('No se pudieron cargar las canciones del género');
      } finally {
        setIsLoading(false);
      }
    };

    if (genreId) {
      fetchGenreSongs();
    }
  }, [genreId]);

  // Función para reproducir una canción
  const handlePlaySong = (song: SongItem) => {
    // Obtener el nombre del artista
    const artistName = typeof song.artist === 'string' 
      ? song.artist 
      : song.artist?.name || 'Artista desconocido';
      
    // Mapear la canción al formato esperado por el reproductor
    const playerSong = {
      id: song.id,
      title: song.title,
      artist: artistName,
      duration: song.duration || 0,
      album: song.album?.title || 'Álbum desconocido',
      audioUrl: song.url || '',
      imageUrl: song.image || song.album?.image || ''
    };

    if (currentSong?.id === playerSong.id) {
      togglePlayPause();
    } else {
      // Creamos la lista de canciones en el formato correcto
      const songsToQueue = songs.map(s => {
        const artistName = typeof s.artist === 'string' ? s.artist : s.artist?.name || 'Artista desconocido';
        return {
          id: s.id,
          title: s.title,
          artist: artistName,
          duration: s.duration || 0,
          album: s.album?.title || 'Álbum desconocido',
          audioUrl: s.url || '',
          imageUrl: s.image || s.album?.image || ''
        };
      });
      
      // Primero limpiamos la cola actual
      clearQueue();
      
      // Añadimos todas las canciones a la cola
      addToQueue(songsToQueue);
      
      // Esperamos un momento para asegurar que la cola se actualice
      // antes de reproducir la canción seleccionada
      setTimeout(() => {
        play(playerSong);
      }, 100);
    }
  };

  // Mostrar carga
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green mb-4"></div>
        <p className="text-gray-400">Cargando canciones...</p>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-spotify-green text-black rounded-full font-medium hover:bg-green-400 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Mostrar mensaje si no hay canciones
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-neutral-800 p-6 rounded-full mb-4">
          <FaMusic className="text-4xl text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No hay canciones disponibles</h2>
        <p className="text-gray-400 mb-6">No se encontraron canciones para este género.</p>
        <button
          onClick={() => router.push('/genres')}
          className="px-6 py-2 bg-spotify-green text-black rounded-full font-medium hover:bg-green-400 transition-colors"
        >
          Explorar más géneros
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado del género */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
        <div className="w-48 h-48 md:w-60 md:h-60 bg-gradient-to-br from-purple-600 to-blue-500 rounded-md shadow-lg overflow-hidden flex-shrink-0">
          {genre?.image ? (
            <Image 
              src={genre.image} 
              alt={genre.name} 
              width={240} 
              height={240} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
              <FaMusic className="text-6xl text-white opacity-80" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <span className="text-sm font-semibold text-gray-300">GÉNERO</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mt-2 mb-4 line-clamp-2">
            {genre?.name || 'Género desconocido'}
          </h1>
          
          <div className="flex items-center text-sm text-gray-300 mt-6">
            <span>{songs.length} {songs.length === 1 ? 'canción' : 'canciones'}</span>
          </div>
        </div>
      </div>
      
      {/* Lista de canciones */}
      <div className="mt-8">
        <div className="grid gap-2">
          {songs.map((song, index) => (
            <div 
              key={song.id} 
              className={`flex items-center gap-4 p-3 rounded-md hover:bg-neutral-800/50 transition-colors group ${currentSong?.id === song.id ? 'bg-neutral-800/70' : ''} cursor-pointer`}
              onClick={() => handlePlaySong(song)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePlaySong(song);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Reproducir ${song.title}`}
            >
              <div className="w-10 flex-shrink-0 text-center text-gray-400">
                {currentSong?.id === song.id && isPlaying ? (
                  <div className="flex items-center justify-center h-8 w-8">
                    <div className="flex items-end space-x-0.5 h-4">
                      <span className="w-0.5 h-1 bg-spotify-green animate-[equalize_1s_infinite]" style={{
                        animationDelay: '0.1s',
                        height: '60%',
                        marginRight: '1px'
                      }}></span>
                      <span className="w-0.5 h-1 bg-spotify-green animate-[equalize_1s_infinite]" style={{
                        animationDelay: '0.3s',
                        height: '30%',
                        marginRight: '1px'
                      }}></span>
                      <span className="w-0.5 h-1 bg-spotify-green animate-[equalize_1s_infinite]" style={{
                        animationDelay: '0.4s',
                        height: '75%',
                        marginRight: '1px'
                      }}></span>
                      <span className="w-0.5 h-1 bg-spotify-green animate-[equalize_1s_infinite]" style={{
                        animationDelay: '0.2s',
                        height: '50%'
                      }}></span>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="group-hover:hidden">{index + 1}</span>
                    <div className="hidden group-hover:inline-flex items-center justify-center w-8 h-8 bg-white rounded-full text-black">
                      <FaPlay size={12} className="ml-0.5" />
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium truncate ${currentSong?.id === song.id ? 'text-spotify-green' : 'text-white'}`}>
                  {song.title}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  {song.artist && typeof song.artist === 'object' && 'name' in song.artist 
                    ? song.artist.name 
                    : typeof song.artist === 'string' 
                      ? song.artist 
                      : 'Artista desconocido'}
                </p>
              </div>
              
              <div className="text-xs text-gray-400">
                {song.duration ? 
                  new Date(song.duration * 1000).toISOString().substr(14, 5) : 
                  '--:--'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
