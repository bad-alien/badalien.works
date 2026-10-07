import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import { useMDXComponents as getMDXComponents } from '@/mdx-components';
import { SITE_URL, SITE_NAME, ORGANIZATION_ID, FOUNDER_ID, DEFAULT_OG_IMAGE, breadcrumbJsonLd, jsonLdScript } from '@/lib/site';
import { getPost, getAllPosts } from '@/lib/blog';


export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Post Not Found' };

  const { data } = post;
  return {
    title: `${data.title} | Bad Alien`,
    description: data.description,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `/insights/${slug}`,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: data.date,
      modifiedTime: data.updated ?? data.date,
      authors: [`${SITE_URL}/about`],
      tags: data.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { data, content, readingTime: time } = post;

  // Runtime MDX compilation
  const { default: MDXContent } = await evaluate(content, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: 'github-dark-dimmed', keepBackground: false }],
    ],
    useMDXComponents: () => getMDXComponents({}),
  });

  const postUrl = `${SITE_URL}/insights/${slug}`;
  // Article rich results need an image. The per-post OG card lives at a hashed
  // path Next assigns at build time, so point at the frontmatter image or the
  // site-wide card, both of which have stable URLs.
  const image = data.image ? `${SITE_URL}${data.image}` : `${SITE_URL}${DEFAULT_OG_IMAGE.url}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image,
    datePublished: data.date,
    dateModified: data.updated ?? data.date,
    inLanguage: 'en-US',
    url: postUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    author: { '@type': 'Person', '@id': FOUNDER_ID, name: 'Rasheed', url: `${SITE_URL}/about` },
    publisher: { '@type': 'ProfessionalService', '@id': ORGANIZATION_ID, name: SITE_NAME, url: SITE_URL },
    articleSection: data.category,
    keywords: (data.tags || []).join(', '),
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', path: '' },
    { name: 'Insights', path: '/insights' },
    { name: data.title, path: `/insights/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbs) }} />

      <article className="max-w-4xl mx-auto px-6 py-24">
        {/* Back Link */}
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 font-sans text-primary hover:text-primary-light transition-colors mb-8"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Back to Insights</span>
        </Link>

        {/* Post Header */}
        <header className="mb-12">
          <div className="mb-4">
            <span className="font-mono text-xs uppercase tracking-wider text-secondary">
              {data.category}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-heading mb-6">
            {data.title}
          </h1>
          <div className="flex items-center gap-4 font-mono text-sm text-text-secondary">
            <time dateTime={data.date}>
              {new Date(data.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                // Frontmatter dates are calendar days; format in UTC so viewers west of UTC don't see the day before
                timeZone: 'UTC',
              })}
            </time>
            <span>·</span>
            <span>{time}</span>
          </div>
        </header>

        {/* MDX Content */}
        <div className="prose-insights">
          <MDXContent />
        </div>

        {/* CTA */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="font-sans text-lg text-body mb-4">Want to discuss this?</p>
          <Link
            href="/contact#book"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white font-sans font-medium rounded-md transition-colors"
          >
            Book a Consultation
          </Link>
        </div>
      </article>
    </>
  );
}
