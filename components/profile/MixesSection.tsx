'use client';

import { FiMusic } from 'react-icons/fi';
import { FaPlay, FaMicrophone } from 'react-icons/fa';
import { MixesSectionProps } from './types';

export default function MixesSection({ user }: MixesSectionProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Tus mezclas</h2>
          <p className="text-sm text-gray-400">Listas personalizadas según tus gustos</p>
        </div>
        <button className="text-sm text-gray-400 hover:text-white">Ver todo</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="group cursor-pointer">
            <div className="relative mb-4 bg-gradient-to-br from-purple-600/20 to-blue-500/20 rounded-lg aspect-square overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl">
                  {item % 2 === 0 ? (
                    <FiMusic className="text-purple-400" />
                  ) : (
                    <FaMicrophone className="text-blue-400" />
                  )}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <button className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center ml-auto transform hover:scale-105">
                  <FaPlay className="ml-1 text-black" />
                </button>
              </div>
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center">
                <span className="text-xs font-bold">{item}</span>
              </div>
            </div>
            <h3 className="font-medium text-white truncate">Mezcla semanal #{item}</h3>
            <p className="text-sm text-gray-400 truncate">Actualizada hoy</p>
          </div>
        ))}
      </div>
    </div>
  );
}
