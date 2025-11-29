// ================================================
// src/app/api/users/[id]/route.ts - User Profile API (NextAuth v5)
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { ForbiddenError, NotFoundError, UnauthorizedError } from '@/lib/errors'

export const GET = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to view user profile')
    }

    const { id } = await params

    // Only the user themselves or an admin can view this profile
    if (session.user.id !== id && session.user.role !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to view this profile')
    }

    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        kyc_verified: true,
        kyc_documents: true,
        saved_plots: true,
        created_at: true,
        last_login: true,
      },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return successResponse({ user })
  },
  'GET /api/users/[id]'
)

// ================================================
// PATCH /api/users/[id] - Update user profile
// ================================================

export const PATCH = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to update user profile')
    }

    const { id } = await params

    if (session.user.id !== id && session.user.role !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to update this profile')
    }

    const body = await request.json()

    // Prevent updates to sensitive fields
    delete body.password_hash
    delete body.role
    delete body.kyc_verified

    const updatedUser = await prisma.users.update({
      where: { id },
      data: body,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        kyc_verified: true,
      },
    })

    return successResponse({ user: updatedUser }, 200, 'User updated successfully')
  },
  'PATCH /api/users/[id]'
)
