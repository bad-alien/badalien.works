'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Logo from '@/components/shared/Logo';
import { useChat } from '@/contexts/ChatContext';

export default function ConsultHero() {
  const { openChat, setEntryPoint } = useChat();

  const handleChatOpen = () => {
    setEntryPoint('widget');
    openChat();
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-center relative h-24 md:h-28">
          <Link
            href="/"
            className="absolute left-6 lg:left-8 flex items-center gap-2 text-sm font-light tracking-wider text-white/70 hover:text-white transition-colors"
          >
            <span aria-hidden="true">&larr;</span> Back to Home
          </Link>

          <Logo size="md" className="!h-[77px]" />

          <Link
            href="/contact"
            className="absolute right-6 lg:right-8 px-6 py-2.5 bg-white text-black font-sans text-lg hover:bg-white/90 transition-colors rounded"
          >
            Let&apos;s Talk
          </Link>
        </div>
      </header>

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
          Stop Watching Competitors
          <br />
          Ship AI While You Plan
        </h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl sm:text-2xl md:text-3xl text-text-heading mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          I help product teams ship AI features in weeks, not quarters.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Primary CTA - Talk to AI */}
          <button
            onClick={handleChatOpen}
            className="group relative px-8 py-4 min-h-[44px] text-lg font-medium text-black bg-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            <span className="relative z-10">Talk to My AI</span>
          </button>

          {/* Secondary CTA - Book a Call */}
          <a
            href="/contact"
            className="group relative px-8 py-4 min-h-[44px] text-lg font-medium text-white bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 hover:bg-elevated"
          >
            <span className="relative z-10">Book a Call</span>
          </a>
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
