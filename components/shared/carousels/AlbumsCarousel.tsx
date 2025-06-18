import React from 'react';
import useCarousel from '@/hooks/useCarousel';
import { CarouselNavButton } from '../ui/CarouselNavButton';
import { useSampleData } from '@/hooks/useSampleData';
import { FaPlay } from 'react-icons/fa';

interface AlbumsCarouselProps {
  title: string;
  showAllText?: string;
}

// Tamaños responsivos para las tarjetas
const cardSizes = 'w-[calc(50%-0.75rem)] sm:w-[calc(33.333%-1rem)] md:w-[calc(25%-1.125rem)] lg:w-[calc(20%-1.2rem)] xl:w-[calc(16.666%-1.25rem)]';

// Clases para las tarjetas
const cardClasses = 'group flex-shrink-0';
const cardInnerClasses = 'bg-neutral-800/50 hover:bg-neutral-700/70 rounded-md p-4 transition-all duration-300 hover:shadow-lg';
const imageContainerClasses = 'relative mb-4';
const imageWrapperClasses = 'w-full aspect-square rounded-md shadow-lg mb-3 overflow-hidden group-hover:shadow-2xl transition-all duration-300';
const playButtonClasses = 'absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105';
const titleClasses = 'font-bold text-white truncate';
const subtitleClasses = 'text-sm text-gray-400 truncate';

export const AlbumsCarousel: React.FC<AlbumsCarouselProps> = ({ 
  title = 'Álbumes y sencillos populares', 
  showAllText = 'Mostrar todo' 
}) => {
  const { popularAlbums } = useSampleData();
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
        
        <CarouselNavButton 
          direction="prev" 
          onClick={prev} 
          visible={showPrevBtn} 
        />
        
        <CarouselNavButton 
          direction="next" 
          onClick={next} 
          visible={showNextBtn} 
        />
      </div>
    </section>
  );
};
