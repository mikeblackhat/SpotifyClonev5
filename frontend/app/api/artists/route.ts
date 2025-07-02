import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

interface Artist {
  id: number;
  name: string;
  bio: string | null;
  image: string | null;
  created_at: Date;
  updated_at: Date;
}

// Cache por 1 hora
const CACHE_DURATION = 60 * 60;
let cachedArtists: any = null;
let lastFetchTime = 0;

export async function GET() {
  try {
    const now = Date.now();
    const isCacheValid = cachedArtists && (now - lastFetchTime) < (CACHE_DURATION * 1000);
    
    if (isCacheValid) {
      return NextResponse.json(cachedArtists);
    }
    
    const result = await pool.query<Artist>(
      `SELECT id, name, bio, image 
       FROM artists 
       ORDER BY name ASC`
    );
    
    const artists = result.rows.map(artist => ({
      id: artist.id.toString(),
      name: artist.name,
      bio: artist.bio,
      image: artist.image || 'https://via.placeholder.com/300x300?text=No+Image'
    }));
    
    const responseData = { 
      success: true,
      data: { artists }
    };
    
    cachedArtists = responseData;
    lastFetchTime = now;
    
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=300`
      }
    });
  } catch (error) {
    console.error('Error al obtener los artistas:', error);
    return NextResponse.json(
      { error: 'Error al obtener los artistas' },
      { status: 500 }
    );
  }
}
