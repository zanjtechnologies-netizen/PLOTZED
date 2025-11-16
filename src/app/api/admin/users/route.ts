// ================================================
// src/app/api/admin/users/route.ts - User Management (Admin)
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { BadRequestError, ForbiddenError, UnauthorizedError } from '@/lib/errors'

export const GET = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to access this resource')
    }

    // Only admins can access user management
    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Admin access required')
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    const search = searchParams.get('search')
    const role = searchParams.get('role')
    const kycVerified = searchParams.get('kycVerified')

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (role) where.role = role
    if (kycVerified !== null) where.kyc_verified = kycVerified === 'true'

    // Get total count
    const total = await prisma.user.count({ where })

    // Get users
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        kyc_verified: true,
        saved_plots: true,
        created_at: true,
        last_login: true,
        email_verified: true,
        _count: {
          select: {
            site_visits: true,
            inquiries: true,
          },
        },
      },
    })

    // Get user statistics
    const stats = {
      total: total,
      customers: await prisma.user.count({ where: { role: 'CUSTOMER' } }),
      admins: await prisma.user.count({ where: { role: 'ADMIN' } }),
      verified: await prisma.user.count({ where: { email_verified: true } }),
    }

    return successResponse({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + users.length < total,
      },
      stats,
    })
  },
  'GET /api/admin/users'
)

export const PUT = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to access this resource')
    }

    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Admin access required')
    }

    const body = await request.json()
    const { userId, role, email_verified, kyc_verified } = body

    if (!userId) {
      throw new BadRequestError('User ID is required')
    }

    const updateData: any = {}
    if (role !== undefined) updateData.role = role
    if (email_verified !== undefined) updateData.email_verified = email_verified
    if (kyc_verified !== undefined) updateData.kyc_verified = kyc_verified

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        kyc_verified: true,
        email_verified: true,
      },
    })

    return successResponse({ user: updatedUser }, 200, 'User updated successfully')
  },
  'PUT /api/admin/users'
)

export const DELETE = withErrorHandling(
  async (request: NextRequest) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Please login to access this resource')
    }

    if (session.user.role !== 'ADMIN') {
      throw new ForbiddenError('Admin access required')
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      throw new BadRequestError('User ID is required')
    }

    // Prevent deleting yourself
    if (userId === session.user.id) {
      throw new ForbiddenError('You cannot delete your own account')
    }

    // Prevent deleting other admins
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (userToDelete?.role === 'ADMIN') {
      throw new ForbiddenError('Cannot delete admin accounts')
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    return successResponse(null, 200, 'User deleted successfully')
  },
  'DELETE /api/admin/users'
)
