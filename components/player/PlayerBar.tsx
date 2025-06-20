import React, { useState, useEffect, useCallback } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
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
  } = usePlayer();

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

  // Mostrar el reproductor incluso si no hay canción actual
  const displaySong = currentSong || {
    id: 'default',
    title: 'No hay canción seleccionada',
    artist: 'Selecciona una canción para reproducir',
    duration: 0,
    playCount: 0
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-sm border-t border-gray-800/50 p-2 sm:p-3 z-40 sm:z-50">
      <div className="container mx-auto">
        {/* Vista móvil */}
        <div className="flex flex-col sm:hidden pb-16">
          {/* Contenido principal */}
          <div className="flex items-center justify-between w-full mb-2">
            {/* Información de la canción */}
            <div className="flex items-center flex-1 min-w-0">
              <div className="h-12 w-12 bg-gray-800 rounded overflow-hidden mr-3 flex-shrink-0">
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
          <div 
            className="w-full h-1.5 bg-gray-700 rounded-full cursor-pointer" 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              seek(pos * duration);
            }}
          >
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Vista de escritorio */}
        <div className="hidden sm:flex items-center">
          {/* Información de la canción */}
          <div className="flex items-center w-1/4">
            <div className="h-14 w-14 bg-gray-800 rounded-md overflow-hidden mr-3 flex-shrink-0">
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
            <button className="ml-4 text-gray-400 hover:text-white">
              <BsThreeDots size={20} />
            </button>
          </div>

          {/* Controles de reproducción */}
          <div className="flex flex-col items-center w-2/4">
            <div className="flex items-center space-x-4 mb-2">
              <button 
                onClick={playPrevious}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Canción anterior"
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
                onClick={playNext}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Siguiente canción"
              >
                <FaStepForward />
              </button>
            </div>
            
            <div className="w-full flex items-center space-x-2">
              <span className="text-xs text-gray-400 w-10 text-right">
                {formatTime(currentTime)}
              </span>
              
              <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress || 0}
                  onChange={handleProgressChange}
                  className="w-full h-full appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:hover:opacity-100 [&::-webkit-slider-thumb]:transition-opacity"
                  style={{
                    background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${progress}%, #4D4D4D ${progress}%, #4D4D4D 100%)`,
                  }}
                />
              </div>
              
              <span className="text-xs text-gray-400 w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Controles de volumen */}
          <div className="hidden sm:flex items-center justify-end w-1/4 space-x-2">
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
