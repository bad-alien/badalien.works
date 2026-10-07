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
  // getAllPosts sorts newest first, so the first post is the featured one
  const [latest, ...rest] = getAllPosts();

  return (
    <main id="main-content" className="max-w-6xl mx-auto px-6 pt-32 md:pt-40 pb-24">
      <h1 className="font-display text-5xl md:text-6xl font-bold text-heading mb-10">
        Insights
      </h1>

      {latest && (
        <section aria-label="Latest article" className="mb-6">
          <PostCard post={latest} index={0} featured />
        </section>
      )}

      <section aria-label="Articles">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rest.map((post, index) => (
            <PostCard key={post.slug} post={post} index={index + 1} />
          ))}
        </div>
      </section>
    </main>
  );
}
