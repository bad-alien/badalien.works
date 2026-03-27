export type PortfolioCategory = 'Photo' | 'UI/UX' | 'Data Viz';

export interface PortfolioItem {
  id: number;
  src: string;
  width: number;
  height: number;
  alt: string;
  category: PortfolioCategory;
  title?: string;
  notes?: string;
  url?: string;
  unoptimized?: boolean;
}

export const portfolioItems: PortfolioItem[] = [
  // Row 1
  { id: 18, src: '/web/hummingbird-double.jpeg', width: 1600, height: 1200, alt: 'Hummingbird feeder double exposure at sunset', category: 'Photo', notes: '35mm, double exposure' },
  { id: 41, src: '/images/work/decoded-loop.gif', width: 1600, height: 900, alt: 'Decoded — year-in-review data visualization', category: 'Data Viz', title: 'Decoded', url: 'https://decoded.badalien.works', unoptimized: true },
  { id: 27, src: '/web/night-liquor-120.jpeg', width: 1600, height: 1200, alt: 'Night liquor store', category: 'Photo', notes: '120mm' },
  // Row 2
  { id: 1, src: '/web/CDMXtower-double.jpeg', width: 1600, height: 1200, alt: 'CDMX tower double exposure', category: 'Photo', notes: '35mm, double exposure' },
  { id: 31, src: '/web/prince-longexp.jpeg', width: 1600, height: 1200, alt: 'Dalmatian portrait with bokeh', category: 'Photo', notes: '35mm, 4" long exposure' },
  { id: 6, src: '/web/cabin-double.jpeg', width: 1600, height: 1200, alt: 'A-frame cabin view double exposure', category: 'Photo', notes: '35mm, double exposure' },
  // Row 3
  { id: 4, src: '/web/agave-double.jpeg', width: 1600, height: 1200, alt: 'Agave triple exposure', category: 'Photo', notes: '35mm, triple exposure' },
  { id: 34, src: '/web/statue-dream.jpeg', width: 1600, height: 1200, alt: 'Statue with dream effect', category: 'Photo', notes: '35mm, digital manipulation' },
  { id: 40, src: '/images/work/primari-health-hero.png', width: 1600, height: 900, alt: 'primarihealth.com — primary care practice website', category: 'UI/UX', title: 'primarihealth.com', url: 'https://primarihealth.com' },
  // Row 4 — camcoig lands in col1 (short, balances the extra item)
  { id: 42, src: '/images/work/camcoig-hero.png', width: 1600, height: 900, alt: 'camcoig.com — commercial real estate group website', category: 'UI/UX', title: 'camcoig.com', url: 'https://camcoig.com' },
  { id: 2, src: '/web/LA-crosswalk.jpeg', width: 1600, height: 1200, alt: 'LA crosswalk', category: 'Photo', notes: '35mm' },
  { id: 26, src: '/web/museo-thinker.jpeg', width: 1600, height: 1200, alt: 'Museum thinker', category: 'Photo', notes: '35mm' },
  // Row 5 — badalien in col1 (short, balances)
  { id: 44, src: '/images/work/badalien-hero.png', width: 1600, height: 900, alt: 'badalien.works — AI consulting portfolio site', category: 'UI/UX', title: 'badalien.works' },
  { id: 5, src: '/web/beach-double.jpeg', width: 1600, height: 1200, alt: 'Beach double exposure', category: 'Photo', notes: '35mm, double exposure' },
  { id: 24, src: '/web/me-myself-i-3.jpeg', width: 1600, height: 1200, alt: 'Self-portrait double exposure', category: 'Photo', notes: '35mm, double exposure' },
  // Row 6
  { id: 23, src: '/web/me-myself-i-2.jpeg', width: 1600, height: 1200, alt: 'Self-portrait triple exposure', category: 'Photo', notes: '35mm, triple exposure' },
  { id: 7, src: '/web/cabin-fever.jpeg', width: 1600, height: 1200, alt: 'Cabin fever double exposure', category: 'Photo', notes: '35mm, double exposure' },
  { id: 32, src: '/web/self-double-120.jpeg', width: 1600, height: 1200, alt: 'Self-portrait double exposure on medium format', category: 'Photo', notes: '120mm, double exposure' },
  // Row 7 — homeai in col1 (short, balances)
  { id: 43, src: '/images/work/homeai-triage-hero.png', width: 1600, height: 900, alt: 'HomeAI — inspection report automation interface', category: 'UI/UX', title: 'HomeAI' },
  { id: 22, src: '/web/me-myself-I-1.jpeg', width: 1600, height: 1200, alt: 'Self-portrait triple exposure', category: 'Photo', notes: '35mm, triple exposure' },
  { id: 30, src: '/web/prince-gargoyle.jpeg', width: 1600, height: 1200, alt: 'Prince as gargoyle', category: 'Photo', notes: '35mm' },
  // Row 8
  { id: 15, src: '/web/escondido-sunset.jpeg', width: 1600, height: 1200, alt: 'Escondido sunset', category: 'Photo', notes: '35mm' },
  { id: 12, src: '/web/dodger-champs.jpeg', width: 1600, height: 1200, alt: 'Dodgers world champs celebration', category: 'Photo', notes: '35mm, world champs!' },
  { id: 29, src: '/web/prince-couch.jpeg', width: 1600, height: 1200, alt: 'Prince on couch', category: 'Photo', notes: '35mm' },
  // Row 9 (col1 only)
  { id: 17, src: '/web/house-dusk.jpeg', width: 1600, height: 1200, alt: 'House at dusk', category: 'Photo', notes: '35mm, long exposure' },
];

export const portfolioFilters: (PortfolioCategory | 'All')[] = ['All', 'Photo', 'UI/UX', 'Data Viz'];
