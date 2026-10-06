import { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import PostCard from '@/components/insights/PostCard';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  path: '/insights',
  title: 'Insights | Bad Alien',
  description:
    'Technical deep-dives, AI strategy, and field notes from the front lines of AI consulting and engineering.',
});

export default function InsightsPage() {
  const posts = getAllPosts();

  return (
    <main id="main-content" className="max-w-6xl mx-auto px-6 py-24">
      {/* Header: the page title is screen-reader-only, the mono label carries it visually */}
      <section aria-label="Insights overview" className="mb-12">
        <h1 className="sr-only">Insights</h1>
        <p className="font-mono text-xs uppercase tracking-wider text-secondary mb-4">
          {'// insights'}
        </p>
        <p className="font-sans text-lg text-body max-w-2xl">
          Technical deep-dives, AI strategy, and field notes from the front
          lines of AI consulting and engineering.
        </p>
      </section>

      {/* Posts Grid */}
      <section aria-label="Articles">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <PostCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
