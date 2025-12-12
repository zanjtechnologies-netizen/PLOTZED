import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch quick stats for sidebar
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all stats in parallel
    const [activeListings, pendingVisits, newInquiries] = await Promise.all([
      prisma.plots.count({
        where: {
          is_published: true,
          status: 'AVAILABLE',
        },
      }),
      prisma.site_visits.count({
        where: {
          status: 'PENDING',
        },
      }),
      prisma.inquiries.count({
        where: {
          status: 'NEW',
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        activeListings,
        pendingVisits,
        newInquiries,
      },
    });
  } catch (error) {
    console.error('Error fetching quick stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quick stats' },
      { status: 500 }
    );
  }
}
