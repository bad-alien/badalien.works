import Link from 'next/link';
import type { PostMeta } from '@/lib/blog';

interface PostCardProps {
  post: PostMeta;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="block bg-surface border border-border rounded-lg p-6 hover:border-primary/30 transition-colors duration-300 group"
      style={{
        animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
      }}
    >
      <div className="mb-3">
        <span className="font-mono text-xs uppercase tracking-wider text-secondary">
          {post.category}
        </span>
      </div>
      <h3 className="font-display text-xl font-semibold text-heading mb-3 group-hover:text-primary transition-colors">
        {post.title}
      </h3>
      <p className="font-sans text-text-secondary mb-4 line-clamp-2">
        {post.description}
      </p>
      <div className="flex items-center gap-4 font-mono text-xs text-muted">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </time>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>
    </Link>
  );
}
