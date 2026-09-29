import { renderOgImage, OG_SIZE } from '@/lib/og';

// Site-wide share card. Routes with their own opengraph-image.tsx override it.
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Bad Alien — AI consulting and enablement in Pasadena, CA';

export default function Image() {
  return renderOgImage({
    kicker: 'Bad Alien',
    title: 'Honest AI consulting in a market full of hype.',
    subtitle:
      'Strategy, automation, private LLMs and custom tools for small and mid-sized businesses. Based in Pasadena, serving Los Angeles and remote clients.',
  });
}
