import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { faker } from '@faker-js/faker';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Verificar que la URL de la base de datos esté configurada
if (!process.env.DB_URL) {
  console.error('Error: La variable de entorno DB_URL no está configurada en el archivo .env');
  process.exit(1);
}

// Función para analizar la URL de conexión
function parseDatabaseUrl(url: string) {
  const parsed = new URL(url);
  return {
    user: parsed.username,
    password: parsed.password,
    host: parsed.hostname,
    port: parseInt(parsed.port, 10),
    database: parsed.pathname.slice(1), // Elimina la barra inicial
    ssl: {
      rejectUnauthorized: false
    }
  };
}

// Configurar la conexión a la base de datos
const pool = new Pool(parseDatabaseUrl(process.env.DB_URL));

// Tipos de datos
interface Artist {
  id: string;
  name: string;
  bio: string;
  image: string;
}

interface Album {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  artist_id: string;
  genre_id: string;
}

interface Song {
  id: string;
  title: string;
  duration: number;
  url: string;
  image: string;
  album_id: string;
  artist_id: string;
  genre_id: string;
}

// Datos de ejemplo
const genres = [
  { name: 'Pop', description: 'Música popular con melodías pegadizas' },
  { name: 'Rock', description: 'Música rock clásica y moderna' },
  { name: 'Hip Hop', description: 'Ritmos urbanos y letras potentes' },
  { name: 'Electrónica', description: 'Música electrónica para bailar' },
  { name: 'R&B', description: 'Rhythm and Blues con influencias soul' },
  { name: 'Reggaetón', description: 'Ritmos latinos urbanos' },
  { name: 'Indie', description: 'Música independiente y alternativa' },
  { name: 'Jazz', description: 'Improvisación y armonías complejas' },
  { name: 'Clásica', description: 'Música clásica de todos los tiempos' },
  { name: 'Metal', description: 'Música pesada con guitarras distorsionadas' },
];

// Función para generar datos de artistas
function generateArtists(count: number): Omit<Artist, 'id'>[] {
  const artists: Omit<Artist, 'id'>[] = [];
  
  for (let i = 0; i < count; i++) {
    artists.push({
      name: faker.person.fullName(),
      bio: faker.lorem.paragraph(),
      image: `https://i.pravatar.cc/300?img=${i + 1}`,
    });
  }
  
  return artists;
}

// Función para generar datos de álbumes
function generateAlbums(artists: Artist[], genres: { id: string; name: string }[], countPerArtist: number): Omit<Album, 'id'>[] {
  const albums: Omit<Album, 'id'>[] = [];
  
  for (const artist of artists) {
    for (let i = 0; i < countPerArtist; i++) {
      const randomGenre = genres[Math.floor(Math.random() * genres.length)];
      
      albums.push({
        title: `${faker.music.genre()} ${faker.word.noun()}`,
        description: faker.lorem.sentence(),
        thumbnail: `https://picsum.photos/seed/${artist.id}-${i}/300/300`,
        artist_id: artist.id,
        genre_id: randomGenre.id,
      });
    }
  }
  
  return albums;
}

// Función para generar datos de canciones
function generateSongs(albums: Album[], countPerAlbum: number): Omit<Song, 'id'>[] {
  const songs: Omit<Song, 'id'>[] = [];
  
  for (const album of albums) {
    for (let i = 0; i < countPerAlbum; i++) {
      songs.push({
        title: `${faker.music.songName()}`,
        duration: Math.floor(Math.random() * 300) + 120, // Entre 2 y 7 minutos
        url: `https://example.com/songs/${album.artist_id}/${album.id}/${i}.mp3`,
        image: album.thumbnail,
        album_id: album.id,
        artist_id: album.artist_id,
        genre_id: album.genre_id,
      });
    }
  }
  
  return songs;
}

// Función principal
async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando la carga de datos de ejemplo...');
    
    // Iniciar una transacción
    await client.query('BEGIN');
    
    try {
      // 1. Insertar géneros
      console.log('Insertando géneros...');
      const insertedGenres: { id: string; name: string }[] = [];
      
      for (const genre of genres) {
        const result = await client.query(
          'INSERT INTO genres (name, description) VALUES ($1, $2) RETURNING id, name',
          [genre.name, genre.description]
        );
        
        if (result.rows && result.rows.length > 0) {
          insertedGenres.push(result.rows[0]);
          console.log(`Género insertado: ${result.rows[0].name}`);
        }
      }
      
      // 2. Insertar artistas
      console.log('\nInsertando artistas...');
      const artists = generateArtists(10);
      const insertedArtists: Artist[] = [];
      
      for (const artist of artists) {
        const result = await client.query(
          'INSERT INTO artists (name, bio, image) VALUES ($1, $2, $3) RETURNING id, name, bio, image',
          [artist.name, artist.bio, artist.image]
        );
        
        if (result.rows && result.rows.length > 0) {
          insertedArtists.push(result.rows[0]);
          console.log(`Artista insertado: ${result.rows[0].name}`);
        }
      }
      
      // 3. Insertar álbumes
      console.log('\nInsertando álbumes...');
      const albums = generateAlbums(insertedArtists, insertedGenres, 2);
      const insertedAlbums: Album[] = [];
      
      for (const album of albums) {
        const result = await client.query(
          `INSERT INTO albums (title, description, thumbnail, artist_id, genre_id) 
           VALUES ($1, $2, $3, $4, $5) RETURNING id, title, artist_id, genre_id`,
          [album.title, album.description, album.thumbnail, album.artist_id, album.genre_id]
        );
        
        if (result.rows && result.rows.length > 0) {
          insertedAlbums.push({
            ...result.rows[0],
            description: album.description,
            thumbnail: album.thumbnail
          } as unknown as Album);
          console.log(`Álbum insertado: ${result.rows[0].title}`);
        }
      }
      
      // 4. Insertar canciones
      console.log('\nInsertando canciones...');
      const songs = generateSongs(insertedAlbums, 5);
      
      for (const song of songs) {
        await client.query(
          `INSERT INTO songs (title, duration, url, image, album_id, artist_id, genre_id) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            song.title, 
            song.duration, 
            song.url, 
            song.image, 
            song.album_id, 
            song.artist_id, 
            song.genre_id
          ]
        );
        console.log(`Canción insertada: ${song.title}`);
      }
      
      // Si todo va bien, hacer commit de la transacción
      await client.query('COMMIT');
      console.log('\n¡Datos de ejemplo cargados exitosamente!');
      
    } catch (error) {
      // Si hay un error, hacer rollback de la transacción
      await client.query('ROLLBACK');
      console.error('Error durante la carga de datos, se ha realizado un rollback:', error);
      throw error;
    }
    
  } catch (error) {
    console.error('Error al cargar los datos de ejemplo:', error);
    process.exit(1);
  } finally {
    // Liberar el cliente de vuelta al pool
    client.release();
    // Cerrar el pool de conexiones
    await pool.end();
    process.exit(0);
  }
}

// Ejecutar la función principal
seedDatabase();
