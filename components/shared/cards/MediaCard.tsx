import React from 'react';
import { ImageWithFallback } from '../ui/ImageWithFallback';

interface MediaCardProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

const MediaCard: React.FC<MediaCardProps> = ({
  title,
  subtitle,
  imageUrl,
  onClick,
  className = ''
}) => {
  return (
    <div 
      className={`group bg-neutral-800/50 hover:bg-neutral-700/70 rounded-md p-4 transition-all duration-300 hover:shadow-lg cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="relative mb-4">
        <div className="w-full aspect-square rounded-md shadow-lg overflow-hidden">
          <ImageWithFallback 
            src={imageUrl || ''}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <h3 className="font-bold text-white truncate">{title}</h3>
      <p className="text-sm text-gray-400 truncate">{subtitle}</p>
    </div>
  );
};

export default MediaCard;
