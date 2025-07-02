import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Interfaz para el género
interface Genre {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  created_at: Date;
  updated_at: Date;
}

// Cachear la respuesta por 1 hora
const CACHE_DURATION = 60 * 60; // 1 hora en segundos
let cachedGenres: any = null;
let lastFetchTime = 0;

export async function GET() {
  try {
    // Verificar si tenemos una respuesta en caché y si aún es válida
    const now = Date.now();
    const isCacheValid = cachedGenres && (now - lastFetchTime) < (CACHE_DURATION * 1000);
    
    if (isCacheValid) {
      console.log('Sirviendo géneros desde caché');
      return NextResponse.json(cachedGenres);
    }
    
    console.log('Obteniendo géneros desde la base de datos...');
    
    // Obtener todos los géneros ordenados por nombre
    const result = await pool.query<Genre>(
      'SELECT id, name, description FROM genres ORDER BY name ASC'
    );
    
    const genres = result.rows;
    console.log(`Total de géneros encontrados: ${genres.length}`);
    
    // Formatear la respuesta
    const formattedGenres = genres.map(genre => ({
      id: genre.id.toString(),
      name: genre.name,
      description: genre.description || null,
      image: null // No hay columna de imagen en la base de datos
    }));
    
    const responseData = { 
      success: true,
      data: {
        genres: formattedGenres
      }
    };
    
    // Actualizar la caché
    cachedGenres = responseData;
    lastFetchTime = now;
    
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=300`
      }
    });
  } catch (error) {
    console.error('Error al obtener los géneros:', error);
    return NextResponse.json(
      { error: 'Error al obtener los géneros' },
      { status: 500 }
    );
  }
}
