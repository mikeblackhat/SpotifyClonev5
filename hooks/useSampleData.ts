import { Song, Artist, Album, Playlist } from '@/types/media';
import { sampleSongs, sampleArtists, sampleAlbums, samplePlaylists } from '@/data/sample';
import { useState, useEffect } from 'react';

// Función para generar un ID único basado en un prefijo y un índice
const generateId = (prefix: string, index: number): string => {
  return `${prefix}-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Función para generar una URL de imagen de placeholder
const getImageUrl = (type: string, id: string | number): string => {
  return `https://picsum.photos/seed/${type}-${id}/400/400`;
};

// Función para generar una URL de audio de placeholder
const getAudioUrl = (id: string | number): string => {
  return `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${id}.mp3`;
};

export const useSampleData = () => {
  // Función para generar una lista de canciones con IDs únicos
  const generateSongs = (count: number, offset = 0): Song[] => {
    return sampleSongs.slice(0, count).map((song, index) => ({
      ...song,
      id: generateId('song', index + offset),
      imageUrl: getImageUrl('song', index + offset),
      audioUrl: getAudioUrl(index + 1), // Usamos index + 1 para variar la canción de SoundHelix
      duration: 180 + Math.floor(Math.random() * 120), // Duración entre 3-5 minutos
      playCount: Math.floor(Math.random() * 1000000) // Reproducciones aleatorias
    }));
  };

  // Función para generar una lista de artistas con IDs únicos
  const generateArtists = (count: number, offset = 0): Artist[] => {
    return sampleArtists.slice(0, count).map((artist, index) => ({
      ...artist,
      id: generateId('artist', index + offset),
      imageUrl: getImageUrl('artist', index + offset),
      followers: Math.floor(Math.random() * 10000000) // Seguidores aleatorios
    }));
  };

  // Función para generar una lista de álbumes con IDs únicos
  const generateAlbums = (count: number, offset = 0): Album[] => {
    return sampleAlbums.slice(0, count).map((album, index) => ({
      ...album,
      id: generateId('album', index + offset),
      imageUrl: getImageUrl('album', `${album.title.toLowerCase().replace(/\s+/g, '-')}-${index + offset}`)
    }));
  };

  // Función para generar una lista de listas de reproducción con IDs únicos
  const generatePlaylists = (count: number, offset = 0): Playlist[] => {
    return samplePlaylists.slice(0, count).map((playlist, index) => ({
      ...playlist,
      id: generateId('playlist', index + offset),
      imageUrl: getImageUrl('playlist', index + offset),
      duration: 3600 + Math.floor(Math.random() * 7200), // 1-3 horas de duración
      trackCount: 20 + Math.floor(Math.random() * 50) // 20-70 pistas
    }));
  };

  // Datos de ejemplo
  const popularSongs = generateSongs(12);
  const popularArtists = generateArtists(10);
  const popularAlbums = generateAlbums(15);
  const featuredPlaylists = generatePlaylists(10);

  return {
    popularSongs,
    popularArtists,
    popularAlbums,
    featuredPlaylists,
    generateSongs,
    generateArtists,
    generateAlbums,
    generatePlaylists
  };
};
