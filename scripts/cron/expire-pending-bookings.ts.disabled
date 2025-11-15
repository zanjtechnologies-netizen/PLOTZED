#!/usr/bin/env tsx
// ================================================
// scripts/cron/expire-pending-bookings.ts
// Automatically expire pending bookings after timeout
// ================================================

/**
 * Scheduled Task: Booking Expiration
 *
 * Purpose:
 * - Cancel bookings stuck in PENDING status for >48 hours
 * - Release plots back to AVAILABLE status
 * - Cancel associated pending payments
 * - Send notification emails to users
 *
 * Schedule: Every 6 hours
 *
 * Usage:
 *   npm run cron:expire-bookings
 */

import { PrismaClient } from '@prisma/client'
import { sendEmail } from '@/lib/email'

const prisma = new PrismaClient()

interface ExpirationResult {
  expiredBookings: number
  releasedPlots: number
  cancelledPayments: number
  emailsSent: number
  duration: number
}

async function expirePendingBookings(): Promise<ExpirationResult> {
  const startTime = Date.now()

  console.log('╔════════════════════════════════════════════╗')
  console.log('║   BOOKING EXPIRATION JOB                   ║')
  console.log('╚════════════════════════════════════════════╝')
  console.log()
  console.log(`Started at: ${new Date().toISOString()}`)
  console.log()

  try {
    // Find pending bookings older than 48 hours
    const expirationThreshold = new Date(Date.now() - 48 * 60 * 60 * 1000)

    console.log(`🔍 Finding bookings pending since before: ${expirationThreshold.toISOString()}`)

    const expiredBookings = await prisma.booking.findMany({
      where: {
        status: 'PENDING',
        created_at: { lt: expirationThreshold },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        plot: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        payments: {
          where: {
            status: { in: ['PENDING', 'PROCESSING'] },
          },
        },
      },
    })

    console.log(`   Found ${expiredBookings.length} expired bookings`)

    if (expiredBookings.length === 0) {
      console.log('   ✅ No bookings to expire')
      return {
        expiredBookings: 0,
        releasedPlots: 0,
        cancelledPayments: 0,
        emailsSent: 0,
        duration: Date.now() - startTime,
      }
    }

    let releasedPlots = 0
    let cancelledPayments = 0
    let emailsSent = 0

    // Process each expired booking
    for (const booking of expiredBookings) {
      console.log(`\n📦 Processing booking ${booking.id}:`)
      console.log(`   User: ${booking.user.name} (${booking.user.email})`)
      console.log(`   Plot: ${booking.plot.title}`)
      console.log(`   Created: ${booking.created_at.toISOString()}`)

      try {
        // Update booking status to CANCELLED
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            status: 'CANCELLED',
          },
        })

        console.log('   ✅ Booking cancelled')

        // Release plot back to AVAILABLE
        await prisma.plot.update({
          where: { id: booking.plot_id },
          data: { status: 'AVAILABLE' },
        })

        releasedPlots++
        console.log('   ✅ Plot released')

        // Cancel pending payments
        if (booking.payments.length > 0) {
          await prisma.payment.updateMany({
            where: {
              booking_id: booking.id,
              status: { in: ['PENDING', 'PROCESSING'] },
            },
            data: {
              status: 'FAILED',
            },
          })

          cancelledPayments += booking.payments.length
          console.log(`   ✅ ${booking.payments.length} payment(s) cancelled`)
        }

        // Log activity
        await prisma.activityLog.create({
          data: {
            user_id: booking.user_id,
            action: 'BOOKING_EXPIRED',
            entity_type: 'booking',
            entity_id: booking.id,
            metadata: {
              reason: 'Automatic expiration after 48 hours',
              plot_id: booking.plot_id,
            },
          },
        })

        // Send notification email
        if (booking.user.email) {
          try {
            await sendEmail({
              to: booking.user.email,
              subject: 'Booking Expired - Plotzed Real Estate',
              html: `
                <h2>Booking Expired</h2>
                <p>Dear ${booking.user.name},</p>
                <p>Your booking for <strong>${booking.plot.title}</strong> has expired due to incomplete payment.</p>
                <p><strong>Booking Details:</strong></p>
                <ul>
                  <li>Property: ${booking.plot.title}</li>
                  <li>Amount: ₹${Number(booking.plot.price).toLocaleString('en-IN')}</li>
                  <li>Booking Date: ${booking.created_at.toLocaleDateString('en-IN')}</li>
                  <li>Expiry: 48 hours from booking</li>
                </ul>
                <p>The property is now available for booking again. If you're still interested, please create a new booking and complete the payment within 48 hours.</p>
                <p><a href="${process.env.NEXTAUTH_URL}/plots" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Browse Properties</a></p>
                <p>Best regards,<br>Plotzed Real Estate Team</p>
              `,
            })

            emailsSent++
            console.log('   ✅ Notification email sent')
          } catch (emailError: any) {
            console.error(`   ⚠️  Email failed: ${emailError.message}`)
          }
        }
      } catch (error: any) {
        console.error(`   ❌ Failed to process booking ${booking.id}:`, error.message)
        continue
      }
    }

    const duration = Date.now() - startTime

    console.log()
    console.log('╔════════════════════════════════════════════╗')
    console.log('║   EXPIRATION COMPLETED                     ║')
    console.log('╚════════════════════════════════════════════╝')
    console.log(`   Expired bookings: ${expiredBookings.length}`)
    console.log(`   Released plots: ${releasedPlots}`)
    console.log(`   Cancelled payments: ${cancelledPayments}`)
    console.log(`   Emails sent: ${emailsSent}`)
    console.log(`   Duration: ${duration}ms`)
    console.log()

    return {
      expiredBookings: expiredBookings.length,
      releasedPlots,
      cancelledPayments,
      emailsSent,
      duration,
    }
  } catch (error: any) {
    console.error('❌ Booking expiration failed:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Execute if run directly
if (require.main === module) {
  expirePendingBookings()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

export { expirePendingBookings }
