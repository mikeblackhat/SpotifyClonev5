"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";

const tabs = ["Todo", "Música", "Podcasts"];

const featuredPlaylists = [
  { title: "Corridos Tumbados🔥", liked: true },
  { title: "Selección Natural", liked: false },
  { title: "Tus me gusta", liked: true },
  { title: "Mix diario 2", liked: false },
  { title: "FIRE OG🔥", liked: false },
  { title: "Duki Mix", liked: false },
];

const createdForYou = [
  { title: "Descubrimiento Semanal", img: "/cover1.jpg", desc: "Tu mix semanal de música nueva…" },
  { title: "Mix diario 1", img: "/cover2.jpg", desc: "Duki, Bizarrap, DC, Reyes y más" },
  { title: "Mix diario 3", img: "/cover3.jpg", desc: "Cráneo, Soukin, Gloosito y más" },
  { title: "Mix diario 4", img: "/cover4.jpg", desc: "Natanael Cano, Xavi, Izaak G y más" },
  { title: "Mix diario 5", img: "/cover5.jpg", desc: "Gold Kid, Golden Ganga, Gonzalo Genek y más" },
  { title: "Mix diario 6", img: "/cover6.jpg", desc: "Rels B, DJ Pimp, Tangana y más" },
];

const mixes = [
  { title: "Mix 1", img: "/cover7.jpg" },
  { title: "Mix 2", img: "/cover8.jpg" },
  { title: "Mix 3", img: "/cover9.jpg" },
  { title: "Mix 4", img: "/cover10.jpg" },
];

const HomeContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full min-h-screen px-8 pt-8 pb-32 overflow-x-hidden">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all ${
              activeTab === idx
                ? "bg-neutral-800 text-white shadow"
                : "bg-neutral-900 text-gray-400 hover:bg-neutral-800 hover:text-white"
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Featured playlists row */}
      <motion.div className="flex flex-wrap gap-2 mb-8 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {featuredPlaylists.map((pl, idx) => (
          <div
            key={pl.title}
            className="w-full sm:w-[220px] flex items-center bg-neutral-800 rounded-lg px-4 py-2 gap-2 shadow hover:bg-neutral-700 transition-colors"
          >
            <span className="font-semibold text-white truncate flex-1 max-w-full overflow-hidden text-ellipsis">{pl.title}</span>
            <button>
              <FaHeart className={`text-lg ${pl.liked ? "text-pink-500" : "text-gray-400"}`} />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Creado para ti */}
      <h2 className="text-2xl font-bold text-white mb-4">Creado para ti</h2>
      <motion.div className="flex gap-6 flex-wrap mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        {createdForYou.map((item, idx) => (
          <div
            key={item.title}
            className="flex-shrink-0 w-48 bg-neutral-900 rounded-lg p-4 hover:bg-neutral-800 transition-colors shadow"
          >
            <div className="w-full h-44 bg-neutral-700 rounded mb-3 overflow-hidden">
              <img src={item.img} alt={item.title} className="object-cover w-full h-full" />
            </div>
            <div className="font-semibold text-white mb-1 truncate">{item.title}</div>
            <div className="text-xs text-gray-400 truncate max-w-full overflow-hidden text-ellipsis break-words">{item.desc}</div>
          </div>
        ))}
      </motion.div>

      {/* Tus mixes más escuchados */}
      <h2 className="text-2xl font-bold text-white mb-4">Tus mixes más escuchados</h2>
      <motion.div className="flex gap-6 flex-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {mixes.map((item, idx) => (
          <div
            key={item.title}
            className="flex-shrink-0 w-48 bg-neutral-900 rounded-lg p-4 hover:bg-neutral-800 transition-colors shadow"
          >
            <div className="w-full h-44 bg-neutral-700 rounded mb-3 overflow-hidden">
              <img src={item.img} alt={item.title} className="object-cover w-full h-full" />
            </div>
            <div className="font-semibold text-white mb-1 truncate max-w-full overflow-hidden text-ellipsis break-words">{item.title}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default HomeContent;
