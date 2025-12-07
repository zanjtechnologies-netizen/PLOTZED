// ================================================
// src/app/api/site-visits/[id]/route.ts - Site Visit Management API
// ================================================

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH - Update site visit (reschedule or change status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status, visit_date, visit_time } = body

    // Verify the site visit belongs to the user
    const existingVisit = await prisma.site_visits.findUnique({
      where: { id: params.id },
    })

    if (!existingVisit) {
      return NextResponse.json(
        { success: false, error: 'Site visit not found' },
        { status: 404 }
      )
    }

    if (existingVisit.user_id !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    if (status) {
      updateData.status = status
    }

    if (visit_date) {
      updateData.visit_date = new Date(visit_date)
      updateData.status = 'RESCHEDULED'
    }

    if (visit_time) {
      updateData.visit_time = visit_time
    }

    // Update the site visit
    const updatedVisit = await prisma.site_visits.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Site visit updated successfully',
      data: updatedVisit,
    })
  } catch (error) {
    console.error('Error updating site visit:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Cancel site visit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify the site visit belongs to the user
    const existingVisit = await prisma.site_visits.findUnique({
      where: { id: params.id },
    })

    if (!existingVisit) {
      return NextResponse.json(
        { success: false, error: 'Site visit not found' },
        { status: 404 }
      )
    }

    if (existingVisit.user_id !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Update status to CANCELLED instead of deleting
    await prisma.site_visits.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' },
    })

    return NextResponse.json({
      success: true,
      message: 'Site visit cancelled successfully',
    })
  } catch (error) {
    console.error('Error cancelling site visit:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
