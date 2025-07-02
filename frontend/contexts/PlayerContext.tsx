import React, { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Song } from '@/types/media';
import { sampleSongs } from '@/src/data/sample/songs';

type LoopMode = 'none' | 'one' | 'all';

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
  toggleLoop: () => void;
  loopMode: LoopMode;
  queue: Song[];
  queueIndex: number;
  addToQueue: (songs: Song | Song[]) => void;
  clearQueue: () => void;
  areNavigationControlsDisabled: boolean;
  isFreeUser: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  
  // Estado del reproductor
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.7);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(-1);
  const [loopMode, setLoopMode] = useState<LoopMode>('none');
  const [skipsRemaining, setSkipsRemaining] = useState<number>(10);
  const [lastSkipReset, setLastSkipReset] = useState<number>(Date.now());
  const isFreeUser = session?.user?.plan === 'free';
  
  // Función para cambiar el modo de repetición
  const toggleLoop = useCallback(() => {
    setLoopMode(prevMode => {
      switch (prevMode) {
        case 'none': return 'all';
        case 'all': return 'one';
        case 'one': 
        default: return 'none';
      }
    });
  }, []);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Limpiar el estado del reproductor cuando el usuario cierre sesión
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Pausar la reproducción
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Limpiar el estado
      setCurrentSong(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setQueue([]);
      setQueueIndex(-1);
    }
  }, [status]);

  // Función para manejar el evento 'ended' del audio
  const handleEnded = useCallback(() => {
    console.log('Canción terminada - Modo de repetición:', loopMode);
    
    if (loopMode === 'one' && currentSong) {
      // Repetir la misma canción
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } else if (loopMode === 'all' && queue.length > 0 && queueIndex === queue.length - 1) {
      // Si es la última canción y está en modo repetir todo, volver al inicio
      setQueueIndex(0);
      const firstSong = queue[0];
      if (audioRef.current && firstSong.audioUrl) {
        audioRef.current.src = firstSong.audioUrl;
        audioRef.current.play().catch(console.error);
      }
    } else if (queue.length > 0 && queueIndex < queue.length - 1) {
      // Si hay una siguiente canción en la cola, reproducirla
      const nextIndex = queueIndex + 1;
      const nextSong = queue[nextIndex];
      if (nextSong) {
        setQueueIndex(nextIndex);
        if (audioRef.current && nextSong.audioUrl) {
          audioRef.current.src = nextSong.audioUrl;
          audioRef.current.play().catch(console.error);
        }
      }
    }
    // Si no hay más canciones en la cola, no hacer nada
  }, [loopMode, currentSong, queue, queueIndex]);

  // Configurar el elemento de audio
  useEffect(() => {
    // No inicializar el reproductor si no hay una canción actual
    if (!currentSong) return;
    if (typeof window === 'undefined') return;
    
    // Crear el elemento de audio si no existe
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume; // Establecer volumen inicial
      audioRef.current.preload = 'metadata'; // Precargar metadatos
    }
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      console.log('Duración cargada:', audio.duration);
      setDuration(audio.duration);
    };
    
    const handleCanPlay = () => {
      console.log('El audio puede reproducirse');
      if (isPlaying) {
        audio.play().catch(error => {
          console.error('Error al reproducir:', error);
          setIsPlaying(false);
        });
      }
    };
    
    const handleError = (e: Event) => {
      console.error('Error en el elemento de audio:', e);
      setIsPlaying(false);
    };
    
    // Agregar manejadores de eventos
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);
    
    // Limpieza
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      
      // No pausamos ni limpiamos la fuente aquí para permitir la precarga
      // audio.pause();
      // audio.src = '';
    };
  }, [isPlaying, volume, currentSong, handleEnded]);

  // Efecto para manejar cambios en el volumen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Efecto para reiniciar el contador de saltos cada hora
  useEffect(() => {
    const resetSkipsHourly = () => {
      const now = Date.now();
      if (now - lastSkipReset >= 3600000) { // 1 hora en milisegundos
        setSkipsRemaining(10);
        setLastSkipReset(now);
      }
    };

    const interval = setInterval(resetSkipsHourly, 60000); // Verificar cada minuto
    return () => clearInterval(interval);
  }, [lastSkipReset]);

  // Efecto para manejar reproducción/pausa
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const playAudio = async () => {
      if (!currentSong) return;
      
      try {
        console.log('Reproduciendo canción:', currentSong.title);
        // Solo cambiar la fuente si es diferente a la actual
        if (audio.src !== (currentSong.audioUrl || '')) {
          console.log('Cambiando fuente de audio a:', currentSong.audioUrl);
          audio.pause();
          audio.src = currentSong.audioUrl || '';
          await audio.load();
        }
        
        if (isPlaying) {
          console.log('Iniciando reproducción...');
          await audio.play();
          console.log('Reproducción iniciada');
        }
      } catch (error) {
        console.error('Error al reproducir la canción:', error);
        setIsPlaying(false);
      }
    };
    
    if (isPlaying) {
      playAudio();
    } else if (audio) {
      console.log('Pausando reproducción...');
      audio.pause();
    }
    
    // Limpieza
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [isPlaying, currentSong]);

  // Función para reproducir una canción
  const play = useCallback(async (song: Song) => {
    // Verificar si el usuario ha iniciado sesión
    if (status !== 'authenticated') {
      console.log('Por favor inicia sesión para reproducir canciones');
      // Aquí podrías redirigir al usuario a la página de inicio de sesión
      // o mostrar un modal de inicio de sesión
      window.location.href = '/auth/signin';
      return;
    }

    if (!audioRef.current) {
      console.error('El elemento de audio no está disponible');
      return;
    }
    
    console.log('Preparando para reproducir canción:', song.title);
    console.log('Estado actual de la cola:', { queueLength: queue.length, queueIndex, queue });
    
    // Pausar la reproducción actual si hay una
    if (audioRef.current.src) {
      audioRef.current.pause();
    }
    
    // Verificar si la URL de audio es válida
    if (!song.audioUrl) {
      console.error('La canción no tiene una URL de audio válida');
      return;
    }
    
    try {
      // Actualizar la fuente si es necesario
      const isNewSource = !audioRef.current.src || audioRef.current.src !== song.audioUrl;
      
      if (isNewSource) {
        console.log('Actualizando fuente de audio a:', song.audioUrl);
        // Primero configuramos el manejador de eventos 'canplay' para cuando el audio esté listo
        const canPlayPromise = new Promise<void>((resolve) => {
          const onCanPlay = () => {
            audioRef.current?.removeEventListener('canplay', onCanPlay);
            resolve();
          };
          audioRef.current?.addEventListener('canplay', onCanPlay, { once: true });
        });
        
        // Actualizamos la fuente
        audioRef.current.src = song.audioUrl;
        
        // Esperamos a que el audio esté listo para reproducir
        await canPlayPromise;
      }
      
      // Establecer el volumen actual
      audioRef.current.volume = volume;
      
      // Actualizar la canción actual
      setCurrentSong(song);
      
      // Verificar si la canción está en la cola actual
      const songIndex = queue.findIndex(s => s.id === song.id);
      
      if (songIndex !== -1) {
        // Si la canción está en la cola, actualizar el índice
        console.log('Canción encontrada en la cola en el índice:', songIndex);
        setQueueIndex(songIndex);
      } else if (queue.length === 0) {
        // Si la cola está vacía, agregar la canción actual
        console.log('Cola vacía, agregando canción a la cola');
        setQueue([song]);
        setQueueIndex(0);
      } else {
        // Si la canción no está en la cola, agregarla al final
        console.log('Agregando canción al final de la cola');
        setQueue(prevQueue => {
          const newQueue = [...prevQueue, song];
          console.log('Nueva cola después de agregar canción:', newQueue);
          return newQueue;
        });
        setQueueIndex(queue.length);
      }
      
      // Esperar un momento para que se actualice el estado de la cola
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Intentar reproducir
      console.log('Intentando reproducir...');
      await audioRef.current.play();
      console.log('Reproducción iniciada correctamente');
      setIsPlaying(true);
      
    } catch (error: any) {
      console.error('Error al reproducir la canción:', error);
      setIsPlaying(false);
      
      // Mostrar mensaje de error al usuario
      if (error.name === 'NotAllowedError') {
        console.log('Reproducción no permitida. Se requiere interacción del usuario.');
        // No mostramos alerta aquí, dejamos que el usuario intente de nuevo
      } else if (error.name === 'NotSupportedError') {
        console.error('Formato de audio no compatible');
        alert('El formato de audio no es compatible con tu navegador.');
      } else {
        console.error('Error desconocido al reproducir:', error);
        // No mostramos alerta genérica, permitimos reintentar
      }
      setIsPlaying(false);
    }
  }, [queue, queueIndex, volume, status]);

  // Función para alternar entre reproducir y pausar
  const togglePlayPause = () => {
    // Verificar si el usuario ha iniciado sesión
    if (status !== 'authenticated') {
      console.log('Por favor inicia sesión para reproducir canciones');
      window.location.href = '/auth/signin';
      return;
    }
    
    // Si no hay canción actual, no hacer nada
    if (!currentSong) return;
    
    setIsPlaying(!isPlaying);
  };

  // Función para establecer el volumen
  const setVolume = (newVolume: number) => {
    const volumeValue = Math.max(0, Math.min(1, newVolume));
    setVolumeState(volumeValue);
  };

  // Función para buscar un tiempo específico en la canción
  const seek = (time: number) => {
    if (!audioRef.current || !isFinite(time) || !isFinite(duration)) {
      console.error('No se puede buscar: audio no inicializado o tiempo inválido', { time, duration });
      return;
    }
    
    // Asegurarse de que el tiempo esté dentro de los límites
    const newTime = Math.max(0, Math.min(time, isFinite(duration) ? duration : time));
    
    // Solo establecer currentTime si el valor es finito
    if (isFinite(newTime)) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    } else {
      console.error('Intento de búsqueda con tiempo no finito', { newTime, time, duration });
    }
  };

  // Función para verificar y actualizar el límite de saltos
  const checkAndUpdateSkips = (): boolean => {
    if (!isFreeUser) return true; // Sin límite para usuarios premium
    
    // Reiniciar el contador si ha pasado una hora
    const now = Date.now();
    if (now - lastSkipReset > 3600000) { // 1 hora en milisegundos
      setSkipsRemaining(10);
      setLastSkipReset(now);
      return true;
    }
    
    // Verificar si quedan saltos disponibles
    if (skipsRemaining > 0) {
      setSkipsRemaining(prev => prev - 1);
      return true;
    }
    
    return false;
  };

  // Función para reproducir la siguiente canción en la cola
  const playNext = () => {
    // Verificar si el usuario ha iniciado sesión
    if (status !== 'authenticated') {
      console.log('Por favor inicia sesión para reproducir canciones');
      window.location.href = '/auth/signin';
      return;
    }
    
    console.log('playNext llamado', { 
      queueIndex, 
      queueLength: queue.length,
      currentSong: currentSong?.title,
      isFreeUser,
      skipsRemaining
    });
    
    // Si no hay canciones en la cola, no hacer nada
    if (queue.length === 0) {
      console.log('No hay canciones en la cola');
      return;
    }
    
    // Verificar límite de saltos para usuarios gratuitos
    if (isFreeUser && skipsRemaining <= 0) {
      console.log('Límite de saltos alcanzado. Actualiza a premium para saltos ilimitados.');
      // Aquí podrías agregar una notificación al usuario
      return;
    }
    
    // Determinar la siguiente canción a reproducir
    let nextIndex = -1;
    
    // Si no hay canción actual o es la primera vez que se llama
    if (queueIndex === -1 || !currentSong) {
      nextIndex = 0; // Empezar por la primera canción
    }
    // Si hay una canción actual y hay una siguiente canción en la cola
    else if (queueIndex < queue.length - 1) {
      nextIndex = queueIndex + 1;
    }
    // Si es la última canción y el modo de repetición está activado
    else if (loopMode === 'all') {
      nextIndex = 0; // Volver al inicio de la cola
    } else {
      // No hay más canciones y no está en modo repetir
      console.log('No hay más canciones en la cola');
      if (currentSong) {
        seek(0);
      }
      return;
    }
    
    // Verificar que el índice sea válido
    if (nextIndex >= 0 && nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      console.log('Siguiente canción seleccionada:', { 
        title: nextSong.title, 
        index: nextIndex,
        url: nextSong.audioUrl 
      });
      
      // Actualizar el estado en un solo paso para evitar actualizaciones parciales
      setQueueIndex(nextIndex);
      setCurrentSong(nextSong);
      
      // Actualizar contador de saltos para usuarios gratuitos
      if (isFreeUser) {
        setSkipsRemaining(prev => {
          const newValue = prev > 0 ? prev - 1 : 0;
          console.log('Saltos restantes actualizados:', newValue);
          return newValue;
        });
      }
      
      // No es necesario manejar la reproducción aquí, el efecto se encargará
      // cuando cambie currentSong
    }
  };

  // Función para reproducir la canción anterior en la cola
  const playPrevious = () => {
    // Verificar si el usuario ha iniciado sesión
    if (status !== 'authenticated') {
      console.log('Por favor inicia sesión para reproducir canciones');
      window.location.href = '/auth/signin';
      return;
    }
    
    // Si no hay canciones en la cola, no hacer nada
    if (queue.length === 0) {
      console.log('No hay canciones en la cola');
      return;
    }

    // Si hay una canción actual y han pasado más de 3 segundos, reiniciarla
    if (currentTime > 3 && currentSong) {
      seek(0);
      return;
    }
    
    // Si no hay canción actual, reproducir la última de la cola
    if (queueIndex === -1 && queue.length > 0) {
      const lastSong = queue[queue.length - 1];
      setQueueIndex(queue.length - 1);
      setCurrentSong(lastSong);
      
      // Actualizar contador de saltos
      if (isFreeUser) {
        setSkipsRemaining(prev => prev - 1);
      }
      
      if (audioRef.current) {
        audioRef.current.src = lastSong.audioUrl || '';
        audioRef.current.play().catch(console.error);
      }
      return;
    }
    
    // Si hay una canción anterior
    if (queueIndex > 0) {
      // Verificar límite de saltos para usuarios gratuitos
      if (isFreeUser && skipsRemaining <= 0) {
        console.log('Límite de saltos alcanzado. Actualiza a premium para saltos ilimitados.');
        // Aquí podrías agregar una notificación al usuario
        return;
      }
      
      // Ir a la canción anterior
      const prevSong = queue[queueIndex - 1];
      setQueueIndex(queueIndex - 1);
      setCurrentSong(prevSong);
      
      // Actualizar contador de saltos
      if (isFreeUser) {
        setSkipsRemaining(prev => prev - 1);
      }
      
      if (audioRef.current) {
        audioRef.current.src = prevSong.audioUrl || '';
        audioRef.current.play().catch(console.error);
      }
    } 
    // Si está en modo repetir todo, ir a la última canción
    else if (loopMode === 'all') {
      // Verificar límite de saltos para usuarios gratuitos
      if (isFreeUser && skipsRemaining <= 0) {
        console.log('Límite de saltos alcanzado. Actualiza a premium para saltos ilimitados.');
        // Aquí podrías agregar una notificación al usuario
        return;
      }
      
      const lastSong = queue[queue.length - 1];
      setQueueIndex(queue.length - 1);
      setCurrentSong(lastSong);
      
      // Actualizar contador de saltos
      if (isFreeUser) {
        setSkipsRemaining(prev => prev - 1);
      }
      
      if (audioRef.current) {
        audioRef.current.src = lastSong.audioUrl || '';
        audioRef.current.play().catch(console.error);
      }
    } 
    // Si no hay canción anterior y no está en modo repetir, reiniciar la actual
    else if (currentSong) {
      seek(0);
    }
  };

  // Función para agregar canciones a la cola
  const addToQueue = useCallback((songs: Song | Song[]) => {
    const songsArray = Array.isArray(songs) ? songs : [songs];
    
    if (songsArray.length === 0) return;
    
    setQueue(prevQueue => {
      // Si la cola está vacía, simplemente agregamos las canciones
      if (prevQueue.length === 0) {
        return [...songsArray];
      }
      
      // Si ya hay canciones, las añadimos al final
      return [...prevQueue, ...songsArray];
    });
    
    // Si no hay canción actual, reproducir la primera de la lista
    if (!currentSong && songsArray.length > 0) {
      const songToPlay = songsArray[0];
      setCurrentSong(songToPlay);
      setQueueIndex(0);
      
      if (audioRef.current) {
        audioRef.current.src = songToPlay.audioUrl || '';
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentSong]);

  // Función para limpiar la cola
  const clearQueue = () => {
    setQueue([]);
    setQueueIndex(-1);
  };

  // Determinar si los controles de navegación deben estar deshabilitados
  // Solo para usuarios gratuitos que hayan alcanzado el límite de saltos
  const areNavigationControlsDisabled = isFreeUser && skipsRemaining <= 0 && queue.length > 0;

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
        toggleLoop,
        loopMode,
        queue,
        queueIndex,
        addToQueue,
        clearQueue,
        areNavigationControlsDisabled,
        isFreeUser,
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
