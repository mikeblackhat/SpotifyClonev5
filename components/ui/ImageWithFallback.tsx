'use client';

import { useState } from 'react';
import { FiMusic } from 'react-icons/fi';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  gradientId?: number;
  isRounded?: boolean;
}

export const ImageWithFallback = ({
  src,
  alt,
  className = '',
  fallbackIcon = <FiMusic className="text-4xl opacity-80" />,
  gradientId = 0,
  isRounded = false
}: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);

  const gradients = [
    // Gradientes púrpura/azul
    'from-purple-600 to-blue-500',
    'from-indigo-600 to-purple-500',
    'from-violet-600 to-indigo-500',
    
    // Gradientes rosa/rojo
    'from-pink-600 to-rose-500',
    'from-rose-600 to-pink-500',
    'from-fuchsia-600 to-rose-500',
    
    // Gradientes verde/azul
    'from-emerald-600 to-teal-500',
    'from-teal-600 to-cyan-500',
    'from-cyan-500 to-blue-500',
    
    // Gradientes cálidos
    'from-amber-600 to-orange-500',
    'from-orange-600 to-red-500',
    'from-yellow-500 to-amber-500',
    
    // Gradientes especiales
    'from-blue-600 to-cyan-400',
    'from-purple-500 to-pink-500',
    'from-rose-500 to-amber-500',
    'from-emerald-500 to-blue-500',
    'from-violet-500 to-purple-500',
    'from-cyan-400 to-blue-500',
    'from-amber-200 to-pink-500',
    'from-blue-400 to-indigo-600',
    'from-rose-400 to-orange-300',
    'from-emerald-400 to-cyan-400'
  ];

  const gradient = gradients[gradientId % gradients.length];
  const roundedClass = isRounded ? 'rounded-full' : 'rounded-md';

  if (error) {
    return (
      <div 
        className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient} ${roundedClass} ${className}`}
      >
        {fallbackIcon}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`w-full h-full object-cover ${roundedClass} ${className}`}
      onError={() => setError(true)}
    />
  );
};
