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
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
      >
        {/* Heading */}
        <h2
          className="text-5xl sm:text-6xl md:text-7xl mb-12"
          style={{ fontFamily: 'var(--font-science-gothic)' }}
        >
          Ready to Talk?
        </h2>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          {/* Primary CTA - Talk to AI */}
          <button
            onClick={handleChatOpen}
            className="group relative px-8 py-4 min-h-[44px] text-lg font-medium text-black bg-white rounded-lg transition-all duration-300 hover:scale-105"
            style={{ fontFamily: 'var(--font-gemunu-libre)' }}
          >
            <span className="relative z-10">Talk to My AI</span>
          </button>

          {/* Secondary CTA - Book a Call */}
          <a
            href="/contact"
            className="group relative px-8 py-4 min-h-[44px] text-lg font-medium text-white bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg transition-all duration-300 hover:bg-white/10 hover:border-white/30"
            style={{ fontFamily: 'var(--font-gemunu-libre)' }}
          >
            <span className="relative z-10">Book a Call</span>
          </a>
        </div>

        {/* Email alternative */}
        <motion.p
          className="text-xl text-white/50"
          style={{ fontFamily: 'var(--font-gemunu-libre)' }}
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
