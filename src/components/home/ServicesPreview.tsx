'use client';

import { motion } from 'framer-motion';
import { services } from '@/data/services';

export default function ServicesPreview() {
  const displayServices = services.slice(0, 4); // Show all 4 services

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

        {/* Featured first card — full width */}
        {displayServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-6"
          >
            <div className="p-10 md:p-12 bg-surface border border-border rounded-xl">
              <div className="flex-1">
                <span className="text-6xl font-bold text-text-secondary/30 font-display">
                  {displayServices[0].number}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-text-heading mt-4 mb-4">
                  {displayServices[0].title}
                </h3>
                <p className="text-text-body text-lg max-w-2xl">
                  {displayServices[0].description}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Remaining cards — 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayServices.slice(1).map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: (index + 1) * 0.1,
                ease: 'easeOut',
              }}
            >
              <div className="h-full p-8 bg-surface border border-border rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-5xl font-bold text-text-secondary/30 font-display">
                    {service.number}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-text-heading mb-3">
                  {service.title}
                </h3>
                <p className="text-text-body mb-4 line-clamp-3">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
