import { useState, useEffect, useRef, RefObject } from 'react';

interface UseCarouselProps {
  totalItems: number;
  itemsPerPage: number;
  itemWidth?: number; // Ancho fijo opcional para cada elemento
}

interface UseCarouselReturn {
  carouselRef: RefObject<HTMLDivElement>;
  showPrevBtn: boolean;
  showNextBtn: boolean;
  currentIndex: number;
  next: () => void;
  prev: () => void;
  scrollToItem: (index: number) => void;
}

const useCarousel = ({ totalItems, itemsPerPage, itemWidth }: UseCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showPrevBtn, setShowPrevBtn] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateButtonVisibility = () => {
    if (!carouselRef.current) return;
    
    const container = carouselRef.current;
    const maxScroll = container.scrollWidth - container.offsetWidth;
    const currentScroll = container.scrollLeft;
    
    setShowPrevBtn(currentScroll > 5); // Pequeña tolerancia
    setShowNextBtn(currentScroll < maxScroll - 5);
    
    // Calcular el índice actual basado en el desplazamiento
    if (itemWidth) {
      const newIndex = Math.round(currentScroll / itemWidth);
      setCurrentIndex(Math.min(newIndex, totalItems - itemsPerPage));
    }
  };

  const scrollToItem = (index: number) => {
    if (!carouselRef.current) return;
    
    const container = carouselRef.current;
    const itemWidth = container.scrollWidth / totalItems;
    const scrollAmount = itemWidth * index;
    
    container.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
    
    // Actualizar después de la animación
    setTimeout(updateButtonVisibility, 300);
  };

  const next = () => {
    if (!carouselRef.current) return;
    
    const container = carouselRef.current;
    const itemWidth = container.scrollWidth / totalItems;
    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.offsetWidth;
    
    // Calcular el siguiente índice basado en la posición actual
    const currentIndex = Math.round(currentScroll / itemWidth);
    const nextIndex = Math.min(currentIndex + 1, totalItems - 1);
    const nextScroll = nextIndex * itemWidth;
    
    container.scrollTo({
      left: nextScroll,
      behavior: 'smooth'
    });
    
    // Actualizar estado después de la animación
    setTimeout(updateButtonVisibility, 300);
  };

  const prev = () => {
    if (!carouselRef.current) return;
    
    const container = carouselRef.current;
    const itemWidth = container.scrollWidth / totalItems;
    const currentScroll = container.scrollLeft;
    
    // Calcular el índice anterior basado en la posición actual
    const currentIndex = Math.round(currentScroll / itemWidth);
    const prevIndex = Math.max(currentIndex - 1, 0);
    const prevScroll = prevIndex * itemWidth;
    
    container.scrollTo({
      left: prevScroll,
      behavior: 'smooth'
    });
    
    // Actualizar estado después de la animación
    setTimeout(updateButtonVisibility, 300);
  };

  // Efecto para manejar redimensionamiento y scroll
  useEffect(() => {
    const handleResize = () => {
      updateButtonVisibility();
    };
    
    // Ejecutar después de que el componente se monte
    const timer = setTimeout(updateButtonVisibility, 100);
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    const currentCarousel = carouselRef.current;
    
    // Usar passive: true para mejor rendimiento en el scroll
    currentCarousel?.addEventListener('scroll', updateButtonVisibility, { passive: true });
    
    // Limpieza
    return () => {
      window.removeEventListener('resize', handleResize);
      currentCarousel?.removeEventListener('scroll', updateButtonVisibility);
      clearTimeout(timer);
    };
  }, [totalItems, itemsPerPage]);

  return {
    carouselRef,
    showPrevBtn,
    showNextBtn,
    currentIndex,
    next,
    prev,
    scrollToItem
  };
};

export default useCarousel;
