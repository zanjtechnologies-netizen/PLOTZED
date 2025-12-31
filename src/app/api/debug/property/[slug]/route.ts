import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { NotFoundError } from '@/lib/errors'

export const GET = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params

    const plot = await prisma.plots.findUnique({
      where: { slug },
    })

    if (!plot) {
      throw new NotFoundError('Plot not found')
    }

    // Convert Decimal fields to numbers for JSON serialization
    const serializedPlot = {
      ...plot,
      price: plot.price.toNumber(),
      original_price: plot.original_price?.toNumber() ?? null,
      booking_amount: plot.booking_amount.toNumber(),
      plot_size: plot.plot_size.toNumber(),
      latitude: plot.latitude?.toNumber() ?? null,
      longitude: plot.longitude?.toNumber() ?? null,
    }

    return successResponse({
      plot: serializedPlot,
      imageCheck: {
        hasHeroImage: !!plot.hero_image,
        heroImageUrl: plot.hero_image,
        hasGalleryImages: plot.images && plot.images.length > 0,
        galleryImagesCount: plot.images?.length || 0,
        firstGalleryImage: plot.images?.[0] || null,
      }
    })
  },
  'GET /api/debug/property/[slug]'
)
