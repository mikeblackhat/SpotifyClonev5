'use client';

import { useEffect, useState } from 'react';
import { FaPlay, FaPause, FaHeart } from 'react-icons/fa';
import { usePlayer } from '@/contexts/PlayerContext';
import { Song } from '@/types/media';
import { getLikedSongs } from '@/services/likeService';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiMusic, FiClock } from 'react-icons/fi';
import { formatTime } from '@/lib/utils';

const LikedSongsSection = () => {
  // Asegurarse de que el estado inicial sea un array vacío
  const [likedSongs, setLikedSongs] = useState<Song[]>(() => []);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  const { currentSong, isPlaying, play, togglePlayPause } = usePlayer();

  useEffect(() => {
    const fetchLikedSongs = async () => {
      if (!session) {
        router.push('/login');
        return;
      }
      
      try {
        setIsLoading(true);
        const songs = await getLikedSongs();
        setLikedSongs(songs);
      } catch (error) {
        console.error('Error al cargar canciones favoritas:', error);
        setLikedSongs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedSongs();
  }, [session, router]);

  const handlePlayPause = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      play(song);
    }
  };

  // Asegurarse de que likedSongs sea un array antes de usar reduce
  const totalDuration = (Array.isArray(likedSongs) ? likedSongs : []).reduce((total, song) => total + (song?.duration || 0), 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);
  const durationText = hours > 0 
    ? `${hours} h ${minutes} min` 
    : `${minutes} min`;

  if (isLoading) {
    return (
      <div className="bg-neutral-800/50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-neutral-700 rounded w-48 animate-pulse"></div>
          <div className="h-10 w-10 rounded-full bg-neutral-700 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center p-3 rounded hover:bg-neutral-700/50">
              <div className="w-8 h-8 bg-neutral-700 rounded mr-4 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-neutral-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-neutral-700 rounded w-1/2"></div>
              </div>
              <div className="w-12 h-4 bg-neutral-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (likedSongs.length === 0) {
    return (
      <div className="bg-neutral-800/50 rounded-lg p-8 text-center mb-8">
        <div className="bg-neutral-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaHeart className="text-2xl text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Tus canciones favoritas</h3>
        <p className="text-gray-400 mb-6">Las canciones que te gustan aparecerán aquí.</p>
        <button 
          onClick={() => router.push('/search')}
          className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-neutral-200 transition-colors"
        >
          Buscar canciones
        </button>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-end gap-6 mb-6">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-md shadow-lg flex items-center justify-center">
          <FaHeart className="text-white text-6xl" />
        </div>
        
        <div className="flex-1">
          <span className="text-sm font-medium text-white bg-white/10 px-3 py-1 rounded-full inline-block mb-2">
            Playlist
          </span>
          <h1 className="text-5xl font-bold text-white mb-4">Tus me gusta</h1>
          
          <div className="flex items-center text-sm text-gray-300">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold mr-2">
                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="font-medium">{session?.user?.name || 'Usuario'}</span>
            </div>
            <span className="mx-2">•</span>
            <span>{likedSongs.length} canciones</span>
            <span className="mx-2">•</span>
            <span>{durationText}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-neutral-800/30 rounded-lg overflow-hidden">
        {/* Header de la tabla */}
        <div className="grid grid-cols-12 gap-4 text-gray-400 text-sm font-medium border-b border-white/10 p-4">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">TÍTULO</div>
          <div className="col-span-4">ÁLBUM</div>
          <div className="col-span-2 flex items-center justify-end pr-4">
            <FiClock className="text-base" />
          </div>
        </div>
        
        {/* Lista de canciones */}
        {likedSongs.map((song, index) => {
          const isCurrentSong = currentSong?.id === song.id;
          const isPlayingCurrentSong = isCurrentSong && isPlaying;
          
          return (
            <div 
              key={song.id || index}
              className={`group grid grid-cols-12 items-center p-3 hover:bg-white/5 transition-colors ${isCurrentSong ? 'bg-white/10' : ''}`}
            >
              <div className="col-span-1 text-center text-gray-400">
                {isCurrentSong && isPlaying ? (
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mx-0.5 animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full mx-0.5 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full mx-0.5 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                ) : (
                  <span className="group-hover:hidden">{index + 1}</span>
                )}
                <button 
                  onClick={() => handlePlayPause(song)}
                  className="hidden group-hover:flex items-center justify-center w-full h-full text-white hover:text-green-500 transition-colors"
                >
                  {isPlayingCurrentSong ? <FaPause /> : <FaPlay className="ml-0.5" />}
                </button>
              </div>
              
              <div className="col-span-5 flex items-center">
                <div className="relative w-10 h-10 mr-3 flex-shrink-0 group-hover:opacity-80 transition-opacity">
                  <Image 
                    src={song.imageUrl || '/images/placeholder-album.png'} 
                    alt={song.title || 'Álbum'} 
                    fill 
                    sizes="40px"
                    className="object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/placeholder-album.png';
                    }}
                    unoptimized={song.imageUrl?.includes('picsum.photos')} // Desactivar optimización para imágenes de placeholder
                  />
                </div>
                <div className="truncate">
                  <div className={`font-medium ${isCurrentSong ? 'text-green-500' : 'text-white'} truncate`}>
                    {song.title}
                  </div>
                  <div className="text-sm text-gray-400 truncate">
                    {typeof song.artist === 'string' ? song.artist : 'Artista desconocido'}
                  </div>
                </div>
              </div>
              
              <div className="col-span-4 text-gray-400 text-sm truncate pr-2">
                {song.album || 'Álbum desconocido'}
              </div>
              
              <div className="col-span-2 text-right text-gray-400 text-sm pr-4">
                {song.duration ? formatTime(song.duration) : '--:--'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LikedSongsSection;
