'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaSpinner, FaMusic } from 'react-icons/fa';

// Componente Skeleton para la carga
const GenreSkeleton = () => (
  <div className="aspect-square rounded-md overflow-hidden bg-neutral-800 animate-pulse">
    <div className="w-full h-full flex items-end p-4">
      <div className="h-6 w-3/4 bg-neutral-700 rounded"></div>
    </div>
  </div>
);

interface Genre {
  id: string;
  name: string;
  image?: string | null;
}

function GenresGrid() {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Colores para los géneros (usados como fallback cuando no hay imagen)
  const genreColors = [
    'from-pink-500 to-purple-600',
    'from-blue-500 to-cyan-400',
    'from-green-500 to-emerald-400',
    'from-yellow-500 to-amber-500',
    'from-red-500 to-pink-500',
    'from-indigo-500 to-purple-500',
    'from-cyan-500 to-blue-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
  ];

  const fetchAllGenres = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Usar cache: 'force-cache' para SSR/SSG o 'no-store' para datos siempre frescos
      const response = await fetch('/api/genres', {
        next: { revalidate: 3600 }, // Revalidar cada hora
        cache: 'force-cache'
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar los géneros');
      }
      
      const result = await response.json();
      
      if (!result.success || !Array.isArray(result.data?.genres)) {
        throw new Error('Formato de respuesta inválido');
      }
      
      // Simular un pequeño retraso para que se vea el skeleton (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      setGenres(result.data.genres);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al cargar los géneros:', error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenreClick = (genreId: string) => {
    router.push(`/genres/${genreId}`);
  };

  // Cargar géneros al montar el componente
  useEffect(() => {
    // Verificar si ya tenemos los géneros cargados
    if (genres.length === 0) {
      fetchAllGenres();
    }
  }, [fetchAllGenres, genres.length]);

  // Mostrar skeleton loading
  if (isLoading && genres.length === 0) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, index) => (
            <GenreSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error al cargar los géneros: {error}</p>
        <button
          onClick={fetchAllGenres}
          className="px-4 py-2 bg-spotify-green text-black rounded-full font-medium hover:bg-green-400 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (genres.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-neutral-800 p-6 rounded-full mb-4">
          <FaMusic className="text-4xl text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No se encontraron géneros</h3>
        <p className="text-gray-400 mb-4">No hay géneros disponibles en este momento</p>
        <button
          onClick={fetchAllGenres}
          className="px-4 py-2 bg-spotify-green text-black rounded-full font-medium hover:bg-green-400 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {genres.map((genre, index) => (
          <div 
            key={genre.id}
            onClick={() => handleGenreClick(genre.id)}
            className="group relative aspect-square rounded-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <div className="relative w-full h-full">
              {genre.image ? (
                <>
                  <Image
                    src={genre.image}
                    alt={genre.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33.33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                </>
              ) : (
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${genreColors[index % genreColors.length]}`}
                />
              )}
              
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-spotify-green transition-colors">
                  {genre.name}
                </h3>
                <div className="w-8 h-1 bg-spotify-green mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GenresGrid;
