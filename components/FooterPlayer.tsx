"use client";

import React, { memo, useCallback } from "react";
import { FaRegHeart, FaRandom, FaStepBackward, FaPlay, FaPause, FaStepForward, FaRedo, FaVolumeUp, FaListUl, FaDesktop, FaExpand, FaCompress } from "react-icons/fa";
import { useSession } from "next-auth/react";

interface FooterPlayerProps {
  showRightbar: boolean;
  setShowRightbar: (show: boolean) => void;
}

const FooterPlayer: React.FC<FooterPlayerProps> = memo(({ showRightbar, setShowRightbar }) => {
  const { status } = useSession({
    required: false,
  });
  
  // No mostrar el reproductor si el usuario no está autenticado
  if (status !== 'authenticated') {
    return null;
  }
  
  const toggleRightbar = useCallback((): void => {
    setShowRightbar(!showRightbar);
  }, [showRightbar, setShowRightbar]);
  
  return (
    <footer className="w-full bg-neutral-900/95 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between px-4 py-2 fixed bottom-0 left-0 z-40 backdrop-blur-md transition-all duration-300">
      {/* Info canción actual */}
      <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto md:min-w-[200px] max-w-full overflow-hidden">
        <img 
          src="https://i.scdn.co/image/ab67616d0000b2730e2e7e5e5e5e5e5e5e5e5e" 
          alt="cover" 
          className="w-12 h-12 md:w-14 md:h-14 rounded-md shadow flex-shrink-0" 
        />
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-white font-semibold text-sm hover:underline cursor-pointer truncate">El de la Codeína</span>
            <button className="hidden sm:block">
              <FaRegHeart className="text-gray-400 hover:text-green-500 text-base transition" />
            </button>
          </div>
          <span className="text-gray-400 text-xs hover:underline cursor-pointer truncate">Natanael Cano</span>
        </div>
      </div>
      
      {/* Controles de reproducción */}
      <div className="flex flex-col items-center gap-1 md:gap-2 w-full md:flex-1 max-w-2xl mt-2 md:mt-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="text-gray-400 hover:text-white text-base md:text-lg hidden sm:block">
            <FaRandom />
          </button>
          <button className="text-gray-400 hover:text-white text-lg md:text-xl">
            <FaStepBackward />
          </button>
          <button className="bg-white text-black rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xl md:text-2xl shadow hover:scale-105 transition">
            <FaPlay />
          </button>
          <button className="text-gray-400 hover:text-white text-lg md:text-xl">
            <FaStepForward />
          </button>
          <button className="text-gray-400 hover:text-white text-base md:text-lg hidden sm:block">
            <FaRedo />
          </button>
        </div>
        <div className="w-full flex items-center gap-2 max-w-md">
          <span className="text-xs text-gray-400 hidden sm:inline">0:19</span>
          <div className="h-1 bg-gray-700 rounded flex-1 relative">
            <div className="h-1 bg-green-500 rounded absolute left-0 top-0" style={{ width: '33%' }}></div>
          </div>
          <span className="text-xs text-gray-400 hidden sm:inline">2:08</span>
        </div>
      </div>
      
      {/* Volumen y otros íconos */}
      <div className="hidden md:flex items-center gap-3 min-w-[200px] justify-end">
        <button className="text-gray-400 hover:text-white"><FaListUl /></button>
        <button className="text-gray-400 hover:text-white"><FaDesktop /></button>
        <button className="text-gray-400 hover:text-white"><FaVolumeUp /></button>
        <input type="range" min="0" max="100" className="w-24 accent-green-500" />
        {status === 'authenticated' && (
          <button
            className="text-gray-400 hover:text-white"
            onClick={toggleRightbar}
            title={showRightbar ? 'Ocultar barra derecha' : 'Mostrar barra derecha'}
          >
            {showRightbar ? <FaCompress /> : <FaExpand />}
          </button>
        )}
      </div>
      
      {/* Mobile controls */}
      <div className="md:hidden flex items-center justify-between w-full mt-2 pt-2 border-t border-gray-800">
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white">
            <FaVolumeUp />
          </button>
          <input type="range" min="0" max="100" className="w-20 accent-green-500" />
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white">
            <FaListUl />
          </button>
          {status === 'authenticated' && (
            <button
              className="text-gray-400 hover:text-white"
              onClick={toggleRightbar}
              title={showRightbar ? 'Ocultar barra derecha' : 'Mostrar barra derecha'}
            >
              {showRightbar ? <FaCompress /> : <FaExpand />}
            </button>
          )}
        </div>
      </div>
    </footer>
  );
});

FooterPlayer.displayName = 'FooterPlayer';

export default FooterPlayer;
