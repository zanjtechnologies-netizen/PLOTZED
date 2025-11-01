// ================================================
// src/app/api/plots/route.ts - Plots API
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPlotSchema } from '@/lib/validators'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const plots = await prisma.plot.findMany()
    return NextResponse.json(plots)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const plotData = createPlotSchema.parse(body)

    // Create a URL-friendly slug from the title
    const slug = plotData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/[\s-]+/g, '-')

    const {
      bookingAmount,
      plotSize,
      reraNumber,
      isFeatured,
      ...restOfPlotData
    } = plotData

    const newPlot = await prisma.plot.create({
      data: {
        ...restOfPlotData,
        slug,
        booking_amount: bookingAmount,
        plot_size: plotSize,
        rera_number: reraNumber,
        is_featured: isFeatured,
      },
    })

    return NextResponse.json(newPlot, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
