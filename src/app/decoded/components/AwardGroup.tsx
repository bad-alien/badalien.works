'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AwardItem {
  category: string;
  title: string;
  description: string;
  image_asset_name: string;
  rank: number;
}

interface AwardGroupProps {
  title: string;
  items: AwardItem[];
  year: string;
}

export default function AwardGroup({ title, items, year }: AwardGroupProps) {
  // We strictly expect ranks 1, 2, and 3.
  const rank1 = items.find(i => i.rank === 1);
  const rank2 = items.find(i => i.rank === 2);
  const rank3 = items.find(i => i.rank === 3);

  // Helper to render a single podium card
  const renderCard = (item: AwardItem | undefined, position: 'center' | 'left' | 'right') => {
    if (!item) return null;

    const isCenter = position === 'center';
    
    // Animation Delays: Center (0s) -> Left (0.3s) -> Right (0.6s)
    const delay = isCenter ? 0 : position === 'left' ? 0.3 : 0.6;

    return (
      <motion.div
        key={item.title}
        initial={{ 
          opacity: 0, 
          y: 50, 
          scale: 0.8 
        }}
        whileInView={{ 
          opacity: 1, 
          y: 0, 
          scale: 1 
        }}
        transition={{ 
          delay,
          type: "spring",
          stiffness: 70,
          damping: 12
        }}
        className={cn(
          "flex flex-col items-center gap-6 relative shrink-0",
          isCenter ? "z-20" : "z-10",
          position === 'left' && "-mr-[18%] md:-mr-[80px]",
          position === 'right' && "-ml-[18%] md:-ml-[80px]",
        )}
        style={{
           transform: isCenter ? 'scale(1.3) translateY(-40px)' : 'scale(0.85)',
        }}
      >
        {/* Poster - Rank Badge Removed */}
        <div 
          className={cn(
            "relative rounded-2xl overflow-hidden border transition-all duration-700 group hover:shadow-2xl",
            isCenter 
              ? "shadow-[0_0_80px_rgba(255,107,53,0.5)] border-void-orange/50 scale-105" 
              : "shadow-xl border-neutral-800 opacity-60 hover:opacity-100"
          )}
          style={{
            width: '240px',
            height: '360px',
          }}
        >
          <Image
            src={`/decoded/assets/${year}/${item.image_asset_name}`}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
          
          {/* Rank Indicator (Subtle overlay instead of badge) */}
          <div className={cn(
            "absolute bottom-4 left-4 font-black text-4xl italic tracking-tighter opacity-20",
            isCenter ? "text-void-orange opacity-40" : "text-white"
          )}>
            {item.rank}
          </div>
        </div>

        {/* Text Label - Larger for center */}
        <div className={cn(
          "text-center transition-all duration-500",
          isCenter ? "max-w-[350px] scale-110" : "max-w-[200px]"
        )}>
          <h3 className={cn(
            "font-black leading-none tracking-tighter mb-2",
            isCenter ? "text-4xl md:text-5xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" : "text-xl text-neutral-400"
          )}>
            {item.title}
          </h3>
          <p className={cn(
            "font-mono tracking-widest uppercase",
            isCenter ? "text-void-orange text-sm font-bold" : "text-neutral-600 text-[10px]"
          )}>
            {item.description}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto flex flex-col items-center justify-center p-4 md:p-8">
      {/* Title */}
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 uppercase tracking-tighter mb-8 md:mb-16 text-center"
      >
        {title}
      </motion.h2>

      {/* Podium Container - Scale down on mobile to fit width */}
      <div className="flex items-center justify-center w-full origin-top scale-[0.6] md:scale-100 transition-transform duration-300">
        {renderCard(rank2, 'left')}
        {renderCard(rank1, 'center')}
        {renderCard(rank3, 'right')}
      </div>
    </div>
  );
}
