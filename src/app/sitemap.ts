import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

// Last substantive content change per static route. Google only trusts lastmod
// when it tracks real edits, so bump the date when a page's copy changes, not on
// every deploy. (Build time would make every URL look modified on every deploy.)
export const STATIC_PAGES: { path: string; updated: string; changeFrequency: 'weekly' | 'monthly' | 'yearly'; priority: number }[] = [
  { path: '', updated: '2026-10-08', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/consult', updated: '2026-10-08', changeFrequency: 'monthly', priority: 1.0 },
  { path: '/ai-consultant-pasadena', updated: '2026-09-29', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/insights', updated: '2026-10-07', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/about', updated: '2026-09-29', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/services', updated: '2026-10-07', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/contact', updated: '2026-10-02', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/creative', updated: '2026-10-08', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/privacy-policy', updated: '2026-10-07', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms-and-conditions', updated: '2026-09-29', changeFrequency: 'yearly', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const posts = getAllPosts();

  const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(page.updated),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/insights/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...blogPosts];
}
