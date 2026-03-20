import ConsultHero from '@/components/consulting/ConsultHero';
import ProblemSection from '@/components/consulting/ProblemSection';
import SolutionSection from '@/components/consulting/SolutionSection';
import ProofSection from '@/components/consulting/ProofSection';
import ConsultCta from '@/components/consulting/ConsultCta';

export const metadata = {
  title: 'AI Consulting & Enablement | Bad Alien',
  description: 'From strategy to production — AI that saves time, reduces costs, and scales. 8 years building products across finance, defense, and healthtech.',
};

export default function ConsultPage() {
  return (
    <main id="main-content" className="relative bg-base text-white overflow-hidden grain-texture">
      <ConsultHero />
      <ProblemSection />
      <SolutionSection />
      <ProofSection />
      <ConsultCta />
    </main>
  );
}
