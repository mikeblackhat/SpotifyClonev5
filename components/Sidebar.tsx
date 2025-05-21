import { usePathname } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
import { BiExpandAlt, BiSolidAlbum, BiSolidPlaylist } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { RiCompass3Line } from "react-icons/ri";

const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const playlists = [
        { id: 1, name: "Discover Weekly" },
        { id: 2, name: "Release Radar" },
        { id: 3, name: "Liked Songs" },
        { id: 4, name: "Daily Mix 1" },
        { id: 5, name: "Your Top Songs 2024" },
    ];

    return (
        <motion.div
            className="flex h-full bg-black text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <aside className="hidden md:flex flex-col max-w-[320px] w-[320px] bg-black/70 backdrop-blur-md border-r border-neutral-800 select-none overflow-hidden flex-1 pt-1 md:pt-1.5">

                {/* Tu biblioteca + tabs */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
  <span className="text-2xl font-bold text-white">Tu biblioteca</span>
  <div className="flex items-center gap-2">
    <button className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-neutral-800/0 hover:bg-neutral-800/70 transition-colors text-2xl">
      +
    </button>
    <button className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-neutral-800/0 hover:bg-neutral-800/70 transition-colors text-xl">
      <BiExpandAlt />
    </button>
  </div>
</div>
                {/* Tabs biblioteca */}
                <div className="flex gap-2 px-4 mb-2">
                  <button className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-white">Playlists</button>
                  <button className="px-3 py-1 rounded-full text-xs font-semibold text-gray-400 hover:bg-neutral-800 hover:text-white transition">Artistas</button>
                  <button className="px-3 py-1 rounded-full text-xs font-semibold text-gray-400 hover:bg-neutral-800 hover:text-white transition">Álbumes</button>
                </div>
                {/* Filtros biblioteca */}
                <div className="flex items-center justify-between px-4 mb-1">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="font-semibold cursor-pointer hover:text-white transition">Recientes</span>
                    <IoMdArrowDropdown className="text-lg" />
                  </div>
                  <button className="text-gray-400 hover:text-white p-1 rounded transition"><RiCompass3Line /></button>
                </div>
                {/* Lista biblioteca (mock) */}
                <motion.ul
                  className="flex-1 min-h-0 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  {/* Ejemplo de ítems de biblioteca */}
                  <li className="flex items-center gap-3 px-2 py-1.5 rounded-md bg-neutral-800 text-green-500 font-bold cursor-pointer">
                    <FaHeart className="text-lg" />
                    <div className="flex flex-col">
                      <span className="text-base">Tus me gusta</span>
                      <span className="text-xs text-gray-400 font-normal">Playlist • 411 canciones</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-neutral-800 cursor-pointer">
                    <BiSolidPlaylist className="text-lg text-blue-400" />
                    <div className="flex flex-col">
                      <span className="text-base text-white">Corridos Tumbados <span className="">🔥</span></span>
                      <span className="text-xs text-gray-400 font-normal">Playlist • Top Music</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-neutral-800 cursor-pointer">
                    <BiSolidAlbum className="text-lg text-purple-400" />
                    <div className="flex flex-col">
                      <span className="text-base text-white">Selección Natural</span>
                      <span className="text-xs text-gray-400 font-normal">Álbum • Granuja</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-neutral-800 cursor-pointer">
                    <BiSolidPlaylist className="text-lg text-yellow-400" />
                    <div className="flex flex-col">
                      <span className="text-base text-white">Mix diario 2</span>
                      <span className="text-xs text-gray-400 font-normal">Playlist • Spotify</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-neutral-800 cursor-pointer">
                    <BiSolidPlaylist className="text-lg text-red-400" />
                    <div className="flex flex-col">
                      <span className="text-base text-white">FIRE OG <span>🔥</span></span>
                      <span className="text-xs text-gray-400 font-normal">Playlist • Gold Kid</span>
                    </div>
                  </li>
                  {/* ...agrega más ítems si lo deseas... */}
                </motion.ul>
            </aside>

        </motion.div>
    );
}
export default Sidebar;
