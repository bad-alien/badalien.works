import ConsultHero from '@/components/consulting/ConsultHero';
import SolutionSection from '@/components/consulting/SolutionSection';
import ConsultSelectedWork from '@/components/consulting/ConsultSelectedWork';
import ProofSection from '@/components/consulting/ProofSection';
import ConsultCta from '@/components/consulting/ConsultCta';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({
  path: '/consult',
  title: 'AI Consulting & Enablement | Bad Alien',
  description: 'From strategy to production — AI that saves time, reduces costs, and scales. 8 years building products across finance, defense, and healthtech. Based in Pasadena, CA.',
});

export default function ConsultPage() {
  return (
    <main id="main-content" className="relative bg-base text-white overflow-hidden grain-texture">
      <ConsultHero />
      <SolutionSection />
      <ConsultSelectedWork />
      <ProofSection />
      <ConsultCta />
    </main>
  );
}
