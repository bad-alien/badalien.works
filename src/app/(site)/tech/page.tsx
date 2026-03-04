'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '@/components/shared/Logo';
import ServiceFilterBar from '@/components/tech/ServiceFilterBar';
import ServiceSection from '@/components/tech/ServiceSection';
import { services, serviceFilters, type ServiceFilter } from '@/data/services';
import { useScrollState } from '@/hooks/useScrollState';
import { ServiceCategory } from '@/components/tech/types';

export default function TechPage() {
  const isScrolled = useScrollState(50);
  const [activeFilter, setActiveFilter] = useState<ServiceFilter>('All');

  const filteredServices = useMemo(
    () =>
      activeFilter === 'All'
        ? services
        : services.filter((s) => s.categories.includes(activeFilter as ServiceCategory)),
    [activeFilter]
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md py-3' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-center relative">
          <Logo
            size={isScrolled ? 'sm' : 'sm'}
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

      {/* Filter bar — sticky below header */}
      <ServiceFilterBar
        filters={serviceFilters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        isScrolled={isScrolled}
      />

      {/* Hero */}
      <main className="pt-40 md:pt-48">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-3xl mx-auto mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            <p className="text-white/30 text-xs font-mono tracking-[0.3em] uppercase mb-5">
              What I Build
            </p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white leading-[1.05] mb-6">
              Services
            </h1>
            <p className="text-gray-400 font-light text-base md:text-lg leading-relaxed max-w-xl">
              End-to-end solutions across AI, automation, infrastructure, and design — built to last and engineered to scale.
            </p>
          </motion.div>
        </div>

        {/* Service sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filteredServices.map((service) => (
              <ServiceSection key={service.id} service={service} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filteredServices.length === 0 && (
          <div className="container mx-auto px-6 py-32 text-center">
            <p className="text-white/30 font-light tracking-wider text-sm">
              No services in this category yet.
            </p>
          </div>
        )}

        {/* Footer CTA */}
        <section className="py-32 md:py-40 border-t border-white/5">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <p className="text-white/25 text-xs font-mono tracking-[0.3em] uppercase mb-6">
                Ready to start?
              </p>
              <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight mb-10 leading-[1.1]">
                Let&apos;s Build Together
              </h2>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-3.5 border border-white/30 text-sm font-light tracking-wider text-white hover:bg-white hover:text-black transition-all duration-300 rounded-sm"
              >
                Get in touch
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
