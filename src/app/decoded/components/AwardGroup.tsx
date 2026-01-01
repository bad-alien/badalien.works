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
              const match = item.description.match(/^((viewed|played) by (\d+) users?:)\s*(.+)$/i);
              if (match) {
                const [, header, , , names] = match;
                // Split names and limit to fit in 2 rows (~3 names per row max)
                const nameList = names.split(',').map(n => n.trim());
                const maxNames = 6;
                const displayNames = nameList.slice(0, maxNames);
                const remaining = nameList.length - maxNames;
                const midpoint = Math.ceil(displayNames.length / 2);
                const row1 = displayNames.slice(0, midpoint).join(', ');
                const row2 = displayNames.slice(midpoint).join(', ') + (remaining > 0 ? ` +${remaining} more` : '');
                return (
                  <div className="text-center">
                    <p className="font-mono tracking-wider uppercase text-void-orange text-xs font-bold mb-1">
                      {header}
                    </p>
                    <p className="font-mono tracking-wider uppercase text-void-orange text-xs font-bold">
                      {row1}
                    </p>
                    {row2 && (
                      <p className="font-mono tracking-wider uppercase text-void-orange text-xs font-bold">
                        {row2}
                      </p>
                    )}
                  </div>
                );
              }
              return (
                <p className="font-mono tracking-wider uppercase text-void-orange text-xs font-bold text-center">
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

      {/* Podium Container - items-start so text extends below */}
      <div className="flex items-start justify-center gap-4 md:gap-8 w-full">
        {renderCard(rank2, 'left')}
        {renderCard(rank1, 'center')}
        {renderCard(rank3, 'right')}
      </div>
    </div>
  );
}
