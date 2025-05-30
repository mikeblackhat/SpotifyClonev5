import React from "react";

const Rightbar: React.FC = () => {
  return (
    <aside className="max-w-[340px] w-full h-full min-h-0 bg-black/60 backdrop-blur-xl border-l border-neutral-700 shadow-2xl px-4 py-6 xl:flex hidden flex-col overflow-y-auto custom-scrollbar pt-1 md:pt-1.5">
      <div className="flex-1 min-h-0 flex flex-col">

      {/* Portada y datos principales */}
      <div className="mb-6">
        <img src="https://i.scdn.co/image/ab67616d0000b2730e2e7e5e5e5e5e5e5e5e5e5e" alt="Artista" className="w-full max-h-48 object-cover rounded-lg mb-4 shadow" />
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
      <div className="mb-2">
        <div className="text-white font-semibold mb-2 text-base">Más de este artista</div>
        <div className="flex gap-3">
          <img src="https://i.scdn.co/image/ab67616d0000b2730e2e7e5e5e5e5e5e5e5e5e5e" alt="Album1" className="w-16 h-16 max-w-full max-h-16 rounded object-cover" />
          <img src="https://i.scdn.co/image/ab67616d0000b2730e2e7e5e5e5e5e5e5e5e5e5e" alt="Album2" className="w-16 h-16 max-w-full max-h-16 rounded object-cover" />
          <img src="https://i.scdn.co/image/ab67616d0000b2730e2e7e5e5e5e5e5e5e5e5e5e" alt="Album3" className="w-16 h-16 max-w-full max-h-16 rounded object-cover" />
        </div>
      </div>
      </div>
    </aside>
  );
};

export default Rightbar;
