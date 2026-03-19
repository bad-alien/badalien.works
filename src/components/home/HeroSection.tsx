'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLogoCycle } from '@/hooks/useLogoCycle';

interface HeroSectionProps {
  onAnimationComplete: () => void;
  onTransitionStart?: () => void;
}

type AnimationPhase = 'animating' | 'resolved' | 'transitioning' | 'complete';

export default function HeroSection({ onAnimationComplete, onTransitionStart }: HeroSectionProps) {
  const [phase, setPhase] = useState<AnimationPhase>('animating');
  const { currentLogo, stopCycling } = useLogoCycle({
    logoCount: 7,
    interval: 156,
    autoStart: true,
  });

  useEffect(() => {
    // Phase 1: Logo cycles for 2 seconds
    const cycleTimer = setTimeout(() => {
      stopCycling();
      setPhase('resolved');
    }, 2000);

    return () => clearTimeout(cycleTimer);
  }, [stopCycling]);

  useEffect(() => {
    // Phase 2: Static logo holds for ~0.9s, then transition starts
    if (phase === 'resolved') {
      const holdTimer = setTimeout(() => {
        setPhase('transitioning');
        onTransitionStart?.();
      }, 900);

      return () => clearTimeout(holdTimer);
    }
  }, [phase, onTransitionStart]);

  useEffect(() => {
    // Phase 3: Logo moves to header + overlay fades out simultaneously over 1.0s
    if (phase === 'transitioning') {
      const transitionTimer = setTimeout(() => {
        setPhase('complete');
        onAnimationComplete();
      }, 1000);

      return () => clearTimeout(transitionTimer);
    }
  }, [phase, onAnimationComplete]);

  const isMoving = phase === 'transitioning' || phase === 'complete';
  const targetY = isMoving ? '-45vh' : '0vh';
  const overlayFading = phase === 'transitioning' || phase === 'complete';

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex items-center justify-center"
      animate={{ opacity: overlayFading ? 0 : 1 }}
      transition={{ duration: 1.0, ease: 'easeIn' }}
      style={{ pointerEvents: overlayFading ? 'none' : 'auto' }}
    >
      {/* Logo container - animates from center to header position */}
      <motion.div
        className="relative w-[400px] h-[400px]"
        animate={{
          scale: isMoving ? 0.12 : 1,
          y: targetY,
        }}
        transition={{
          duration: 1.0,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {/* Cycling logos - fades out when phase changes from animating */}
        <motion.div
          animate={{ opacity: phase === 'animating' ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((logoNum) => (
            <Image
              key={logoNum}
              src={`/logos/ba-logo-${logoNum}.svg`}
              alt="Bad Alien"
              width={400}
              height={400}
              priority={logoNum <= 2}
              className={`absolute w-full h-full object-contain transition-opacity duration-100 select-none filter invert ${
                currentLogo === logoNum ? 'opacity-80' : 'opacity-0'
              }`}
            />
          ))}
        </motion.div>

        {/* Static resolved logo - fades in quickly as cycling fades out */}
        <motion.div
          animate={{ opacity: phase !== 'animating' ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Image
            src="/logos/ba-logo-trans-white.png"
            alt="Bad Alien"
            fill
            sizes="400px"
            priority
            className="object-contain select-none"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
