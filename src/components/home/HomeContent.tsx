'use client';

import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/home/HeroSection';
import ServicesPreview from '@/components/home/ServicesPreview';
import WorkPreview from '@/components/home/WorkPreview';
import AboutPreview from '@/components/home/AboutPreview';
import InsightsPreview from '@/components/home/InsightsPreview';
import CtaSection from '@/components/home/CtaSection';
import { useChat } from '@/contexts/ChatContext';
import type { PostMeta } from '@/lib/blog';

interface HomeContentProps {
  latestPosts: PostMeta[];
}

export default function HomeContent({ latestPosts }: HomeContentProps) {
  const { openChat, setEntryPoint } = useChat();

  const handleChatActivated = () => {
    setEntryPoint('hero');
    openChat();
  };

  const handleLearnMore = () => {
    document.querySelector('#main-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-base relative grain-texture">
      <Header />

      <HeroSection onChatActivated={handleChatActivated} onLearnMore={handleLearnMore} />

      <main id="main-content">
        <h1 className="sr-only">Bad Alien — AI Consulting &amp; Enablement in Pasadena, CA</h1>

        <ServicesPreview />
        <WorkPreview />
        <AboutPreview />
        <InsightsPreview posts={latestPosts} />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
