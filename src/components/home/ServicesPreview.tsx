'use client';

import { motion } from 'framer-motion';
import { services } from '@/data/services';

export default function ServicesPreview() {
  const displayServices = services.slice(0, 4);

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
            Whether I&apos;m teaching your team, cutting your costs, or building your system — transparency is fundamental, and my focus is making you capable of navigating AI on your own
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
      </div>
    </section>
  );
}
