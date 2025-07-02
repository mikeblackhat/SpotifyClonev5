import axios, { AxiosResponse, AxiosError } from 'axios';
import { cache } from '@/lib/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Mapa para rastrear solicitudes en curso
const pendingRequests = new Map<string, Promise<AxiosResponse>>();

// Configuración de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError;
      console.log('Request error:', err.message);
      const errorMessage = (err.response?.data as any)?.message || err.message || 'Error de conexión';
      console.error('API Error:', errorMessage);
      return Promise.reject(new Error(errorMessage));
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Unknown error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

// Función auxiliar para manejar solicitudes con caché y cancelación
async function fetchWithCache<T>(url: string, cacheKey: string): Promise<T> {
  // Verificar caché primero
  const cachedData = cache.get<T>(cacheKey);
  if (cachedData) {
    console.log('Cache hit for:', cacheKey);
    return cachedData;
  }

  // Verificar si ya hay una solicitud en curso para esta URL
  if (pendingRequests.has(url)) {
    console.log('Using pending request for:', url);
    const pendingResult = await pendingRequests.get(url)!;
    return pendingResult as T;
  }

  try {
    console.log('Fetching from API:', url);
    const request = api.get<T>(url);
    
    // Almacenar la promesa de la solicitud
    pendingRequests.set(url, request);
    
    const response = await request;
    
    // Almacenar en caché
    if (response.data) {
      cache.set(cacheKey, response.data);
      return response.data;
    }
    
    throw new Error('No se recibieron datos de la API');
  } catch (error) {
    console.error('Error en fetchWithCache:', error);
    throw error;
  } finally {
    // Limpiar la solicitud pendiente
    pendingRequests.delete(url);
  }
}

export interface Song {
  id: string;
  title: string;
  duration: number;
  url: string;
  image: string;
  album_id: string;
  artist_id: string;
  genre_id: string;
  album?: {
    id: string;
    title: string;
  };
}

export interface Album {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  artist_id: string;
  genre_id: string;
  releaseDate?: string | number | Date;
}

export interface Artist {
  id: string;
  name: string;
  image?: string;
  bio?: string;
  followers?: number;
  albums?: Album[];
  songs?: Song[];
}

export const songService = {
  // Obtener todos los artistas
  async getAllArtists(): Promise<Artist[]> {
    try {
      const response = await fetchWithCache<{ success: boolean; data: { artists: Artist[] } }>('/artists', 'all_artists');
      
      // Verificar si la respuesta tiene el formato esperado
      if (response && response.success && response.data && Array.isArray(response.data.artists)) {
        return response.data.artists;
      }
      
      console.warn('Formato de respuesta inesperado:', response);
      return [];
    } catch (error) {
      console.error('Error en getAllArtists:', error);
      // En caso de error, devolver un array vacío en lugar de lanzar el error
      return [];
    }
  },

  // Obtener un artista por ID con sus álbumes y canciones
  async getArtist(artistId: string): Promise<Artist> {
    try {
      const response = await fetchWithCache<{ data: Artist } | Artist>(`/artists/${artistId}`, `artist_${artistId}`);
      // Asegurarse de que la respuesta tenga el formato correcto
      if (response && typeof response === 'object' && 'data' in response) {
        return response.data as Artist;
      }
      return response as Artist;
    } catch (error) {
      console.error('Error en getArtist:', error);
      throw error;
    }
  },

  // Obtener todos los álbumes
  async getAllAlbums(): Promise<Album[]> {
    try {
      const data = await fetchWithCache<{ data: Album[] } | Album[]>('/albums', 'all_albums');
      // Asegurarse de que la respuesta tenga el formato correcto
      if (Array.isArray(data)) {
        return data as Album[];
      }
      return (data as { data: Album[] }).data || [];
    } catch (error) {
      console.error('Error en getAllAlbums:', error);
      throw error;
    }
  },

  // Obtener todas las canciones
  async getAllSongs(): Promise<Song[]> {
    try {
      const data = await fetchWithCache<{ data: Song[] } | Song[]>('/songs', 'all_songs');
      // Asegurarse de que la respuesta tenga el formato correcto
      if (Array.isArray(data)) {
        return data as Song[];
      }
      return (data as { data: Song[] }).data || [];
    } catch (error) {
      console.error('Error en getAllSongs:', error);
      throw error;
    }
  },

  // Obtener canciones de un álbum específico
  async getSongsByAlbum(albumId: string): Promise<{ songs: Song[]; album: Album }> {
    try {
      const data = await fetchWithCache<{ songs: Song[]; album: Album }>(
        `/albums/${albumId}/songs`,
        `album_${albumId}_songs`
      );
      // Asegurarse de que la respuesta tenga el formato correcto
      if (data && 'songs' in data && 'album' in data) {
        return data as { songs: Song[]; album: Album };
      }
      throw new Error('Formato de respuesta inválido para getSongsByAlbum');
    } catch (error) {
      console.error('Error en getSongsByAlbum:', error);
      throw error;
    }
  },

  // Obtener una canción específica
  async getSong(songId: string): Promise<Song> {
    try {
      const data = await fetchWithCache<{ data: Song } | Song>(`/songs/${songId}`, `song_${songId}`);
      // Asegurarse de que la respuesta tenga el formato correcto
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data as Song;
      }
      return data as Song;
    } catch (error) {
      console.error('Error en getSong:', error);
      throw error;
    }
  }
};

export default songService;
