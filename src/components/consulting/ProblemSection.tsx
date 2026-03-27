'use client';

import { motion } from 'framer-motion';

export default function ProblemSection() {
  return (
    <section className="relative py-20 px-6">
      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <p
          className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-text-body"
          style={{ fontSize: 'clamp(1rem, 3vw, 1.875rem)' }}
        >
          The AI consulting market is full of hype — overcharging, over-promising, and exploiting the massive information gap between those in the know and those outside it. You deserve better than half-baked systems at prices that don&apos;t reflect the ease of doing things. Whether I&apos;m teaching your team, cutting your costs, or building your system — transparency is fundamental, and my focus is making you capable of navigating AI on your own.
        </p>
      </motion.div>
    </section>
  );
}
