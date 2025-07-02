'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { songService } from '@/services/songService';

export type Artist = {
  id: string;
  name: string;
  bio?: string;
  image?: string;
  followers?: number;
  // Otras propiedades opcionales que puedan venir de la API
  [key: string]: any;
};

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

export interface ArtistWithDetails extends Artist {
  id: string;
  name: string;
  bio?: string;
  image?: string;
  followers?: number;
  albums: Album[];
  songs: Song[];
  [key: string]: any;
}

interface SongContextType {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  currentSong: Song | null;
  isLoading: boolean;
  error: string | null;
  fetchSongs: () => Promise<void>;
  fetchAlbums: () => Promise<void>;
  fetchArtists: () => Promise<void>;
  fetchArtist: (artistId: string) => Promise<ArtistWithDetails>;
  fetchSongsByAlbum: (albumId: string) => Promise<{ songs: Song[]; album: Album }>;
  fetchSong: (songId: string) => Promise<Song>;
  setCurrentSong: (song: Song | null) => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

export const SongProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await songService.getAllSongs();
      setSongs(data);
    } catch (err) {
      setError('Error al cargar las canciones');
      console.error('Error fetching songs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAlbums = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await songService.getAllAlbums();
      setAlbums(data);
    } catch (err) {
      setError('Error al cargar los álbumes');
      console.error('Error fetching albums:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSongsByAlbum = async (albumId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await songService.getSongsByAlbum(albumId);
    } catch (err) {
      setError('Error al cargar las canciones del álbum');
      console.error('Error fetching album songs:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSong = async (songId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await songService.getSong(songId);
    } catch (err) {
      setError('Error al cargar la canción');
      console.error('Error fetching song:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArtists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await songService.getAllArtists();
      setArtists(data);
    } catch (err) {
      setError('Error al cargar los artistas');
      console.error('Error fetching artists:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArtist = React.useCallback(async (artistId: string): Promise<ArtistWithDetails> => {
    if (isLoading) return Promise.reject('Ya se está cargando el artista');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await songService.getArtist(artistId);
      
      // Asegurarse de que data tenga la estructura esperada
      const artistData = data as ArtistWithDetails;
      
      // Actualizar el artista en la lista de artistas si es necesario
      setArtists(prevArtists => {
        // Asegurarse de que prevArtists sea un array
        const currentArtists = Array.isArray(prevArtists) ? prevArtists : [];
        const artistExists = currentArtists.some(a => a && a.id === artistId);
        
        if (artistExists) {
          return currentArtists.map(a => 
            a && a.id === artistId ? { ...a, ...artistData } : a
          );
        }
        
        return [...currentArtists, { 
          id: artistData.id, 
          name: artistData.name, 
          image: artistData.image,
          bio: artistData.bio,
          followers: artistData.followers
        }];
      });
      
      // Actualizar los álbumes en la lista de álbumes
      if (artistData.albums && artistData.albums.length > 0) {
        setAlbums(prevAlbums => {
          const newAlbums = artistData.albums.filter((album: Album) => 
            !prevAlbums.some(a => a.id === album.id)
          );
          return [...prevAlbums, ...newAlbums];
        });
      }
      
      // Actualizar las canciones en la lista de canciones
      if (artistData.songs && artistData.songs.length > 0) {
        setSongs(prevSongs => {
          const newSongs = artistData.songs.filter((song: Song) => 
            !prevSongs.some(s => s.id === song.id)
          );
          return [...prevSongs, ...newSongs];
        });
      }
      
      return artistData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el artista';
      setError(errorMessage);
      console.error('Error fetching artist:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Cargar datos iniciales solo una vez
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // No cargar si ya tenemos datos o ya estamos cargando
        if (songs.length > 0 || albums.length > 0 || artists.length > 0 || isLoading) {
          return;
        }
        
        setIsLoading(true);
        console.log('Cargando datos iniciales...');
        
        // Cargar en paralelo para mejorar el rendimiento
        await Promise.all([
          fetchSongs(),
          fetchAlbums(),
          fetchArtists()
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Error al cargar los datos iniciales');
      } finally {
        setIsLoading(false);
      }
    };

    // Verificar si necesitamos cargar datos
    if (songs.length === 0 && albums.length === 0 && artists.length === 0) {
      loadInitialData();
    }
  }, [songs.length, albums.length, artists.length]); // Solo volver a cargar si los arrays están vacíos

  return (
    <SongContext.Provider
      value={{
        songs,
        albums,
        artists,
        currentSong,
        isLoading,
        error,
        fetchSongs,
        fetchAlbums,
        fetchArtists,
        fetchArtist,
        fetchSongsByAlbum,
        fetchSong,
        setCurrentSong,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSongs = (): SongContextType => {
  const context = useContext(SongContext);
  if (context === undefined) {
    throw new Error('useSongs debe ser usado dentro de un SongProvider');
  }
  return context;
};
