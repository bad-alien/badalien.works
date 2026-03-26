'use client';

import { motion } from 'framer-motion';
import DualCta from '@/components/shared/DualCta';

interface CtaSectionProps {
  scrollToChat?: () => void;
}

export default function CtaSection({ scrollToChat }: CtaSectionProps) {
  return (
    <section className="py-32 px-4 bg-base relative overflow-hidden">
      {/* Background gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/50 to-transparent opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <h2 className="text-5xl md:text-7xl font-bold text-text-heading mb-8 font-display">
          Ready to Get Started?
        </h2>

        <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-2xl mx-auto">
          Let&apos;s talk about your AI strategy and how I can help
        </p>

        <DualCta
          primary={{ type: 'link', label: 'Book a Call', href: '/contact' }}
          secondary={{ type: 'button', label: 'Or Ask My AI', onClick: scrollToChat ?? (() => {}) }}
          size="large"
        />
      </motion.div>
    </section>
  );
}
