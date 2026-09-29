import { getPost } from '@/lib/blog';
import { renderOgImage, OG_SIZE } from '@/lib/og';

// Per-post share card: category as kicker, post title, description.
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Bad Alien Insights';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return renderOgImage({
    kicker: post ? `Insights · ${post.data.category}` : 'Insights',
    title: post?.data.title ?? 'Insights | Bad Alien',
    subtitle: post?.data.description,
  });
}
