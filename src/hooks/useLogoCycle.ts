import { useState, useEffect } from 'react';

interface UseLogoCycleOptions {
  /**
   * Number of logos to cycle through
   */
  logoCount: number;
  /**
   * Interval in milliseconds between logo changes
   */
  interval?: number;
  /**
   * Whether to start cycling immediately
   */
  autoStart?: boolean;
}

interface UseLogoCycleReturn {
  /**
   * Current logo number (1-indexed)
   */
  currentLogo: number;
  /**
   * Whether the cycle is currently running
   */
  isCycling: boolean;
  /**
   * Start the logo cycling
   */
  startCycling: () => void;
  /**
   * Stop the logo cycling
   */
  stopCycling: () => void;
  /**
   * Reset to the first logo
   */
  reset: () => void;
}

/**
 * Custom hook to manage cycling through multiple logos
 *
 * @param options - Configuration options for logo cycling
 * @returns Object with current logo state and control functions
 *
 * @example
 * ```tsx
 * const { currentLogo, isCycling, stopCycling } = useLogoCycle({
 *   logoCount: 7,
 *   interval: 200,
 *   autoStart: true
 * });
 *
 * // Use currentLogo to display the appropriate logo
 * <img src={`/logos/logo-${currentLogo}.svg`} />
 * ```
 */
export function useLogoCycle({
  logoCount,
  interval = 200,
  autoStart = true,
}: UseLogoCycleOptions): UseLogoCycleReturn {
  const [currentLogo, setCurrentLogo] = useState(1);
  const [isCycling, setIsCycling] = useState(autoStart);

  useEffect(() => {
    if (!isCycling) return;

    const cycleInterval = setInterval(() => {
      setCurrentLogo((prev) => (prev === logoCount ? 1 : prev + 1));
    }, interval);

    return () => clearInterval(cycleInterval);
  }, [isCycling, logoCount, interval]);

  const startCycling = () => setIsCycling(true);
  const stopCycling = () => setIsCycling(false);
  const reset = () => setCurrentLogo(1);

  return {
    currentLogo,
    isCycling,
    startCycling,
    stopCycling,
    reset,
  };
}
