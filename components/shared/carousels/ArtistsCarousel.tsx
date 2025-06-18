import React from 'react';
import { FaMicrophone, FaPlay, FaMusic } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import useCarousel from '@/hooks/useCarousel';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { useSampleData } from '@/hooks/useSampleData';

interface ArtistsCarouselProps {
  title: string;
  showAllText?: string;
}

export const ArtistsCarousel: React.FC<ArtistsCarouselProps> = ({ 
  title = 'Artistas populares', 
  showAllText = 'Mostrar todo' 
}) => {
  const { popularArtists } = useSampleData();
  
  const {
    carouselRef,
    showPrevBtn,
    showNextBtn,
    next,
    prev
  } = useCarousel({
    totalItems: popularArtists.length,
    itemsPerPage: 6
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
            {popularArtists.map((artist, index) => (
              <div 
                key={`artist-${index}`} 
                className="group flex-shrink-0 w-[calc(50%-0.75rem)] sm:w-[calc(33.333%-1rem)] md:w-[calc(25%-1.125rem)] lg:w-[calc(20%-1.2rem)] xl:w-[calc(16.666%-1.25rem)]"
              >
                <div className="group cursor-pointer">
                  <div className="relative mb-3 overflow-hidden rounded-full aspect-square bg-gradient-to-br from-purple-600/20 to-blue-500/20 p-1">
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <ImageWithFallback 
                        src={artist.imageUrl || `https://picsum.photos/seed/artist-${index}/500/500`}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                        fallbackIcon={
                          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                            <FaMicrophone className="text-2xl text-white" />
                          </div>
                        }
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black transform hover:scale-105">
                          <FaPlay className="ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-center truncate">{artist.name}</h3>
                  <p className="text-sm text-gray-400 text-center truncate">{artist.genre}</p>
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
