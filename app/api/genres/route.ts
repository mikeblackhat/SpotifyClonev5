import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Interfaz para el documento de género en MongoDB
interface GenreDocument {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Función auxiliar para obtener la base de datos
async function getDb() {
  const client = await clientPromise;
  return client.db();
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
    
    const db = await getDb();
    const genresCollection = db.collection<GenreDocument>('genres');
    
    // Obtener todos los géneros ordenados por nombre
    const genres = await genresCollection
      .find({}, { 
        projection: { 
          name: 1, 
          image: 1,
          _id: 1
        } 
      })
      .sort({ name: 1 })
      .toArray();
    
    console.log(`Total de géneros encontrados: ${genres.length}`);
    
    // Formatear la respuesta
    const formattedGenres = genres.map(genre => {
      if (!genre._id || !genre.name) {
        console.warn('Género inválido encontrado:', genre);
        return null;
      }
      return {
        id: genre._id.toString(),
        name: genre.name,
        image: genre.image || null
      };
    }).filter(Boolean);
    
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
