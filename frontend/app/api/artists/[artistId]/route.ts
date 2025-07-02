import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET(
  request: Request,
  { params }: { params: { artistId: string } }
) {
  try {
    const artistId = params.artistId;
    
    const artistResult = await pool.query(
      `SELECT id, name, bio, image 
       FROM artists 
       WHERE id = $1`,
      [artistId]
    );

    if (artistResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Artista no encontrado' },
        { status: 404 }
      );
    }

    const artist = artistResult.rows[0];
    
    const albumsResult = await pool.query(
      `SELECT id, title, description, thumbnail, created_at
       FROM albums 
       WHERE artist_id = $1
       ORDER BY created_at DESC`,
      [artistId]
    );

    const songsResult = await pool.query(
      `SELECT s.id, s.title, s.duration, s.url, s.image, 
              a.id as album_id, a.title as album_title
       FROM songs s
       LEFT JOIN albums a ON s.album_id = a.id
       WHERE s.artist_id = $1
       ORDER BY s.title ASC`,
      [artistId]
    );

    const responseData = {
      success: true,
      data: {
        artist: {
          id: artist.id.toString(),
          name: artist.name,
          bio: artist.bio,
          image: artist.image || '/images/default-artist.jpg'
        },
        albums: albumsResult.rows.map(album => ({
          id: album.id.toString(),
          title: album.title,
          description: album.description,
          thumbnail: album.thumbnail,
          year: new Date(album.created_at).getFullYear()
        })),
        songs: songsResult.rows.map(song => ({
          id: song.id.toString(),
          title: song.title,
          duration: song.duration,
          url: song.url,
          image: song.image,
          album: song.album_id ? {
            id: song.album_id.toString(),
            title: song.album_title
          } : null
        }))
      }
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error al obtener el artista:', error);
    return NextResponse.json(
      { error: 'Error al obtener el artista' },
      { status: 500 }
    );
  }
}
