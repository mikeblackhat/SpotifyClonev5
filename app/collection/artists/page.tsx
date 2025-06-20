"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BiUserPlus } from 'react-icons/bi';
import { FaPlay } from 'react-icons/fa';
import CollectionHeader from '@/components/collection/CollectionHeader';

// Datos de prueba para artistas
const mockArtists = [
  {
    id: 1,
    name: 'Bad Bunny',
    followers: '45.2M',
    monthlyListeners: '82.4M',
    image: '/images/artists/bad-bunny.jpg',
    topTrack: 'Tití Me Preguntó',
    isFollowing: true
  },
  {
    id: 2,
    name: 'Taylor Swift',
    followers: '68.7M',
    monthlyListeners: '78.9M',
    image: '/images/artists/taylor-swift.jpg',
    topTrack: 'Anti-Hero',
    isFollowing: true
  },
  {
    id: 3,
    name: 'The Weeknd',
    followers: '52.1M',
    monthlyListeners: '74.3M',
    image: '/images/artists/the-weeknd.jpg',
    topTrack: 'Blinding Lights',
    isFollowing: false
  },
  {
    id: 4,
    name: 'Dua Lipa',
    followers: '38.6M',
    monthlyListeners: '65.2M',
    image: '/images/artists/dua-lipa.jpg',
    topTrack: 'Levitating',
    isFollowing: true
  },
  {
    id: 5,
    name: 'BTS',
    followers: '62.4M',
    monthlyListeners: '59.8M',
    image: '/images/artists/bts.jpg',
    topTrack: 'Dynamite',
    isFollowing: false
  },
];

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState(mockArtists);
  
  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFollow = (id: number) => {
    setArtists(artists.map(artist => 
      artist.id === id ? { ...artist, isFollowing: !artist.isFollowing } : artist
    ));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 text-white">


      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {filteredArtists.map((artist) => (
          <motion.div 
            key={artist.id}
            className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors group text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-blue-500 mb-3">
                <img 
                  src={artist.image} 
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:scale-110">
                <FaPlay className="text-black ml-0.5 text-xs" />
              </button>
            </div>
            <h3 className="font-medium truncate">{artist.name}</h3>
            <p className="text-sm text-gray-400 mb-3">{artist.monthlyListeners} oyentes mensuales</p>
            <div className="flex justify-center gap-2">
              <button 
                onClick={() => toggleFollow(artist.id)}
                className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1 ${
                  artist.isFollowing 
                    ? 'bg-white/10 text-white border border-white/20' 
                    : 'bg-white text-black font-medium'
                }`}
              >
                {artist.isFollowing ? 'Siguiendo' : 'Seguir'}
              </button>
              <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <BiUserPlus className="text-lg" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
