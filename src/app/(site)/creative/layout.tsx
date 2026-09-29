import { pageMetadata } from '@/lib/site';

// page.tsx is a client component and can't export metadata itself
export const metadata = pageMetadata({
  path: '/creative',
  title: 'Creative Work & Photography | Bad Alien',
  description:
    'Photography, UI/UX, and data visualization work by Bad Alien, a Pasadena-based creative technology and AI consulting studio.',
});

export default function CreativeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
