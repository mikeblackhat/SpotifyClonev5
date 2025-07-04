import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI as string;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    
    console.log('Obteniendo canciones desde MongoDB...');
    
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    
    let query = {};
    
    // Si hay IDs en los parámetros, buscar solo esas canciones
    if (idsParam) {
      const ids = idsParam.split(',').map(id => {
        try {
          return new ObjectId(id);
        } catch (e) {
          console.warn(`ID inválido: ${id}`);
          return null;
        }
      }).filter(Boolean);
      
      if (ids.length > 0) {
        query = { _id: { $in: ids } };
      }
    }
    
    const songs = await db.collection('songs')
      .find(query)
      .toArray();
    
    await client.close();

    console.log(`Total de canciones encontradas: ${songs.length}`);
    
    // Mapear los _id de ObjectId a string para la respuesta
    const formattedSongs = songs.map(song => ({
      ...song,
      id: song._id.toString(),
      _id: song._id.toString()
    }));
    
    return NextResponse.json(formattedSongs, { status: 200 });
    
  } catch (error) {
    console.error('Error al obtener canciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener canciones' },
      { status: 500 }
    );
  }
}
