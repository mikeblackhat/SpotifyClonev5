import React from 'react';

const GenresCarouselSkeleton: React.FC = () => {
  // Crear 6 placeholders para el carrusel
  const placeholders = Array(6).fill(0);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-48 bg-neutral-800 rounded animate-pulse"></div>
        <div className="h-6 w-20 bg-neutral-800 rounded animate-pulse"></div>
      </div>
      
      <div className="flex gap-4 overflow-hidden">
        {placeholders.map((_, index) => (
          <div key={index} className="flex-shrink-0 w-40">
            <div className="relative mb-3 aspect-square bg-neutral-800 rounded-md animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-800 opacity-30"></div>
            </div>
            <div className="h-4 bg-neutral-800 rounded animate-pulse mb-2 w-3/4"></div>
            <div className="h-3 bg-neutral-800 rounded animate-pulse w-1/2"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GenresCarouselSkeleton;
