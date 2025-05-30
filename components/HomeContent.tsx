"use client";
import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useSession } from 'next-auth/react';
import GuestHome from './GuestHome';

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

const gradientClasses = [
  'from-purple-600 to-blue-500',
  'from-amber-600 to-orange-500',
  'from-emerald-600 to-teal-500',
  'from-pink-600 to-rose-500',
  'from-blue-600 to-indigo-500',
  'from-green-600 to-emerald-500'
];

const HomeContent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { data: session, status } = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (status === 'unauthenticated') {
    // HOME PÚBLICO PARA INVITADOS
    return (
      <div className="w-full min-h-screen px-4 md:px-8 pt-6 pb-32 overflow-x-hidden bg-gradient-to-b from-neutral-900 to-black">
        <div className="flex flex-col gap-10">
          {/* Canciones del momento */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Canciones del momento</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[1,2,3,4,5].map((n) => (
                <div key={n} className="bg-neutral-800 rounded-lg p-4 flex flex-col items-center">
                  <img src={`/demo/song${n}.jpg`} alt="Canción" className="w-24 h-24 rounded shadow mb-2 object-cover" />
                  <span className="font-semibold text-white">Canción {n}</span>
                  <span className="text-xs text-gray-400">Artista {n}</span>
                </div>
              ))}
            </div>
          </section>
          {/* Artistas populares */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Artistas populares</h2>
            <div className="flex gap-4 overflow-x-auto">
              {[1,2,3,4,5,6,7].map((n) => (
                <div key={n} className="flex flex-col items-center min-w-[100px]">
                  <img src={`/demo/artist${n}.jpg`} alt="Artista" className="w-20 h-20 rounded-full object-cover mb-2" />
                  <span className="font-semibold text-white text-sm">Artista {n}</span>
                  <span className="text-xs text-gray-400">Artista</span>
                </div>
              ))}
            </div>
          </section>
          {/* Álbumes y sencillos populares */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Álbumes y sencillos populares</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map((n) => (
                <div key={n} className="bg-neutral-800 rounded-lg p-4 flex flex-col items-center">
                  <img src={`/demo/album${n}.jpg`} alt="Álbum" className="w-24 h-24 rounded shadow mb-2 object-cover" />
                  <span className="font-semibold text-white">Álbum {n}</span>
                  <span className="text-xs text-gray-400">Artista {n}</span>
                </div>
              ))}
            </div>
          </section>
          {/* Estaciones populares */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Estaciones populares</h2>
            <div className="flex gap-4 overflow-x-auto">
              {[1,2,3,4].map((n) => (
                <div key={n} className="flex flex-col items-center min-w-[120px]">
                  <img src={`/demo/station${n}.jpg`} alt="Estación" className="w-20 h-20 rounded object-cover mb-2" />
                  <span className="font-semibold text-white text-sm">Estación {n}</span>
                </div>
              ))}
            </div>
          </section>
          {/* Listas destacadas */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Listas destacadas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1,2,3].map((n) => (
                <div key={n} className="bg-neutral-800 rounded-lg p-4 flex flex-col items-center">
                  <img src={`/demo/playlist${n}.jpg`} alt="Playlist" className="w-20 h-20 rounded shadow mb-2 object-cover" />
                  <span className="font-semibold text-white">Playlist {n}</span>
                </div>
              ))}
            </div>
          </section>
          {/* Lo que más está sonando */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Lo que más está sonando</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map((n) => (
                <div key={n} className="bg-neutral-800 rounded-lg p-4 flex flex-col items-center">
                  <img src={`/demo/hot${n}.jpg`} alt="Hot" className="w-24 h-24 rounded shadow mb-2 object-cover" />
                  <span className="font-semibold text-white">Hit {n}</span>
                  <span className="text-xs text-gray-400">Artista {n}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // CONTENIDO PERSONALIZADO PARA USUARIO AUTENTICADO
  return (
    <div className="w-full min-h-screen px-6 pt-6 pb-32 overflow-x-hidden bg-gradient-to-b from-neutral-900 to-black">
      <div className="flex flex-col gap-8">
        {/* Navigation Tabs */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {tabs.map((tab, idx) => (
              <button
                key={tab}
                className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all ${
                  activeTab === idx
                    ? "bg-white text-black hover:bg-white"
                    : "bg-neutral-800/70 text-white hover:bg-neutral-700/70"
                }`}
                onClick={() => setActiveTab(idx)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        {/* Featured Playlists */}
        <section aria-labelledby="featured-playlists-heading" className="space-y-4">
          <h2 id="featured-playlists-heading" className="text-2xl font-bold text-white">Buenos días</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {featuredPlaylists.map((playlist) => (
              <Link 
                href={`/playlist/${playlist.title.toLowerCase().replace(/\s+/g, '-')}`} 
                key={playlist.title}
                className="group flex items-center bg-white/5 hover:bg-white/10 rounded p-4 transition-colors"
                aria-label={`Ir a la playlist ${playlist.title}`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${gradientClasses[0]} rounded shadow-lg flex-shrink-0`} />
                <div className="ml-4 flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{playlist.title}</h3>
                  <p className="text-sm text-gray-400">Playlist</p>
                </div>
                <button 
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  aria-label={playlist.liked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                >
                  <FaHeart className={`text-lg ${playlist.liked ? "text-green-500" : "text-gray-400 hover:text-white"}`} />
                </button>
              </Link>
            ))}
          </div>
        </section>

        {/* Your Mixes */}
        <section aria-labelledby="for-you-heading" className="space-y-4">
          <h2 id="for-you-heading" className="text-2xl font-bold text-white">Tus mezclas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {createdForYou.map((item, idx) => (
              <article 
                key={item.title}
                className="group bg-white/5 hover:bg-white/10 p-4 rounded-lg transition-all duration-300"
              >
                <Link 
                  href={`/playlist/${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block"
                  aria-label={`Reproducir ${item.title}`}
                >
                  <div className="relative mb-4">
                    <div className={`w-full aspect-square rounded-lg overflow-hidden ${gradientClasses[idx % gradientClasses.length]} flex items-center justify-center`}>
                      {item.img ? (
                        <Image 
                          src={item.img} 
                          alt={`Portada de ${item.title}`} 
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                          priority={idx < 6}
                        />
                      ) : (
                        <span className="text-white text-2xl font-bold">{item.title.charAt(0)}</span>
                      )}
                    </div>
                    <button 
                      className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      aria-label={`Reproducir ${item.title}`}
                    >
                      <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M6.3 2.84L16.8 10l-10.5 7.16V2.84z" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{item.desc}</p>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Top Mixes */}
        <section aria-labelledby="top-mixes-heading" className="space-y-4">
          <h2 id="top-mixes-heading" className="text-2xl font-bold text-white">Tus mezclas más escuchadas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {mixes.map((item, idx) => {
              const colors = [
                'from-purple-600 to-blue-500',
                'from-pink-600 to-rose-500',
                'from-emerald-600 to-teal-500',
                'from-amber-600 to-orange-500'
              ];
              const colorClass = colors[idx % colors.length];
              
              return (
                <article 
                  key={item.title}
                  className="group bg-white/5 hover:bg-white/10 p-4 rounded-lg transition-all duration-300"
                >
                  <Link 
                    href={`/mix/${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block"
                    aria-label={`Reproducir mix ${item.title}`}
                  >
                    <div className="relative mb-4">
                      <div className={`w-full aspect-square rounded-lg overflow-hidden ${colorClass} flex items-center justify-center`}>
                        {item.img ? (
                          <Image 
                            src={item.img} 
                            alt={`Portada de ${item.title}`} 
                            width={300} 
                            height={300} 
                            className="w-full h-full object-cover"
                            priority={idx < 6}
                          />
                        ) : (
                          <span className="text-white text-2xl font-bold">{item.title.charAt(0)}</span>
                        )}
                      </div>
                      <button 
                        className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        aria-label={`Reproducir ${item.title}`}
                      >
                        <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M6.3 2.84L16.8 10l-10.5 7.16V2.84z" />
                        </svg>
                      </button>
                    </div>
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400">Mezcla personalizada</p>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeContent;
