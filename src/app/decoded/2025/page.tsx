'use client';

import { useRef } from 'react';
import decodedData from './data/decoded_data.json';
import HorizontalSection from './components/HorizontalSection';
import ProgressBar from './components/ProgressBar';
import InteractiveChart from './components/InteractiveChart';
import AwardSlide from './components/AwardSlide';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DecodedPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ProgressBar containerRef={containerRef} />
      
      {/* Back Button */}
      <Link 
        href="/"
        className="fixed top-6 left-6 z-50 p-3 rounded-full bg-black/50 backdrop-blur border border-white/10 hover:border-void-orange text-white hover:text-void-orange transition-all duration-300 group"
      >
        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </Link>

      <main 
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory h-screen w-screen overflow-y-hidden scrollbar-hide bg-black"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* SECTION 1: INTRO */}
        <HorizontalSection className="bg-gradient-to-br from-black via-neutral-900 to-black">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 mb-4">
                DECODED
              </h1>
              <p className="text-2xl md:text-4xl font-mono text-void-orange tracking-widest">
                2025
              </p>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-neutral-400 max-w-xl mx-auto text-lg"
            >
              Scroll right to explore the year in data.
            </motion.p>
            <motion.div 
              className="animate-bounce text-neutral-600 mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              →
            </motion.div>
          </div>
        </HorizontalSection>

        {/* SECTION 2: LIBRARY GROWTH */}
        <HorizontalSection className="bg-black relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,53,0.05),transparent_70%)]" />
          <InteractiveChart 
            type="area" 
            data={decodedData.stats.library_growth} 
            dataKey="movies" 
            xAxisKey="month"
            title="Library Expansion"
            color="#FF6B35"
          />
        </HorizontalSection>

        {/* SECTION 3: SERVER DENSITY */}
        <HorizontalSection className="bg-neutral-950">
          <InteractiveChart 
            type="bar" 
            data={decodedData.stats.server_density} 
            dataKey="usage" 
            xAxisKey="time"
            title="Server Load Distribution"
            color="#00FF00"
          />
        </HorizontalSection>

        {/* SECTION 4+: AWARDS */}
        {decodedData.stats.awards.map((award, index) => (
          <HorizontalSection key={index} className="bg-black border-l border-neutral-900">
            <AwardSlide 
              category={award.category}
              title={award.title}
              imagePath={award.image_path}
              description={award.description}
            />
          </HorizontalSection>
        ))}

        {/* SECTION FINAL: OUTRO */}
        <HorizontalSection className="bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none" />
          <div className="text-center z-10">
            <h2 className="text-5xl md:text-8xl font-bold mb-8 text-white">
              END OF LINE
            </h2>
            <Link 
              href="/"
              className="inline-block px-12 py-4 bg-white text-black font-bold text-xl rounded-full hover:bg-void-orange hover:text-white transition-all duration-300 hover:scale-105"
            >
              Return to Base
            </Link>
          </div>
        </HorizontalSection>
      </main>
    </>
  );
}
