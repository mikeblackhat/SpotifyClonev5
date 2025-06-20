'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiMusic } from 'react-icons/fi';
import { FaPlay, FaMicrophone } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';

// Components
import ProfileHeader from './ProfileHeader';
import PlaylistsSection from './PlaylistsSection';
import MixesSection from './MixesSection';

// Types
import { TopTrack, UserData } from './types';

const UserProfileClient = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });
  
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const formatName = (name: string | null | undefined): string => {
    if (!name) return 'Usuario';
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Datos del usuario autenticado
  const user: UserData = {
    name: formatName(session?.user?.name || null),
    email: session?.user?.email || 'usuario@ejemplo.com',
    followers: 1245,
    following: 42,
    playlists: 12,
    topGenres: ['Pop', 'Rock', 'Electrónica', 'Hip Hop', 'R&B'],
    topArtists: [
      { id: 1, name: 'Dua Lipa', plays: 342, image: '/placeholder-artist.jpg' },
      { id: 2, name: 'The Weeknd', plays: 298, image: '/placeholder-artist.jpg' },
      { id: 3, name: 'Billie Eilish', plays: 256, image: '/placeholder-artist.jpg' },
      { id: 4, name: 'Post Malone', plays: 231, image: '/placeholder-artist.jpg' },
      { id: 5, name: 'Ariana Grande', plays: 215, image: '/placeholder-artist.jpg' },
    ],
    topTrack: 'Blinding Lights',
    topArtist: 'The Weeknd',
    topPlaylist: 'Tus Mezclas'
  };

  return (
    <div className="bg-gradient-to-b from-neutral-900 to-black min-h-screen text-white p-6 pb-32 md:pb-24">
      <ProfileHeader user={user} />
      
      {/* Pestañas */}
      <div className="border-b border-gray-800 mb-6">
        <div className="flex gap-8">
          <button className="border-b-2 border-green-500 text-white pb-3 px-1 font-medium">
            Canciones
          </button>
          <button className="text-gray-400 hover:text-white pb-3 px-1 font-medium">
            Playlists
          </button>
          <button className="text-gray-400 hover:text-white pb-3 px-1 font-medium">
            Seguidos
          </button>
          <button className="text-gray-400 hover:text-white pb-3 px-1 font-medium">
            Seguidores
          </button>
        </div>
      </div>

      {/* Lista de canciones */}
      <div className="mb-8">
        {/* Encabezados - Ocultos en móviles */}
        <div className="hidden md:grid grid-cols-12 gap-4 text-gray-400 text-sm font-medium border-b border-gray-800 pb-2 mb-4 px-4">
          <div className="col-span-1">#</div>
          <div className="col-span-6 lg:col-span-5 xl:col-span-6">TÍTULO</div>
          <div className="col-span-3 lg:col-span-4 xl:col-span-3">REPRODUCCIONES</div>
          <div className="col-span-2 lg:col-span-2 xl:col-span-2 text-right">DURACIÓN</div>
        </div>
        
        {[
          { id: 1, title: 'Canción Favorita 1', artist: user.topArtist || 'Artista', duration: '3:45', plays: 1245 },
          { id: 2, title: 'Canción Favorita 2', artist: user.topArtist || 'Artista', duration: '3:20', plays: 1103 },
          { id: 3, title: 'Canción Favorita 3', artist: user.topArtist || 'Artista', duration: '4:12', plays: 987 },
        ].map((track, index) => (
          <div 
            key={track.id}
            className="grid grid-cols-12 gap-2 md:gap-3 lg:gap-4 items-center py-2 md:py-2.5 px-2 md:px-4 rounded-md hover:bg-white/10 group cursor-pointer"
          >
            {/* Número / Botón de reproducción */}
            <div className="col-span-1 text-gray-400 group-hover:hidden text-xs md:text-sm text-center">
              <span className="md:hidden">{index + 1}.</span>
              <span className="hidden md:inline">{index + 1}</span>
            </div>
            <div className="col-span-1 hidden group-hover:flex items-center">
              <button className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform">
                <FaPlay className="ml-0.5 text-xs md:text-sm" />
              </button>
            </div>
            
            {/* Información de la canción */}
            <div className="col-span-8 md:col-span-6 lg:col-span-5 xl:col-span-6 pl-1 md:pl-0">
              <div className="font-medium text-white text-sm md:text-base truncate">{track.title}</div>
              <div className="text-xs md:text-sm text-gray-400 truncate">{track.artist}</div>
            </div>
            
            {/* Reproducciones */}
            <div className="hidden md:block col-span-3 lg:col-span-4 xl:col-span-3 text-gray-400 text-sm">
              {track.plays.toLocaleString()}
            </div>
            
            {/* Duración y menú */}
            <div className="col-span-3 md:col-span-2 lg:col-span-2 text-right flex items-center justify-end">
              {/* Botón de menú en móviles */}
              <button className="md:hidden text-gray-400 hover:text-white p-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              <span className="text-xs md:text-sm text-gray-400 ml-2 md:ml-0">
                {track.duration}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de géneros principales */}
      <div className="mb-8 md:mb-10">
        <div className="flex items-center justify-between mb-4 md:mb-6 px-2 md:px-0">
          <h2 className="text-xl md:text-2xl font-bold">Tus géneros principales</h2>
          <button className="text-xs md:text-sm text-gray-400 hover:text-white">Ver todo</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 px-2 md:px-0">
          {user.topGenres.map((genre, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-purple-600/20 to-blue-500/20 p-3 md:p-4 rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <FiMusic className="text-lg md:text-xl text-purple-400" />
                <span className="text-[10px] md:text-xs text-gray-400">Género</span>
              </div>
              <h3 className="font-bold text-base md:text-lg leading-tight md:leading-normal truncate">{genre}</h3>
              <div className="flex items-center mt-1 md:mt-2 text-[10px] md:text-xs text-gray-400">
                <FiMusic className="mr-1" />
                <span>Populares</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de artistas destacados */}
      <div className="mb-8 md:mb-10">
        <div className="flex items-center justify-between mb-4 md:mb-6 px-2 md:px-0">
          <h2 className="text-xl md:text-2xl font-bold">Tus artistas destacados</h2>
          <button className="text-xs md:text-sm text-gray-400 hover:text-white">Ver todo</button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 px-2 md:px-0">
          {user.topArtists.map((artist) => (
            <div 
              key={artist.id}
              className="group cursor-pointer"
            >
              <div className="relative mb-2 md:mb-3 overflow-hidden rounded-full aspect-square bg-gradient-to-br from-purple-600/20 to-blue-500/20 p-0.5 md:p-1">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                    <FaMicrophone className="text-2xl md:text-3xl lg:text-4xl text-white/80" />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500 flex items-center justify-center text-black transform hover:scale-105 transition-transform">
                      <FaPlay className="ml-0.5 text-sm md:text-base" />
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-0 right-1 md:right-2 bg-green-500 rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                  <BsGraphUp className="text-[8px] md:text-xs text-black" />
                </div>
              </div>
              <h3 className="font-bold text-white text-center text-sm md:text-base truncate px-1">{artist.name}</h3>
              <p className="text-xs md:text-sm text-gray-400 text-center">{artist.plays.toLocaleString()} rep.</p>
            </div>
          ))}
        </div>
      </div>

      <PlaylistsSection user={user} />
      <MixesSection user={user} />
    </div>
  );
};

export default UserProfileClient;
