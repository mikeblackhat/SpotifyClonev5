import React from 'react';

const AlbumsCarouselSkeleton: React.FC = () => {
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
            <div key={index} className="group flex-shrink-0 w-[45%] xs:w-[45%] sm:w-[30%] md:w-[23%] lg:w-[18%] xl:w-[16%] 2xl:w-[15%]">
              <div className="bg-neutral-800/50 hover:bg-neutral-700/70 rounded-lg p-3 transition-all duration-300 hover:shadow-lg">
                <div className="relative mb-3">
                  <div className="w-full aspect-square rounded-lg bg-neutral-800 animate-pulse"></div>
                  <div className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-neutral-800 rounded-full"></div>
                </div>
                <div className="h-4 bg-neutral-800 rounded animate-pulse mb-1 w-4/5"></div>
                <div className="h-3 bg-neutral-800 rounded animate-pulse w-3/5"></div>
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

export default AlbumsCarouselSkeleton;
