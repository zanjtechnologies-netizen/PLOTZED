// ================================================
// src/lib/audit-log.ts - Admin Action Audit Logging
// ================================================

import { prisma } from './db'

export enum AuditAction {
  // Site Visit Actions
  SITE_VISIT_CONFIRMED = 'SITE_VISIT_CONFIRMED',
  SITE_VISIT_CANCELLED = 'SITE_VISIT_CANCELLED',
  SITE_VISIT_RESCHEDULED = 'SITE_VISIT_RESCHEDULED',
  SITE_VISIT_COMPLETED = 'SITE_VISIT_COMPLETED',

  // Inquiry Actions
  INQUIRY_CONTACTED = 'INQUIRY_CONTACTED',
  INQUIRY_QUALIFIED = 'INQUIRY_QUALIFIED',
  INQUIRY_CONVERTED = 'INQUIRY_CONVERTED',
  INQUIRY_CLOSED = 'INQUIRY_CLOSED',

  // Plot Actions
  PLOT_CREATED = 'PLOT_CREATED',
  PLOT_UPDATED = 'PLOT_UPDATED',
  PLOT_DELETED = 'PLOT_DELETED',
  PLOT_STATUS_CHANGED = 'PLOT_STATUS_CHANGED',

  // User Actions
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
}

interface AuditLogData {
  adminId: string
  adminEmail: string
  action: AuditAction
  entityType: string // 'SiteVisit', 'Inquiry', 'Plot', 'User'
  entityId: string
  changes?: Record<string, any> // Old and new values
  metadata?: Record<string, any> // Additional context
  ipAddress?: string
}

/**
 * Log admin action to database
 */
export async function logAdminAction(data: AuditLogData): Promise<void> {
  try {
    // For now, log to console (in production, save to database)
    const logEntry = {
      timestamp: new Date().toISOString(),
      admin: {
        id: data.adminId,
        email: data.adminEmail,
      },
      action: data.action,
      entity: {
        type: data.entityType,
        id: data.entityId,
      },
      changes: data.changes,
      metadata: data.metadata,
      ipAddress: data.ipAddress,
    }

    console.log('📋 AUDIT LOG:', JSON.stringify(logEntry, null, 2))

    // TODO: In production, save to audit_logs table
    // await prisma.auditLog.create({
    //   data: {
    //     admin_id: data.adminId,
    //     action: data.action,
    //     entity_type: data.entityType,
    //     entity_id: data.entityId,
    //     changes: data.changes,
    //     metadata: data.metadata,
    //     ip_address: data.ipAddress,
    //   },
    // })
  } catch (error) {
    console.error('Failed to log audit entry:', error)
    // Don't throw error - audit logging should not break the main flow
  }
}

/**
 * Helper to create audit log for site visit status change
 */
export async function logSiteVisitStatusChange(
  adminId: string,
  adminEmail: string,
  siteVisitId: string,
  oldStatus: string,
  newStatus: string,
  ipAddress?: string
) {
  let action: AuditAction

  switch (newStatus) {
    case 'CONFIRMED':
      action = AuditAction.SITE_VISIT_CONFIRMED
      break
    case 'CANCELLED':
      action = AuditAction.SITE_VISIT_CANCELLED
      break
    case 'RESCHEDULED':
      action = AuditAction.SITE_VISIT_RESCHEDULED
      break
    case 'COMPLETED':
      action = AuditAction.SITE_VISIT_COMPLETED
      break
    default:
      action = AuditAction.SITE_VISIT_CONFIRMED
  }

  await logAdminAction({
    adminId,
    adminEmail,
    action,
    entityType: 'SiteVisit',
    entityId: siteVisitId,
    changes: {
      status: {
        old: oldStatus,
        new: newStatus,
      },
    },
    ipAddress,
  })
}

/**
 * Helper to create audit log for inquiry status change
 */
export async function logInquiryStatusChange(
  adminId: string,
  adminEmail: string,
  inquiryId: string,
  oldStatus: string,
  newStatus: string,
  ipAddress?: string
) {
  let action: AuditAction

  switch (newStatus) {
    case 'CONTACTED':
      action = AuditAction.INQUIRY_CONTACTED
      break
    case 'QUALIFIED':
      action = AuditAction.INQUIRY_QUALIFIED
      break
    case 'CONVERTED':
      action = AuditAction.INQUIRY_CONVERTED
      break
    case 'CLOSED':
      action = AuditAction.INQUIRY_CLOSED
      break
    default:
      action = AuditAction.INQUIRY_CONTACTED
  }

  await logAdminAction({
    adminId,
    adminEmail,
    action,
    entityType: 'Inquiry',
    entityId: inquiryId,
    changes: {
      status: {
        old: oldStatus,
        new: newStatus,
      },
    },
    ipAddress,
  })
}
