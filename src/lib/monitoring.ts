// src/lib/monitoring.ts

import { prisma } from './prisma'
import { randomUUID } from 'crypto'

interface SecurityEvent {
  type: 'failed_login' | 'suspicious_activity' | 'rate_limit_exceeded' | 'unauthorized_access'
  user_id?: string
  ip_address?: string
  user_agent?: string
  details?: any
}

export async function logSecurityEvent(event: SecurityEvent) {
  try {
    await prisma.activity_logs.create({
      data: {
        id: randomUUID(),
        action: event.type,
        user_id: event.user_id,
        ip_address: event.ip_address,
        user_agent: event.user_agent,
        metadata: event.details,
      },
    })

    // Alert on critical events
    if (shouldAlert(event)) {
      await sendSecurityAlert(event)
    }
  } catch (error) {
    console.error('Security logging error:', error)
  }
}

function shouldAlert(event: SecurityEvent): boolean {
  const criticalEvents = ['unauthorized_access', 'suspicious_activity']
  return criticalEvents.includes(event.type)
}

async function sendSecurityAlert(event: SecurityEvent) {
  // Send email/SMS to admin
  console.log('SECURITY ALERT:', event)
  // TODO: Implement email/SMS notification
}

// Detect suspicious patterns
export async function detectSuspiciousActivity(userId: string): Promise<boolean> {
  const recentLogs = await prisma.activity_logs.findMany({
    where: {
      user_id: userId,
      created_at: {
        gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      },
    },
    orderBy: { created_at: 'desc' },
  })

  // Check for rapid actions
  if (recentLogs.length > 100) {
    return true
  }

  // Check for failed logins
  const failedLogins = recentLogs.filter((log: any) => log.action === 'failed_login')
  if (failedLogins.length > 5) {
    return true
  }

  return false
}