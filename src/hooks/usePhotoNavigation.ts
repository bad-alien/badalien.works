import { useState, useCallback, useMemo } from 'react';
import { Photo } from '@/data/photos';

interface UsePhotoNavigationReturn<T> {
  /**
   * Currently selected photo ID
   */
  selectedId: number | null;
  /**
   * Currently selected photo data
   */
  selectedPhoto: T | null;
  /**
   * Select a photo by ID
   */
  selectPhoto: (id: number) => void;
  /**
   * Clear the selection
   */
  clearSelection: () => void;
  /**
   * Navigate to the previous photo
   */
  goToPrevious: () => void;
  /**
   * Navigate to the next photo
   */
  goToNext: () => void;
}

/**
 * Custom hook to manage photo selection and navigation
 *
 * @param photos - Array of photos to navigate through
 * @returns Object with current selection state and navigation functions
 *
 * @example
 * ```tsx
 * const { selectedPhoto, selectPhoto, clearSelection, goToNext, goToPrevious } = usePhotoNavigation(photos);
 *
 * // Select a photo
 * <PhotoCard onClick={selectPhoto} />
 *
 * // Show lightbox with navigation
 * {selectedPhoto && (
 *   <Lightbox
 *     photo={selectedPhoto}
 *     onClose={clearSelection}
 *     onNext={goToNext}
 *     onPrevious={goToPrevious}
 *   />
 * )}
 * ```
 */
export function usePhotoNavigation<T extends { id: number }>(
  photos: T[]
): UsePhotoNavigationReturn<T> {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedPhoto = useMemo(
    () => (selectedId !== null ? photos.find((p) => p.id === selectedId) ?? null : null),
    [selectedId, photos]
  );

  const selectPhoto = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  const goToPrevious = useCallback(() => {
    if (selectedId !== null) {
      const currentIndex = photos.findIndex((p) => p.id === selectedId);
      const prevIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
      setSelectedId(photos[prevIndex].id);
    }
  }, [selectedId, photos]);

  const goToNext = useCallback(() => {
    if (selectedId !== null) {
      const currentIndex = photos.findIndex((p) => p.id === selectedId);
      const nextIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
      setSelectedId(photos[nextIndex].id);
    }
  }, [selectedId, photos]);

  return {
    selectedId,
    selectedPhoto,
    selectPhoto,
    clearSelection,
    goToPrevious,
    goToNext,
  };
}
