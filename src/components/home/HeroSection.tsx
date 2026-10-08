'use client';

import Image from 'next/image';
import { useState, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { useLogoCycle } from '@/hooks/useLogoCycle';
import HeroInteractive from './HeroInteractive';

interface HeroSectionProps {
  onChatActivated: () => void;
  onLearnMore?: () => void;
}

// The signature moment: cycle through the seven marks, then cross-fade to the
// resolved logo while the controls fade in beneath it. The hero is a normal
// in-flow section, so the page scrolls and the header is present throughout.
const CYCLE_MS = 1785;
const CROSSFADE_S = 0.42;
const SEEN_KEY = 'animation_seen';
const LOGO_COUNT = 7;

export default function HeroSection({ onChatActivated, onLearnMore }: HeroSectionProps) {
  const [resolved, setResolved] = useState(false);

  const { currentLogo, decelerate, stopCycling } = useLogoCycle({
    logoCount: LOGO_COUNT,
    interval: 125,
    autoStart: true,
  });

  // Play the cycle once per session. Return visitors and reduced-motion users
  // get the resolved logo and the controls straight away.
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sessionStorage.getItem(SEEN_KEY) || reduceMotion) {
      stopCycling();
      setResolved(true);
      return;
    }

    const resolveTimer = setTimeout(() => {
      setResolved(true);
      sessionStorage.setItem(SEEN_KEY, 'true');
    }, CYCLE_MS);
    const decelerateTimer = setTimeout(decelerate, CYCLE_MS + 300);

    return () => {
      clearTimeout(resolveTimer);
      clearTimeout(decelerateTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pb-12 pt-24 md:pt-28"
    >
      {/* Fixed-size logo box, sized in CSS so hydration never resizes it and the cross-fade never shifts layout */}
      <div className="relative h-[230px] w-[230px] flex-shrink-0 sm:h-[340px] sm:w-[340px]">
        <motion.div
          className="absolute inset-0 flex scale-110 items-center justify-center sm:scale-[1.3]"
          initial={false}
          animate={{ opacity: resolved ? 0 : 0.8 }}
          transition={{ duration: CROSSFADE_S, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          {Array.from({ length: LOGO_COUNT }, (_, i) => i + 1).map((logoNum) => (
            <Image
              key={logoNum}
              src={`/logos/ba-logo-${logoNum}.svg`}
              alt=""
              width={340}
              height={340}
              priority={logoNum <= 2}
              className={`absolute w-full h-full object-contain select-none filter invert ${
                currentLogo === logoNum ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ opacity: resolved ? 1 : 0, scale: resolved ? 1 : 0.6 }}
          transition={{ duration: CROSSFADE_S, ease: 'easeOut' }}
        >
          <Image
            src="/logos/ba-logo-trans-white.png"
            alt="Bad Alien"
            fill
            sizes="(max-width: 639px) 230px, 340px"
            priority
            className="object-contain select-none"
          />
        </motion.div>
      </div>

      <HeroInteractive show={resolved} onActivateChat={onChatActivated} onLearnMore={onLearnMore} />
    </section>
  );
}
