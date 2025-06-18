/**
 * Formatea segundos a un string de tiempo (MM:SS)
 * @param seconds Tiempo en segundos
 * @returns String formateado (ej: "2:45" o "1:02:30" para más de una hora)
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

/**
 * Acorta un texto a una longitud máxima, añadiendo "..." si es necesario
 * @param text Texto a acortar
 * @param maxLength Longitud máxima (por defecto 50)
 * @returns Texto acortado si es necesario
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return '';
  return text.length > maxLength 
    ? `${text.substring(0, maxLength)}...` 
    : text;
};

/**
 * Genera un ID único
 * @param prefix Prefijo opcional para el ID
 * @returns ID único
 */
export const generateId = (prefix: string = ''): string => {
  return `${prefix}${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
};

/**
 * Formatea un número grande a un formato más legible (ej: 1.5K, 2.3M)
 * @param num Número a formatear
 * @returns String formateado
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};
