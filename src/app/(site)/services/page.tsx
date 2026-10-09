'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ServiceSection from '@/components/services/ServiceSection';
import { services, SERVICES_INTRO } from '@/data/services';

export default function TechPage() {
  return (
    <div className="min-h-screen bg-base text-white relative grain-texture">
      <Header />

      {/* Hero */}
      <main id="main-content" className="pt-36 md:pt-44">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-text-secondary leading-[1.3]">
              {SERVICES_INTRO}
            </h1>
          </motion.div>
        </div>

        {/* Service sections */}
        {services.map((service) => (
          <ServiceSection key={service.id} service={service} />
        ))}

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
              <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-secondary mb-6">
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
      <Footer />
    </div>
  );
}
