import { prisma } from '../src/lib/prisma';

async function checkBlogPosts() {
  console.log('🔍 Checking blog posts in database...\n');

  try {
    const allPosts = await prisma.blog_posts.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        is_published: true,
        published_at: true,
        created_at: true,
      },
    });

    console.log(`📊 Total blog posts: ${allPosts.length}\n`);

    if (allPosts.length === 0) {
      console.log('❌ No blog posts found in database');
      return;
    }

    console.log('Blog posts:');
    allPosts.forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Published: ${post.is_published ? '✅' : '❌'}`);
      console.log(`   Published At: ${post.published_at || 'Not set'}`);
      console.log(`   Created At: ${post.created_at}`);
    });

    const publishedCount = allPosts.filter((p) => p.is_published).length;
    console.log(`\n\n✅ Published posts: ${publishedCount}`);
    console.log(`❌ Unpublished posts: ${allPosts.length - publishedCount}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBlogPosts();
