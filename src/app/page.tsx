'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [showNav, setShowNav] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(1);
  
  // Cycle through logos 1-7
  useEffect(() => {
    if (!showNav) {
      const interval = setInterval(() => {
        setCurrentLogo(prev => prev === 7 ? 1 : prev + 1);
      }, 500); // Change every 500ms
      
      return () => clearInterval(interval);
    }
  }, [showNav]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Logo Animation - Click to reveal navigation */}
        <div 
          className="cursor-pointer transition-all duration-700 ease-in-out"
          onClick={() => setShowNav(!showNav)}
        >
          {!showNav ? (
            // Large cycling SVG logos
            <div className="relative h-96 md:h-screen w-full max-w-6xl mx-auto flex items-center justify-center">
              {[1, 2, 3, 4, 5, 6, 7].map((logoNum) => (
                <img
                  key={logoNum}
                  src={`/logos/ba-logo-${logoNum}.svg`}
                  alt={`Bad Alien Logo ${logoNum}`}
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out select-none filter invert ${
                    currentLogo === logoNum ? 'opacity-40' : 'opacity-0'
                  }`}
                />
              ))}
              
              {/* Explore text */}
              <p className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs text-slate-400 animate-pulse">
                explore
              </p>
            </div>
          ) : (
            // Compact main logo when nav is shown
            <div className="flex flex-col items-center animate-in fade-in duration-700 ease-in-out">
              <img 
                src="/logos/ba-logo-trans-white.png" 
                alt="Bad Alien Logo" 
                className="h-32 md:h-48 w-auto hover:scale-105 transition-all duration-700 ease-in-out select-none mb-8"
              />
              
              {/* Navigation Buttons - directly below main logo */}
              <div className="flex flex-row gap-12 justify-center items-center transition-all duration-700 delay-300 ease-in-out">
                <Link 
                  href="/creative"
                  className="text-white hover:text-purple-400 transition-colors duration-300 ease-in-out text-lg font-medium"
                >
                  creative
                </Link>

                <Link 
                  href="/consult"
                  className="text-white hover:text-blue-400 transition-colors duration-300 ease-in-out text-xl font-bold"
                >
                  consult
                </Link>

                <Link 
                  href="/about"
                  className="text-white hover:text-slate-400 transition-colors duration-300 ease-in-out text-lg font-medium"
                >
                  about
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Subdomain info - shown when nav is visible */}
        <div className={`mt-12 text-sm text-slate-500 dark:text-slate-400 transition-all duration-700 ${
          showNav ? 'opacity-100' : 'opacity-0'
        }`}>
          <p>creative.badalien.works • consult.badalien.works • badalien.works/about</p>
        </div>
      </div>
    </div>
  );
}