// ================================================
// src/app/api/admin/users/route.ts - User Management (Admin)
// ================================================
export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { ForbiddenError, UnauthorizedError } from '@/lib/errors'

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
        _count: {
          select: {
            bookings: true,
            inquiries: true,
            payments: true,
          },
        },
      },
    })

    // Get user statistics
    const stats = {
      total: total,
      customers: await prisma.user.count({ where: { role: 'CUSTOMER' } }),
      admins: await prisma.user.count({ where: { role: 'ADMIN' } }),
      kycVerified: await prisma.user.count({ where: { kyc_verified: true } }),
      kycPending: await prisma.user.count({ where: { kyc_verified: false } }),
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
