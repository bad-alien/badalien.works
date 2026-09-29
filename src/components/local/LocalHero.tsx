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
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-secondary block mb-6">
          {'// pasadena, ca'}
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-tight text-text-heading mb-8">
          AI Consultant in Pasadena, CA
        </h1>
        <p className="text-lg md:text-2xl text-text-body leading-relaxed max-w-3xl mb-10">
          Bad Alien is an independent AI consultancy in Pasadena, California, run by Rasheed. I help
          small and mid-sized businesses in Pasadena, across Los Angeles, and remotely put AI to work:
          hands-on team enablement, workflow automation, private LLM deployments, and custom-built
          tools. Discovery first, no black boxes, and every engagement ends with your team able to run
          it without me.
        </p>
        <DualCta
          primary={{ type: 'link', label: 'Book a free intro call', href: '/contact#book' }}
          secondary={{ type: 'button', label: 'Or ask my AI', onClick: handleChatOpen }}
        />
      </motion.div>
    </section>
  );
}
