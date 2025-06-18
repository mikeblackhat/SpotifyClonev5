import React from 'react';
import { FaPlay, FaMusic } from 'react-icons/fa';
import useCarousel from '@/hooks/useCarousel';
import { useSampleData } from '@/hooks/useSampleData';
import MediaCard from '../ui/MediaCard';
import { Playlist } from '@/types/media';

interface PlaylistsCarouselProps {
  title: string;
  showAllText?: string;
}

export const PlaylistsCarousel: React.FC<PlaylistsCarouselProps> = ({ 
  title = 'Listas destacadas', 
  showAllText = 'Mostrar todo' 
}) => {
  const { featuredPlaylists } = useSampleData();
  
  const {
    carouselRef,
    showPrevBtn,
    showNextBtn,
    next,
    prev
  } = useCarousel({
    totalItems: featuredPlaylists.length,
    itemsPerPage: 3
  });

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-xl md:text-2xl font-bold text-white hover:underline cursor-pointer">
          {title}
        </h2>
        <button className="text-xs md:text-sm font-semibold text-gray-400 hover:text-white transition-colors">
          {showAllText}
        </button>
      </div>
      <div className="relative px-4">
        <div className="overflow-hidden">
          <div 
            ref={carouselRef}
            className="flex gap-4 transition-transform duration-300 ease-out overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {featuredPlaylists.map((playlist: Playlist, index: number) => (
              <div 
                key={`playlist-${playlist.id || index}`}
                className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[240px]"
              >
                <MediaCard
                  playlist={{
                    ...playlist,
                    imageUrl: playlist.imageUrl || `https://picsum.photos/seed/playlist-${playlist.id || index}/400/400`,
                  }}
                  type="playlist"
                  className="h-full w-full"
                  imageClassName="w-full aspect-square"
                  imageUrl={playlist.imageUrl || `https://picsum.photos/seed/playlist-${playlist.id || index}/400/400`}
                  title={playlist.title}
                  subtitle={playlist.description || playlist.owner}
                  showPlayButton
                  showMenuButton
                />
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
