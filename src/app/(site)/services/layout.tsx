import { pageMetadata } from '@/lib/site';

// page.tsx is a client component and can't export metadata itself
export const metadata = pageMetadata({
  path: '/services',
  title: 'AI Consulting Services | Bad Alien',
  description:
    'AI strategy, workflow automation, private LLM deployment, and custom AI tools for small and mid-sized businesses. Bad Alien is based in Pasadena, CA and works with teams across Los Angeles and remotely.',
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
