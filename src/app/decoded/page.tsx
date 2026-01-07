'use client';

import { useRef, useEffect } from 'react';
import decodedManifest from '../../../decoded_manifest.json';
import HorizontalSection from './components/HorizontalSection';
import ProgressBar from './components/ProgressBar';
import InteractiveChart from './components/InteractiveChart';
import RidgelineChart from './components/RidgelineChart';
import AwardGroup from './components/AwardGroup';
import UserUsageChart from './components/UserUsageChart';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Types for the Manifest
interface BaseSection {
  type: string;
  id?: string;
}

interface IntroSection extends BaseSection {
  type: 'intro';
  title: string;
  subtitle: string;
  description: string;
}

interface ChartSection extends BaseSection {
  type: 'chart';
  title?: string;
  chart_type: 'area' | 'bar' | 'heatmap';
  config: Record<string, unknown>;
  data: Record<string, string | number>[];
  user_joins?: { username: string; date: string; avatar: string }[];
}

interface AwardItem {
  category: string;
  title: string;
  description: string;
  image_asset_name: string;
}

interface AwardsSection extends BaseSection {
  type: 'awards';
  items: AwardItem[];
}

interface UserData {
  name: string;
  join_date: string;
  image_asset_name: string;
  play_time: {
    total: string;
    movie: string;
    tv: string;
    music: string;
  };
}

interface UsersSection extends BaseSection {
  type: 'users';
  title?: string;
  data: UserData[];
}

type Section = IntroSection | ChartSection | AwardsSection | UsersSection;

interface WeeklyPatternItem {
  day: string;
  hour: number;
  value: number;
}

interface WeeklyPatternConfig {
  color: string;
  unit?: string;
}

interface InteractiveChartConfig {
  xaxis_key: string;
  series: { key: string; label: string; color: string }[];
  unit?: string;
}

// Helper to process awards into groups
const processAwards = (items: AwardItem[]) => {
  const groups: Record<string, { title: string; items: (AwardItem & { rank: number })[] }> = {
    movies: { title: "Top Movies", items: [] },
    tv: { title: "Top TV Shows", items: [] },
    artists: { title: "Top Artists", items: [] },
    albums: { title: "Top Albums", items: [] },
  };

  items.forEach(item => {
    let rank = 0;
    const rankMatch = item.category.match(/^#(\d+)/);
    if (rankMatch) {
      rank = parseInt(rankMatch[1], 10);
    }

    const awardItem = { ...item, rank };
    const lowerCat = item.category.toLowerCase();

    if (lowerCat.includes('movie')) {
      groups.movies.items.push(awardItem);
    } else if (lowerCat.includes('tv show')) {
      groups.tv.items.push(awardItem);
    } else if (lowerCat.includes('artist')) {
      groups.artists.items.push(awardItem);
    } else if (lowerCat.includes('album')) {
      groups.albums.items.push(awardItem);
    }
    // Skip user awards - handled separately in UserUsageChart
  });

  // Filter out empty groups and sort items by rank
  return Object.values(groups)
    .filter(g => g.items.length > 0)
    .map(g => ({
      ...g,
      items: g.items.sort((a, b) => a.rank - b.rank)
    }));
};

export default function DecodedPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use window listener for global wheel capture
    const handleWheel = (e: WheelEvent) => {
      const isVertical = Math.abs(e.deltaY) > Math.abs(e.deltaX);
      if (isVertical) {
        container.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

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
        {/* Reorder sections: intro, library-growth, users, heatmap, awards */}
        {(() => {
          const sections = decodedManifest.sections as Section[];
          const introSection = sections.find(s => s.type === 'intro');
          const libraryGrowthChart = sections.find(s => s.type === 'chart' && (s as ChartSection).chart_type !== 'heatmap');
          const heatmapChart = sections.find(s => s.type === 'chart' && (s as ChartSection).chart_type === 'heatmap');
          const usersSection = sections.find(s => s.type === 'users');
          const awardsSection = sections.find(s => s.type === 'awards');
          const reorderedSections = [
            ...(introSection ? [introSection] : []),
            ...(libraryGrowthChart ? [libraryGrowthChart] : []),
            ...(usersSection ? [usersSection] : []),
            ...(heatmapChart ? [heatmapChart] : []),
            ...(awardsSection ? [awardsSection] : []),
          ];
          return reorderedSections;
        })().map((section, index) => {
          // SECTION: INTRO
          if (section.type === 'intro') {
            const intro = section as IntroSection;
            return (
              <HorizontalSection key={intro.id || index} className="bg-gradient-to-br from-black via-neutral-900 to-black">
                <div className="text-center space-y-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                  >
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 mb-4">
                      {intro.title}
                    </h1>
                    <p className="text-2xl md:text-4xl font-mono text-void-orange tracking-widest">
                      {intro.subtitle}
                    </p>
                  </motion.div>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-neutral-400 max-w-xl mx-auto text-lg"
                  >
                    {intro.description}
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
            );
          }

          // SECTION: CHART (InteractiveChart or RidgelineChart)
          if (section.type === 'chart') {
            const chart = section as ChartSection;
            const isHeatmap = chart.chart_type === 'heatmap';
            
            return (
              <HorizontalSection key={chart.id || index} className="bg-black relative border-l border-neutral-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,53,0.05),transparent_70%)] pointer-events-none" />
                {isHeatmap ? (
                  <RidgelineChart
                    data={chart.data as unknown as WeeklyPatternItem[]}
                    config={chart.config as unknown as WeeklyPatternConfig}
                    title="When We Use Blackbox"
                  />
                ) : (
                  <InteractiveChart
                    type={chart.chart_type as 'area' | 'bar'}
                    data={chart.data}
                    config={chart.config as unknown as InteractiveChartConfig}
                    title={chart.title}
                  />
                )}
              </HorizontalSection>
            );
          }

          // SECTION: AWARDS (Grouped by Category)
          if (section.type === 'awards') {
            const awards = section as AwardsSection;
            const groups = processAwards(awards.items);

            return groups.map((group, i) => (
              <HorizontalSection key={`${section.id}-group-${i}`} className="bg-black border-l border-neutral-900">
                <AwardGroup
                  title={group.title}
                  items={group.items}
                  year={decodedManifest.meta.year}
                />
              </HorizontalSection>
            ));
          }

          // SECTION: USERS (How We Use The Server)
          if (section.type === 'users') {
            const usersSection = section as UsersSection;
            return (
              <HorizontalSection key={section.id || index} className="bg-black relative border-l border-neutral-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,53,0.05),transparent_70%)] pointer-events-none" />
                <UserUsageChart
                  users={usersSection.data}
                  year={decodedManifest.meta.year}
                  title="How We Use Blackbox"
                />
              </HorizontalSection>
            );
          }

          return null;
        })}

        {/* SECTION FINAL: OUTRO */}
        <HorizontalSection className="bg-black relative overflow-hidden border-l border-neutral-900">
          <div className="absolute inset-0 bg-neutral-900/20 opacity-20 pointer-events-none" />
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
