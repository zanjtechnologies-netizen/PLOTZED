// ================================================
// src/app/api/cron/[task]/route.ts - Cron Job API Endpoints
// ================================================

/**
 * Secure Cron Job Execution API
 *
 * Endpoints:
 * - GET /api/cron/cleanup-tokens
 * - GET /api/cron/visit-reminders
 * - GET /api/cron/cleanup-logs
 * - GET /api/cron/all (run all tasks)
 *
 * Security:
 * - Requires CRON_SECRET in Authorization header
 * - Bearer token authentication
 *
 * Usage:
 *   curl http://localhost:3000/api/cron/cleanup-tokens \
 *     -H "Authorization: Bearer YOUR_CRON_SECRET"
 */

import { NextRequest } from 'next/server'
import { successResponse, withErrorHandling } from '@/lib/api-error-handler'
import { UnauthorizedError, NotFoundError } from '@/lib/errors'
import { structuredLogger } from '@/lib/structured-logger'

// Import cron job functions
import { cleanupExpiredTokens } from '@/../scripts/cron/cleanup-expired-tokens'
import { sendSiteVisitReminders } from '@/../scripts/cron/send-site-visit-reminders'
import { cleanupActivityLogs } from '@/../scripts/cron/cleanup-activity-logs'

type CronTask =
  | 'cleanup-tokens'
  | 'visit-reminders'
  | 'cleanup-logs'
  | 'all'

interface CronTaskConfig {
  name: string
  description: string
  handler: () => Promise<any>
}

const CRON_TASKS: Record<string, CronTaskConfig> = {
  'cleanup-tokens': {
    name: 'Cleanup Expired Tokens',
    description: 'Remove expired verification and reset tokens',
    handler: cleanupExpiredTokens,
  },
  'visit-reminders': {
    name: 'Site Visit Reminders',
    description: 'Send reminders for upcoming site visits',
    handler: sendSiteVisitReminders,
  },
  'cleanup-logs': {
    name: 'Cleanup Activity Logs',
    description: 'Delete activity logs older than 90 days',
    handler: cleanupActivityLogs,
  },
}

/**
 * Verify cron authentication
 */
function verifyCronAuth(request: NextRequest): void {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    throw new Error('CRON_SECRET not configured')
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header')
  }

  const token = authHeader.substring(7)

  if (token !== cronSecret) {
    structuredLogger.warn('Invalid cron secret attempt', {
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      type: 'cron_auth_failed',
    })
    throw new UnauthorizedError('Invalid cron secret')
  }
}

/**
 * GET /api/cron/[task]
 * Execute a specific cron task
 */
export const GET = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ task: string }> }) => {
    const startTime = Date.now()

    // Verify authentication
    verifyCronAuth(request)

    const { task } = await params

    structuredLogger.info('Cron job triggered', {
      task,
      type: 'cron_job_start',
    })

    // Handle "all" tasks
    if (task === 'all') {
      const results: Record<string, any> = {}

      for (const [taskName, config] of Object.entries(CRON_TASKS)) {
        try {
          console.log(`\n🚀 Running: ${config.name}`)
          const result = await config.handler()
          results[taskName] = {
            success: true,
            ...result,
          }
        } catch (error: any) {
          results[taskName] = {
            success: false,
            error: error.message,
          }
          structuredLogger.error(`Cron task ${taskName} failed`, error, {
            task: taskName,
            type: 'cron_job_error',
          })
        }
      }

      const duration = Date.now() - startTime

      structuredLogger.info('All cron jobs completed', {
        duration,
        results,
        type: 'cron_job_complete',
      })

      return successResponse({
        message: 'All cron tasks executed',
        results,
        duration,
        timestamp: new Date().toISOString(),
      })
    }

    // Execute specific task
    const taskConfig = CRON_TASKS[task]

    if (!taskConfig) {
      throw new NotFoundError(`Cron task '${task}' not found`)
    }

    console.log(`\n🚀 Running: ${taskConfig.name}`)
    const result = await taskConfig.handler()
    const duration = Date.now() - startTime

    structuredLogger.info(`Cron job ${task} completed`, {
      task,
      duration,
      result,
      type: 'cron_job_complete',
    })

    return successResponse({
      message: `${taskConfig.name} completed successfully`,
      task,
      description: taskConfig.description,
      result,
      duration,
      timestamp: new Date().toISOString(),
    })
  },
  'GET /api/cron/[task]'
)
