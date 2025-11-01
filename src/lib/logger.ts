// ================================================
// src/lib/logger.ts - Activity Logger
// ================================================

import { prisma } from './prisma'

interface LogActivityParams {
  user_id?: string
  action: string
  entity_type?: string
  entity_id?: string
  ip_address?: string
  user_agent?: string
  metadata?: any
}

export async function logActivity(params: LogActivityParams) {
  try {
    await prisma.activityLog.create({
      data: params,
    })
  } catch (error) {
    console.error('Activity logging error:', error)
  }
}
