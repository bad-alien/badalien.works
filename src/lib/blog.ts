import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export type Category = 'AI Strategy' | 'Engineering' | 'AI Pulse' | 'Field Notes';

export interface PostMeta {
  title: string;
  date: string;
  description: string;
  category: Category;
  tags: string[];
  image?: string;
  readingTime: string;
  slug: string;
}

const contentDirectory = path.join(process.cwd(), 'src/content/insights');

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(contentDirectory).filter((f) => f.endsWith('.mdx'));

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');
    const { data } = matter(fileContents);
    const time = readingTime(fileContents);

    return {
      title: data.title,
      date: data.date,
      description: data.description,
      category: data.category as Category,
      tags: data.tags || [],
      image: data.image,
      readingTime: time.text,
      slug,
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByCategory(category: Category): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getAllCategories(): Category[] {
  return ['AI Strategy', 'Engineering', 'AI Pulse', 'Field Notes'];
}
