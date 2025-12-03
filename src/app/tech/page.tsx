'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/shared/Logo';
import { useScrollState } from '@/hooks/useScrollState';

type TechFilter = 'All' | 'AI' | 'Automation' | 'Demo' | 'Client';

const techFilters: TechFilter[] = ['All', 'AI', 'Automation', 'Demo', 'Client'];

export default function TechPage() {
  const isScrolled = useScrollState(50);
  const [activeFilter, setActiveFilter] = useState<TechFilter>('All');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-md py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-center relative">
          <Logo
            size={isScrolled ? 'sm' : 'md'}
            className="transition-all duration-300"
          />

          <Link
            href="/contact"
            className="absolute right-6 text-sm font-light tracking-wider hover:text-gray-400 transition-colors"
          >
            CONTACT
          </Link>
        </div>
      </header>

      {/* Filter Bar */}
      <div
        className={`sticky z-30 bg-transparent transition-all duration-500 ${
          isScrolled
            ? 'top-[72px] py-4 opacity-100 translate-y-0'
            : 'top-[72px] py-4 opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {techFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 font-light tracking-wider text-sm rounded-md backdrop-blur-md transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-white text-black'
                    : 'bg-black/80 text-white border border-white/30 hover:border-white/60 hover:bg-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Banner Image */}
      <div className={`container mx-auto px-6 transition-all duration-500 ${
        isScrolled ? 'pt-32' : 'pt-24'
      }`}>
        <div className="relative w-full max-w-4xl mx-auto">
          <Image
            src="/assets/ba_knows_ai.png"
            alt="Bad Alien Knows AI"
            width={1920}
            height={1080}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Main Content - Placeholder for scrolling test */}
      <main className="container mx-auto px-6 pb-16">
        <div className="h-[200vh]">
          {/* Blank space for scroll testing */}
        </div>
      </main>
    </div>
  );
}
