'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { useLogoCycle } from '@/hooks/useLogoCycle';
import HeroInteractive from './HeroInteractive';
import HeroChatTransition from './HeroChatTransition';

interface HeroSectionProps {
  onChatActivated: () => void;
  onLearnMore?: () => void;
}

type AnimationPhase = 'chat-opening' | 'chat-active';

export default function HeroSection({ onChatActivated, onLearnMore }: HeroSectionProps) {
  const [phase, setPhase] = useState<AnimationPhase | null>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [scope, animate] = useAnimate();
  const interactiveRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const { currentLogo, decelerate } = useLogoCycle({
    logoCount: 7,
    interval: 156,
    autoStart: true,
  });

  // Trigger deceleration at 3000ms
  useEffect(() => {
    const decelerateTimer = setTimeout(() => {
      decelerate();
    }, 3000);

    return () => clearTimeout(decelerateTimer);
  }, [decelerate]);

  const runHeroSequence = useCallback(async () => {
    // Initial state: interactive and chat hidden
    if (interactiveRef.current) {
      interactiveRef.current.style.opacity = '0';
      interactiveRef.current.style.pointerEvents = 'none';
    }
    if (chatRef.current) {
      chatRef.current.style.opacity = '0';
      chatRef.current.style.pointerEvents = 'none';
    }

    // Wait for logo cycling (2.55s)
    await new Promise(r => setTimeout(r, 2550));

    // Cross-fade: cycling out + resolved in (simultaneously, 0.6s)
    animate('.cycling-logos', { opacity: 0 }, { duration: 0.6, ease: 'easeInOut' });
    await animate('.resolved-logo', { opacity: 1, scale: 1 }, { duration: 0.6, ease: 'easeOut' });

    // Wait for deceleration to finish
    await new Promise(r => setTimeout(r, 700));

    // Logo rises + shrinks (0.6s)
    animate('.logo-container', { width: 200, height: 200, y: -80 }, { duration: 0.6, ease: 'easeInOut' });

    // Interactive fades in with slight delay (0.2s after logo starts moving)
    await new Promise(r => setTimeout(r, 200));
    if (interactiveRef.current) {
      interactiveRef.current.style.pointerEvents = 'auto';
    }
    await animate(interactiveRef.current!, { opacity: 1 }, { duration: 0.3 });

    // Intro animation complete - allow clicks to pass through overlay
    setIntroComplete(true);
  }, [animate]);

  // Run the main hero animation sequence
  useEffect(() => {
    runHeroSequence();
  }, [runHeroSequence]);

  const runChatSequence = useCallback(async () => {
    // Fade out interactive
    if (interactiveRef.current) {
      interactiveRef.current.style.pointerEvents = 'none';
      animate(interactiveRef.current, { opacity: 0 }, { duration: 0.2 });
    }
    // Shrink + fade logo
    await animate('.logo-container', { width: 77, height: 77, opacity: 0 }, { duration: 0.4, ease: 'easeInOut' });
    // Fade out entire overlay so page Header + inline chat show through
    onChatActivated();
    await animate(scope.current!, { opacity: 0 }, { duration: 0.3, ease: 'easeIn' });
    // Remove overlay from layout entirely
    if (scope.current) {
      scope.current.style.display = 'none';
    }
  }, [animate, scope, onChatActivated]);

  const handleActivateChat = () => {
    runChatSequence();
  };

  return (
    <motion.div
      ref={scope}
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden"
      style={{ pointerEvents: introComplete ? 'none' : 'auto' }}
    >
      {/* Logo container - shrinks through phases, fades out during chat */}
      <div
        className="logo-container relative flex-shrink-0"
        style={{ width: 400, height: 400 }}
      >
        {/* Cycling logos - fades out when resolved logo appears */}
        <div
          className="cycling-logos absolute inset-0 flex items-center justify-center"
          style={{ transform: 'scale(1.3)', opacity: 0.8 }}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((logoNum) => (
            <Image
              key={logoNum}
              src={`/logos/ba-logo-${logoNum}.svg`}
              alt="Bad Alien"
              width={400}
              height={400}
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
            sizes="400px"
            priority
            className="object-contain select-none"
          />
        </div>
      </div>

      {/* Interactive content - flows below logo in flex column */}
      <div ref={interactiveRef}>
        <HeroInteractive onActivateChat={handleActivateChat} onLearnMore={onLearnMore} />
      </div>

      {/* Chat transition and interface */}
      <div
        ref={chatRef}
        className="absolute inset-0 flex flex-col items-center justify-start pt-24"
      >
        {phase && <HeroChatTransition phase={phase} />}
      </div>
    </motion.div>
  );
}
