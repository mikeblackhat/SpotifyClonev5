import { sql } from "./config/db.js";
import TryCatch from "./TryCatch.js";
import { QueryResult } from '@neondatabase/serverless';

const CACHE_EXPIRY = 1800; // 30 minutos (no se usa actualmente)

// Tipos para las funciones de retorno de llamada
type FallbackFunction<T> = () => Promise<T>;

// Función auxiliar para manejar operaciones (sin caché por ahora)
const withRedis = async <T>(
  _key: string, 
  fallback: () => Promise<T>,
  _options: { expiry?: number } = {}
): Promise<T> => {
  // Simplemente ejecutar la función de respaldo sin usar caché
  return fallback();
};

// Interfaz para las canciones
export interface Song {
  id: string;
  title: string;
  duration: number;
  url: string;
  album_id: string;
  created_at: Date;
  updated_at: Date;
  [key: string]: any; // Para manejar propiedades adicionales
}

// Interfaz para los álbumes
export interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  cover_image: string;
  created_at: Date;
  updated_at: Date;
                                                                                                                                                                                                                                                                  [key: string]: any; // Para manejar propiedades adicionales
                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                // Tipo para la respuesta de canciones por álbum
                                                                                                                                                                                                                                                                interface AlbumSongsResponse {
                                                                                                                                                                                                                                                                  songs: Song[];
                                                                                                                                                                                                                                                                  album: Album;
                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                export const getAllSongs = TryCatch(async (req, res) => {
                                                                                                                                                                                                                                                                  try {
                                                                                                                                                                                                                                                                    const songs = await withRedis<Song[]>(
                                                                                                                                                                                                                                                                      'songs',
                                                                                                                                                                                                                                                                      async () => {
                                                                                                                                                                                                                                                                        const result = await sql`SELECT * FROM songs` as unknown as Song[];
                                                                                                                                                                                                                                                                        return result || [];
                                                                                                                                                                                                                                                                      },
                                                                                                                                                                                                                                                                      { expiry: CACHE_EXPIRY }
                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                    res.json(songs || []);
                                                                                                                                                                                                                                                                  } catch (error) {
                                                                                                                                                                                                                                                                    console.error('Error en getAllSongs:', error);
                                                                                                                                                                                                                                                                    res.status(500).json({ error: 'Error al obtener las canciones' });
                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                                export const getAllAlbums = TryCatch(async (req, res) => {
                                                                                                                                                                                                                                                                  try {
                                                                                                                                                                                                                                                                    const albums = await withRedis<Album[]>(
                                                                                                                                                                                                                                                                      'albums',
                                                                                                                                                                                                                                                                      async () => {
                                                                                                                                                                                                                                                                        const result = await sql`SELECT * FROM albums` as unknown as Album[];
                                                                                                                                                                                                                                                                        return result || [];
                                                                                                                                                                                                                                                                      },
                                                                                                                                                                                                                                                                      { expiry: CACHE_EXPIRY }
                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                    res.json(albums || []);
                                                                                                                                                                                                                                                                  } catch (error) {
                                                                                                                                                                                                                                                                    console.error('Error en getAllAlbums:', error);
                                                                                                                                                                                                                                                                    res.status(500).json({ error: 'Error al obtener los álbumes' });
                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                                export const getAllSongsOfAlbum = TryCatch(async (req, res) => {
                                                                                                                                                                                                                                                                  try {
                                                                                                                                                                                                                                                                    const { id } = req.params;
                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                    const result = await withRedis<AlbumSongsResponse | null>(
                                                                                                                                                                                                                                                                      `album_songs_${id}`, 
      async () => {
        const albums = await sql`SELECT * FROM albums WHERE id = ${id}` as unknown as Album[];
        const album = albums[0];
        
        if (!album) {
          res.status(404).json({ message: "No album with this id" });
          return null;
        }
        
        const songs = await sql`SELECT * FROM songs WHERE album_id = ${id}` as unknown as Song[];
        return { 
          songs: songs || [], 
          album 
        };
      },
      { expiry: CACHE_EXPIRY }
    );
    
    if (result) {
      res.json(result);
    }
  } catch (error) {
    console.error('Error en getAllSongsOfAlbum:', error);
    res.status(500).json({ error: 'Error al obtener las canciones del álbum' });
  }
});

export const getSingleSong = TryCatch(async (req, res) => {
  try {
    const { id } = req.params;
    const songs = await sql`SELECT * FROM songs WHERE id = ${id}` as unknown as Song[];
    const song = songs[0];
    
    if (!song) {
      res.status(404).json({ message: "Canción no encontrada" });
      return;
    }
    
    res.json(song);
  } catch (error) {
    console.error('Error en getSingleSong:', error);
    res.status(500).json({ error: 'Error al obtener la canción' });
  }
});

// Endpoint temporal para obtener información de la base de datos
export const getDbInfo = TryCatch(async (req, res) => {
  try {
    // Obtener todas las tablas en la base de datos
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name`;
    
    console.log('Tablas en la base de datos:', tables);
    
    // Obtener la estructura de cada tabla
    const tablesInfo: Record<string, any> = {};
    
    for (const table of tables) {
      const tableName = table.table_name;
      const columns = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = ${tableName}
        ORDER BY ordinal_position`;
      
      tablesInfo[tableName] = columns;
      console.log(`Estructura de la tabla ${tableName}:`, columns);
      
      // Mostrar algunos datos de ejemplo (primeros 3 registros) con consultas condicionales
      try {
        let sampleData;
        
        // Usar una estructura condicional para manejar diferentes nombres de tabla
        if (tableName === 'albums') {
          sampleData = await sql`SELECT * FROM albums LIMIT 3`;
        } else if (tableName === 'songs') {
          sampleData = await sql`SELECT * FROM songs LIMIT 3`;
        } else if (tableName === 'artists') {
          sampleData = await sql`SELECT * FROM artists LIMIT 3`;
        } else {
          console.log(`No se ha definido una consulta para la tabla: ${tableName}`);
          continue; // Saltar a la siguiente tabla
        }
        
        if (sampleData) {
          console.log(`Datos de ejemplo de ${tableName}:`, sampleData);
        }
      } catch (error) {
        console.error(`Error al obtener datos de ejemplo de ${tableName}:`, error);
      }
    }
    
    res.json({
      tables: tables.map(t => t.table_name),
      structure: tablesInfo
    });
  } catch (error) {
    console.error('Error al obtener información de la base de datos:', error);
    res.status(500).json({ 
      error: 'Error al obtener información de la base de datos',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
});

// Interfaz para el tipo de artista
interface Artist {
  id: string;
  name: string;
  image?: string;
}

// Función para obtener todos los artistas únicos
export const getAllArtists = TryCatch(async (req, res) => {
  try {
    console.log('Obteniendo artistas desde la base de datos...');
    
    // Obtener la lista de artistas desde la tabla artists
    const artists = await withRedis<Artist[]>(
      'artists',
      async (): Promise<Artist[]> => {
        try {
          console.log('Ejecutando consulta SQL para obtener artistas...');
          
          // Consulta para obtener todos los artistas con sus imágenes
          const result = await sql`
            SELECT id, name, image 
            FROM artists 
            WHERE name IS NOT NULL 
            ORDER BY name
            LIMIT 50`;
          
          console.log(`Se encontraron ${result.length} artistas`);
          
          // Mapear los resultados al formato esperado
          return result.map(artist => ({
            id: artist.id.toString(), // Convertir a string para consistencia
            name: artist.name,
            image: artist.image || '/images/default-artist.jpg' // Imagen por defecto
          }));
        } catch (queryError: unknown) {
          const errorMessage = queryError instanceof Error ? queryError.message : 'Error desconocido';
          console.error('Error en la consulta SQL:', errorMessage);
          throw new Error(`Error en la consulta SQL: ${errorMessage}`);
        }
      },
      { expiry: CACHE_EXPIRY }
    );
    
    // Devolver los resultados
    console.log(`Devolviendo ${artists?.length || 0} artistas`);
    res.json(artists || []);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error en getAllArtists:', errorMessage);
    res.status(500).json({ 
      error: 'Error al obtener los artistas',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});
