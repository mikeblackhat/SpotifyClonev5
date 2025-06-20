"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BiSearch, BiHeart, BiDotsHorizontalRounded } from 'react-icons/bi';
import { FaPlay, FaHeart as FaHeartSolid } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import CollectionHeader from '@/components/collection/CollectionHeader';

// Datos de prueba para álbumes
const mockAlbums = [
  {
    id: 1,
    title: 'Un Verano Sin Ti',
    artist: 'Bad Bunny',
    year: 2022,
    image: '/images/albums/un-verano-sin-ti.jpg',
    duration: '1h 21m',
    songs: 23,
    isLiked: true,
    type: 'Álbum'
  },
  {
    id: 2,
    title: 'Midnights',
    artist: 'Taylor Swift',
    year: 2022,
    image: '/images/albums/midnights.jpg',
    duration: '44m',
    songs: 13,
    isLiked: true,
    type: 'Álbum'
  },
  {
    id: 3,
    title: 'After Hours',
    artist: 'The Weeknd',
    year: 2020,
    image: '/images/albums/after-hours.jpg',
    duration: '56m',
    songs: 14,
    isLiked: false,
    type: 'Álbum'
  },
  {
    id: 4,
    title: 'Future Nostalgia',
    artist: 'Dua Lipa',
    year: 2020,
    image: '/images/albums/future-nostalgia.jpg',
    duration: '37m',
    songs: 11,
    isLiked: true,
    type: 'Álbum'
  },
  {
    id: 5,
    title: 'Map of the Soul: 7',
    artist: 'BTS',
    year: 2020,
    image: '/images/albums/mots7.jpg',
    duration: '1h 14m',
    songs: 20,
    isLiked: false,
    type: 'Álbum'
  },
];

type ViewMode = 'grid' | 'list';

interface Album {
  id: number;
  title: string;
  artist: string;
  year: number;
  image: string;
  duration: string;
  songs: number;
  isLiked: boolean;
  type: string;
}

export default function AlbumsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [albums, setAlbums] = useState<Album[]>(mockAlbums);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleLike = (id: number) => {
    setAlbums(albums.map(album => 
      album.id === id ? { ...album, isLiked: !album.isLiked } : album
    ));
  };

  if (viewMode === 'list') {
    return (
      <div className="p-4 md:p-6 lg:p-8 text-white">
        <CollectionHeader
          title="Álbumes"
          searchPlaceholder="Buscar en álbumes"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showViewToggle={true}
        />

        {/* Lista de álbumes */}
        <div className="mb-4">
          <div className="grid grid-cols-12 gap-4 text-gray-400 text-sm font-medium border-b border-white/10 pb-2 mb-2 px-4">
            <div className="col-span-6 md:col-span-5">TÍTULO</div>
            <div className="col-span-3 hidden md:block">ARTISTA</div>
            <div className="col-span-2 hidden sm:block">AÑO</div>
            <div className="col-span-6 md:col-span-2 text-right">DURACIÓN</div>
          </div>
          
          {filteredAlbums.map((album, index) => (
            <motion.div 
              key={album.id}
              className="grid grid-cols-12 gap-4 items-center py-2 px-2 md:px-4 rounded-md hover:bg-white/10 group cursor-pointer"
              whileHover={{ scale: 1.002 }}
            >
              <div className="col-span-1 text-gray-400 text-center">{index + 1}</div>
              <div className="col-span-5 flex items-center">
                <div className="w-10 h-10 bg-white/10 rounded overflow-hidden mr-3 flex-shrink-0">
                  <img src={album.image} alt={album.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-medium text-white line-clamp-1">{album.title}</div>
                  <div className="text-sm text-gray-400 md:hidden">{album.artist}</div>
                </div>
              </div>
              <div className="col-span-3 hidden md:block">{album.artist}</div>
              <div className="col-span-2 hidden sm:block">{album.year}</div>
              <div className="col-span-3 md:col-span-1 flex items-center justify-end gap-3">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(album.id);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  {album.isLiked ? <FaHeartSolid className="text-green-500" /> : <BiHeart />}
                </button>
                <span className="text-sm text-gray-400">{album.duration}</span>
                <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                  <BiDotsHorizontalRounded className="text-xl" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Vista de cuadrícula (por defecto)
  return (
    <div className="p-4 md:p-6 lg:p-8 text-white">
      <CollectionHeader
        title="Álbumes"
        searchPlaceholder="Buscar en álbumes"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {filteredAlbums.map((album) => (
          <motion.div 
            key={album.id}
            className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative mb-4">
              <div className="aspect-square bg-white/10 rounded-md overflow-hidden mb-2">
                <img 
                  src={album.image} 
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:scale-110">
                <FaPlay className="text-black ml-0.5 text-xs" />
              </button>
            </div>
            <h3 className="font-medium truncate">{album.title}</h3>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400 truncate">{album.artist} • {album.year}</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(album.id);
                }}
                className="text-gray-400 hover:text-white p-1"
              >
                {album.isLiked ? <FaHeartSolid className="text-green-500" /> : <BiHeart />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
