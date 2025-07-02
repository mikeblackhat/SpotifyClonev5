'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaVolumeDown, FaRedo } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { usePlayer } from '@/contexts/PlayerContext';

// Función para formatear el tiempo (MM:SS)
const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
    return '0:00';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const PlayerBar: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    duration,
    currentTime,
    togglePlayPause,
    setVolume,
    seek,
    playNext,
    playPrevious,
    toggleLoop,
    loopMode,
    queue,
    queueIndex,
    areNavigationControlsDisabled,
    isFreeUser: isFreeUserProp
  } = usePlayer();
  
  // Verificar si hay una canción actual
  const hasSong = !!currentSong;
  
  // Determinar si los botones de navegación deben estar habilitados
  // El botón de siguiente está habilitado si hay canciones en la cola
  const isFreeUser = isFreeUserProp || false;
  
  const hasNext = queue.length > 0 && queueIndex < queue.length - 1;
  
  // El botón de anterior está habilitado si hay una canción actual y 
  // (hay una canción anterior o el modo bucle está activado)
  const hasPrevious = hasSong && (queueIndex > 0 || loopMode === 'all');
  
  console.log('PlayerBar estado:', { 
    currentSong: currentSong?.title, 
    queueIndex, 
    queueLength: queue.length,
    hasNext,
    hasPrevious,
    areNavigationControlsDisabled 
  });

  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);

  // Actualizar el progreso cuando cambia el tiempo actual o la duración
  useEffect(() => {
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    } else {
      setProgress(0);
    }
  }, [currentTime, duration]);

  // Manejar cambios en la barra de progreso
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * duration;
    seek(newTime);
  };

  // Alternar silencio
  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(previousVolume);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
    }
    setIsMuted(!isMuted);
  }, [isMuted, previousVolume, setVolume, volume]);

  // Manejar cambios de volumen
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    setPreviousVolume(newVolume);
  };

  // No mostrar el reproductor si no hay canción actual
  if (!currentSong) {
    return null;
  }

  const displaySong = currentSong;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-sm border-t border-gray-800/50 p-2 sm:p-3 z-40 sm:z-50">
      <div className="container mx-auto max-w-screen-2xl px-4">
        {/* Vista móvil */}
        <div className="flex flex-col sm:hidden pb-16">
          {/* Contenido principal */}
          <div className="flex items-center justify-between w-full mb-2">
            {/* Información de la canción */}
            <div className="flex items-center flex-1 min-w-0">
              <div className="h-12 w-12 bg-gray-800 rounded overflow-hidden mr-4 flex-shrink-0">
                {displaySong.imageUrl ? (
                  <img 
                    src={displaySong.imageUrl} 
                    alt={displaySong.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs">
                      {displaySong.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-white font-medium text-sm truncate">
                  {displaySong.title}
                </h4>
                <p className="text-gray-400 text-xs truncate">
                  {displaySong.artist}
                </p>
              </div>
            </div>
            
            {/* Botón de play/pause */}
            <button 
              onClick={togglePlayPause}
              className="ml-2 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:scale-105 transform transition-transform flex-shrink-0"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
            </button>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full">
            <div 
              className="w-full h-1.5 bg-gray-700 rounded-full cursor-pointer group relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPosition = e.clientX - rect.left;
                const percentage = (clickPosition / rect.width) * 100;
                const newTime = (percentage / 100) * duration;
                seek(newTime);
              }}
            >
              <div 
                className="h-full bg-gray-500 rounded-full absolute top-0 left-0 right-0"
              />
              <div 
                className="h-full bg-green-500 rounded-full relative group-hover:bg-green-400 transition-colors"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Vista de escritorio */}
        <div className="hidden sm:flex items-center justify-between w-full">
          {/* Información de la canción */}
          <div className="flex items-center w-1/4 min-w-0">
            <button 
              onClick={() => {
                // Mostrar el RightBar con la información de la canción
                document.dispatchEvent(new CustomEvent('toggleRightbar', { detail: true }));
              }}
              className="relative group flex items-center"
            >
              <div className="h-14 w-14 flex-shrink-0 bg-gray-700 rounded overflow-hidden mr-4">
                {currentSong.imageUrl ? (
                  <img 
                    src={currentSong.imageUrl} 
                    alt={currentSong.title} 
                    className="h-full w-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs">
                      {currentSong.title?.charAt(0).toUpperCase() || 'M'}
                    </span>
                  </div>
                )}
              </div>
            </button>
            <div className="overflow-hidden">
              <h4 className="text-white font-medium text-sm truncate">
                {displaySong.title}
              </h4>
              <p className="text-gray-400 text-xs truncate">
                {displaySong.artist}
              </p>
            </div>
            <button className="ml-4 text-gray-400 hover:text-white">
              <BsThreeDots size={20} />
            </button>
          </div>

          {/* Controles de reproducción */}
          <div className="flex flex-col items-center flex-1 max-w-2xl">
            <div className="flex items-center justify-center space-x-4 mb-1 w-full">
              <button 
                onClick={playPrevious}
                disabled={areNavigationControlsDisabled}
                className={`${areNavigationControlsDisabled ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-white'} transition-colors`}
                aria-label="Canción anterior"
                title={areNavigationControlsDisabled ? 'Actualiza a premium para saltos ilimitados' : 'Canción anterior'}
              >
                <FaStepBackward />
              </button>
              
              <button 
                onClick={togglePlayPause}
                className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center hover:scale-105 transform transition-transform"
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} className="ml-0.5" />}
              </button>
              
              <button 
                onClick={() => {
                  console.log('Botón siguiente clickeado');
                  playNext();
                }}
                disabled={!hasNext || (isFreeUser && areNavigationControlsDisabled)}
                className={`${!hasNext || (isFreeUser && areNavigationControlsDisabled) 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-300 hover:text-white'} transition-colors`}
                aria-label="Siguiente canción"
                title={isFreeUser && areNavigationControlsDisabled 
                  ? 'Límite de saltos alcanzado. Actualiza a premium para saltos ilimitados.' 
                  : !hasNext 
                    ? 'No hay más canciones en la cola' 
                    : 'Siguiente canción'}
              >
                <FaStepForward />
              </button>
              
              {/* Botón de repetición */}
              <button
                onClick={toggleLoop}
                className={`transition-colors relative ${
                  loopMode === 'none' ? 'text-gray-500 hover:text-white' : 
                  loopMode === 'one' ? 'text-green-500' : 'text-green-500'
                }`}
                aria-label={`Modo de repetición: ${loopMode}`}
                title={`Modo de repetición: ${
                  loopMode === 'none' ? 'Desactivado' : 
                  loopMode === 'one' ? 'Repetir una canción' : 'Repetir toda la cola'
                }`}
              >
                <FaRedo className={loopMode === 'one' ? 'text-green-500' : ''} />
                {loopMode === 'one' && <span className="absolute -top-1 -right-1 text-[8px] text-white bg-green-500 rounded-full w-3 h-3 flex items-center justify-center">1</span>}
              </button>
            </div>
            
            <div className="w-full flex items-center space-x-2 group">
              <span className="text-xs text-gray-400 w-10 text-right tabular-nums">
                {formatTime(currentTime)}
              </span>
              
              <div 
                className="flex-1 h-1 group-hover:h-1.5 transition-all duration-200"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickPosition = e.clientX - rect.left;
                  const percentage = (clickPosition / rect.width) * 100;
                  const newTime = (percentage / 100) * duration;
                  seek(newTime);
                }}
              >
                <div className="relative w-full h-full">
                  <div className="absolute top-0 left-0 right-0 h-full bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-600 group-hover:bg-gray-500 transition-colors"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div 
                    className="absolute top-0 left-0 h-full bg-green-500 group-hover:bg-green-400 transition-colors rounded-full"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
              
              <span className="text-xs text-gray-400 w-10 tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Controles de volumen */}
          <div className="flex items-center space-x-2 w-1/4 justify-end">
            <button 
              onClick={toggleMute}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            
            <div className="w-20 sm:w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-full appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${(isMuted ? 0 : volume) * 100}%, #4D4D4D ${(isMuted ? 0 : volume) * 100}%, #4D4D4D 100%)`,
                }}
                aria-label="Volumen"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
