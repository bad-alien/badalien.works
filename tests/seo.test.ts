import { describe, it, expect } from 'vitest';
import sitemap, { STATIC_PAGES } from '@/app/sitemap';
import robots from '@/app/robots';
import { GET as rss } from '@/app/api/rss/route';
import { GET as llms } from '@/app/llms.txt/route';
import { getAllPosts } from '@/lib/blog';
import { SITE_URL, pageMetadata, breadcrumbJsonLd, organizationJsonLd } from '@/lib/site';

const WWW = 'https://www.badalien.works';

describe('SEO surface', () => {
  it('uses the www host as the canonical site URL', () => {
    expect(SITE_URL).toBe(WWW);
  });

  describe('sitemap', () => {
    const entries = sitemap();

    it('lists every static page and every post on the www host with a lastmod', () => {
      expect(entries.length).toBe(STATIC_PAGES.length + getAllPosts().length);
      for (const entry of entries) {
        expect(entry.url.startsWith(WWW)).toBe(true);
        expect(entry.url.endsWith('/')).toBe(false);
        expect(entry.lastModified).toBeInstanceOf(Date);
        expect(Number.isNaN((entry.lastModified as Date).getTime())).toBe(false);
      }
    });

    it('has no duplicate URLs', () => {
      const urls = entries.map((e) => e.url);
      expect(new Set(urls).size).toBe(urls.length);
    });

    it('includes the core landing pages', () => {
      const urls = entries.map((e) => e.url);
      for (const path of ['', '/consult', '/ai-consultant-pasadena', '/insights', '/about', '/services', '/contact']) {
        expect(urls).toContain(`${WWW}${path}`);
      }
    });
  });

  describe('robots', () => {
    const result = robots();

    it('points crawlers at the www sitemap and host', () => {
      expect(result.sitemap).toBe(`${WWW}/sitemap.xml`);
      expect(result.host).toBe(WWW);
    });

    it('allows the site and blocks only the API', () => {
      const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
      for (const rule of rules) {
        expect(rule.allow).toBe('/');
        expect(rule.disallow).toBe('/api/');
      }
    });
  });

  describe('RSS feed', () => {
    it('links every item to the www host', async () => {
      const xml = await (await rss()).text();
      const links = [...xml.matchAll(/<link>([^<]+)<\/link>/g)].map((m) => m[1]);
      expect(links.length).toBeGreaterThan(1);
      for (const link of links) expect(link.startsWith(WWW)).toBe(true);
      expect(xml).not.toContain('https://badalien.works');
    });
  });

  describe('llms.txt', () => {
    it('is plain text and lists every post and the core pages', async () => {
      const res = llms();
      expect(res.headers.get('Content-Type')).toContain('text/plain');
      const text = await res.text();
      expect(text.startsWith('# Bad Alien')).toBe(true);
      for (const post of getAllPosts()) {
        expect(text).toContain(`${WWW}/insights/${post.slug}`);
      }
      expect(text).toContain(`${WWW}/ai-consultant-pasadena`);
      expect(text).not.toContain('https://badalien.works/');
    });
  });

  describe('metadata helpers', () => {
    it('sets a self canonical and the RSS alternate on every page', () => {
      const meta = pageMetadata({ path: '/about' });
      expect(meta.alternates?.canonical).toBe('/about');
      expect(meta.alternates?.types?.['application/rss+xml']).toBe(`${WWW}/api/rss`);
    });

    it('builds absolute breadcrumb items in order', () => {
      const crumbs = breadcrumbJsonLd([
        { name: 'Home', path: '' },
        { name: 'Insights', path: '/insights' },
      ]);
      expect(crumbs.itemListElement[0].item).toBe(WWW);
      expect(crumbs.itemListElement[1]).toMatchObject({ position: 2, item: `${WWW}/insights` });
    });

    it('never publishes a surname or street address in the organization schema', () => {
      const json = JSON.stringify(organizationJsonLd);
      expect(json).not.toMatch(/streetAddress/);
      expect(json).toContain('"name":"Rasheed"');
    });
  });
});
