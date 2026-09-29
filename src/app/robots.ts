import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Search/retrieval crawlers behind AI answers. The wildcard already allows
// them; explicit entries make the intent unambiguous to operators that look
// for their own user agent. Training-only bots (GPTBot, ClaudeBot,
// Google-Extended) are covered by the wildcard and can be opted out here.
const AI_SEARCH_BOTS = [
  'Googlebot',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
      { userAgent: AI_SEARCH_BOTS, allow: '/', disallow: '/api/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
