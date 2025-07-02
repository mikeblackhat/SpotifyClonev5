'use client';

import React, { useState, useEffect } from "react";
import { FaTimes } from 'react-icons/fa';
import { usePlayer } from "@/contexts/PlayerContext";
import { motion, AnimatePresence } from "framer-motion";

interface RightbarProps {
  showRightbar?: boolean;
  onClose?: () => void;
}

const Rightbar: React.FC<RightbarProps> = ({ showRightbar = true, onClose }) => {
  const [imageError, setImageError] = useState(false);
  // Obtener el estado del reproductor
  const { currentSong } = usePlayer();
  
  // Función para manejar el error de carga de imagen
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Si no hay canción actual, no mostrar el rightbar
  if (!currentSong || !showRightbar) return null;
  
  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar p-6">
      <div className="flex-1 min-h-0 flex flex-col">

      {/* Botón de cierre */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Cerrar panel derecho"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>
      
      {/* Portada y datos principales */}
      <div className="mb-6">
        {imageError || !currentSong.imageUrl ? (
          <div className="w-full h-48 rounded-lg mb-4 shadow bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {currentSong.artist ? currentSong.artist.charAt(0).toUpperCase() : 'M'}
            </span>
          </div>
        ) : (
          <div className="relative group">
            <img 
              src={currentSong.imageUrl} 
              alt={currentSong.artist || 'Artista'} 
              className="w-full max-h-48 object-cover rounded-lg mb-4 shadow" 
              onError={handleImageError}
            />
            <button 
              onClick={onClose}
              className="absolute bottom-6 right-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105"
            >
              <FaTimes className="text-black" />
            </button>
          </div>
        )}
        <h3 className="text-white text-lg font-bold leading-tight">{currentSong.title || 'Sin título'}</h3>
        <p className="text-gray-400 text-sm mb-1">{currentSong.artist || 'Artista desconocido'}</p>
        <button className="mt-1 px-4 py-1 bg-white text-black rounded-full font-bold hover:bg-neutral-200 text-sm">
          {currentSong.artist ? `Seguir a ${currentSong.artist.split(' ')[0]}` : 'Seguir'}
        </button>
      </div>
      {/* Información adicional del artista */}
      <div className="mb-6">
        <div className="text-gray-300 text-xs mb-1">
          {currentSong.album ? `Álbum: ${currentSong.album}` : 'Música'}
        </div>
        {currentSong.playCount && (
          <div className="text-gray-400 text-xs">
            Reproducciones: {currentSong.playCount.toLocaleString()}
          </div>
        )}
      </div>
      {/* Acerca del artista */}
      <div className="mb-6">
        <div className="text-white font-semibold mb-2 text-base">Acerca del artista</div>
        <div className="bg-neutral-800/50 p-3 rounded-lg">
          <p className="text-gray-400 text-sm">
            {currentSong.artist || 'Este artista'} es parte de tu biblioteca musical. 
            {currentSong.album ? ` Su álbum más reciente es "${currentSong.album}".` : ''}
          </p>
        </div>
      </div>
      {/* Álbumes populares */}
      <div className="mb-6">
        <h3 className="text-white font-semibold text-base mb-4">Álbumes populares</h3>
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <div key={`album-${item}`} className="flex items-center group p-2 rounded hover:bg-neutral-800/50 transition-colors">
              <div className="relative w-12 h-12 flex-shrink-0">
                {currentSong.imageUrl ? (
                  <img 
                    src={currentSong.imageUrl}
                    alt={`Álbum ${item}`}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {currentSong.artist ? currentSong.artist.charAt(0).toUpperCase() : 'A'}
                    </span>
                  </div>
                )}

              </div>
              <div className="ml-3 flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm truncate">
                  {currentSong.album || 'Álbum sin título'}
                </h4>
                <p className="text-gray-400 text-xs">
                  {currentSong.artist || 'Artista desconocido'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Rightbar;
