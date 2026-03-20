'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLogoCycle } from '@/hooks/useLogoCycle';
import HeroInteractive from './HeroInteractive';
import HeroChatTransition from './HeroChatTransition';

interface HeroSectionProps {
  onChatActivated: () => void;
}

type AnimationPhase = 'animating' | 'resolving' | 'interactive' | 'chat-opening' | 'chat-active';

export default function HeroSection({ onChatActivated }: HeroSectionProps) {
  const [phase, setPhase] = useState<AnimationPhase>('animating');
  const { currentLogo, decelerate } = useLogoCycle({
    logoCount: 7,
    interval: 156,
    autoStart: true,
  });

  // Phase 1: Logo cycles for 2 seconds
  useEffect(() => {
    const cycleTimer = setTimeout(() => {
      decelerate();
      setPhase('resolving');
    }, 2000);

    return () => clearTimeout(cycleTimer);
  }, [decelerate]);

  // Phase 2: Resolving - decelerate and cross-fade (700ms)
  useEffect(() => {
    if (phase === 'resolving') {
      const resolveTimer = setTimeout(() => {
        setPhase('interactive');
      }, 700);

      return () => clearTimeout(resolveTimer);
    }
  }, [phase]);

  // Phase 4: Chat opening animation (600ms)
  useEffect(() => {
    if (phase === 'chat-opening') {
      const openingTimer = setTimeout(() => {
        setPhase('chat-active');
      }, 600);

      return () => clearTimeout(openingTimer);
    }
  }, [phase]);

  const handleActivateChat = () => {
    setPhase('chat-opening');
    onChatActivated();
  };

  // Calculate logo animations based on phase
  const isMovingToHeader = phase === 'chat-opening' || phase === 'chat-active';
  const isInteractive = phase === 'interactive';
  const logoSize = isMovingToHeader ? 77 : isInteractive ? 200 : 400;

  // Overlay opacity - only fade interactive elements during chat-opening
  const showInteractive = phase === 'interactive';
  const showChat = phase === 'chat-opening' || phase === 'chat-active';

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Logo container - shrinks through phases, fades out during chat */}
      <motion.div
        className="relative flex-shrink-0"
        animate={{
          width: logoSize,
          height: logoSize,
          opacity: isMovingToHeader ? 0 : 1,
        }}
        transition={{
          duration: isMovingToHeader ? 0.4 : isInteractive ? 0.5 : 0,
          ease: 'easeInOut',
        }}
      >
        {/* Cycling logos - fades out during resolving phase */}
        <motion.div
          animate={{
            opacity: phase === 'animating' ? 0.8 : 0,
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
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
                currentLogo === logoNum ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </motion.div>

        {/* Static resolved logo - fades in during resolving phase with 100ms offset */}
        <motion.div
          animate={{
            opacity: phase !== 'animating' ? 1 : 0,
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
            delay: phase === 'resolving' ? 0.1 : 0,
          }}
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

      {/* Interactive content - flows below logo in flex column */}
      <AnimatePresence mode="wait">
        {showInteractive && (
          <motion.div
            key="interactive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HeroInteractive onActivateChat={handleActivateChat} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat transition and interface */}
      <AnimatePresence mode="wait">
        {showChat && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.4,
              delay: phase === 'chat-opening' ? 0.2 : 0,
            }}
            className="absolute inset-0 flex flex-col items-center justify-start pt-24"
          >
            <HeroChatTransition phase={phase === 'chat-opening' ? 'chat-opening' : 'chat-active'} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
