'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface Genre {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

interface GenreContextType {
  genres: Genre[];
  isLoading: boolean;
  error: string | null;
  fetchGenres: () => Promise<void>;
}

const GenreContext = createContext<GenreContextType | undefined>(undefined);

export function GenreProvider({ children }: { children: React.ReactNode }) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

  const fetchGenres = useCallback(async (force = false) => {
    // Usar caché si los datos son recientes y no se fuerza la recarga
    const shouldUseCache = Date.now() - lastFetched < CACHE_DURATION && genres.length > 0 && !force;
    
    if (shouldUseCache) {
      return;
    }

    // Solo mostrar loading si no hay datos o si se fuerza la recarga
    if (genres.length === 0 || force) {
      setIsLoading(true);
    }
    
    setError(null);

    try {
      // Agregar timestamp para evitar caché del navegador
      const response = await fetch(`/api/genres?t=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los géneros');
      }
      
      const data = await response.json();
      
      if (data?.data?.genres) {
        setGenres(data.data.genres);
        setLastFetched(Date.now());
      }
    } catch (err) {
      console.error('Error en fetchGenres:', err);
      setError('No se pudieron cargar los géneros. Intente de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  }, [genres.length, lastFetched]);

  // Cargar géneros al montar el componente
  useEffect(() => {
    fetchGenres();
    
    // Recargar cada 5 minutos
    const interval = setInterval(() => {
      fetchGenres(true);
    }, CACHE_DURATION);
    
    return () => clearInterval(interval);
  }, [fetchGenres]);

  return (
    <GenreContext.Provider value={{ genres, isLoading, error, fetchGenres }}>
      {children}
    </GenreContext.Provider>
  );
}

export function useGenres() {
  const context = useContext(GenreContext);
  if (context === undefined) {
    throw new Error('useGenres debe usarse dentro de un GenreProvider');
  }
  return context;
}
