'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, useCallback } from 'react';

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

// Map award group titles to their corresponding header images
const titleImageMap: Record<string, string> = {
  'Top Movies': 'top-movies.png',
  'Top TV Shows': 'top-tvshows.png',
  'Top Artists': 'top-artists.png',
  'Top Albums': 'top-albums.png',
};

export default function AwardGroup({ title, items, year }: AwardGroupProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  // Track scroll position to update active dot
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isMobile) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.offsetWidth;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(newIndex, 2));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Scroll to specific item when dot is clicked
  const scrollToItem = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const itemWidth = container.offsetWidth;
    container.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
  };

  // We strictly expect ranks 1, 2, and 3.
  const rank1 = items.find(i => i.rank === 1);
  const rank2 = items.find(i => i.rank === 2);
  const rank3 = items.find(i => i.rank === 3);

  // For mobile carousel, order is 1, 2, 3
  const mobileOrder = [rank1, rank2, rank3].filter(Boolean) as (AwardItem & { rank: number })[];

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
          "flex flex-col items-center relative shrink-0",
          isCenter ? "z-20 mx-8" : "z-10",
        )}
      >
        {/* Poster */}
        <div
          className={cn(
            "relative rounded-2xl overflow-hidden border transition-all duration-700 group hover:shadow-2xl",
            isCenter
              ? "shadow-[0_0_60px_rgba(255,107,53,0.4)] border-void-orange/50"
              : "shadow-xl border-neutral-800 opacity-70 hover:opacity-100"
          )}
          style={{
            width: isCenter ? '280px' : '200px',
            height: isCenter ? '420px' : '300px',
            marginTop: isCenter ? '0' : '120px', // Offset side cards down so poster bottoms align
          }}
        >
          <Image
            src={`/decoded/assets/${year}/${item.image_asset_name}`}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />

          {/* Rank Indicator (Top-left watermark) */}
          <div className={cn(
            "absolute top-4 left-4 font-black text-4xl italic tracking-tighter opacity-20",
            isCenter ? "text-void-orange opacity-40" : "text-white"
          )}>
            {item.rank}
          </div>
        </div>

        {/* Text Label */}
        <div className={cn(
          "text-center transition-all duration-500 mt-4",
          isCenter ? "max-w-[300px]" : "max-w-[180px]"
        )}>
          <h3 className={cn(
            "font-black leading-tight tracking-tight mb-1 text-center break-words",
            isCenter ? "text-2xl md:text-3xl text-white" : "text-base text-neutral-400"
          )}>
            {item.title}
          </h3>
          {isCenter ? (
            // Center card shows full description with user list (max 2 rows of names)
            (() => {
              const match = item.description.match(/^((\d+)\s*plays?\s*by\s*(\d+)\s*users?:)\s*(.+)$/i)
                || item.description.match(/^((viewed|played)\s*by\s*(\d+)\s*users?:)\s*(.+)$/i);
              if (match) {
                const [, header, , , names] = match;
                // Split names and limit to fit in 2 rows (~3 names per row max)
                const nameList = names.split(',').map(n => n.trim());
                const maxNames = 6;
                const displayNames = nameList.slice(0, maxNames);
                const remaining = nameList.length - maxNames;
                const midpoint = Math.ceil(displayNames.length / 2);
                const row1 = displayNames.slice(0, midpoint).join(', ');
                const row2Suffix = remaining > 0 ? ` +${remaining}` : '';
                const row2 = displayNames.slice(midpoint).join(', ') + row2Suffix;
                return (
                  <div className="text-center max-w-[320px]">
                    <p className="font-mono tracking-wider uppercase text-void-orange text-xs font-bold mb-1">
                      {header}
                    </p>
                    <p className="font-mono tracking-wider uppercase text-void-orange text-xs font-bold break-words">
                      {row1}
                    </p>
                    {row2 && (
                      <p className="font-mono tracking-wider uppercase text-void-orange text-xs font-bold break-words">
                        {row2}
                      </p>
                    )}
                  </div>
                );
              }
              return (
                <p className="font-mono tracking-wider uppercase text-void-orange text-xs font-bold text-center max-w-[320px] break-words">
                  {item.description}
                </p>
              );
            })()
          ) : (
            // Side cards show only "Viewed/Played by X users"
            <p className="font-mono tracking-wider uppercase text-neutral-600 text-[10px] text-center">
              {(() => {
                const match = item.description.match(/(viewed|played) by (\d+) users?/i);
                if (match) {
                  const verb = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
                  return `${verb} by ${match[2]} users`;
                }
                const names = item.description.split(',');
                if (names.length > 1) {
                  return `${names.length} users`;
                }
                return item.description;
              })()}
            </p>
          )}
        </div>
      </motion.div>
    );
  };

  // Mobile card renderer (simplified, all same size)
  const renderMobileCard = (item: AwardItem) => {
    return (
      <div
        key={item.title}
        className="flex-shrink-0 w-full flex flex-col items-center px-4"
      >
        {/* Poster */}
        <div
          className="relative rounded-2xl overflow-hidden border shadow-[0_0_60px_rgba(255,107,53,0.4)] border-void-orange/50"
          style={{
            width: '240px',
            height: '360px',
          }}
        >
          <Image
            src={`/decoded/assets/${year}/${item.image_asset_name}`}
            alt={item.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />

          {/* Rank Indicator */}
          <div className="absolute top-4 left-4 font-black text-4xl italic tracking-tighter text-void-orange opacity-40">
            {item.rank}
          </div>
        </div>

        {/* Text Label */}
        <div className="text-center mt-2 max-w-[280px]">
          <h3 className="text-2xl font-black leading-tight tracking-tight mb-1 text-white break-words">
            {item.title}
          </h3>
          {(() => {
            const match = item.description.match(/^((\d+)\s*plays?\s*by\s*(\d+)\s*users?:)\s*(.+)$/i)
              || item.description.match(/^((viewed|played)\s*by\s*(\d+)\s*users?:)\s*(.+)$/i);
            if (match) {
              const [, header, , , names] = match;
              const nameList = names.split(',').map(n => n.trim());
              const maxNames = 6;
              const displayNames = nameList.slice(0, maxNames);
              const remaining = nameList.length - maxNames;
              const midpoint = Math.ceil(displayNames.length / 2);
              const row1 = displayNames.slice(0, midpoint).join(', ');
              const row2Suffix = remaining > 0 ? ` +${remaining}` : '';
              const row2 = displayNames.slice(midpoint).join(', ') + row2Suffix;
              return (
                <div className="text-center">
                  <p className="font-mono tracking-wider uppercase text-void-orange text-xs font-bold mb-1">
                    {header}
                  </p>
                  <p className="font-mono tracking-wider uppercase text-void-orange text-xs font-bold break-words">
                    {row1}
                  </p>
                  {row2 && (
                    <p className="font-mono tracking-wider uppercase text-void-orange text-xs font-bold break-words">
                      {row2}
                    </p>
                  )}
                </div>
              );
            }
            return (
              <p className="font-mono tracking-wider uppercase text-void-orange text-xs font-bold break-words">
                {item.description}
              </p>
            );
          })()}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto flex flex-col items-center justify-center p-4 md:p-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="relative w-[300px] md:w-[518px] h-[75px] md:h-[130px] mb-1 md:mb-4"
      >
        {titleImageMap[title] ? (
          <Image
            src={`/decoded/assets/${year}/${titleImageMap[title]}`}
            alt={title}
            fill
            className="object-contain"
          />
        ) : (
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 uppercase tracking-tighter text-center">
            {title}
          </h2>
        )}
      </motion.div>

      {/* Mobile Carousel */}
      {isMobile ? (
        <div className="w-full flex flex-col items-center">
          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            className="w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex w-[300%]">
              {mobileOrder.map((item) => (
                <div key={item.title} className="w-1/3 snap-center flex justify-center">
                  {renderMobileCard(item)}
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex gap-3 mt-3">
            {mobileOrder.map((item, index) => (
              <button
                key={item.rank}
                onClick={() => scrollToItem(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  activeIndex === index
                    ? "bg-void-orange scale-125"
                    : "bg-neutral-600 hover:bg-neutral-500"
                )}
                aria-label={`Go to item ${index + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Desktop Podium Container - items-start so text extends below */
        <div className="flex items-start justify-center gap-4 md:gap-8 w-full">
          {renderCard(rank2, 'left')}
          {renderCard(rank1, 'center')}
          {renderCard(rank3, 'right')}
        </div>
      )}
    </div>
  );
}
