import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// IDs de las canciones que necesitamos crear (tomados de los likes existentes)
const SONG_IDS = [69, 41, 44, 43, 70, 42, 45, 32, 22, 25, 98];

// Datos de ejemplo para las canciones
const ARTISTS = [
  'The Weeknd', 'Dua Lipa', 'Ed Sheeran', 'Billie Eilish', 'Post Malone',
  'Ariana Grande', 'Justin Bieber', 'Doja Cat', 'The Kid LAROI', 'Olivia Rodrigo'
];

const ALBUMS = [
  'After Hours', 'Future Nostalgia', '=', 'Happier Than Ever', 'Hollywood\'s Bleeding',
  'Positions', 'Justice', 'Planet Her', 'F*CK LOVE 3', 'SOUR'
];

const SONGS = [
  'Blinding Lights', 'Levitating', 'Bad Habits', 'Happier Than Ever', 'Circles',
  'Positions', 'Stay', 'Kiss Me More', 'Without You', 'good 4 u'
];

async function seedSongs() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Verificar si ya existen canciones
    const existingSongs = await db.collection('songs').find({}).toArray();
    
    if (existingSongs.length > 0) {
      console.log('Ya existen canciones en la base de datos. No se agregarán más.');
      return;
    }
    
    // Crear canciones de prueba
    const songsToInsert = SONG_IDS.map((id, index) => ({
      _id: new ObjectId(id.toString().padStart(24, '0')), // Convertir a ObjectId válido
      id: id.toString(),
      title: SONGS[index % SONGS.length],
      artist: ARTISTS[index % ARTISTS.length],
      album: ALBUMS[index % ALBUMS.length],
      duration: 180 + Math.floor(Math.random() * 120), // Entre 3 y 5 minutos
      url: `/songs/song-${id}.mp3`,
      // Usar placeholder de imágenes de álbumes
      imageUrl: `https://picsum.photos/300/300?random=${id}`,
      genre: 'Pop',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Insertar canciones
    const result = await db.collection('songs').insertMany(songsToInsert);
    
    console.log(`Se insertaron ${result.insertedCount} canciones de prueba.`);
    
  } catch (error) {
    console.error('Error al insertar canciones de prueba:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seedSongs();
