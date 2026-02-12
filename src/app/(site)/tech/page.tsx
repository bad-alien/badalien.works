'use client';

import Link from 'next/link';
import Logo from '@/components/shared/Logo';

export default function TechPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="w-full py-6">
        <div className="container mx-auto px-6 flex items-center justify-center relative">
          <Logo size="sm" className="transition-all duration-300" />
          <Link
            href="/contact"
            className="absolute right-6 text-sm font-light tracking-wider hover:text-gray-400 transition-colors"
          >
            CONTACT
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">
        <div className="text-center space-y-6 max-w-lg">
          <p className="text-neutral-500 text-sm font-mono tracking-[0.3em] uppercase">
            Coming Soon
          </p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Tech
          </h1>
          <div className="w-12 h-px bg-neutral-700 mx-auto" />
          <p className="text-neutral-400 text-base md:text-lg font-light leading-relaxed">
            This section is being built. Check back soon for projects, demos, and tools.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="text-neutral-500 text-sm font-mono tracking-wider hover:text-white transition-colors duration-300"
            >
              &larr; Back
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
