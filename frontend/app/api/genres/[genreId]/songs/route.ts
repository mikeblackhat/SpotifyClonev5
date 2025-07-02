import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Tipos de respuesta
interface ApiResponse {
  success: boolean;
  data?: {
    songs: any[];
    genre: {
      id: string;
      name: string;
      image?: string | null;
    };
  };
  error?: string;
}

export async function GET(
  request: Request,
  { params }: { params: { genreId: string } }
) {
  const client = await pool.connect();
  
  try {
    const { genreId } = params;

    // Validar el ID del género
    if (!genreId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere un ID de género' },
        { status: 400 }
      );
    }

    // Buscar el género por ID
    const genreResult = await client.query(
      'SELECT id, name FROM genres WHERE id = $1',
      [genreId]
    );

    if (genreResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Género no encontrado' },
        { status: 404 }
      );
    }

    const genre = genreResult.rows[0];

    // Buscar canciones que tengan este género
    const songsResult = await client.query(
      `SELECT s.id, s.title, s.duration, s.url, s.image, 
              a.id as artist_id, a.name as artist_name,
              al.id as album_id, al.title as album_title, al.thumbnail as album_image
       FROM songs s
       LEFT JOIN artists a ON s.artist_id = a.id
       LEFT JOIN albums al ON s.album_id = al.id
       WHERE s.genre_id = $1
       ORDER BY s.title ASC`,
      [genreId]
    );

    // Mapear los datos necesarios para la respuesta
    const songsData = songsResult.rows.map(song => {
      // Usar URL de audio de ejemplo si no hay una URL definida
      // Usamos un archivo de audio de muestra que es compatible con la mayoría de navegadores
      const audioUrl = song.url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      
      return {
        id: song.id.toString(),
        title: song.title,
        duration: song.duration,
        url: audioUrl,
        image: song.image || null,
        artist: song.artist_id ? {
          id: song.artist_id.toString(),
          name: song.artist_name
        } : null,
        album: song.album_id ? {
          id: song.album_id.toString(),
          title: song.album_title,
          image: song.album_image || null
        } : null,
        genre: {
          id: genre.id.toString(),
          name: genre.name
        }
      };
    });

    // Datos del género para la respuesta
    const genreData = {
      id: genre.id.toString(),
      name: genre.name,
      image: null // No hay columna de imagen en la tabla genres
    };

    return NextResponse.json({
      success: true,
      data: {
        songs: songsData,
        genre: genreData
      }
    });

  } catch (error) {
    console.error('Error al obtener canciones del género:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener las canciones del género',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  } finally {
    // Liberar el cliente de vuelta al pool
    client.release();
  }
}
