'use client';

import { motion } from 'framer-motion';
import { useChat } from '@/contexts/ChatContext';
import DualCta from '@/components/shared/DualCta';

export default function ConsultCta() {
  const { openChat, setEntryPoint } = useChat();

  const handleChatOpen = () => {
    setEntryPoint('widget');
    openChat();
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
        <DualCta
          primary={{ type: 'button', label: 'Talk to My AI', onClick: handleChatOpen }}
          secondary={{ type: 'link', label: 'Book a Call', href: '/contact#book' }}
          className="mb-12"
        />

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
