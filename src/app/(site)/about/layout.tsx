import { pageMetadata, jsonLdScript, SITE_URL, FOUNDER_ID, ORGANIZATION_ID } from '@/lib/site';

// page.tsx is a client component and can't export metadata itself
export const metadata = pageMetadata({
  path: '/about',
  title: 'About Bad Alien | AI Consultant in Pasadena, CA',
  description:
    'Meet Rasheed, founder of Bad Alien: 8 years building products across finance, defense, and healthtech, now helping businesses in Pasadena, Los Angeles, and remotely put AI to work.',
});

const profileJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: `${SITE_URL}/about`,
  mainEntity: {
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: 'Rasheed',
    jobTitle: 'Founder, AI Consultant',
    image: `${SITE_URL}/images/profile.jpg`,
    worksFor: { '@id': ORGANIZATION_ID },
    homeLocation: { '@type': 'City', name: 'Pasadena, CA' },
    knowsAbout: ['AI consulting', 'AI automation', 'Private LLM deployment', 'Product management', 'Machine learning'],
    sameAs: ['https://github.com/bad-alien'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(profileJsonLd) }} />
      {children}
    </>
  );
}
