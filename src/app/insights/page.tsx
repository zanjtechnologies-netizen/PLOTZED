import Link from 'next/link';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { Playfair_Display, Libre_Baskerville } from 'next/font/google';
import { prisma } from '@/lib/prisma';
import InsightsClient from '@/components/insights/InsightsClient';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
});

const libre = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-libre',
});

async function getBlogPosts() {
  try {
    const posts = await prisma.blog_posts.findMany({
      where: {
        is_published: true,
      },
      orderBy: {
        published_at: 'desc',
      },
      take: 20,
    });
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function InsightsPage() {
  const posts = await getBlogPosts();

  return <InsightsClient posts={posts} />
}
