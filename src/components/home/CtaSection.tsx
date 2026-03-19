'use client';

import { motion } from 'framer-motion';

interface CtaSectionProps {
  scrollToChat: () => void;
}

export default function CtaSection({ scrollToChat }: CtaSectionProps) {
  return (
    <section className="py-32 px-4 bg-black relative overflow-hidden">
      {/* Background gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <h2
          className="text-5xl md:text-7xl font-bold text-white mb-8"
          style={{ fontFamily: 'var(--font-science-gothic)' }}
        >
          Ready to Get Started?
        </h2>

        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Let&apos;s talk about your AI strategy and how I can help
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Primary CTA */}
          <a
            href="/contact"
            className="px-10 py-5 bg-white text-black text-lg font-bold rounded-sm hover:bg-gray-200 transition-all duration-300 hover:scale-105"
          >
            Book a Call
          </a>

          {/* Secondary CTA */}
          <button
            onClick={scrollToChat}
            className="group px-10 py-5 bg-white/5 backdrop-blur-sm border border-white/10 text-white text-lg font-semibold rounded-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            Or Ask My AI
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300">
              ↑
            </span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
