import { NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId, Db, Collection } from 'mongodb';

// Define the Like interface
interface Like {
  _id: ObjectId;
  userEmail: string;
  songId: string;
  createdAt: Date;
}

// Extend the default Session type to include the user email
type SessionWithEmail = Session & {
  user?: {
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
};

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as SessionWithEmail;
    
    if (!session?.user?.email) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    // Get the likes collection with proper typing
    const likesCollection = db.collection<Like>('likes');
    
    // Find likes for the current user
    const likes = await likesCollection
      .find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    // Extract only the song IDs
    const songIds = likes.map(like => like.songId);

    return NextResponse.json(songIds);
  } catch (error) {
    console.error('Error al obtener los likes del usuario:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
