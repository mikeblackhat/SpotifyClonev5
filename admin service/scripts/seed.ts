import { neon } from "@neondatabase/serverless";
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

// Cargar variables de entorno
dotenv.config();

// Configurar la conexión a la base de datos
const sql = neon(process.env.DB_URL as string);

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
  try {
    console.log('Iniciando la carga de datos de ejemplo...');
    
    // 1. Insertar géneros
    console.log('Insertando géneros...');
    const insertedGenres = [];
    
    for (const genre of genres) {
      const [insertedGenre] = await sql`
        INSERT INTO genres (name, description)
        VALUES (${genre.name}, ${genre.description})
        RETURNING id, name, description
      `;
      insertedGenres.push(insertedGenre);
      console.log(`Género insertado: ${insertedGenre.name}`);
    }
    
    // 2. Insertar artistas
    console.log('\nInsertando artistas...');
    const artists = generateArtists(10);
    const insertedArtists = [];
    
    for (const artist of artists) {
      const [insertedArtist] = await sql`
        INSERT INTO artists (name, bio, image)
        VALUES (${artist.name}, ${artist.bio}, ${artist.image})
        RETURNING id, name, bio, image
      `;
      insertedArtists.push(insertedArtist);
      console.log(`Artista insertado: ${insertedArtist.name}`);
    }
    
    // 3. Insertar álbumes
    console.log('\nInsertando álbumes...');
    const albums = generateAlbums(insertedArtists, insertedGenres, 2);
    const insertedAlbums = [];
    
    for (const album of albums) {
      const [insertedAlbum] = await sql`
        INSERT INTO albums (title, description, thumbnail, artist_id, genre_id)
        VALUES (${album.title}, ${album.description}, ${album.thumbnail}, ${album.artist_id}, ${album.genre_id})
        RETURNING id, title, artist_id, genre_id
      `;
      insertedAlbums.push(insertedAlbum);
      console.log(`Álbum insertado: ${insertedAlbum.title}`);
    }
    
    // 4. Insertar canciones
    console.log('\nInsertando canciones...');
    const songs = generateSongs(insertedAlbums, 5);
    
    for (const song of songs) {
      await sql`
        INSERT INTO songs (title, duration, url, image, album_id, artist_id, genre_id)
        VALUES (${song.title}, ${song.duration}, ${song.url}, ${song.image}, ${song.album_id}, ${song.artist_id}, ${song.genre_id})
        RETURNING id, title
      `;
      console.log(`Canción insertada: ${song.title}`);
    }
    
    console.log('\n¡Datos de ejemplo cargados exitosamente!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error al cargar los datos de ejemplo:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
seedDatabase();
