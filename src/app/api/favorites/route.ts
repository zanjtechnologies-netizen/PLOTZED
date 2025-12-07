// ================================================
// src/app/api/favorites/route.ts - User Favorites API
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch user's favorites
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's favorites
    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: {
        favorite_plots: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        favorites: user?.favorite_plots || [],
      },
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Please log in to save favorites' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { plotId } = body

    if (!plotId) {
      return NextResponse.json(
        { success: false, error: 'Plot ID is required' },
        { status: 400 }
      )
    }

    // Get current favorites
    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: { favorite_plots: true },
    })

    const currentFavorites = (user?.favorite_plots as string[]) || []

    // Add to favorites if not already there
    if (!currentFavorites.includes(plotId)) {
      await prisma.users.update({
        where: { id: session.user.id },
        data: {
          favorite_plots: [...currentFavorites, plotId],
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Added to favorites',
    })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove from favorites
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const plotId = searchParams.get('plotId')

    if (!plotId) {
      return NextResponse.json(
        { success: false, error: 'Plot ID is required' },
        { status: 400 }
      )
    }

    // Get current favorites
    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: { favorite_plots: true },
    })

    const currentFavorites = (user?.favorite_plots as string[]) || []

    // Remove from favorites
    const updatedFavorites = currentFavorites.filter((id) => id !== plotId)

    await prisma.users.update({
      where: { id: session.user.id },
      data: {
        favorite_plots: updatedFavorites,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites',
    })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
