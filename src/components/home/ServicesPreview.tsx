'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { services } from '@/data/services';

export default function ServicesPreview() {
  const displayServices = services.slice(0, 4); // Show all 4 services

  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2
            className="text-5xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-science-gothic)' }}
          >
            What I Do
          </h2>
          <p className="text-xl text-gray-400 mb-16 max-w-2xl">
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
                <div className="h-full p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className="text-5xl font-bold text-white/20 group-hover:text-white/40 transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-science-gothic)' }}
                    >
                      {service.number}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center text-white group-hover:translate-x-2 transition-transform duration-300">
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
