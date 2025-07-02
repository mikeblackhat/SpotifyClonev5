'use client';

import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlay, FaMusic } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import SectionTitle from '@/components/core/shared/SectionTitle';

// Importación dinámica del skeleton
const GenresCarouselSkeleton = dynamic(
  () => import('@/components/core/ui/Skeletons/GenresCarouselSkeleton'),
  { ssr: false }
);
import { useGenres } from '@/contexts/GenreContext';
import { ImageWithFallback } from '@/components/core/shared/ui/ImageWithFallback';

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
  const { genres, isLoading, error, fetchGenres } = useGenres();
  
  // Tomar solo los primeros 10 géneros para el carrusel
  const displayedGenres = useMemo(() => genres.slice(0, 10), [genres]);

  // Configuración del carrusel
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showPrevBtn, setShowPrevBtn] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Tamaño de cada elemento y elementos por página
  const itemWidth = 176; // Ancho fijo de cada tarjeta de género (w-40 + gap-4)
  const itemsPerPage = Math.min(6, displayedGenres.length);
  
  // Navegación del carrusel
  const next = useCallback(() => {
    if (!carouselRef.current) return;
    const maxIndex = Math.max(0, displayedGenres.length - itemsPerPage);
    const newIndex = Math.min(currentIndex + 1, maxIndex);
    setCurrentIndex(newIndex);
    
    // Desplazamiento suave
    carouselRef.current.scrollTo({
      left: newIndex * itemWidth,
      behavior: 'smooth'
    });
  }, [currentIndex, displayedGenres.length, itemsPerPage]);
  
  const prev = useCallback(() => {
    if (!carouselRef.current) return;
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);
    
    // Desplazamiento suave
    carouselRef.current.scrollTo({
      left: newIndex * itemWidth,
      behavior: 'smooth'
    });
  }, [currentIndex]);
  
  // Efecto para actualizar la visibilidad de los botones de navegación
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    
    const updateButtonVisibility = () => {
      if (!container) return;
      const { scrollWidth, clientWidth, scrollLeft } = container;
      const maxScroll = scrollWidth - clientWidth;
      
      setShowPrevBtn(scrollLeft > 10);
      setShowNextBtn(scrollLeft < maxScroll - 10);
    };
    
    // Configurar el event listener de scroll
    container.addEventListener('scroll', updateButtonVisibility, { passive: true });
    
    // Actualizar la visibilidad inicial
    updateButtonVisibility();
    
    // Limpiar
    return () => {
      container.removeEventListener('scroll', updateButtonVisibility);
    };
  }, [displayedGenres]);

  const handleShowAll = () => {
    router.push('/genres');
  };

  const handleGenreClick = (genreId: string) => {
    router.push(`/genres/${genreId}`);
  };

  // Colores para los fondos de los géneros
  const genreColors = useMemo(() => [
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
  ], []);

  // Recargar géneros si hay un error
  const handleRetry = () => {
    fetchGenres();
  };

  // No mostrar skeleton mientras carga, en su lugar mostrar los géneros existentes o un estado vacío
  // Mostrar skeleton mientras carga
  if (isLoading && genres.length === 0) {
    return <GenresCarouselSkeleton />;
  }

  // Mostrar mensaje de error si falla la carga
  if (error && genres.length === 0) {
    return (
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="flex items-center justify-center h-48 bg-neutral-900/50 rounded-lg">
          <div className="text-center">
            <p className="text-red-400 mb-2">{error}</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-opacity-90 transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <SectionTitle 
        title={title}
        href={showAllText ? '/genres' : undefined}
        linkText={showAllText}
      />
      
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
            style={{ 
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              scrollSnapType: 'x mandatory'
            }}
          >
            {displayedGenres.map((genre, index) => (
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
        
        {/* Botones de navegación */}
        <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center pointer-events-none">
          {showPrevBtn && (
            <button 
              onClick={prev}
              className="w-12 h-12 bg-black/70 hover:bg-black rounded-full flex items-center justify-center text-white z-10 transition-all pointer-events-auto ml-4"
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
              className="w-12 h-12 bg-black/70 hover:bg-black rounded-full flex items-center justify-center text-white z-10 transition-all pointer-events-auto mr-4"
              aria-label="Siguiente"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenresCarousel;
