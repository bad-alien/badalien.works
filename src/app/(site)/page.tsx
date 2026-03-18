'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/home/HeroSection';
import BusinessChatInterface from '@/components/chat/BusinessChatInterface';

export default function Home() {
  const [headerVisible, setHeaderVisible] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      {/* Logo Animation Overlay */}
      <HeroSection
        onAnimationComplete={() => {}}
        onTransitionStart={() => setHeaderVisible(true)}
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
        {/* Chat Section - Fills viewport below header */}
        <section className="h-[calc(85vh-96px)] px-4 pt-12 md:pt-16 pb-2 bg-black overflow-hidden">
          <div className="max-w-5xl mx-auto h-full">
            <BusinessChatInterface />
          </div>
        </section>

        {/* Content Preview - Peeks up to indicate scrollability */}
        <section className="bg-black border-t border-white/10 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-8"
              style={{ fontFamily: 'var(--font-science-gothic)' }}
            >
              What I Do
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  title: 'AI Strategy',
                  description: 'Transform your business with intelligent automation and strategic AI implementation.',
                },
                {
                  title: 'Creative Technology',
                  description: 'Push boundaries with experimental interfaces, data visualization, and interactive experiences.',
                },
                {
                  title: 'Full-Stack Development',
                  description: 'Build scalable, performant applications with modern web technologies and best practices.',
                },
              ].map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <h3
                    className="text-2xl font-bold text-white mb-4"
                    style={{ fontFamily: 'var(--font-science-gothic)' }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-gray-300 leading-relaxed"
                    style={{ fontFamily: 'var(--font-gemunu-libre)' }}
                  >
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </motion.main>

      <Footer />
    </div>
  );
}
