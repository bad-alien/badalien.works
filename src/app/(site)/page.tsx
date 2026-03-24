import { getAllPosts } from '@/lib/blog';
import HomeContent from '@/components/home/HomeContent';

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 2);

  return <HomeContent latestPosts={latestPosts} />;
}
