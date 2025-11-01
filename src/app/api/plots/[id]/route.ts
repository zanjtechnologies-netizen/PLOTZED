// ================================================
// src/app/api/plots/[id]/route.ts - Single Plot API
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updatePlotSchema } from '@/lib/validators'
import { z } from 'zod'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const plot = await prisma.plot.findUnique({
      where: { id: params.id },
      include: {
        bookings: {
          where: { status: 'COMPLETED' },
          select: { id: true },
        },
      },
    })

    if (!plot) {
      return NextResponse.json(
        { error: 'Plot not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(plot)
  } catch (error) {
    console.error('Plot fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plot' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const plotData = updatePlotSchema.parse(body)

    const {
      bookingAmount,
      plotSize,
      reraNumber,
      isFeatured,
      ...restOfPlotData
    } = plotData

    const updatedPlot = await prisma.plot.update({
      where: { id: params.id },
      data: {
        ...restOfPlotData,
        booking_amount: bookingAmount,
        plot_size: plotSize,
        rera_number: reraNumber,
        is_featured: isFeatured,
      },
    })

    return NextResponse.json(updatedPlot)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Plot update error:', error)
    return NextResponse.json(
      { error: 'Failed to update plot' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.plot.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Plot delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete plot' },
      { status: 500 }
    )
  }
}
