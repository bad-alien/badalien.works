import { pageMetadata, jsonLdScript, SITE_URL, ORGANIZATION_ID } from '@/lib/site';
import { services } from '@/data/services';

// page.tsx is a client component and can't export metadata itself
export const metadata = pageMetadata({
  path: '/services',
  title: 'AI Consulting Services | Bad Alien',
  description:
    'AI strategy, workflow automation, private LLM deployment, and custom AI tools for small and mid-sized businesses. Bad Alien is based in Pasadena, CA and works with teams across Los Angeles and remotely.',
});

// Each service is a schema.org Service offered by the organization, so answer
// engines can attribute "what does Bad Alien do" to named offerings.
const servicesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  url: `${SITE_URL}/services`,
  itemListElement: services.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      '@id': `${SITE_URL}/services#${service.id}`,
      name: service.title,
      description: service.description,
      serviceType: service.title,
      provider: { '@id': ORGANIZATION_ID },
      areaServed: ['Pasadena, CA', 'Los Angeles, CA', 'United States'],
      url: `${SITE_URL}/services#${service.id}`,
    },
  })),
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(servicesJsonLd) }} />
      {children}
    </>
  );
}
