'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface AwardSlideProps {
  category: string;
  title: string;
  imagePath: string;
  description: string;
}

export default function AwardSlide({ category, title, imagePath, description }: AwardSlideProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl mx-auto w-full">
      {/* Text Content */}
      <div className="flex-1 text-center md:text-left space-y-6 order-2 md:order-1">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 border border-void-orange/50 rounded-full text-void-orange text-sm font-mono tracking-wider mb-4">
            {category.toUpperCase()}
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 leading-none">
            {title}
          </h2>
          <p className="text-xl text-neutral-400 font-light max-w-lg">
            {description}
          </p>
        </motion.div>
      </div>

      {/* Poster Image */}
      <motion.div 
        className="flex-1 relative order-1 md:order-2 flex justify-center"
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: 0.2 
        }}
      >
        <div className="relative w-[300px] h-[450px] md:w-[400px] md:h-[600px] shadow-2xl shadow-void-orange/20 rounded-xl overflow-hidden border border-neutral-800 group">
          <Image
            src={imagePath}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        </div>
      </motion.div>
    </div>
  );
}
