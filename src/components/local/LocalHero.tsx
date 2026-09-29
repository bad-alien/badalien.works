'use client';

import { motion } from 'framer-motion';
import Header from '@/components/shared/Header';
import DualCta from '@/components/shared/DualCta';
import { useChat } from '@/contexts/ChatContext';

export default function LocalHero() {
  const { openChat, setEntryPoint } = useChat();

  const handleChatOpen = () => {
    setEntryPoint('widget');
    openChat();
  };

  return (
    <section className="relative px-6 pt-36 pb-16 md:pt-44 md:pb-24">
      <Header />
      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 className="sr-only">AI Consultant in Pasadena, CA</h1>
        <p className="text-lg md:text-2xl text-text-body leading-relaxed mb-10">
          Bad Alien is an independent AI consultancy in Pasadena, California. I help small and
          mid-sized businesses in Pasadena, Los Angeles, and remotely put AI to work: team
          enablement, workflow automation, private LLMs, and custom tools. Discovery first, no
          black boxes, and your team runs it without me when we&apos;re done.
        </p>
        <DualCta
          primary={{ type: 'link', label: 'Book a free intro call', href: '/contact#book' }}
          secondary={{ type: 'button', label: 'Or ask my AI', onClick: handleChatOpen }}
        />
      </motion.div>
    </section>
  );
}
