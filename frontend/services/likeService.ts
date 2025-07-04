import { Song } from '@/types/media';

interface LikeResponse {
  liked: boolean;
  count?: number;
}

interface LikeStatus {
  liked: boolean;
  count: number;
}

interface UserLike {
  songId: string;
  likedAt: string;
}

const API_BASE = '/api';

/**
 * Alterna el estado de 'me gusta' de una canción
 */
export const toggleLike = async (songId: string): Promise<LikeResponse> => {
  try {
    const response = await fetch(`${API_BASE}/songs/${songId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al actualizar el like');
    }

    return response.json();
  } catch (error) {
    console.error('Error en toggleLike:', error);
    throw error;
  }
};

/**
 * Verifica si el usuario actual ha dado like a una canción
 */
export const checkLikeStatus = async (songId: string): Promise<LikeStatus> => {
  try {
    const response = await fetch(`${API_BASE}/songs/${songId}/like`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Error al verificar el like');
    }

    return response.json();
  } catch (error) {
    console.error('Error en checkLikeStatus:', error);
    return { liked: false, count: 0 };
  }
};

/**
 * Obtiene todos los likes del usuario actual con detalles de las canciones
 */
export const getLikedSongs = async (): Promise<Song[]> => {
  try {
    // Primero obtenemos los IDs de las canciones que le han gustado al usuario
    const response = await fetch(`${API_BASE}/me/likes`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener las canciones favoritas');
    }
    
    const songIds = await response.json();
    
    if (!Array.isArray(songIds) || songIds.length === 0) {
      return [];
    }
    
    // Luego obtenemos los detalles de las canciones en una sola petición
    const songsResponse = await fetch(`${API_BASE}/songs?ids=${songIds.join(',')}`, {
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!songsResponse.ok) {
      const errorData = await songsResponse.json().catch(() => ({}));
      console.error('Error al cargar los detalles de las canciones:', errorData);
      return [];
    }
    
    const result = await songsResponse.json();
    
    // Asegurarse de que siempre devolvemos un array
    if (!Array.isArray(result)) {
      console.warn('Se esperaba un array de canciones, pero se recibió:', result);
      return [];
    }
    
    return result;
  } catch (error) {
    console.error('Error en getLikedSongs:', error);
    // En caso de error, devolvemos un array vacío
    return [];
  }
};

/**
 * Obtiene solo los IDs de las canciones que le han gustado al usuario
 */
export const getLikedSongIds = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE}/me/likes`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener los likes del usuario');
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error en getLikedSongIds:', error);
    return [];
  }
};
