import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import { useMDXComponents as getMDXComponents } from '@/mdx-components';

const contentDirectory = path.join(process.cwd(), 'src/content/insights');

function getPost(slug: string) {
  const fullPath = path.join(contentDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf-8');
  const { data, content } = matter(fileContents);
  const time = readingTime(fileContents);

  return { data, content, readingTime: time.text };
}

export async function generateStaticParams() {
  if (!fs.existsSync(contentDirectory)) return [];

  return fs
    .readdirSync(contentDirectory)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => ({ slug: f.replace(/\.mdx$/, '') }));
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
    openGraph: {
      title: data.title,
      description: data.description,
      type: 'article',
      publishedTime: data.date,
      tags: data.tags || [],
      images: data.image ? [{ url: data.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: data.image ? [data.image] : [],
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    datePublished: data.date,
    author: {
      '@type': 'Person',
      name: 'Bad Alien',
      url: 'https://badalien.works/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bad Alien',
      url: 'https://badalien.works',
    },
    keywords: (data.tags || []).join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

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
            href="/consult"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white font-sans font-medium rounded-md transition-colors"
          >
            Book a Consultation
          </Link>
        </div>
      </article>
    </>
  );
}
