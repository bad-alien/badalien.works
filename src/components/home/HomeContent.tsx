'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/home/HeroSection';
import ServicesPreview from '@/components/home/ServicesPreview';
import WorkPreview from '@/components/home/WorkPreview';
import AboutPreview from '@/components/home/AboutPreview';
import InsightsPreview from '@/components/home/InsightsPreview';
import CtaSection from '@/components/home/CtaSection';
import { useChat } from '@/contexts/ChatContext';
import type { PostMeta } from '@/lib/blog';

interface HomeContentProps {
  latestPosts: PostMeta[];
}

export default function HomeContent({ latestPosts }: HomeContentProps) {
  const [headerVisible, setHeaderVisible] = useState(false);
  const { openChat, setEntryPoint } = useChat();

  const handleChatActivated = () => {
    setHeaderVisible(true);
    setEntryPoint('hero');
    openChat();
  };

  const handleLearnMore = () => {
    setHeaderVisible(true);

    setTimeout(() => {
      const contentSection = document.querySelector('#main-content');
      if (contentSection) {
        contentSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-base relative grain-texture">
      <HeroSection
        onChatActivated={handleChatActivated}
        onLearnMore={handleLearnMore}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: headerVisible ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <Header />
      </motion.div>

      <motion.main
        id="main-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: headerVisible ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h1 className="sr-only">Bad Alien — AI Consulting &amp; Enablement</h1>

        <ServicesPreview />
        <WorkPreview />
        <AboutPreview />
        <InsightsPreview posts={latestPosts} />
        <CtaSection />
      </motion.main>

      <Footer />
    </div>
  );
}
