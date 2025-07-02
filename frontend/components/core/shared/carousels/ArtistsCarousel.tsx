import React, { useCallback } from 'react';
import { FaMicrophone, FaPlay } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import useCarousel from '@/hooks/useCarousel';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { useSongs } from '@/contexts/SongContext';
import dynamic from 'next/dynamic';
import SectionTitle from '../../shared/SectionTitle';
// Función auxiliar para combinar clases de Tailwind
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Definir un tipo unificado para Artist
interface Artist {
  id?: string;  // Hacer el id opcional para coincidir con el tipo en media.ts
  name: string;
  image?: string;
  imageUrl?: string;
  bio?: string;
  followers?: number;
  genre?: string;  // Añadir genre que está en el tipo original
}

// Importación dinámica del skeleton
const ArtistsCarouselSkeleton = dynamic(
  () => import('@/components/core/ui/Skeletons/ArtistsCarouselSkeleton'),
  { ssr: false }
);

interface ArtistsCarouselProps {
  title?: string;
  showAllText?: string;
  artists?: Artist[]; // Opcional: permite pasar artistas como prop
  isLoading?: boolean; // Opcional: permite controlar el estado de carga externamente
  itemsPerPage?: number; // Personalizar la cantidad de elementos por página
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

export const ArtistsCarousel: React.FC<ArtistsCarouselProps> = ({ 
  title = 'Artistas populares', 
  showAllText = 'Mostrar todo',
  artists: externalArtists,
  isLoading: externalIsLoading,
  itemsPerPage = 6
}) => {
  const { artists: contextArtists, isLoading: contextIsLoading } = useSongs();
  const router = useRouter();
  
  // Asegurarse de que siempre trabajemos con arrays
  const safeExternalArtists = Array.isArray(externalArtists) ? externalArtists : [];
  const safeContextArtists = Array.isArray(contextArtists) ? contextArtists : [];
  
  // Usar los artistas proporcionados como prop o los del contexto
  const artists = [...safeExternalArtists, ...safeContextArtists].reduce<Artist[]>((acc, artist) => {
    // Asegurarse de que el artista sea un objeto válido con id y nombre
    if (!artist || typeof artist !== 'object' || !artist.name) {
      console.warn('Artista inválido:', artist);
      return acc;
    }
    
    // Crear un ID si no existe (usando el nombre como base)
    const artistId = artist.id || `artist-${artist.name.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Crear un objeto artista válido con las propiedades necesarias
    const validArtist: Artist = {
      id: artistId,
      name: artist.name,
      // Usar image si está disponible, de lo contrario usar imageUrl, o undefined si ninguno existe
      ...(artist.image && { image: artist.image }),
      ...(artist.imageUrl && { imageUrl: artist.imageUrl }),
      ...(artist.bio && { bio: artist.bio }),
      ...(typeof artist.followers !== 'undefined' && { followers: artist.followers }),
      ...(artist.genre && { genre: artist.genre })
    };
    
    return [...acc, validArtist];
  }, []);
  
  // Colores para los artistas (usados como fallback cuando no hay imagen)
  const artistColors = [
    'from-pink-600 to-purple-700',
    'from-blue-600 to-cyan-500',
    'from-green-600 to-emerald-500',
    'from-yellow-600 to-amber-600',
    'from-red-600 to-pink-600',
    'from-indigo-600 to-purple-600',
    'from-cyan-600 to-blue-600',
    'from-emerald-600 to-teal-600',
    'from-amber-600 to-orange-600',
    'from-rose-600 to-pink-600',
  ];
  
  // Función para obtener un color basado en el ID del artista
  const getArtistColor = (id: string) => {
    // Asegurarse de que el ID sea un string
    const safeId = id || '';
    const index = safeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % artistColors.length;
    return artistColors[Math.abs(index)]; // Usar Math.abs para evitar índices negativos
  };
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : contextIsLoading;
  
  const {
    carouselRef,
    showPrevBtn,
    showNextBtn,
    next,
    prev
  } = useCarousel({
    totalItems: artists.length,
    itemsPerPage: itemsPerPage || 6
  });

  const handleArtistClick = useCallback((artistId: string | undefined) => {
    if (!artistId) {
      console.error('No se pudo navegar: ID de artista no proporcionado');
      return;
    }
    router.push(`/artist/${artistId}`);
  }, [router]);

  const handlePlayClick = useCallback((e: React.MouseEvent, artist: Artist) => {
    e.stopPropagation();
    // Aquí iría la lógica para reproducir el artista
    console.log('Reproducir artista:', artist.name);
  }, []);

  // Mostrar skeleton loading
  if (isLoading && (!artists || artists.length === 0)) {
    return <ArtistsCarouselSkeleton />;
  }

  if (!isLoading && (!artists || artists.length === 0)) return null;

  return (
    <section className="mb-10 relative">
      <SectionTitle 
        title={title}
        href={showAllText ? '/artists' : undefined}
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
            {artists.map((artist) => {
              const imageUrl = artist.image || artist.imageUrl;
              const artistColor = getArtistColor(artist.id || 'default');
              
              return (
                <div 
                  key={artist.id}
                  className={`${cardClasses} ${cardSizes}`}
                >
                  <div 
                    className={cardInnerClasses}
                    onClick={() => handleArtistClick(artist.id)}
                  >
                    <div className={imageContainerClasses}>
                      <div className={imageWrapperClasses}>
                        <ImageWithFallback 
                          src={imageUrl || ''}
                          alt={artist.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          fallbackIcon={
                            <div className={cn(
                              "w-full h-full flex items-center justify-center",
                              `bg-gradient-to-br ${artistColor}`
                            )}>
                              <FaMicrophone className="text-3xl text-white/80" />
                            </div>
                          }
                        />
                        <button 
                          className={playButtonClasses}
                          onClick={(e) => handlePlayClick(e, artist)}
                          aria-label={`Reproducir ${artist.name}`}
                        >
                          <FaPlay className="text-black text-sm ml-0.5" />
                        </button>
                      </div>
                    </div>
                    <div className="px-1">
                      <h3 className={titleClasses}>
                        {artist.name}
                      </h3>
                      {artist.genre && (
                        <p className={subtitleClasses}>
                          {artist.genre}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
