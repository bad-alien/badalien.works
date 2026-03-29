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

export default function HeroSection({ onChatActivated, onLearnMore }: HeroSectionProps) {
  const [introComplete, setIntroComplete] = useState(false);
  const [phase, setPhase] = useState<'animating' | 'complete'>('animating');

  const [scope, animate] = useAnimate();
  const interactiveRef = useRef<HTMLDivElement>(null);
  const isExitingRef = useRef(false);

  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);
  const logoSize = isMobile ? 260 : 400;
  const logoShrunk = isMobile ? 140 : 200;
  const logoRise = isMobile ? -50 : -80;

  const { currentLogo, decelerate } = useLogoCycle({
    logoCount: 7,
    interval: 125,
    autoStart: true,
  });

  // Trigger deceleration at 3000ms
  useEffect(() => {
    const decelerateTimer = setTimeout(() => {
      decelerate();
    }, 2100);

    return () => clearTimeout(decelerateTimer);
  }, [decelerate]);

  const runHeroSequence = useCallback(async () => {
    // Initial state: interactive and chat hidden
    if (interactiveRef.current) {
      interactiveRef.current.style.opacity = '0';
      interactiveRef.current.style.pointerEvents = 'none';
    }
    // Wait for logo cycling (1.785s)
    await new Promise(r => setTimeout(r, 1785));

    // Cross-fade: cycling out + resolved in (simultaneously, 0.42s)
    animate('.cycling-logos', { opacity: 0 }, { duration: 0.42, ease: 'easeInOut' });
    await animate('.resolved-logo', { opacity: 1, scale: 1 }, { duration: 0.42, ease: 'easeOut' });

    // Wait for deceleration to finish
    await new Promise(r => setTimeout(r, 390));

    // Logo rises + shrinks (0.35s)
    animate('.logo-container', { width: logoShrunk, height: logoShrunk, y: logoRise }, { duration: 0.35, ease: 'easeInOut' });

    // Interactive fades in with slight delay (112ms after logo starts moving)
    await new Promise(r => setTimeout(r, 112));
    if (interactiveRef.current) {
      interactiveRef.current.style.pointerEvents = 'auto';
    }
    await animate(interactiveRef.current!, { opacity: 1 }, { duration: 0.18 });

    // Intro animation complete - allow clicks to pass through overlay
    setIntroComplete(true);
  }, [animate, logoShrunk, logoRise]);

  // Check sessionStorage first — skip animation for return visitors, otherwise run it
  useLayoutEffect(() => {
    if (sessionStorage.getItem('animation_seen')) {
      setPhase('complete');
      // Show main content immediately for return visitors (avoid blank screen)
      // Using setTimeout to defer callback until after render cycle completes
      setTimeout(() => {
        if (onLearnMore) {
          onLearnMore();
        }
      }, 0);
      return;
    }
    runHeroSequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runHeroSequence]); // onLearnMore intentionally omitted - only called once on mount

  const exitOverlay = useCallback(async () => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;

    // Fade out interactive
    if (interactiveRef.current) {
      interactiveRef.current.style.pointerEvents = 'none';
      animate(interactiveRef.current, { opacity: 0 }, { duration: 0.2 });
    }
    // Shrink + fade logo
    await animate('.logo-container', { width: isMobile ? 50 : 77, height: isMobile ? 50 : 77, opacity: 0 }, { duration: 0.4, ease: 'easeInOut' });

    return scope;
  }, [animate, scope, isMobile]);

  const runChatSequence = useCallback(async () => {
    if (isExitingRef.current) return;
    await exitOverlay();
    onChatActivated();
    await animate(scope.current!, { opacity: 0 }, { duration: 0.3, ease: 'easeIn' });
    sessionStorage.setItem('animation_seen', 'true');
    setPhase('complete');
  }, [animate, scope, onChatActivated, exitOverlay]);

  const runLearnMoreSequence = useCallback(async () => {
    if (isExitingRef.current) return;
    await exitOverlay();
    onLearnMore?.();
    await animate(scope.current!, { opacity: 0 }, { duration: 0.5, ease: 'easeIn' });
    sessionStorage.setItem('animation_seen', 'true');
    setPhase('complete');
  }, [animate, scope, onLearnMore, exitOverlay]);

  // Scroll/swipe down triggers learn-more exit
  useEffect(() => {
    if (!introComplete) return;

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
  }, [introComplete, runLearnMoreSequence]);

  const handleActivateChat = () => {
    runChatSequence();
  };

  if (phase === 'complete') return null;

  return (
    <motion.div
      ref={scope}
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden"
      style={{ pointerEvents: introComplete ? 'none' : 'auto' }}
    >
      {/* Logo container - shrinks through phases, fades out during chat */}
      <div
        className="logo-container relative flex-shrink-0"
        style={{ width: logoSize, height: logoSize }}
      >
        {/* Cycling logos - fades out when resolved logo appears */}
        <div
          className="cycling-logos absolute inset-0 flex items-center justify-center"
          style={{ transform: isMobile ? 'scale(1.1)' : 'scale(1.3)', opacity: 0.8 }}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((logoNum) => (
            <Image
              key={logoNum}
              src={`/logos/ba-logo-${logoNum}.svg`}
              alt="Bad Alien"
              width={logoSize}
              height={logoSize}
              priority={logoNum <= 2}
              className={`absolute w-full h-full object-contain select-none filter invert ${
                currentLogo === logoNum ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {/* Static resolved logo - fades in during resolving phase */}
        <div
          className="resolved-logo absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0, transform: 'scale(0.6)' }}
        >
          <Image
            src="/logos/ba-logo-trans-white.png"
            alt="Bad Alien"
            fill
            sizes={`${logoSize}px`}
            priority
            className="object-contain select-none"
          />
        </div>
      </div>

      {/* Interactive content - flows below logo in flex column */}
      <div ref={interactiveRef}>
        <HeroInteractive onActivateChat={handleActivateChat} onLearnMore={runLearnMoreSequence} />
      </div>

    </motion.div>
  );
}
