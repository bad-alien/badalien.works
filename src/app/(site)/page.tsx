'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/home/HeroSection';
import BusinessChatInterface from '@/components/chat/BusinessChatInterface';
import ServicesPreview from '@/components/home/ServicesPreview';
import WorkPreview from '@/components/home/WorkPreview';
import AboutPreview from '@/components/home/AboutPreview';
import CtaSection from '@/components/home/CtaSection';
import { useChat } from '@/contexts/ChatContext';

export default function Home() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const { entryPoint } = useChat();

  return (
    <div className="min-h-screen bg-base relative grain-texture">
      {/* Logo Animation Overlay */}
      <HeroSection
        onChatActivated={() => setHeaderVisible(true)}
      />

      {/* Header - Always rendered, fades in during logo-to-header transition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: headerVisible ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <Header />
      </motion.div>

      {/* Main Content - Always rendered, fades in with header */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: headerVisible ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Chat Section - Fills viewport below header (hidden when chat activated from hero) */}
        {entryPoint !== 'hero' && (
          <section className="h-[calc(85vh-96px)] px-4 pt-12 md:pt-16 pb-2 bg-base overflow-hidden">
            <div className="max-w-5xl mx-auto h-full">
              <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-secondary mb-4">{"// AI CONSULTING & ENABLEMENT"}</p>
              <BusinessChatInterface />
            </div>
          </section>
        )}

        {/* Scroll-down sections */}
        <ServicesPreview />
        <WorkPreview />
        <AboutPreview />
        <CtaSection />
      </motion.main>

      <Footer />
    </div>
  );
}
