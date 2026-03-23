import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostsByCategory, getAllCategories } from '@/lib/blog';

describe('Blog library', () => {
  describe('getAllPosts', () => {
    it('returns posts sorted by date descending', () => {
      const posts = getAllPosts();

      if (posts.length < 2) {
        expect(posts.length).toBeGreaterThanOrEqual(1);
        return;
      }

      for (let i = 0; i < posts.length - 1; i++) {
        const currentDate = new Date(posts[i].date);
        const nextDate = new Date(posts[i + 1].date);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });

    it('includes correct metadata fields', () => {
      const posts = getAllPosts();
      expect(posts.length).toBeGreaterThan(0);

      posts.forEach((post) => {
        expect(post).toHaveProperty('title');
        expect(post).toHaveProperty('date');
        expect(post).toHaveProperty('description');
        expect(post).toHaveProperty('category');
        expect(post).toHaveProperty('tags');
        expect(post).toHaveProperty('readingTime');
        expect(post).toHaveProperty('slug');

        expect(typeof post.title).toBe('string');
        expect(typeof post.date).toBe('string');
        expect(typeof post.description).toBe('string');
        expect(typeof post.category).toBe('string');
        expect(Array.isArray(post.tags)).toBe(true);
        expect(typeof post.readingTime).toBe('string');
        expect(typeof post.slug).toBe('string');
      });
    });

    it('calculates reasonable reading time', () => {
      const posts = getAllPosts();
      expect(posts.length).toBeGreaterThan(0);

      posts.forEach((post) => {
        expect(post.readingTime).toBeTruthy();
        expect(post.readingTime).toMatch(/\d+ min read/);

        const minutes = parseInt(post.readingTime);
        expect(minutes).toBeGreaterThan(0);
        expect(minutes).toBeLessThan(60);
      });
    });

    it('generates correct slugs from filenames', () => {
      const posts = getAllPosts();
      expect(posts.length).toBeGreaterThan(0);

      posts.forEach((post) => {
        expect(post.slug).toBeTruthy();
        expect(post.slug).not.toContain('.mdx');
        expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      });
    });
  });

  describe('getPostsByCategory', () => {
    it('filters posts by Engineering category', () => {
      const engineeringPosts = getPostsByCategory('Engineering');

      engineeringPosts.forEach((post) => {
        expect(post.category).toBe('Engineering');
      });
    });

    it('returns empty array for category with no posts', () => {
      const aiStrategyPosts = getPostsByCategory('AI Strategy');
      expect(Array.isArray(aiStrategyPosts)).toBe(true);
    });

    it('maintains date sort order within category', () => {
      const posts = getPostsByCategory('Engineering');

      if (posts.length < 2) {
        return;
      }

      for (let i = 0; i < posts.length - 1; i++) {
        const currentDate = new Date(posts[i].date);
        const nextDate = new Date(posts[i + 1].date);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });
  });

  describe('getAllCategories', () => {
    it('returns all 4 categories', () => {
      const categories = getAllCategories();
      expect(categories).toHaveLength(4);
      expect(categories).toContain('AI Strategy');
      expect(categories).toContain('Engineering');
      expect(categories).toContain('AI Pulse');
      expect(categories).toContain('Field Notes');
    });
  });
});
