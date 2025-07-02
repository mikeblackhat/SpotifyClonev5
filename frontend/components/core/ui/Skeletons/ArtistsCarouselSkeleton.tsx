import React from 'react';

const ArtistsCarouselSkeleton: React.FC = () => {
  // Crear 6 placeholders para el carrusel
  const placeholders = Array(6).fill(0);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-48 bg-neutral-800 rounded animate-pulse"></div>
        <div className="h-6 w-24 bg-neutral-800 rounded animate-pulse"></div>
      </div>
      
      <div className="relative">
        <div className="flex gap-4 overflow-hidden">
          {placeholders.map((_, index) => (
            <div key={index} className="flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.8rem)] md:w-[calc(25%-0.9rem)] lg:w-[calc(20%-1rem)] xl:w-[calc(16.666%-1rem)]">
              <div className="bg-neutral-800/50 rounded-lg p-5">
                <div className="relative mb-4">
                  <div className="w-full aspect-square rounded-full bg-neutral-800 animate-pulse"></div>
                  <div className="absolute bottom-3 right-3 w-14 h-14 bg-neutral-800 rounded-full"></div>
                </div>
                <div className="h-5 bg-neutral-800 rounded animate-pulse mb-2 w-3/4 mx-auto"></div>
                <div className="h-4 bg-neutral-800 rounded animate-pulse w-1/2 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Botones de navegación esqueletos */}
        <div className="hidden sm:block">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 bg-neutral-800/80 rounded-full"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 bg-neutral-800/80 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default ArtistsCarouselSkeleton;
