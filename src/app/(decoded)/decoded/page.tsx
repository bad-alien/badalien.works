'use client';

import { useRef, useState, useEffect } from 'react';
import decodedManifest from '@/decoded_manifest.json';
import Section from './components/Section';
import ProgressBar from './components/ProgressBar';
import InteractiveChart from './components/InteractiveChart';
import RidgelineChart from './components/RidgelineChart';
import AwardGroup from './components/AwardGroup';
import UserUsageChart from './components/UserUsageChart';
import BoxAnimationHero from './components/BoxAnimationHero';
import { motion } from 'framer-motion';
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
        className={`fixed top-4 left-4 md:top-6 md:left-6 z-50 p-2 md:p-3 rounded-full bg-black/50 backdrop-blur border border-white/10 hover:border-void-orange text-white hover:text-void-orange transition-all duration-300 group ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-y-1 transition-transform" />
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
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-3xl mx-auto space-y-3 md:space-y-6"
                >
                  <p className="text-neutral-300 text-sm md:text-lg leading-snug md:leading-relaxed">
                    One of the harshest evolutions of our ever-evolving world is the ever-present blitz of recommendation algorithms. What you see, what you should buy, what to watch or listen to, and now even what you do and make, the grubby hands of tech bros reach for whatever decision in your life they can exploit for profit.
                  </p>
                  <p className="text-neutral-300 text-sm md:text-lg leading-snug md:leading-relaxed">
                    This machine runs on the individual&apos;s sacrifice of choice. It works when you stop selecting for yourself and start accepting whatever you&apos;re handed. Then the platform controls what you see, influences how you think, and opens a gap for ads to be shoveled through.
                  </p>
                  <p className="text-neutral-300 text-sm md:text-lg leading-snug md:leading-relaxed">
                    There isn&apos;t much we can control these days. But we can control where we place our attention—at least temporarily, at least for a moment. It does something to your soul when you choose what to consume with intention. It reclaims your agency. It expresses your individuality. Where attention goes, the mind follows. Even if you end up loving or hating the choice, you can still be satisfied that it was yours.
                  </p>
                  <p className="text-neutral-300 text-sm md:text-lg leading-snug md:leading-relaxed">
                    That&apos;s a big part of why we created Blackbox in 2025. Seeing 5 people simultaneously using the server, having picked what they watch, makes us smile and genuinely happy. Nothing would make us happier than to see that continue and grow in 2026.
                  </p>
                  <p className="text-void-orange font-mono text-xs md:text-lg text-center whitespace-nowrap">
                    Fuck Algorithms. Choose for Yourself. Love You All.
                  </p>
                </motion.div>

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
                    userJoins={chart.user_joins}
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left z-10 max-w-2xl mx-auto space-y-4 md:space-y-8"
          >
            <h3 className="text-void-orange font-mono text-xl md:text-2xl text-center">A Token of Our Appreciation</h3>
            <p className="text-neutral-300 text-sm md:text-lg leading-snug md:leading-relaxed">
              <span className="text-void-orange font-mono">THANK YOU</span> to Will, Chief Music Officer, and Casey, Chief Cinema Officer. They utilize their professional expertise and impeccable taste to continually refine our music and movie / tv libraries. Shout out to Casey and Jack for the hours finagling a finicky-ass disc drive with raided DVDs and Blu-Rays.
            </p>
            <p className="text-neutral-300 text-sm md:text-lg leading-snug md:leading-relaxed">
              <span className="text-void-orange font-mono">THANK YOU</span> to the illustrious Vanneh for putting up with clicks and clacks of the server within reach of her side of the bed and the constant yips and yaps of an exuberant Jack.
            </p>
            <p className="text-neutral-300 text-sm md:text-lg leading-snug md:leading-relaxed">
              <span className="text-void-orange font-mono">THANK YOU</span> to you. For engaging with this project, for putting up with bugs / tech issues, for providing ideas and feedback. And for actually using the damn thing. A huuuuuge thank you to everyone who contributed to our end of year fundraise. We were very hesitant to even do this and beyond appreciative for everyone who chose to contribute. And so, so grateful to Troy who not only volunteered to take the initiative on this, but also coordinated everything himself.
            </p>
            <p className="text-neutral-300 text-sm md:text-lg leading-snug md:leading-relaxed">
              As a token of our gratitude, we have built a way for anyone to request whatever TV show or movie you want. All you have to do is follow the link, sign into your Plex account, and then hit request for whatever content you desire. Blackbox will then retrieve that content and automatically add it for you to watch via Plex as you normally do. The link is <a href="https://request.badalien.works" target="_blank" rel="noopener noreferrer" className="text-void-orange hover:underline">request.badalien.works</a>, bookmark or note it so you don&apos;t forget!
            </p>
            <div className="pt-2 md:pt-4 text-center">
              <a
                href="https://request.badalien.works"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 md:px-12 py-3 md:py-4 bg-white text-black font-bold text-lg md:text-xl rounded-full hover:bg-void-orange hover:text-white transition-all duration-300 hover:scale-105"
              >
                Make A Request
              </a>
            </div>
          </motion.div>
        </Section>
      </main>
    </>
  );
}
