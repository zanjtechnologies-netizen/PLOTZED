import { prisma } from '../src/lib/prisma';
import { randomUUID } from 'crypto';

async function seedBlogPosts() {
  console.log('🌱 Seeding blog posts...\n');

  const blogPosts = [
    {
      id: randomUUID(),
      title: 'Pondicherry White Town — A Rising Luxury Investment Destination',
      slug: 'white-town-luxury-investment',
      content: `Pondicherry's White Town stands as a testament to French colonial heritage, where cobblestone streets wind through pristine white-washed buildings adorned with vibrant bougainvillea. This UNESCO World Heritage precinct has evolved into one of South India's most sought-after luxury investment destinations.

## The White Town Advantage

The area's colonial architecture, combined with its beachfront location, creates an unparalleled ambiance for boutique hotels, cafes, and high-end residential properties. Properties in White Town command premium prices, with heritage buildings fetching anywhere from ₹15-50 crores depending on size and condition.

## Investment Potential

Recent years have seen a surge in boutique hotel developments, with occupancy rates consistently above 75% during peak season. The government's focus on heritage preservation has led to streamlined approval processes for restoration projects, making it easier for investors to develop premium properties while maintaining historical integrity.

## Market Dynamics

The rental yields in White Town average 6-8% annually, significantly higher than metropolitan cities. The area attracts a sophisticated clientele - from international tourists to wellness seekers and digital nomads seeking extended stays in heritage settings.`,
      excerpt: 'Known for its colonial heritage, seaside charm, and boutique-stay culture, White Town attracts premium buyers and investors seeking unique luxury properties.',
      featured_image: '/images/white-town-1.jpg',
      category: 'Market Spotlight',
      tags: ['Pondicherry', 'Investment', 'Heritage', 'Luxury'],
      meta_title: 'White Town Pondicherry: Premium Investment Destination | Plotzed',
      meta_description: 'Discover why Pondicherry White Town is becoming a hotspot for luxury real estate investment. Heritage properties, high returns, and colonial charm.',
      is_published: true,
      published_at: new Date('2024-11-30'),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      title: 'Auroville — An Emerging Hub for Sustainable Luxury Living',
      slug: 'auroville-sustainable-luxury',
      content: `Auroville, the experimental township founded in 1968, is experiencing a renaissance as conscious investors discover its unique blend of sustainability, community, and natural beauty. This international community near Pondicherry is redefining luxury through its commitment to ecological living and human unity.

## The Auroville Philosophy

Unlike conventional luxury developments, Auroville properties emphasize harmony with nature. Plots here come with strict environmental guidelines ensuring sustainable construction, rainwater harvesting, and minimal ecological impact. This doesn't mean compromising on comfort - Auroville homes showcase cutting-edge green architecture that's both beautiful and functional.

## Investment Landscape

Land prices in Auroville have appreciated by 15-20% annually over the past five years, driven by growing demand from environmentally conscious buyers worldwide. The Green Belt zone, in particular, offers 1-5 acre plots ideal for eco-luxury villas and wellness retreats.

## Community & Culture

What sets Auroville apart is its vibrant international community. Residents enjoy organic farms, artisan workshops, world-class schools, and cultural events. The township's emphasis on holistic living attracts wellness entrepreneurs, artists, and professionals seeking a meaningful lifestyle away from urban chaos.

## Future Outlook

With the upcoming Auroville expansion plans and improved infrastructure, property values are expected to continue their upward trajectory. The combination of limited supply, growing demand, and the area's unique cultural capital makes it a compelling long-term investment.`,
      excerpt: 'Known for its greenery, peaceful environment, and global culture, Auroville attracts conscious investors seeking sustainable luxury and lifestyle value.',
      featured_image: '/images/auroville-1.jpg',
      category: 'Market Spotlight',
      tags: ['Auroville', 'Sustainability', 'Eco-Living', 'Investment'],
      meta_title: 'Auroville Real Estate: Sustainable Luxury Investment Guide | Plotzed',
      meta_description: 'Explore Auroville\'s emerging real estate market. Eco-luxury properties, strong appreciation, and conscious community living near Pondicherry.',
      is_published: true,
      published_at: new Date('2024-11-30'),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      title: 'Matrimandir — The Spiritual Heart of Auroville',
      slug: 'matrimandir-spiritual-heart',
      content: `The Matrimandir, Auroville's iconic golden dome, stands as a beacon of human aspiration and inner reflection. More than just an architectural marvel, it represents the spiritual core of this unique international township.

## Architectural Significance

Designed by French architect Roger Anger, the Matrimandir took 37 years to complete. The structure's perfect spherical form, covered in golden discs, creates a stunning visual against Auroville's lush greenery. The inner chamber houses the world's largest optically perfect glass sphere, serving as a space for silent concentration.

## Impact on Property Values

Properties with views of the Matrimandir command significant premiums, often 20-30% higher than comparable plots elsewhere in Auroville. The area surrounding this spiritual center is restricted development zone, ensuring perpetual tranquility and exclusivity for nearby landowners.

## Visitor Experience

The Matrimandir gardens, spanning 62 acres, offer 12 distinct zones representing different aspects of inner perfection. Access to the inner chamber requires advance booking, maintaining the meditative atmosphere. The viewing point provides stunning panoramic views, particularly at sunrise and sunset.

## Living Near Sacred Spaces

For those seeking properties near Matrimandir, the Green Belt offers select opportunities. These locations provide daily access to this unique spiritual environment while enjoying Auroville's sustainable community lifestyle. Such properties rarely come to market, making them highly coveted among serious investors and spiritual seekers alike.`,
      excerpt: 'An iconic meditation space with a distinctive golden dome, symbolizing peace, inner reflection, and human unity in the heart of Auroville.',
      featured_image: '/images/matrimandir-3.jpg',
      category: 'Cultural Heritage',
      tags: ['Matrimandir', 'Auroville', 'Spirituality', 'Architecture'],
      meta_title: 'Matrimandir Auroville: Spiritual Center & Real Estate Impact | Plotzed',
      meta_description: 'Discover the Matrimandir, Auroville\'s golden meditation dome, and its influence on surrounding property values and lifestyle.',
      is_published: true,
      published_at: new Date('2024-11-30'),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  try {
    for (const post of blogPosts) {
      const created = await prisma.blog_posts.create({
        data: post,
      });
      console.log(`✅ Created: ${created.title}`);
    }

    console.log(`\n🎉 Successfully seeded ${blogPosts.length} blog posts!`);
  } catch (error) {
    console.error('❌ Error seeding blog posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBlogPosts();
