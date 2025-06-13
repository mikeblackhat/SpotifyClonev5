import React from 'react';
import { FaPlay, FaMusic } from 'react-icons/fa';
import { useCarousel } from '../../hooks/useCarousel';
import { ImageWithFallback } from '../ui/ImageWithFallback';

interface PlaylistsCarouselProps {
  title: string;
  showAllText?: string;
}

export const PlaylistsCarousel: React.FC<PlaylistsCarouselProps> = ({ 
  title = 'Listas destacadas', 
  showAllText = 'Mostrar todo' 
}) => {
  const {
    carouselRef,
    showPrevBtn,
    showNextBtn,
    next,
    prev
  } = useCarousel({
    totalItems: 12,
    itemsPerPage: 3
  });

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
          {title}
        </h2>
        <button className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
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
            {Array.from({ length: 12 }).map((_, index) => (
              <div 
                key={`playlist-${index}`}
                className="flex-shrink-0 w-[calc(100%-1.5rem)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <div className="group bg-neutral-800/50 hover:bg-neutral-700/70 rounded-md p-4 transition-all duration-300 hover:shadow-lg flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <div className="w-full h-full rounded shadow-lg overflow-hidden">
                      <ImageWithFallback 
                        src={`/demo/playlist${index % 4 + 1}.jpg`}
                        alt={`Lista ${index + 1}`}
                        className="w-full h-full"
                        gradientId={index * 30} // Multiplicamos para mayor variación
                        fallbackIcon={
                          <div className="w-full h-full flex items-center justify-center">
                            <FaMusic className="text-2xl text-white/90" />
                          </div>
                        }
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      <FaPlay className="text-black text-xs ml-0.5" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">Lista de éxitos {index + 1}</h3>
                    <p className="text-sm text-gray-400 truncate">Los éxitos del momento</p>
                  </div>
                </div>
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
