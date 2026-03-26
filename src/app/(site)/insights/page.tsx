import { Metadata } from 'next';
import { getAllPosts, getAllCategories, type Category } from '@/lib/blog';
import CategoryFilter from '@/components/insights/CategoryFilter';
import PostCard from '@/components/insights/PostCard';

export const metadata: Metadata = {
  title: 'Insights | Bad Alien',
  description:
    'Technical deep-dives, AI strategy, and field notes from the front lines of AI consulting and engineering.',
  openGraph: {
    title: 'Insights | Bad Alien',
    description:
      'Technical deep-dives, AI strategy, and field notes from the front lines of AI consulting and engineering.',
    type: 'website',
  },
};

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const selectedCategory = params.category as Category | undefined;

  const filteredPosts = selectedCategory
    ? allPosts.filter((post) => post.category === selectedCategory)
    : allPosts;

  return (
    <main id="main-content" className="max-w-6xl mx-auto px-6 py-24">
      {/* Header */}
      <section aria-label="Insights overview" className="mb-16">
        <p className="font-mono text-xs uppercase tracking-wider text-secondary mb-4">
          {'// insights'}
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-heading mb-6">
          Insights
        </h1>
        <p className="font-sans text-lg text-body max-w-2xl">
          Technical deep-dives, AI strategy, and field notes from the front
          lines of AI consulting and engineering.
        </p>
      </section>

      {/* Category Filter */}
      <CategoryFilter categories={categories} />

      {/* Posts Grid */}
      <section aria-label="Articles">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-sans text-text-secondary">
              No posts found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post, index) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
