'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Logo from '@/components/shared/Logo';
import { useLogoCycle } from '@/hooks/useLogoCycle';

export default function Home() {
  const [showNav, setShowNav] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { currentLogo, stopCycling, startCycling } = useLogoCycle({
    logoCount: 7,
    interval: 200,
    autoStart: true,
  });

  // Initial fade-in animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Handle click - delay stopping the logo cycling
  const handleClick = () => {
    setShowNav(!showNav);
    if (!showNav) {
      // Keep cycling for 800ms while main content fades in
      setTimeout(() => stopCycling(), 800);
    } else {
      // Resume cycling when closing nav
      startCycling();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Logo Animation - Click to reveal navigation */}
        <div 
          className="cursor-pointer transition-all duration-400 ease-in-out"
          onClick={handleClick}
        >
          {/* Large cycling SVG logos - fade in on load, fade out when nav shown */}
          <div className={`relative h-96 md:h-screen w-full max-w-6xl mx-auto flex items-center justify-center transition-opacity duration-[800ms] ease-in-out ${
            showNav ? 'opacity-0' : isInitialLoad ? 'opacity-0' : 'opacity-100'
          }`}>
            {[1, 2, 3, 4, 5, 6, 7].map((logoNum) => (
              <Image
                key={logoNum}
                src={`/logos/ba-logo-${logoNum}.svg`}
                alt={`Bad Alien Logo ${logoNum}`}
                width={1200}
                height={1200}
                priority={logoNum <= 2}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out select-none filter invert ${
                  currentLogo === logoNum ? 'opacity-40' : 'opacity-0'
                }`}
              />
            ))}
          </div>

          {/* Compact main logo when nav is shown - fade in slowly */}
          {showNav && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-in fade-in duration-1000 ease-in-out">
              <Logo
                size="xl"
                linkToHome={false}
                className="hover:scale-105 transition-all duration-700 ease-in-out select-none mb-8"
              />
              
              {/* Navigation Buttons - directly below main logo */}
              <div className="flex flex-row gap-12 justify-center items-center transition-opacity duration-1000 delay-[1000ms] opacity-0 animate-[fadeIn_0.5s_ease-in-out_1s_forwards]">
                <Link
                  href="/creative"
                  className="text-white hover:text-purple-400 transition-colors duration-300 ease-in-out text-xl font-medium tracking-wide"
                >
                  creative
                </Link>

                <Link
                  href="/contact"
                  className="text-white hover:text-blue-400 transition-colors duration-300 ease-in-out text-2xl font-bold tracking-wide"
                >
                  contact
                </Link>

                <Link
                  href="/tech"
                  className="text-white hover:text-emerald-400 transition-colors duration-300 ease-in-out text-xl font-medium tracking-wide"
                >
                  tech
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Subdomain info - hidden */}
        <div className="mt-12 text-sm text-slate-500 dark:text-slate-400 opacity-0 pointer-events-none">
          <p>creative.badalien.works • consult.badalien.works • badalien.works/about</p>
        </div>
      </div>
    </div>
  );
}