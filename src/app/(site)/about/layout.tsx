import { pageMetadata } from '@/lib/site';

// page.tsx is a client component and can't export metadata itself
export const metadata = pageMetadata({
  path: '/about',
  title: 'About Bad Alien | AI Consultant in Pasadena, CA',
  description:
    'Meet Rasheed, founder of Bad Alien: 8 years building products across finance, defense, and healthtech, now helping businesses in Pasadena, Los Angeles, and remotely put AI to work.',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
