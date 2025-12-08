import Link from 'next/link';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { Playfair_Display, Libre_Baskerville } from 'next/font/google';
import { prisma } from '@/lib/prisma';

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

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export default async function InsightsPage() {
  const posts = await getBlogPosts();

  return (
    <div className={`min-h-screen bg-[#F9FAFB] ${playfair.variable} ${libre.variable}`}>
      {/* Header */}
      <div className="bg-[#112250] text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#112250]/80 to-[#112250]" />

        <div className="container-custom mx-auto relative z-10">
          {/* Back to Home Button */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>

          <div className="text-center">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6 text-[#D8B893]">
              Blogs & Stories
            </h1>
            <p className="font-libre text-xl text-gray-300 max-w-2xl mx-auto">
              Curated articles on luxury travel, refined living, and the art of the perfect escape
            </p>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container-custom mx-auto py-20">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg font-libre">
              No blog posts available yet. Check back soon for insights and stories!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/insights/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                    style={{
                      backgroundImage: `url(${post.featured_image || '/images/placeholder-blog.jpg'})`
                    }}
                  />
                  {post.category && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#D8B893] text-[#112250] font-libre">
                        {post.category.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 font-libre">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Coming Soon'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{calculateReadTime(post.content)}</span>
                    </div>
                  </div>

                  <h3 className="font-playfair text-2xl font-bold text-[#112250] mb-3 group-hover:text-[#D8B893] transition-colors">
                    {post.title}
                  </h3>

                  <p className="font-libre text-gray-600 mb-6 flex-grow leading-relaxed">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>

                  <div className="flex items-center gap-2 text-[#112250] font-semibold group-hover:gap-3 transition-all">
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
