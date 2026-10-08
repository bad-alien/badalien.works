'use client';

import Image from 'next/image';
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { useLogoCycle } from '@/hooks/useLogoCycle';
import HeroInteractive from './HeroInteractive';

interface HeroSectionProps {
  onChatActivated: () => void;
  onLearnMore?: () => void;
}

// Full-screen overlay: the marks cycle indefinitely at a flipbook pace, with the
// controls present from the first paint. Scrolling, learn more, or the ghost input run
// the exit choreography that reveals the header and the page beneath. Return visitors
// in the same session skip it.
const CYCLE_INTERVAL_MS = 137;
const LOGO_COUNT = 7;
const SEEN_KEY = 'animation_seen';

export default function HeroSection({ onChatActivated, onLearnMore }: HeroSectionProps) {
  const [phase, setPhase] = useState<'overlay' | 'complete'>('overlay');
  const [staticMark, setStaticMark] = useState(false);

  const [scope, animate] = useAnimate();
  const isExitingRef = useRef(false);

  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);
  const logoSize = isMobile ? 170 : 240;

  const { currentLogo, stopCycling } = useLogoCycle({
    logoCount: LOGO_COUNT,
    interval: CYCLE_INTERVAL_MS,
    autoStart: true,
  });

  // Return visitors go straight to the page. Reduced-motion visitors keep the overlay
  // but see the static mark instead of the cycle.
  useLayoutEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) {
      stopCycling();
      setPhase('complete');
      // Defer so the parent reveals header and content after this render commits
      setTimeout(() => onLearnMore?.(), 0);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stopCycling();
      setStaticMark(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exitOverlay = useCallback(async () => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    stopCycling();

    animate('.hero-controls', { opacity: 0 }, { duration: 0.2 });
    await animate('.logo-container', { scale: 0.28, opacity: 0 }, { duration: 0.4, ease: 'easeInOut' });
  }, [animate, stopCycling]);

  const runChatSequence = useCallback(async () => {
    if (isExitingRef.current) return;
    await exitOverlay();
    onChatActivated();
    await animate(scope.current!, { opacity: 0 }, { duration: 0.3, ease: 'easeIn' });
    sessionStorage.setItem(SEEN_KEY, 'true');
    setPhase('complete');
  }, [animate, scope, onChatActivated, exitOverlay]);

  const runLearnMoreSequence = useCallback(async () => {
    if (isExitingRef.current) return;
    await exitOverlay();
    onLearnMore?.();
    await animate(scope.current!, { opacity: 0 }, { duration: 0.5, ease: 'easeIn' });
    sessionStorage.setItem(SEEN_KEY, 'true');
    setPhase('complete');
  }, [animate, scope, onLearnMore, exitOverlay]);

  // Scroll or swipe down leaves the overlay the same way learn more does
  useEffect(() => {
    if (phase !== 'overlay') return;

    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) runLearnMoreSequence();
    };
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY - e.changedTouches[0].clientY > 50) runLearnMoreSequence();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [phase, runLearnMoreSequence]);

  if (phase === 'complete') return null;

  // max-h caps the overlay below Google's very tall render viewport (about 12,000px),
  // so the indexed screenshot shows the page beneath it. Real screens never reach 150rem.
  return (
    <motion.div
      ref={scope}
      className="fixed inset-0 max-h-[150rem] z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="logo-container relative flex-shrink-0" style={{ width: logoSize, height: logoSize }}>
        {/* Cycling marks */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: isMobile ? 'scale(1.1)' : 'scale(1.3)', opacity: staticMark ? 0 : 0.8 }}
          aria-hidden="true"
        >
          {Array.from({ length: LOGO_COUNT }, (_, i) => i + 1).map((logoNum) => (
            <Image
              key={logoNum}
              src={`/logos/ba-logo-${logoNum}.svg`}
              alt=""
              width={logoSize}
              height={logoSize}
              priority={logoNum <= 2}
              className={`absolute w-full h-full object-contain select-none filter invert ${
                currentLogo === logoNum ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {/* Static mark for reduced-motion visitors */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: staticMark ? 1 : 0 }}
        >
          <Image
            src="/logos/ba-logo-trans-white.png"
            alt="Bad Alien"
            fill
            sizes={`${logoSize}px`}
            priority={staticMark}
            className="object-contain select-none"
          />
        </div>
      </div>

      <div className="hero-controls w-full">
        <HeroInteractive onActivateChat={runChatSequence} onLearnMore={runLearnMoreSequence} />
      </div>
    </motion.div>
  );
}
