import React from 'react';

interface CarouselNavButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  visible: boolean;
  className?: string;
}

export const CarouselNavButton: React.FC<CarouselNavButtonProps> = ({
  direction,
  onClick,
  visible,
  className = ''
}) => {
  if (!visible) return null;

  const positionClasses = direction === 'prev' 
    ? 'left-0 -translate-x-6' 
    : 'right-0 translate-x-6';

  return (
    <button 
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-black rounded-full flex items-center justify-center text-white z-10 transition-all ${className} ${positionClasses}`}
      aria-label={direction === 'prev' ? 'Anterior' : 'Siguiente'}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d={direction === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} 
        />
      </svg>
    </button>
  );
};
