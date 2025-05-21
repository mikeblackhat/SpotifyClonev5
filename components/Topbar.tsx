import React, { useState, useRef, useEffect } from "react";

import { FiSearch, FiBell } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import { GrInstallOption } from "react-icons/gr";
import { BsSpotify } from "react-icons/bs";
import { MdDarkMode } from "react-icons/md";
import { FiHelpCircle, FiSettings } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

const UserMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="w-9 h-9 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base cursor-pointer focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir menú de usuario"
      >
        M
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg py-2 z-50 animate-fade-in flex flex-col">
          <button className="flex items-center gap-2 text-left px-4 py-2 text-gray-200 hover:bg-neutral-800 hover:text-white transition">
            <span className="text-lg"><FiBell /></span>
            Perfil
          </button>
          <button className="flex items-center gap-2 text-left px-4 py-2 text-gray-200 hover:bg-neutral-800 hover:text-white transition">
            <span className="text-lg"><MdDarkMode /></span>
            Cambiar tema
          </button>
          <button className="flex items-center gap-2 text-left px-4 py-2 text-gray-200 hover:bg-neutral-800 hover:text-white transition">
            <span className="text-lg"><FiHelpCircle /></span>
            Ayuda
          </button>
          <button className="flex items-center gap-2 text-left px-4 py-2 text-gray-200 hover:bg-neutral-800 hover:text-white transition">
            <span className="text-lg"><FiSettings /></span>
            Configuración
          </button>
          <button className="flex items-center gap-2 text-left px-4 py-2 text-red-400 hover:bg-neutral-800 hover:text-red-500 transition">
            <span className="text-lg"><IoMdClose /></span>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

const Topbar: React.FC = () => {
  return (
    <header className="w-full h-16 px-6 flex items-center justify-between bg-gradient-to-b from-neutral-950/90 to-transparent sticky top-0 z-30 backdrop-blur-md relative">
      {/* Logo Spotify */}
      <div className="flex items-center min-w-12">
        <BsSpotify className="text-white text-2xl" />
      </div>
      {/* Buscador centrado */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg flex items-center gap-3">
        <button className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 transition">
          <IoHomeOutline size={22} className="text-white" />
        </button>
        <div className="flex items-center bg-neutral-900 rounded-full px-3 py-2 md:py-3 flex-1 min-w-0">
          <span className="mr-2 text-gray-400">
            <FiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="¿Qué quieres reproducir?"
            className="bg-transparent outline-none text-white placeholder-gray-400 flex-1 text-sm min-w-0"
          />
        </div>
      </div>
      {/* Botones y perfil */}
      <div className="flex items-center gap-2 relative">
        <button className="bg-white text-black px-4 py-1.5 rounded-full font-bold text-xs hover:bg-neutral-200 transition">Explorar Premium</button>
        <button className="bg-neutral-800 text-white px-4 py-1.5 rounded-full font-semibold text-xs hover:bg-neutral-700 transition flex items-center gap-2">
          <GrInstallOption className="text-base" />
          Instalar aplicación
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-800 transition">
          <FiBell className="text-lg text-gray-300" />
        </button>
        {/* Avatar y menú usuario */}
        <UserMenu />
      </div>
    </header>
  );
};

export default Topbar;
