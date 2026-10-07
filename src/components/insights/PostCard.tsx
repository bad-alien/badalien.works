import Link from 'next/link';
import type { PostMeta } from '@/lib/blog';

interface PostCardProps {
  post: PostMeta;
  index: number;
  /** Larger, full-width treatment for the newest post at the top of the listing */
  featured?: boolean;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    // Frontmatter dates are calendar days; format in UTC so viewers west of UTC don't see the day before
    timeZone: 'UTC',
  });
}

export default function PostCard({ post, index, featured = false }: PostCardProps) {
  const Heading = featured ? 'h2' : 'h3';

  return (
    <Link
      href={`/insights/${post.slug}`}
      className={`block bg-surface border border-border rounded-lg hover:border-primary/30 transition-colors duration-300 group ${
        featured ? 'p-8 md:p-10' : 'p-6'
      }`}
      style={{
        animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
      }}
    >
      <div className="mb-3 flex items-center gap-3 font-mono text-xs uppercase tracking-wider">
        {featured && <span className="text-primary">Latest</span>}
        {featured && <span className="text-muted" aria-hidden="true">/</span>}
        <span className="text-secondary">{post.category}</span>
      </div>
      <Heading
        className={`font-display font-semibold text-heading mb-3 group-hover:text-primary transition-colors ${
          featured ? 'text-2xl md:text-4xl leading-tight max-w-3xl' : 'text-xl'
        }`}
      >
        {post.title}
      </Heading>
      <p
        className={`font-sans text-text-secondary mb-4 ${
          featured ? 'text-base md:text-lg max-w-2xl line-clamp-3' : 'line-clamp-2'
        }`}
      >
        {post.description}
      </p>
      <div className="flex items-center gap-4 font-mono text-xs text-muted">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>
    </Link>
  );
}
