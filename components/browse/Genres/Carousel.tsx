'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaPlay, FaSpinner, FaMusic } from 'react-icons/fa';
import useCarousel from '@/hooks/useCarousel';
import { ImageWithFallback } from '@/components/shared/ui/ImageWithFallback';

interface Genre {
  id: string;
  name: string;
  image?: string | null;
}

interface GenresCarouselProps {
  title?: string;
  showAllText?: string;
}

const GenresCarousel: React.FC<GenresCarouselProps> = ({ 
  title = 'Explorar géneros', 
  showAllText = 'Ver todo' 
}) => {
  const router = useRouter();
  
  const [genres, setGenres] = React.useState<Genre[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const {
    carouselRef,
    showPrevBtn,
    showNextBtn,
    next,
    prev,
  } = useCarousel({
    totalItems: 10, // Número fijo de ítems para la navegación del carrusel
    itemsPerPage: 6 // Mostrar 6 ítems a la vez
  });

  // Cargar géneros al montar el componente
  React.useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('/api/genres');
        if (!response.ok) {
          throw new Error('Error al cargar los géneros');
        }
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data?.genres)) {
          // Tomar solo los primeros 10 géneros para el carrusel
          setGenres(result.data.genres.slice(0, 10));
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (err) {
        console.error('Error al cargar los géneros:', err);
        setError('No se pudieron cargar los géneros. Intenta de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleShowAll = () => {
    router.push('/genres');
  };

  const handleGenreClick = (genreId: string) => {
    router.push(`/genre/${genreId}`);
  };

  // Colores para los fondos de los géneros
  const genreColors = [
    'bg-gradient-to-br from-purple-500 to-indigo-600',
    'bg-gradient-to-br from-green-500 to-emerald-600',
    'bg-gradient-to-br from-blue-500 to-cyan-600',
    'bg-gradient-to-br from-rose-500 to-pink-600',
    'bg-gradient-to-br from-amber-500 to-orange-600',
    'bg-gradient-to-br from-teal-500 to-blue-600',
    'bg-gradient-to-br from-fuchsia-500 to-purple-600',
    'bg-gradient-to-br from-rose-500 to-amber-600',
    'bg-gradient-to-br from-cyan-500 to-blue-600',
    'bg-gradient-to-br from-violet-500 to-purple-600',
  ];

  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            {showAllText}
          </button>
        </div>
        <div className="flex items-center justify-center h-48">
          <FaSpinner className="animate-spin text-2xl text-white" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            {showAllText}
          </button>
        </div>
        <div className="text-center py-8 text-gray-400">{error}</div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
          {title}
        </h2>
        <button 
          onClick={handleShowAll}
          className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
        >
          {showAllText}
        </button>
      </div>
      
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            ref={carouselRef}
            className="flex gap-6 transition-transform duration-300 ease-out overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            {genres.map((genre, index) => (
              <div 
                key={`genre-${genre.id}`} 
                className="group flex-shrink-0 w-40 cursor-pointer"
                onClick={() => handleGenreClick(genre.id)}
              >
                <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-neutral-800 group-hover:bg-neutral-700/70 transition-colors">
                  {genre.image ? (
                    <ImageWithFallback 
                      src={genre.image}
                      alt={genre.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      fallbackIcon={
                        <div className={`w-full h-full ${genreColors[index % genreColors.length]} flex items-center justify-center`}>
                          <FaMusic className="text-white/80 text-4xl" />
                        </div>
                      }
                    />
                  ) : (
                    <div className={`w-full h-full ${genreColors[index % genreColors.length]} flex items-center justify-center`}>
                      <FaMusic className="text-white/80 text-4xl" />
                    </div>
                  )}
                  <button 
                    className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 hover:bg-green-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Reproducir género:', genre.name);
                    }}
                  >
                    <FaPlay className="text-black ml-0.5" />
                  </button>
                </div>
                <h3 className="font-medium text-white truncate mb-1 group-hover:text-spotify-green transition-colors">
                  {genre.name}
                </h3>
                <p className="text-sm text-gray-400">Género</p>
              </div>
            ))}
          </div>
        </div>
        
        {showPrevBtn && (
          <button 
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-12 h-12 bg-black/70 hover:bg-black rounded-full flex items-center justify-center text-white z-10 transition-all"
            aria-label="Anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {showNextBtn && (
          <button 
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-12 h-12 bg-black/70 hover:bg-black rounded-full flex items-center justify-center text-white z-10 transition-all"
            aria-label="Siguiente"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
};

export default GenresCarousel;
