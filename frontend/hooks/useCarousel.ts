import { useState, useRef, useCallback, useEffect } from 'react';

interface UseCarouselProps {
  totalItems: number;
  itemsPerPage: number;
  itemWidth?: number;
}

interface UseCarouselReturn {
  carouselRef: React.RefObject<HTMLDivElement>;
  showPrevBtn: boolean;
  showNextBtn: boolean;
  currentIndex: number;
  next: () => void;
  prev: () => void;
  scrollToItem: (index: number) => void;
}

const useCarousel = ({ totalItems, itemsPerPage, itemWidth }: UseCarouselProps): UseCarouselReturn => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showPrevBtn, setShowPrevBtn] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Memoizar la función de actualización de visibilidad
  const updateButtonVisibility = useCallback(() => {
    const container = carouselRef.current;
    if (!container) return;
    
    const { scrollWidth, clientWidth, scrollLeft } = container;
    const maxScroll = scrollWidth - clientWidth;
    const isAtStart = scrollLeft <= 5;
    const isAtEnd = scrollLeft >= maxScroll - 5;
    
    setShowPrevBtn(!isAtStart);
    setShowNextBtn(!isAtEnd);
    
    // Actualizar el ancho del contenedor si es necesario
    if (clientWidth !== containerWidth) {
      setContainerWidth(clientWidth);
    }
    
    // Calcular el índice actual basado en el desplazamiento
    if (itemWidth) {
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(Math.min(newIndex, Math.max(0, totalItems - itemsPerPage)));
    } else {
      // Si no tenemos un ancho de ítem, estimar basado en el desplazamiento
      const itemWidthEstimate = scrollWidth / totalItems;
      const newIndex = Math.round(scrollLeft / itemWidthEstimate);
      setCurrentIndex(Math.min(newIndex, Math.max(0, totalItems - itemsPerPage)));
    }
  }, [itemWidth, itemsPerPage, totalItems, containerWidth]);

  // Efecto para configurar el observer de intersección y redimensionamiento
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    // Función para manejar el redimensionamiento
    const handleResize = () => {
      updateButtonVisibility();
    };

    // Usar ResizeObserver para detectar cambios en el tamaño
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Configurar el event listener de scroll con passive para mejor rendimiento
    container.addEventListener('scroll', updateButtonVisibility, { passive: true });
    
    // Configurar el event listener de redimensionamiento de ventana
    window.addEventListener('resize', handleResize);
    
    // Actualizar la visibilidad inicial
    updateButtonVisibility();
    
    // Limpiar
    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('scroll', updateButtonVisibility);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateButtonVisibility]);

  // Memoizar las funciones de navegación
  const scrollToItem = useCallback((index: number) => {
    const container = carouselRef.current;
    if (!container) return;
    
    const scrollAmount = itemWidth 
      ? itemWidth * index 
      : (container.scrollWidth / totalItems) * index;
    
    container.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }, [itemWidth, totalItems]);

  const next = useCallback(() => {
    const container = carouselRef.current;
    if (!container) return;
    
    const nextIndex = Math.min(currentIndex + 1, Math.max(0, totalItems - itemsPerPage));
    scrollToItem(nextIndex);
  }, [currentIndex, itemsPerPage, scrollToItem, totalItems]);

  const prev = useCallback(() => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    scrollToItem(prevIndex);
  }, [currentIndex, scrollToItem]);

  return {
    carouselRef,
    showPrevBtn,
    showNextBtn,
    currentIndex,
    next,
    prev,
    scrollToItem
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
