import React, { useState } from "react";
import { FaPlay } from 'react-icons/fa';

const Rightbar: React.FC = () => {
  const [imageError, setImageError] = useState(false);
  
  // Función para manejar el error de carga de imagen
  const handleImageError = () => {
    setImageError(true);
  };
  return (
    <aside className="max-w-[340px] w-full h-full min-h-0 bg-black/60 backdrop-blur-xl border-l border-neutral-700 shadow-2xl px-4 py-6 xl:flex hidden flex-col overflow-y-auto custom-scrollbar pt-1 md:pt-1.5">
      <div className="flex-1 min-h-0 flex flex-col">

      {/* Portada y datos principales */}
      <div className="mb-6">
        {imageError ? (
          <div className="w-full h-48 rounded-lg mb-4 shadow bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">NC</span>
          </div>
        ) : (
          <img 
            src="https://i.scdn.co/image/ab67616d0000b2730e2e7e5e5e5e5e5e5e5e5e5e" 
            alt="Artista" 
            className="w-full max-h-48 object-cover rounded-lg mb-4 shadow" 
            onError={handleImageError}
          />
        )}
        <h3 className="text-white text-lg font-bold leading-tight">El de La Codeína</h3>
        <p className="text-gray-400 text-sm mb-1">Natanael Cano</p>
        <button className="mt-1 px-4 py-1 bg-white text-black rounded-full font-bold hover:bg-neutral-200 text-sm">Seguir</button>
      </div>
      {/* Oyentes mensuales */}
      <div className="mb-6">
        <div className="text-gray-300 text-xs mb-1">21,282,648 oyentes mensuales</div>
      </div>
      {/* Acerca del artista */}
      <div className="mb-6">
        <div className="text-white font-semibold mb-2 text-base">Acerca del artista</div>
        <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?fit=crop&w=400&q=80" alt="Acerca" className="w-full max-h-28 object-cover rounded mb-2" />
        <p className="text-gray-400 text-xs mb-1">Charging singer and songwriter Natanael Cano is at the forefront of the 21st-century corridos...</p>
      </div>
      {/* Más de este artista */}
      <div className="mb-6">
        <h3 className="text-white font-semibold text-base mb-4">Más de este artista</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={`album-${item}`} className="group">
              <div className="relative mb-2">
                <div className="w-full aspect-square rounded-md shadow-lg overflow-hidden group-hover:shadow-2xl transition-all duration-300">
                  <img 
                    src={`https://i.scdn.co/image/ab67616d0000b2730e2e7e5e5e5e5e5e5e5e5e5e`}
                    alt={`Álbum ${item}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '';
                      e.currentTarget.className = 'w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center';
                      const fallback = document.createElement('div');
                      fallback.className = 'text-white text-2xl font-bold';
                      fallback.textContent = 'NC';
                      e.currentTarget.parentNode?.appendChild(fallback);
                    }}
                  />
                </div>
                <button 
                  className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105"
                  aria-label="Reproducir"
                >
                  <FaPlay className="text-black text-xs ml-0.5" />
                </button>
              </div>
              <h4 className="font-medium text-white text-sm truncate">Álbum {item}</h4>
              <p className="text-gray-400 text-xs truncate">Natanael Cano</p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </aside>
  );
};

export default Rightbar;
