'use client';

import { useSession } from 'next-auth/react';
import { FiUser, FiHeart, FiPlus } from 'react-icons/fi';
import { FaPlay } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface TopTrack {
  id: number;
  title: string;
  artist: string;
  duration: string;
  plays: number;
}

interface Artist {
  id: number;
  name: string;
  plays: number;
  image: string;
}

interface UserData {
  name: string;
  email: string;
  followers: number;
  following: number;
  playlists: number;
  topGenres: string[];
  topArtists: Artist[];
}

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
    ]
  };

  const topTracks: TopTrack[] = [
    { id: 1, title: 'Canción Favorita 1', artist: 'Artista 1', duration: '3:45', plays: 1245 },
    { id: 2, title: 'Canción Favorita 2', artist: 'Artista 2', duration: '3:20', plays: 1103 },
    { id: 3, title: 'Canción Favorita 3', artist: 'Artista 3', duration: '4:12', plays: 987 },
    { id: 4, title: 'Canción Favorita 4', artist: 'Artista 4', duration: '3:30', plays: 876 },
    { id: 5, title: 'Canción Favorita 5', artist: 'Artista 5', duration: '3:15', plays: 765 },
  ];

  return (
    <div className="bg-gradient-to-b from-neutral-900 to-black min-h-screen text-white p-6">
      {/* Header del perfil */}
      <div className="flex items-end gap-6 mb-8">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-500 rounded-md shadow-2xl flex items-center justify-center">
          <FiUser className="text-6xl text-white/80" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-green-500 mb-2">PERFIL</p>
          <h1 className="text-6xl font-bold mb-2">{user.name}</h1>
          {user.email && <p className="text-gray-400 text-sm mb-4">{user.email}</p>}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>{user.followers.toLocaleString()} seguidores</span>
            <span>{user.following} siguiendo</span>
            <span>{user.playlists} listas</span>
          </div>
        </div>
      </div>

      {/* Resto del componente... */}
      <div className="flex items-center gap-4 mb-8">
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
        <div className="grid grid-cols-12 gap-4 text-gray-400 text-sm font-medium border-b border-gray-800 pb-2 mb-4 px-4">
          <div className="col-span-1">#</div>
          <div className="col-span-6">TÍTULO</div>
          <div className="col-span-3">REPRODUCCIONES</div>
          <div className="col-span-2 text-right">DURACIÓN</div>
        </div>
        
        {topTracks.map((track, index) => (
          <div 
            key={track.id}
            className="grid grid-cols-12 gap-4 items-center py-3 px-4 rounded-md hover:bg-white/10 group cursor-pointer"
          >
            <div className="col-span-1 text-gray-400 group-hover:hidden">{index + 1}</div>
            <div className="col-span-1 hidden group-hover:block">
              <button className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black">
                <FaPlay className="ml-0.5" />
              </button>
            </div>
            <div className="col-span-6">
              <div className="font-medium text-white">{track.title}</div>
            </div>
            <div className="col-span-3">{track.plays.toLocaleString()}</div>
            <div className="col-span-2 text-right text-gray-400">{track.duration}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfileClient;
