import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getLikedSongs } from '@/services/likeService';
import SongList from '@/components/songs/SongList';

export default async function LikedSongsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  // Obtener las canciones favoritas del usuario
  const likedSongs = await getLikedSongs();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tus canciones favoritas</h1>
      
      {likedSongs.length > 0 ? (
        <SongList songs={likedSongs} showLikeButton={false} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Aún no tienes canciones favoritas</p>
          <p className="text-gray-500 mt-2">Haz clic en el corazón de una canción para agregarla a tus favoritos</p>
        </div>
      )}
    </div>
  );
}
