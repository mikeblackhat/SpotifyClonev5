import React from "react";
import { FaRegHeart, FaRandom, FaStepBackward, FaPlay, FaPause, FaStepForward, FaRedo, FaVolumeUp, FaListUl, FaDesktop, FaExpand, FaCompress } from "react-icons/fa";

interface FooterPlayerProps {
  showRightbar: boolean;
  setShowRightbar: (show: boolean) => void;
}

const FooterPlayer: React.FC<FooterPlayerProps> = ({ showRightbar, setShowRightbar }) => {
  return (
    <footer className="w-full h-24 bg-neutral-900/95 border-t border-neutral-800 flex items-center justify-between px-6 fixed bottom-0 left-0 z-40 backdrop-blur-md">
      {/* Info canción actual */}
      <div className="flex items-center gap-4 min-w-[240px]">
        <img src="https://i.scdn.co/image/ab67616d0000b2730e2e7e5e5e5e5e5e5e5e5e" alt="cover" className="w-14 h-14 rounded-md shadow" />
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm hover:underline cursor-pointer">El de la Codeína</span>
            <button><FaRegHeart className="text-gray-400 hover:text-green-500 text-base transition" /></button>
          </div>
          <span className="text-gray-400 text-xs hover:underline cursor-pointer">Natanael Cano</span>
        </div>
      </div>
      {/* Controles de reproducción */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white text-lg"><FaRandom /></button>
          <button className="text-gray-400 hover:text-white text-xl"><FaStepBackward /></button>
          <button className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow hover:scale-105 transition"><FaPlay /></button>
          <button className="text-gray-400 hover:text-white text-xl"><FaStepForward /></button>
          <button className="text-gray-400 hover:text-white text-lg"><FaRedo /></button>
        </div>
        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-gray-400">0:19</span>
          <div className="h-1 bg-gray-700 rounded w-full max-w-lg relative">
            <div className="h-1 bg-green-500 rounded absolute left-0 top-0" style={{ width: '33%' }}></div>
          </div>
          <span className="text-xs text-gray-400">2:08</span>
        </div>
      </div>
      {/* Volumen y otros íconos */}
      <div className="flex items-center gap-3 min-w-[240px] justify-end">
        <button className="text-gray-400 hover:text-white"><FaListUl /></button>
        <button className="text-gray-400 hover:text-white"><FaDesktop /></button>
        <button className="text-gray-400 hover:text-white"><FaVolumeUp /></button>
        <input type="range" min="0" max="100" className="w-24 accent-green-500" />
        <button
          className="text-gray-400 hover:text-white"
          onClick={() => setShowRightbar(!showRightbar)}
          title={showRightbar ? 'Ocultar barra derecha' : 'Mostrar barra derecha'}
        >
          {showRightbar ? <FaCompress /> : <FaExpand />}
        </button>
      </div>
    </footer>
  );
};

export default FooterPlayer;
