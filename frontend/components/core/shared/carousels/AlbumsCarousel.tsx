import React from 'react';
import useCarousel from '@/hooks/useCarousel';
import { useSampleData } from '@/hooks/useSampleData';
import { FaPlay } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import SectionTitle from '../../shared/SectionTitle';

// Importación dinámica del skeleton
const AlbumsCarouselSkeleton = dynamic(
  () => import('@/components/core/ui/Skeletons/AlbumsCarouselSkeleton'),
  { ssr: false }
);

interface AlbumsCarouselProps {
  title: string;
  showAllText?: string;
}

// Tamaño fijo para las tarjetas (igual que géneros)
const cardSizes = 'w-40';

// Clases para las tarjetas (estilo consistente con géneros)
const cardClasses = 'group flex-shrink-0';
const cardInnerClasses = 'p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer';
const imageContainerClasses = 'relative mb-3 aspect-square overflow-hidden rounded-md group-hover:bg-neutral-700/70 transition-colors';
const imageWrapperClasses = 'w-full h-full';
const playButtonClasses = 'absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105';
const titleClasses = 'font-bold text-white text-sm truncate px-1';
const subtitleClasses = 'text-xs text-gray-400 truncate mt-0.5 px-1';

export const AlbumsCarousel: React.FC<AlbumsCarouselProps> = ({ 
  title = 'Álbumes y sencillos populares', 
  showAllText = 'Mostrar todo' 
}) => {
  const { popularAlbums, isLoading } = useSampleData();
  const {
    carouselRef,
    showPrevBtn,
    showNextBtn,
    next,
    prev
  } = useCarousel({
    totalItems: popularAlbums.length,
    itemsPerPage: 6
  });

  // Mostrar skeleton mientras carga
  if (isLoading) {
    return <AlbumsCarouselSkeleton />;
  }

  return (
    <section className="mb-10 relative">
      <SectionTitle 
        title={title}
        href={showAllText ? '/albums' : undefined}
        linkText={showAllText}
      />
      <div className="relative group">
        {/* Botón de navegación anterior */}
        {showPrevBtn && (
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white shadow-lg transform transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        <div className="overflow-hidden">
          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
            style={{ 
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              scrollSnapType: 'x mandatory'
            }}
          >
            {popularAlbums.map((album, index) => (
              <div 
                key={`album-${album.id || index}-${index}`}
                className={`${cardClasses} ${cardSizes}`}
              >
                <div className={cardInnerClasses}>
                  <div className={imageContainerClasses}>
                    <div className={imageWrapperClasses}>
                      <img 
                        src={album.imageUrl || `https://picsum.photos/seed/album-${album.id || index}/400/400`}
                        alt={album.title}
                        className="w-full h-full object-cover"
                      />
                      <button 
                        className={playButtonClasses}
                        onClick={() => console.log('Reproducir álbum', album.title)}
                      >
                        <FaPlay className="text-black ml-1" />
                      </button>
                    </div>
                  </div>
                  <h3 className={titleClasses} title={album.title}>
                    {album.title}
                  </h3>
                  <p className={subtitleClasses} title={album.artist}>
                    {album.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Botón de navegación siguiente */}
        {showNextBtn && (
          <button 
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white shadow-lg transform transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Siguiente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
};
