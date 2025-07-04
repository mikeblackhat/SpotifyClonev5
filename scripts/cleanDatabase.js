import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function cleanDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Eliminar todas las canciones
    const songsResult = await db.collection('songs').deleteMany({});
    console.log(`Se eliminaron ${songsResult.deletedCount} canciones.`);
    
    // Opcional: también podrías limpiar los likes
    // const likesResult = await db.collection('likes').deleteMany({});
    // console.log(`Se eliminaron ${likesResult.deletedCount} likes.`);
    
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

cleanDatabase();
