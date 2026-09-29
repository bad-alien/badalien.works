import { pageMetadata } from '@/lib/site';

// page.tsx is a client component and can't export metadata itself
export const metadata = pageMetadata({
  path: '/contact',
  title: 'Contact Bad Alien | AI Consulting in Pasadena, CA',
  description:
    'Book a free intro call or tell Bad Alien a good time to reach you. AI consulting for businesses in Pasadena, Los Angeles, and remote.',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
