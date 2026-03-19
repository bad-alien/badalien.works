'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { services } from '@/data/services';

export default function ServicesPreview() {
  const displayServices = services.slice(0, 4); // Show all 4 services

  return (
    <section className="py-24 px-4 bg-base">
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
            AI adoption and custom automation for businesses that want operational advantage
          </p>
        </motion.div>

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
              <Link
                href={`/services#${service.id}`}
                className="group block h-full"
              >
                <div className="h-full p-8 bg-surface border border-border rounded-xl hover:bg-elevated hover:border-muted transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-5xl font-bold text-text-secondary/30 group-hover:text-text-secondary/50 transition-colors duration-300 font-display">
                      {service.number}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-text-heading mb-3 group-hover:text-white transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-text-body mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center text-text-heading group-hover:translate-x-2 transition-transform duration-300">
                    Learn more →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
