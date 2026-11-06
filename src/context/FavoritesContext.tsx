import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRAILS_DATA } from '../data/trails';
import { Trail } from '../types/trail';

interface FavoritesContextType {
  favoriteIds: string[];
  favoriteTrails: Trail[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => Promise<void>;
  favoritesCount: number;
  isLoading: boolean;
}

const STORAGE_KEY = '@trailmap_favorites_v1';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Charger les favoris sauvegardés au démarrage
  useEffect(() => {
    async function loadFavorites() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setFavoriteIds(parsed);
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement des favoris:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, []);

  // Basculer l'état de favori
  const toggleFavorite = useCallback(async (id: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      // Sauvegarde asynchrone
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch((err) => {
        console.error('Erreur sauvegarde favoris:', err);
      });
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => {
      return favoriteIds.includes(id);
    },
    [favoriteIds]
  );

  const favoriteTrails = useMemo(() => {
    return TRAILS_DATA.filter((trail) => favoriteIds.includes(trail.id));
  }, [favoriteIds]);

  const value = useMemo(
    () => ({
      favoriteIds,
      favoriteTrails,
      isFavorite,
      toggleFavorite,
      favoritesCount: favoriteIds.length,
      isLoading,
    }),
    [favoriteIds, favoriteTrails, isFavorite, toggleFavorite, isLoading]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
