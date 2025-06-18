import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Song } from '@/types/media';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  play: (song: Song) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  queue: Song[];
  addToQueue: (songs: Song | Song[]) => void;
  clearQueue: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.7);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(-1);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inicializar el elemento de audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      
      // Configurar manejadores de eventos
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleEnded = () => {
        playNext();
      };
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
        audio.src = '';
      };
    }
  }, []);

  // Efecto para manejar cambios en el volumen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Efecto para manejar reproducción/pausa
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error('Error al reproducir:', error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Función para reproducir una canción
  const play = (song: Song) => {
    if (!audioRef.current) return;
    
    // Si es la misma canción, solo alternar reproducción
    if (currentSong?.id === song.id) {
      togglePlayPause();
      return;
    }
    
    // Detener la reproducción actual
    audioRef.current.pause();
    
    // Configurar la nueva canción
    audioRef.current.src = song.audioUrl || '';
    audioRef.current.load();
    
    setCurrentSong(song);
    setIsPlaying(true);
    
    // Si la canción no está en la cola, agregarla
    if (!queue.some(s => s.id === song.id)) {
      const newQueue = [...queue];
      newQueue.splice(queueIndex + 1, 0, song);
      setQueue(newQueue);
      setQueueIndex(queueIndex + 1);
    } else {
      // Si ya está en la cola, actualizar el índice
      const index = queue.findIndex(s => s.id === song.id);
      setQueueIndex(index);
    }
  };

  // Función para alternar entre reproducir y pausar
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Función para establecer el volumen
  const setVolume = (newVolume: number) => {
    const volumeValue = Math.max(0, Math.min(1, newVolume));
    setVolumeState(volumeValue);
  };

  // Función para buscar un tiempo específico en la canción
  const seek = (time: number) => {
    if (!audioRef.current) return;
    
    const newTime = Math.max(0, Math.min(time, duration));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Función para reproducir la siguiente canción en la cola
  const playNext = () => {
    if (queueIndex < queue.length - 1) {
      const nextSong = queue[queueIndex + 1];
      setQueueIndex(queueIndex + 1);
      setCurrentSong(nextSong);
      
      if (audioRef.current) {
        audioRef.current.src = nextSong.audioUrl || '';
        audioRef.current.play().catch(console.error);
      }
    } else {
      // Llegamos al final de la cola
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  // Función para reproducir la canción anterior en la cola
  const playPrevious = () => {
    if (currentTime > 3) {
      // Si han pasado más de 3 segundos, reiniciar la canción actual
      seek(0);
    } else if (queueIndex > 0) {
      // Si no, ir a la canción anterior
      const prevSong = queue[queueIndex - 1];
      setQueueIndex(queueIndex - 1);
      setCurrentSong(prevSong);
      
      if (audioRef.current) {
        audioRef.current.src = prevSong.audioUrl || '';
        audioRef.current.play().catch(console.error);
      }
    } else {
      // Estamos en la primera canción, reiniciar
      seek(0);
    }
  };

  // Función para agregar canciones a la cola
  const addToQueue = (songs: Song | Song[]) => {
    const songsArray = Array.isArray(songs) ? songs : [songs];
    setQueue(prevQueue => [...prevQueue, ...songsArray]);
    
    // Si no hay canción actual, reproducir la primera
    if (!currentSong && songsArray.length > 0) {
      play(songsArray[0]);
    }
  };

  // Función para limpiar la cola
  const clearQueue = () => {
    setQueue([]);
    setQueueIndex(-1);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        duration,
        currentTime,
        play,
        togglePlayPause,
        setVolume,
        seek,
        playNext,
        playPrevious,
        queue,
        addToQueue,
        clearQueue,
      }}
    >
      {children}
      {/* Elemento de audio oculto */}
      <audio ref={audioRef} className="hidden" />
    </PlayerContext.Provider>
  );
};

// Hook personalizado para usar el contexto del reproductor
export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer debe usarse dentro de un PlayerProvider');
  }
  return context;
};
