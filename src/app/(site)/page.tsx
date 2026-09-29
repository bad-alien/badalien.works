import { getAllPosts } from '@/lib/blog';
import HomeContent from '@/components/home/HomeContent';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({ path: '/' });

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 2);

  return <HomeContent latestPosts={latestPosts} />;
}
