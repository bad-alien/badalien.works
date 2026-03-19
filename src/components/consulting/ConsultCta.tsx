'use client';

import { motion } from 'framer-motion';
import { useChat } from '@/contexts/ChatContext';

export default function ConsultCta() {
  const { setIsWidgetOpen } = useChat();

  const handleChatOpen = () => {
    setIsWidgetOpen(true);
  };

  return (
    <section className="relative py-32 px-6">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        {/* Heading */}
        <h2
          className="text-5xl sm:text-6xl md:text-7xl mb-12 font-display"
        >
          Ready to Talk?
        </h2>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          {/* Primary CTA - Talk to AI */}
          <button
            onClick={handleChatOpen}
            className="group relative px-8 py-4 min-h-[44px] text-lg font-medium text-black bg-white rounded-lg transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">Talk to My AI</span>
          </button>

          {/* Secondary CTA - Book a Call */}
          <a
            href="/contact"
            className="group relative px-8 py-4 min-h-[44px] text-lg font-medium text-white bg-surface border border-border rounded-xl transition-all duration-300 hover:bg-elevated"
          >
            <span className="relative z-10">Book a Call</span>
          </a>
        </div>

        {/* Email alternative */}
        <motion.p
          className="text-xl text-white/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Or email me at{' '}
          <a
            href="mailto:contact@badalien.works"
            className="text-white/70 hover:text-white transition-colors border-b border-white/30 hover:border-white"
          >
            contact@badalien.works
          </a>
        </motion.p>
      </motion.div>
    </section>
  );
}
