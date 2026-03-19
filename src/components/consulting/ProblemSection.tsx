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
          Your team is drowning in AI hype but shipping nothing. POCs stall. Vendors overpromise. Meanwhile, competitors are already capturing the upside. You need someone who can cut through the noise and actually ship.
        </p>
      </motion.div>
    </section>
  );
}
