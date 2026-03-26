'use client';

import { motion } from 'framer-motion';
import Header from '@/components/shared/Header';
import { useChat } from '@/contexts/ChatContext';
import DualCta from '@/components/shared/DualCta';

export default function ConsultHero() {
  const { openChat, setEntryPoint } = useChat();

  const handleChatOpen = () => {
    setEntryPoint('widget');
    openChat();
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <Header />

      {/* Subtle atmospheric background gradient - minimal animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight leading-tight font-display"
        >
          Honest AI Consulting
          <br />
          In a Market Full of Hype
        </h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl sm:text-2xl md:text-3xl text-text-heading mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Discovery-first engagements. Transparent pricing. Systems that actually work.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <DualCta
            primary={{ type: 'button', label: 'Talk to My AI', onClick: handleChatOpen }}
            secondary={{ type: 'link', label: 'Book a Call', href: '/contact' }}
          />
        </motion.div>
      </motion.div>

      {/* Mobile sticky CTA bar - only visible on scroll */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0A0A0A]/98 backdrop-blur-md border-t border-border p-4"
        initial={{ y: 100 }}
        whileInView={{ y: 0 }}
        viewport={{ once: false, margin: '200px' }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={handleChatOpen}
          className="w-full px-8 py-4 min-h-[48px] text-lg font-medium text-black bg-white rounded-lg transition-all duration-300 active:scale-95"
        >
          Talk to My AI
        </button>
      </motion.div>
    </section>
  );
}
