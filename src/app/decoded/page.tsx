'use client';

import { useRef, useState, useEffect } from 'react';
import decodedManifest from '../../../decoded_manifest.json';
import Section from './components/Section';
import ProgressBar from './components/ProgressBar';
import InteractiveChart from './components/InteractiveChart';
import RidgelineChart from './components/RidgelineChart';
import AwardGroup from './components/AwardGroup';
import UserUsageChart from './components/UserUsageChart';
import BoxAnimationHero from './components/BoxAnimationHero';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';

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
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Track scroll position to show/hide scroll-to-top button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Show button after scrolling past ~50% of viewport height
      setShowScrollTop(container.scrollTop > window.innerHeight * 0.5);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ProgressBar containerRef={containerRef} />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed top-6 left-6 z-50 p-3 rounded-full bg-black/50 backdrop-blur border border-white/10 hover:border-void-orange text-white hover:text-void-orange transition-all duration-300 group ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
      </button>

      <main
        ref={containerRef}
        className="overflow-y-auto snap-y snap-mandatory h-screen w-screen overflow-x-hidden scrollbar-hide bg-black"
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
            { type: 'message' as const, id: 'owner-message' },
            ...(libraryGrowthChart ? [libraryGrowthChart] : []),
            ...(usersSection ? [usersSection] : []),
            ...(heatmapChart ? [heatmapChart] : []),
            ...(awardsSection ? [awardsSection] : []),
          ];
          return reorderedSections;
        })().map((section, index) => {
          // SECTION: OWNER MESSAGE
          if (section.type === 'message') {
            return (
              <Section key="owner-message" className="bg-black relative border-t border-neutral-900">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16">
                  {/* Owner 1 Message */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                  >
                    <h3 className="text-void-orange font-mono text-lg">Rasheed:</h3>
                    <p className="text-neutral-300 text-lg leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                  </motion.div>

                  {/* Owner 2 Message */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-void-orange font-mono text-lg">Jack:</h3>
                    <p className="text-neutral-300 text-lg leading-relaxed">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
                    </p>
                  </motion.div>
                </div>

                {/* Explore Arrow */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="mt-16 flex flex-col items-center gap-4"
                >
                  <span
                    className="text-void-orange text-lg font-mono uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(255,107,53,0.5)]"
                  >
                    explore
                  </span>
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                    <div className="absolute inset-0 blur-xl bg-void-orange/30 rounded-full scale-150" />
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="relative text-void-orange drop-shadow-[0_0_20px_rgba(255,107,53,0.8)]"
                    >
                      <path
                        d="M12 4L12 20M12 20L6 14M12 20L18 14"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </motion.div>
              </Section>
            );
          }
          // SECTION: INTRO (Box Animation Hero)
          if (section.type === 'intro') {
            const intro = section as IntroSection;
            return (
              <section
                key={intro.id || index}
                className="min-h-screen w-full snap-start snap-always flex flex-col items-center justify-center relative overflow-hidden"
              >
                <BoxAnimationHero
                  title={intro.title}
                  subtitle={intro.subtitle}
                  description={intro.description}
                />
              </section>
            );
          }

          // SECTION: CHART (InteractiveChart or RidgelineChart)
          if (section.type === 'chart') {
            const chart = section as ChartSection;
            const isHeatmap = chart.chart_type === 'heatmap';
            
            return (
              <Section key={chart.id || index} className="bg-black relative border-t border-neutral-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,53,0.05),transparent_70%)] pointer-events-none" />
                {isHeatmap ? (
                  <RidgelineChart
                    data={chart.data as unknown as WeeklyPatternItem[]}
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
              </Section>
            );
          }

          // SECTION: AWARDS (Grouped by Category)
          if (section.type === 'awards') {
            const awards = section as AwardsSection;
            const groups = processAwards(awards.items);

            return groups.map((group, i) => (
              <Section key={`${section.id}-group-${i}`} className="bg-black border-t border-neutral-900">
                <AwardGroup
                  title={group.title}
                  items={group.items}
                  year={decodedManifest.meta.year}
                />
              </Section>
            ));
          }

          // SECTION: USERS (How We Use The Server)
          if (section.type === 'users') {
            const usersSection = section as UsersSection;
            return (
              <Section key={section.id || index} className="bg-black relative border-t border-neutral-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,53,0.05),transparent_70%)] pointer-events-none" />
                <UserUsageChart
                  users={usersSection.data}
                  year={decodedManifest.meta.year}
                  title="How We Use Blackbox"
                />
              </Section>
            );
          }

          return null;
        })}

        {/* SECTION FINAL: OUTRO */}
        <Section className="bg-black relative overflow-hidden border-t border-neutral-900">
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
        </Section>
      </main>
    </>
  );
}
