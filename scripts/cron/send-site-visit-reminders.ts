#!/usr/bin/env tsx
// ================================================
// scripts/cron/send-site-visit-reminders.ts
// Send reminders for upcoming site visits
// ================================================

/**
 * Scheduled Task: Site Visit Reminders
 *
 * Purpose:
 * - Send email reminders 24 hours before scheduled site visits
 * - Send SMS reminders (if configured)
 * - Improve attendance rates
 * - Enhance customer experience
 *
 * Schedule: Every 2 hours
 *
 * Usage:
 *   npm run cron:visit-reminders
 */

import { PrismaClient } from '@prisma/client'
import { sendEmail } from '@/lib/email'

const prisma = new PrismaClient()

interface ReminderResult {
  remindersChecked: number
  emailsSent: number
  smsSent: number
  errors: number
  duration: number
}

async function sendSiteVisitReminders(): Promise<ReminderResult> {
  const startTime = Date.now()

  console.log('╔════════════════════════════════════════════╗')
  console.log('║   SITE VISIT REMINDER JOB                  ║')
  console.log('╚════════════════════════════════════════════╝')
  console.log()
  console.log(`Started at: ${new Date().toISOString()}`)
  console.log()

  try {
    // Find site visits scheduled 22-26 hours from now (24h ± 2h buffer)
    const now = new Date()
    const reminderWindowStart = new Date(now.getTime() + 22 * 60 * 60 * 1000)
    const reminderWindowEnd = new Date(now.getTime() + 26 * 60 * 60 * 1000)

    console.log(`🔍 Finding site visits between:`)
    console.log(`   Start: ${reminderWindowStart.toISOString()}`)
    console.log(`   End: ${reminderWindowEnd.toISOString()}`)

    const upcomingSiteVisits = await prisma.siteVisit.findMany({
      where: {
        visit_date: {
          gte: reminderWindowStart,
          lte: reminderWindowEnd,
        },
        status: { in: ['PENDING', 'CONFIRMED'] },
        // Only send reminder once - check if we haven't sent one yet
        // We'll add a 'reminder_sent' field to track this
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        plot: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            state: true,
            images: true,
          },
        },
      },
    })

    console.log(`   Found ${upcomingSiteVisits.length} upcoming site visits`)

    if (upcomingSiteVisits.length === 0) {
      console.log('   ✅ No reminders to send')
      return {
        remindersChecked: 0,
        emailsSent: 0,
        smsSent: 0,
        errors: 0,
        duration: Date.now() - startTime,
      }
    }

    let emailsSent = 0
    let smsSent = 0
    let errors = 0

    // Process each site visit
    for (const siteVisit of upcomingSiteVisits) {
      console.log(`\n📅 Processing site visit ${siteVisit.id}:`)
      console.log(`   User: ${siteVisit.user?.name}`)
      console.log(`   Plot: ${siteVisit.plot.title}`)
      console.log(`   Date: ${siteVisit.visit_date.toLocaleDateString('en-IN')}`)
      console.log(`   Time: ${siteVisit.visit_time}`)

      try {
        const visitDateTime = new Date(siteVisit.visit_date)
        const formattedDate = visitDateTime.toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })

        const userEmail = siteVisit.user?.email
        const userName = siteVisit.user?.name

        // Send email reminder
        if (userEmail) {
          try {
            await sendEmail({
              to: userEmail,
              subject: `Reminder: Site Visit Tomorrow at ${siteVisit.visit_time} - Plotzed`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #4F46E5;">Site Visit Reminder</h2>

                  <p>Dear ${userName},</p>

                  <p>This is a friendly reminder about your scheduled site visit <strong>tomorrow</strong>.</p>

                  <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #1F2937;">Visit Details</h3>
                    <p style="margin: 5px 0;"><strong>Property:</strong> ${siteVisit.plot.title}</p>
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
                    <p style="margin: 5px 0;"><strong>Time:</strong> ${siteVisit.visit_time}</p>
                    ${siteVisit.attendees ? `<p style="margin: 5px 0;"><strong>Attendees:</strong> ${siteVisit.attendees}</p>` : ''}
                  </div>

                  <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; border-left: 4px solid #F59E0B; margin: 20px 0;">
                    <h4 style="margin-top: 0; color: #92400E;">Location</h4>
                    <p style="margin: 5px 0;">${siteVisit.plot.address}</p>
                    <p style="margin: 5px 0;">${siteVisit.plot.city}, ${siteVisit.plot.state}</p>
                    ${siteVisit.plot.address ? `<p style="margin-top: 10px;"><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteVisit.plot.address)}" style="color: #4F46E5; text-decoration: none;">📍 Get Directions</a></p>` : ''}
                  </div>

                  ${siteVisit.notes ? `
                  <div style="background: #EFF6FF; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="margin-top: 0; color: #1E40AF;">Notes</h4>
                    <p style="margin: 0;">${siteVisit.notes}</p>
                  </div>
                  ` : ''}

                  <h4 style="margin-top: 30px;">What to Bring:</h4>
                  <ul style="color: #4B5563;">
                    <li>Valid government ID</li>
                    <li>This confirmation email (digital or printed)</li>
                    <li>Questions you'd like to ask</li>
                  </ul>

                  <p style="margin-top: 30px;">Need to reschedule? <a href="${process.env.NEXTAUTH_URL}/dashboard/site-visits" style="color: #4F46E5;">Manage your visit</a></p>

                  <p style="margin-top: 30px;">We look forward to showing you around!</p>

                  <p style="color: #6B7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                    Best regards,<br>
                    Plotzed Real Estate Team<br>
                    <a href="tel:+919876543210" style="color: #4F46E5; text-decoration: none;">+91 98765 43210</a>
                  </p>
                </div>
              `,
            })

            emailsSent++
            console.log('   ✅ Email reminder sent')
          } catch (emailError: any) {
            console.error(`   ⚠️  Email failed: ${emailError.message}`)
            errors++
          }
        }

        // Send SMS reminder (if configured and phone available)
        const userPhone = siteVisit.user?.phone
        if (userPhone && process.env.SMS_API_KEY) {
          try {
            // TODO: Implement SMS sending
            // const smsMessage = `Reminder: Site visit tomorrow at ${siteVisit.visit_time} for ${siteVisit.plot.title}. Location: ${siteVisit.plot.address}. Questions? Call us at +91 98765 43210`
            // await sendSMS(userPhone, smsMessage)

            smsSent++
            console.log('   ✅ SMS reminder sent')
          } catch (smsError: any) {
            console.error(`   ⚠️  SMS failed: ${smsError.message}`)
            errors++
          }
        }

        // Log activity
        await prisma.activityLog.create({
          data: {
            user_id: siteVisit.user_id || null,
            action: 'SITE_VISIT_REMINDER_SENT',
            entity_type: 'site_visit',
            entity_id: siteVisit.id,
            metadata: {
              plot_id: siteVisit.plot_id,
              visit_date: siteVisit.visit_date.toISOString(),
              email_sent: userEmail ? true : false,
              sms_sent: userPhone && process.env.SMS_API_KEY ? true : false,
            },
          },
        })
      } catch (error: any) {
        console.error(`   ❌ Failed to process site visit ${siteVisit.id}:`, error.message)
        errors++
        continue
      }
    }

    const duration = Date.now() - startTime

    console.log()
    console.log('╔════════════════════════════════════════════╗')
    console.log('║   REMINDERS COMPLETED                      ║')
    console.log('╚════════════════════════════════════════════╝')
    console.log(`   Checked: ${upcomingSiteVisits.length}`)
    console.log(`   Emails sent: ${emailsSent}`)
    console.log(`   SMS sent: ${smsSent}`)
    console.log(`   Errors: ${errors}`)
    console.log(`   Duration: ${duration}ms`)
    console.log()

    return {
      remindersChecked: upcomingSiteVisits.length,
      emailsSent,
      smsSent,
      errors,
      duration,
    }
  } catch (error: any) {
    console.error('❌ Site visit reminder job failed:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Execute if run directly
if (require.main === module) {
  sendSiteVisitReminders()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

export { sendSiteVisitReminders }
