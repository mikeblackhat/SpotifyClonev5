import React from 'react';
import { ImageWithFallback } from './ImageWithFallback';
import { FaPlay, FaMusic, FaEllipsisH } from 'react-icons/fa';
import { Song, Artist, Album, Playlist, MediaType } from '@/types/media';

// Tipos de tarjetas soportados
type MediaItem = Song | Artist | Album | Playlist;

interface BaseMediaCardProps {
  /** Título principal de la tarjeta */
  title: string;
  /** Subtítulo o descripción */
  subtitle: string;
  /** URL de la imagen */
  imageUrl: string;
  /** ID para el gradiente de fondo */
  gradientId?: number;
  /** Callback al hacer clic en la tarjeta */
  onClick?: () => void;
  /** Mostrar botón de reproducción */
  showPlayButton?: boolean;
  /** Mostrar botón de menú */
  showMenuButton?: boolean;
  /** Si es true, la imagen será redonda */
  isRounded?: boolean;
  /** Clases adicionales para la imagen */
  imageClassName?: string;
  /** Clases adicionales para la tarjeta */
  className?: string;
  /** Tipo de medio (opcional, se usa para estilos específicos) */
  type?: MediaType;
  /** Información adicional que se muestra en la esquina superior derecha */
  metaInfo?: string;
  /** Número de reproducciones (opcional) */
  playCount?: number;
  /** Tamaño de la tarjeta */
  size?: 'sm' | 'md' | 'lg';
}

// Tipos específicos para cada tipo de tarjeta
interface SongCardProps extends Omit<BaseMediaCardProps, 'title' | 'subtitle'> {
  song: Song;
  type: 'song';
}

interface ArtistCardProps extends Omit<BaseMediaCardProps, 'title' | 'subtitle' | 'showPlayButton'> {
  artist: Artist;
  type: 'artist';
}

interface AlbumCardProps extends Omit<BaseMediaCardProps, 'title' | 'subtitle'> {
  album: Album;
  type: 'album';
}

interface PlaylistCardProps extends Omit<BaseMediaCardProps, 'title' | 'subtitle'> {
  playlist: Playlist;
  type: 'playlist';
}

type MediaCardProps = 
  | SongCardProps 
  | ArtistCardProps 
  | AlbumCardProps 
  | PlaylistCardProps
  | BaseMediaCardProps;

/**
 * Componente de tarjeta de medios reutilizable para mostrar canciones, álbumes, artistas y listas de reproducción.
 */
const MediaCard: React.FC<MediaCardProps> = (props) => {
  // Definir el tipo base para las propiedades de la tarjeta
  type BaseCardProps = {
    title: string;
    subtitle: string;
    imageUrl: string;
    isRounded?: boolean;
    metaInfo?: string;
    playCount?: number;
    type: MediaType;
    size?: 'sm' | 'md' | 'lg';
    gradientId?: number;
    showPlayButton?: boolean;
    showMenuButton?: boolean;
    imageClassName?: string;
    className?: string;
    onClick?: () => void;
  };

  // Inicializar con valores por defecto
  const defaultCardProps: BaseCardProps = {
    title: '',
    subtitle: '',
    imageUrl: '',
    type: 'song',
    size: 'md',
    isRounded: false,
    showPlayButton: true,
    showMenuButton: true,
    className: '',
    imageClassName: '',
    onClick: undefined,
  };

  // Obtener las propiedades según el tipo de tarjeta
  const cardProps: BaseCardProps = (() => {
    // Type guard functions
    const isSongProps = (p: any): p is SongCardProps => 'song' in p;
    const isArtistProps = (p: any): p is ArtistCardProps => 'artist' in p;
    const isAlbumProps = (p: any): p is AlbumCardProps => 'album' in p;
    const isPlaylistProps = (p: any): p is PlaylistCardProps => 'playlist' in p;
    
    if (isSongProps(props)) {
      return {
        title: props.song?.title || '',
        subtitle: props.song?.artist || '',
        imageUrl: props.song?.imageUrl || '',
        playCount: props.song?.playCount,
        isRounded: false,
        type: 'song'
      };
    }
    
    if (isArtistProps(props)) {
      return {
        title: props.artist?.name || '',
        subtitle: props.artist?.genre || 'Artista',
        imageUrl: props.artist?.imageUrl || '',
        isRounded: true,
        type: 'artist'
      };
    }
    
    if (isAlbumProps(props)) {
      return {
        title: props.album?.title || '',
        subtitle: props.album?.artist || '',
        imageUrl: props.album?.imageUrl || '',
        metaInfo: props.album?.year?.toString(),
        isRounded: false,
        type: 'album'
      };
    }
    
    if (isPlaylistProps(props)) {
      const { playlist } = props;
      return {
        title: playlist?.title || '',
        subtitle: playlist?.description || playlist?.owner || '',
        imageUrl: playlist?.imageUrl || '',
        // playCount is not part of the Playlist type, so we'll use trackCount if available
        playCount: 'trackCount' in playlist ? playlist.trackCount : undefined,
        isRounded: false,
        type: 'playlist',
        metaInfo: 'trackCount' in playlist ? `${playlist.trackCount} canciones` : '',
        onClick: props.onClick,
        showPlayButton: props.showPlayButton,
        showMenuButton: props.showMenuButton,
        className: props.className,
      };
    }
    
    // Default case for direct props
    return {
      title: props.title || '',
      subtitle: props.subtitle || '',
      imageUrl: props.imageUrl || '',
      isRounded: props.isRounded || false,
      metaInfo: props.metaInfo,
      playCount: props.playCount,
      type: props.type || 'song',
      size: props.size || 'md',
      gradientId: props.gradientId,
      showPlayButton: props.showPlayButton,
      showMenuButton: props.showMenuButton,
      className: props.className,
      imageClassName: props.imageClassName,
      onClick: props.onClick,
    };
  })();

  // Combinar con valores por defecto
  const finalProps: BaseCardProps = {
    ...defaultCardProps,
    ...cardProps,
    title: cardProps.title || '',
    subtitle: cardProps.subtitle || '',
    imageUrl: cardProps.imageUrl || '',
    type: cardProps.type || 'song',
    size: cardProps.size || 'md',
    isRounded: cardProps.isRounded || false,
  };
  
  // Asegurarse de que size siempre tenga un valor
  const safeSize = finalProps.size || 'md';

  // Desestructurar las propiedades finales
  const {
    title,
    subtitle,
    imageUrl,
    isRounded = false,
    metaInfo,
    playCount,
    size = 'md',
    gradientId,
    showPlayButton = true,
    showMenuButton = true,
    imageClassName = '',
    className = '',
    type: cardType = 'song',
    onClick
  } = finalProps;

  // Tamaños de la tarjeta
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  } as const;

  // Tamaños de la imagen
  const imageSizeClasses = {
    sm: 'h-24 w-24',
    md: 'h-36 w-full',
    lg: 'h-48 w-full'
  } as const;
  
  // Clases para el contenedor de la imagen
  const containerClasses = `relative w-full overflow-hidden transition-all duration-300 group-hover:shadow-2xl ${
    isRounded ? 'rounded-full' : 'rounded-md'
  } ${imageSizeClasses[safeSize as keyof typeof imageSizeClasses]} flex-shrink-0`;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Reproducir', title);
    // Aquí iría la lógica para reproducir el medio
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Menú para', title);
    // Aquí iría la lógica para mostrar el menú contextual
  };

  // Formatear el contador de reproducciones
  const formatPlayCount = (count?: number) => {
    if (!count) return null;
    const numCount = Number(count);
    if (isNaN(numCount)) return null;
    
    return numCount >= 1000000 
      ? `${(numCount / 1000000).toFixed(1)}M`
      : numCount >= 1000 
      ? `${(numCount / 1000).toFixed(1)}K`
      : numCount.toString();
  };

  return (
    <div 
      className={`group bg-neutral-800/50 hover:bg-neutral-700/70 rounded-md ${sizeClasses[safeSize as keyof typeof sizeClasses]} transition-all duration-300 hover:shadow-lg cursor-pointer ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="relative mb-3">
        <div className={containerClasses}>
          <div className="relative w-full h-full">
            <ImageWithFallback 
              src={imageUrl}
              alt={title}
              className={`w-full h-full object-cover ${imageClassName}`}
              gradientId={gradientId}
              fallbackIcon={
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
                  <FaMusic className="text-4xl text-white/90" />
                </div>
              }
            />
            
            {/* Overlay para el efecto hover */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              {showPlayButton && (
                <button 
                  className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105"
                  onClick={handlePlayClick}
                  aria-label={`Reproducir ${title}`}
                >
                  <FaPlay className="text-black ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Botón de menú */}
        {showMenuButton && (
          <button 
            className="absolute top-2 right-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/90"
            onClick={handleMenuClick}
            aria-label="Más opciones"
          >
            <FaEllipsisH className="text-white text-sm" />
          </button>
        )}
        
        {/* Contador de reproducciones */}
        {playCount !== undefined && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {formatPlayCount(playCount)} reproducciones
          </div>
        )}
      </div>
      
      {/* Contenido de texto */}
      <div className="p-2">
        <h3 className="text-white font-medium text-sm truncate">{title}</h3>
        <p className="text-gray-400 text-xs truncate">{subtitle}</p>
        {metaInfo && <p className="text-gray-500 text-xs mt-1">{metaInfo}</p>}
      </div>
    </div>
  );
};

export default MediaCard;

// Componentes específicos para cada tipo de medio
export const SongCard: React.FC<Omit<SongCardProps, 'type'>> = (props) => (
  <MediaCard type="song" {...props} />
);

export const ArtistCard: React.FC<Omit<ArtistCardProps, 'type'>> = (props) => (
  <MediaCard 
    type="artist" 
    isRounded 
    showPlayButton={false} 
    {...props} 
  />
);

export const AlbumCard: React.FC<Omit<AlbumCardProps, 'type'>> = (props) => (
  <MediaCard type="album" {...props} />
);

export const PlaylistCard: React.FC<Omit<PlaylistCardProps, 'type'>> = (props) => (
  <MediaCard type="playlist" {...props} />
);
