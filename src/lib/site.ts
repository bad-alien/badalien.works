import type { Metadata } from 'next';

// Canonical site identity for metadata, sitemap, robots and JSON-LD.
// www is the canonical host; the apex redirects to it (Vercel Domains).
export const SITE_URL = 'https://www.badalien.works';
export const SITE_NAME = 'Bad Alien';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const FOUNDER_ID = `${SITE_URL}/#founder`;

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': ORGANIZATION_ID,
      name: SITE_NAME,
      alternateName: ['Bad Alien LLC', 'badalien.works'],
      description:
        'AI consulting and enablement for small and mid-sized businesses: strategy, automation, private LLM deployment, and custom AI tools. Based in Pasadena, CA.',
      url: SITE_URL,
      logo: `${SITE_URL}/apple-touch-icon.png`,
      image: `${SITE_URL}/images/profile.jpg`,
      email: 'contact@badalien.works',
      telephone: '+1-626-469-5839',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Pasadena',
        addressRegion: 'CA',
        addressCountry: 'US',
      },
      areaServed: [
        { '@type': 'City', name: 'Pasadena, CA' },
        { '@type': 'City', name: 'Los Angeles, CA' },
        { '@type': 'Country', name: 'United States' },
      ],
      knowsAbout: ['AI consulting', 'AI automation', 'Private LLM deployment', 'Data visualization', 'Product design'],
      founder: { '@id': FOUNDER_ID },
      sameAs: ['https://github.com/bad-alien'],
    },
    {
      '@type': 'Person',
      '@id': FOUNDER_ID,
      name: 'Rasheed',
      jobTitle: 'Founder, AI Consultant',
      worksFor: { '@id': ORGANIZATION_ID },
      url: `${SITE_URL}/about`,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: 'Bad Alien LLC',
      url: SITE_URL,
      publisher: { '@id': ORGANIZATION_ID },
    },
  ],
};

export const DEFAULT_TITLE = 'Bad Alien | AI Consulting & Enablement in Pasadena, CA';
export const DEFAULT_DESCRIPTION =
  'Bad Alien helps small and mid-sized businesses put AI to work: strategy, automation, private LLMs, and custom tools. Based in Pasadena, serving Los Angeles and remote clients.';

// Full per-page metadata. Next replaces (not merges) a parent's openGraph and
// twitter blocks, so every page sets them completely, with a self canonical.
// Next replaces (not merges) a parent's openGraph object, so the root
// opengraph-image.tsx is lost on any page that sets openGraph. Reference it
// explicitly; routes with their own opengraph-image.tsx (blog posts) override.
export const DEFAULT_OG_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: 'Bad Alien — AI consulting in Pasadena, CA' };

export const RSS_PATH = '/api/rss';

export function pageMetadata({
  path,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}: {
  path: string;
  title?: string;
  description?: string;
}): Metadata {
  return {
    title,
    description,
    // Next replaces (not merges) alternates too, so the feed link rides along with the canonical.
    alternates: { canonical: path, types: { 'application/rss+xml': `${SITE_URL}${RSS_PATH}` } },
    openGraph: { title, description, url: path, siteName: SITE_NAME, type: 'website', locale: 'en_US', images: [DEFAULT_OG_IMAGE] },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export type FaqItem = { question: string; answer: string };

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
