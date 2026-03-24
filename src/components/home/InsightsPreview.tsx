'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { PostMeta } from '@/lib/blog';

interface InsightsPreviewProps {
  posts: PostMeta[];
}

export default function InsightsPreview({ posts }: InsightsPreviewProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-base">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-end justify-between mb-16"
        >
          <div>
            <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-secondary">
              04 / Insights
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-text-heading font-display">
              Latest Thinking
            </h2>
          </div>
          <Link
            href="/insights"
            className="hidden md:inline-flex items-center text-text-heading hover:text-primary transition-colors duration-200 group"
          >
            <span className="font-semibold">View all</span>
            <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </Link>
        </motion.div>

        <div className={`grid grid-cols-1 ${posts.length > 1 ? 'md:grid-cols-2' : ''} gap-6`}>
          {posts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
            >
              <Link
                href={`/insights/${post.slug}`}
                className="group block h-full"
              >
                <div className="h-full p-8 bg-surface border border-border rounded-xl hover:bg-elevated hover:border-muted transition-all duration-300">
                  <span className="font-mono text-xs font-semibold text-secondary uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h3 className="text-2xl font-bold text-text-heading mt-3 mb-3 group-hover:text-white transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-text-body mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted">
                      {post.readingTime}
                    </span>
                    <span className="inline-flex items-center text-text-heading group-hover:translate-x-2 transition-transform duration-300">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile "View all" link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/insights"
            className="inline-flex items-center text-text-heading hover:text-primary transition-colors duration-200 group"
          >
            <span className="font-semibold">View all insights</span>
            <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
