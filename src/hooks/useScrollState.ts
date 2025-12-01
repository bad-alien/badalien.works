import { useState, useEffect } from 'react';

/**
 * Custom hook to track scroll position and return whether the user has scrolled past a threshold
 *
 * @param threshold - The scroll position in pixels to trigger the state change (default: 50)
 * @returns boolean indicating whether the user has scrolled past the threshold
 *
 * @example
 * ```tsx
 * const isScrolled = useScrollState(50);
 *
 * return (
 *   <header className={isScrolled ? 'scrolled' : ''}>
 *     ...
 *   </header>
 * );
 * ```
 */
export function useScrollState(threshold = 50): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}
