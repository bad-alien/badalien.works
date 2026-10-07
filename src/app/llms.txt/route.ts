import { getAllPosts } from '@/lib/blog';
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, RSS_PATH } from '@/lib/site';
import { services } from '@/data/services';

// llms.txt (llmstxt.org): a plain-text map of the site for AI crawlers and
// answer engines. Mirrors the sitemap in a form a model can read in one pass.
export function GET() {
  const posts = getAllPosts();

  const body = [
    `# ${SITE_NAME}`,
    '',
    `> ${DEFAULT_DESCRIPTION}`,
    '',
    'Bad Alien is an independent AI consultancy founded by Rasheed in Pasadena, California. It works with small and mid-sized businesses in Pasadena, Los Angeles and remotely across the United States. Engagements start with a free 15-minute intro call, then a discovery phase, then a fixed quote. Sensitive data can stay on private or local LLMs on the client\'s own infrastructure.',
    '',
    '## Services',
    '',
    ...services.map((service) => `- [${service.title}](${SITE_URL}/services#${service.id}): ${service.description}`),
    '',
    '## Pages',
    '',
    `- [AI consulting and enablement](${SITE_URL}/consult): what an engagement looks like, selected work and proof`,
    `- [AI consultant in Pasadena, CA](${SITE_URL}/ai-consultant-pasadena): local service page with FAQ`,
    `- [About Rasheed](${SITE_URL}/about): founder background across finance, defense and healthtech`,
    `- [Services](${SITE_URL}/services): full service list and tooling`,
    `- [Creative work and photography](${SITE_URL}/creative)`,
    `- [Contact and booking](${SITE_URL}/contact): free intro call via the booking embed`,
    '',
    '## Insights',
    '',
    ...posts.map((post) => `- [${post.title}](${SITE_URL}/insights/${post.slug}): ${post.description}`),
    '',
    '## Optional',
    '',
    `- [RSS feed](${SITE_URL}${RSS_PATH})`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    `- [Privacy policy](${SITE_URL}/privacy-policy)`,
    `- [Terms and conditions](${SITE_URL}/terms-and-conditions)`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
