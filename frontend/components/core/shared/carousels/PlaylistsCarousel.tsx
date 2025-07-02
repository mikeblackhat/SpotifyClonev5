import React from 'react';
import { FaPlay, FaMusic } from 'react-icons/fa';
import useCarousel from '@/hooks/useCarousel';
import { useSampleData } from '@/hooks/useSampleData';
import MediaCard from '../ui/MediaCard';
import { Playlist } from '@/types/media';
import dynamic from 'next/dynamic';
import SectionTitle from '../../shared/SectionTitle';

// Importación dinámica del skeleton
const PlaylistsCarouselSkeleton = dynamic(
  () => import('@/components/core/ui/Skeletons/PlaylistsCarouselSkeleton'),
  { ssr: false }
);

interface PlaylistsCarouselProps {
  title: string;
  showAllText?: string;
}

export const PlaylistsCarousel: React.FC<PlaylistsCarouselProps> = ({ 
  title = 'Listas destacadas', 
  showAllText = 'Mostrar todo' 
}) => {
  const { featuredPlaylists, isLoading } = useSampleData();
  
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

  // Mostrar skeleton mientras carga
  if (isLoading) {
    return <PlaylistsCarouselSkeleton />;
  }

  return (
    <section className="mb-10 relative">
      <SectionTitle 
        title={title}
        href={showAllText ? '/playlists' : undefined}
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
