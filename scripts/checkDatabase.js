import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Verificar colección de canciones
    const songsCount = await db.collection('songs').countDocuments();
    console.log(`\n=== CANCIONES ===`);
    console.log(`Total de canciones: ${songsCount}`);
    
    if (songsCount > 0) {
      const sampleSong = await db.collection('songs').findOne();
      console.log('\nEjemplo de canción:');
      console.log({
        _id: sampleSong._id,
        title: sampleSong.title,
        artist: sampleSong.artist,
        duration: sampleSong.duration
      });
    }
    
    // Verificar colección de likes
    const likesCount = await db.collection('likes').countDocuments();
    console.log(`\n=== LIKES ===`);
    console.log(`Total de likes: ${likesCount}`);
    
    if (likesCount > 0) {
      const sampleLike = await db.collection('likes').findOne();
      console.log('\nEjemplo de like:');
      console.log(sampleLike);
      
      // Verificar si los IDs de las canciones en likes existen en la colección de canciones
      const allLikes = await db.collection('likes').find({}).toArray();
      const songIdsInLikes = [...new Set(allLikes.map(like => like.songId))];
      
      console.log(`\nVerificando ${songIdsInLikes.length} IDs únicos de canciones...`);
      
      // Buscar canciones por ID numérico (campo 'id') en lugar de _id
      const existingSongs = await db.collection('songs')
        .find({ id: { $in: songIdsInLikes } })
        .toArray();
      
      console.log(`\nCanciones encontradas: ${existingSongs.length}/${songIdsInLikes.length}`);
      
      if (existingSongs.length < songIdsInLikes.length) {
        const missingSongs = songIdsInLikes.filter(id => 
          !existingSongs.some(song => song.id === id)
        );
        
        console.log('\nIDs de canciones no encontradas:');
        console.log(missingSongs);
      }
    }
    
  } catch (error) {
    console.error('Error al verificar la base de datos:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

checkDatabase();
