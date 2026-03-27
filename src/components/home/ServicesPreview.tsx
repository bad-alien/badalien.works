'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { services } from '@/data/services';

export default function ServicesPreview() {
  const displayServices = services.slice(0, 4);
  const [layout, setLayout] = useState<'grid' | 'accordion' | 'stacked'>('grid');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="pt-36 pb-24 px-4 bg-base">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-secondary">01 / Services</span>
          <h2 className="text-5xl md:text-6xl font-bold text-text-heading mb-4 font-display">
            What I Do
          </h2>
          <p className="text-xl text-text-secondary mb-16 max-w-2xl">
            Discovery first — whether you need enablement, automation, or a full custom build
          </p>
        </motion.div>

        {/* DEV ONLY: Layout toggle — remove before shipping */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 flex gap-2">
            <button
              onClick={() => setLayout('grid')}
              className={`px-4 py-2 rounded-lg text-sm font-mono transition-colors ${
                layout === 'grid'
                  ? 'bg-[#FF6B35] text-black'
                  : 'bg-surface border border-border text-text-body hover:text-white'
              }`}
            >
              Option A: 2x2 Grid
            </button>
            <button
              onClick={() => setLayout('accordion')}
              className={`px-4 py-2 rounded-lg text-sm font-mono transition-colors ${
                layout === 'accordion'
                  ? 'bg-[#FF6B35] text-black'
                  : 'bg-surface border border-border text-text-body hover:text-white'
              }`}
            >
              Option B: Accordion
            </button>
            <button
              onClick={() => setLayout('stacked')}
              className={`px-4 py-2 rounded-lg text-sm font-mono transition-colors ${
                layout === 'stacked'
                  ? 'bg-[#FF6B35] text-black'
                  : 'bg-surface border border-border text-text-body hover:text-white'
              }`}
            >
              Option C: Stacked (All Expanded)
            </button>
          </div>
        )}

        {/* ── Option A: 2x2 Grid ── */}
        {layout === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: 'easeOut',
                }}
              >
                <div className="h-full p-8 md:p-10 bg-surface border border-border rounded-xl hover:bg-elevated hover:border-muted transition-all duration-300">
                  <span className="text-5xl font-bold text-text-secondary/30 font-display">
                    {service.number}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-text-heading mt-4 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-text-body text-base md:text-lg leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Option B: Accordion ── */}
        {layout === 'accordion' && (
          <div className="flex flex-col gap-3">
            {displayServices.map((service, index) => {
              const isExpanded = expandedId === service.id;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'easeOut',
                  }}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : service.id)}
                    className="w-full text-left p-6 md:p-8 bg-surface border border-border rounded-xl hover:bg-elevated hover:border-muted transition-all duration-300"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-6">
                        <span className="text-3xl md:text-4xl font-bold text-text-secondary/30 font-display shrink-0">
                          {service.number}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-text-heading">
                          {service.title}
                        </h3>
                      </div>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-text-secondary shrink-0"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.span>
                    </div>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="text-text-body text-base md:text-lg leading-relaxed mt-6 ml-0 md:ml-[4.5rem]">
                            {service.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── Option C: Stacked — all expanded, no collapse ── */}
        {layout === 'stacked' && (
          <div className="flex flex-col gap-8">
            {displayServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: 'easeOut',
                }}
              >
                <div className="p-8 md:p-10 bg-surface border border-border rounded-xl hover:bg-elevated hover:border-muted transition-all duration-300">
                  <div className="flex items-baseline gap-6 mb-4">
                    <span className="text-4xl md:text-5xl font-bold text-text-secondary/30 font-display shrink-0">
                      {service.number}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-text-heading">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-text-body text-base md:text-lg leading-relaxed ml-0 md:ml-[4.5rem]">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
