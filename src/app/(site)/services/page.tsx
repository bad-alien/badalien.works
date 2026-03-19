'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/shared/Header';
import ServiceFilterBar from '@/components/services/ServiceFilterBar';
import ServiceSection from '@/components/services/ServiceSection';
import { services, serviceFilters, type ServiceFilter } from '@/data/services';
import { ServiceCategory } from '@/components/services/types';
import { useScrollState } from '@/hooks/useScrollState';

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
    <div className="min-h-screen bg-base text-white">
      <Header />

      {/* Filter bar — sticky below header */}
      <ServiceFilterBar
        filters={serviceFilters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        isScrolled={isScrolled}
      />

      {/* Hero */}
      <main className="pt-28 md:pt-32">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white/80 leading-[1.3]">
              End-to-end solutions across AI, automation, infrastructure, and design — built to last, engineered to scale, and designed to save you money.
            </h1>
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
            <p className="text-text-secondary font-light tracking-wider text-sm">
              No services in this category yet.
            </p>
          </div>
        )}

        {/* Footer CTA */}
        <section className="py-32 md:py-40 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <p className="text-secondary text-xs font-mono tracking-[0.3em] uppercase mb-6">
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
