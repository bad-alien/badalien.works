import { useState, useEffect, useCallback } from 'react';

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
   * Whether the cycle is decelerating
   */
  isDecelerating: boolean;
  /**
   * Start the logo cycling
   */
  startCycling: () => void;
  /**
   * Stop the logo cycling
   */
  stopCycling: () => void;
  /**
   * Gradually slow down and stop the cycling over ~500ms
   */
  decelerate: () => void;
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
  const [isDecelerating, setIsDecelerating] = useState(false);

  useEffect(() => {
    if (!isCycling || isDecelerating) return;

    const cycleInterval = setInterval(() => {
      setCurrentLogo((prev) => (prev === logoCount ? 1 : prev + 1));
    }, interval);

    return () => clearInterval(cycleInterval);
  }, [isCycling, isDecelerating, logoCount, interval]);

  const startCycling = useCallback(() => setIsCycling(true), []);
  const stopCycling = useCallback(() => setIsCycling(false), []);
  const reset = useCallback(() => setCurrentLogo(1), []);

  const decelerate = useCallback(() => {
    setIsDecelerating(true);

    // Gradually slow down: 156ms → 220ms → 300ms → 400ms → stop
    // Total duration: ~1076ms
    const sequence = [156, 220, 300, 400];
    let step = 0;

    const runStep = () => {
      if (step >= sequence.length) {
        setIsCycling(false);
        return;
      }

      setCurrentLogo((prev) => (prev === logoCount ? 1 : prev + 1));
      step++;

      if (step < sequence.length) {
        setTimeout(runStep, sequence[step]);
      } else {
        setIsCycling(false);
      }
    };

    // Start the deceleration sequence after one more cycle at original speed
    setTimeout(runStep, sequence[0]);
  }, [logoCount]);

  return {
    currentLogo,
    isCycling,
    isDecelerating,
    startCycling,
    stopCycling,
    decelerate,
    reset,
  };
}
