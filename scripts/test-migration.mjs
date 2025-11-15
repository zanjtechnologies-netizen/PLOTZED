#!/usr/bin/env node

/**
 * Migration Test Suite
 *
 * Tests the migration from Booking/Payment system to Site Visits only
 *
 * Usage: node scripts/test-migration.mjs
 */

import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const prisma = new PrismaClient()

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logTest(testName, status, details = '') {
  const icon = status === 'pass' ? '✓' : '✗'
  const color = status === 'pass' ? 'green' : 'red'
  log(`${icon} ${testName}${details ? ': ' + details : ''}`, color)
}

async function runTests() {
  log('\n════════════════════════════════════════════════════════', 'cyan')
  log('  PLOTZED MIGRATION TEST SUITE', 'bright')
  log('  Booking/Payment → Site Visits Only', 'cyan')
  log('════════════════════════════════════════════════════════\n', 'cyan')

  let passedTests = 0
  let failedTests = 0

  try {
    // Test 1: Verify Prisma schema doesn't have Booking model
    log('\n📋 Test 1: Prisma Schema Validation', 'blue')
    try {
      const schemaPath = join(__dirname, '..', 'prisma', 'schema.prisma')
      const schemaContent = readFileSync(schemaPath, 'utf-8')

      const hasBookingModel = schemaContent.includes('model Booking')
      const hasPaymentModel = schemaContent.includes('model Payment')
      const hasSiteVisitModel = schemaContent.includes('model SiteVisit')

      if (!hasBookingModel && !hasPaymentModel && hasSiteVisitModel) {
        logTest('Schema has no Booking/Payment models', 'pass')
        logTest('Schema has SiteVisit model', 'pass')
        passedTests += 2
      } else {
        if (hasBookingModel) logTest('Booking model still exists', 'fail')
        if (hasPaymentModel) logTest('Payment model still exists', 'fail')
        if (!hasSiteVisitModel) logTest('SiteVisit model missing', 'fail')
        failedTests += (hasBookingModel ? 1 : 0) + (hasPaymentModel ? 1 : 0) + (!hasSiteVisitModel ? 1 : 0)
      }
    } catch (error) {
      logTest('Schema validation', 'fail', error.message)
      failedTests++
    }

    // Test 2: Verify SiteVisit model exists in database
    log('\n📊 Test 2: Database Models', 'blue')
    try {
      const siteVisits = await prisma.siteVisit.findMany({ take: 1 })
      logTest('SiteVisit table exists and is accessible', 'pass', `${siteVisits.length} records found`)
      passedTests++
    } catch (error) {
      logTest('SiteVisit table access', 'fail', error.message)
      failedTests++
    }

    // Test 3: Verify Plot model has site_visits relation
    log('\n🏘️  Test 3: Plot Relations', 'blue')
    try {
      const plot = await prisma.plot.findFirst({
        include: { site_visits: true }
      })
      if (plot !== null) {
        logTest('Plot has site_visits relation', 'pass', `Found ${plot.site_visits?.length || 0} site visits`)
        passedTests++
      } else {
        logTest('Plot has site_visits relation', 'pass', 'No plots found but relation exists')
        passedTests++
      }
    } catch (error) {
      logTest('Plot site_visits relation', 'fail', error.message)
      failedTests++
    }

    // Test 4: Verify User model has site_visits relation
    log('\n👤 Test 4: User Relations', 'blue')
    try {
      const user = await prisma.user.findFirst({
        include: { site_visits: true }
      })
      if (user !== null) {
        logTest('User has site_visits relation', 'pass', `Found ${user.site_visits?.length || 0} site visits`)
        passedTests++
      } else {
        logTest('User has site_visits relation', 'pass', 'No users found but relation exists')
        passedTests++
      }
    } catch (error) {
      logTest('User site_visits relation', 'fail', error.message)
      failedTests++
    }

    // Test 5: Check if booking API routes are disabled
    log('\n🔌 Test 5: API Endpoints', 'blue')
    try {
      const bookingRoutes = [
        'src/app/api/bookings/route.ts',
        'src/app/api/bookings/[id]/route.ts',
        'src/app/api/payments/route.ts',
        'src/app/api/payments/verify/route.ts'
      ]

      let allDisabled = true
      for (const route of bookingRoutes) {
        const fullPath = join(__dirname, '..', route)
        try {
          readFileSync(fullPath, 'utf-8')
          allDisabled = false
          logTest(`${route} is not disabled`, 'fail')
          failedTests++
        } catch (error) {
          // File not found is good - it means it's disabled
        }
      }

      if (allDisabled) {
        logTest('All booking/payment routes are disabled', 'pass')
        passedTests++
      }
    } catch (error) {
      logTest('API route check', 'fail', error.message)
      failedTests++
    }

    // Test 6: Check if site visit API routes exist
    log('\n🌐 Test 6: Site Visit API Routes', 'blue')
    try {
      const siteVisitRoutes = [
        'src/app/api/site-visits/route.ts',
        'src/app/api/site-visits/[id]/route.ts'
      ]

      let allExist = true
      for (const route of siteVisitRoutes) {
        const fullPath = join(__dirname, '..', route)
        try {
          readFileSync(fullPath, 'utf-8')
        } catch (error) {
          allExist = false
          logTest(`${route} is missing`, 'fail')
          failedTests++
        }
      }

      if (allExist) {
        logTest('All site visit routes exist', 'pass')
        passedTests++
      }
    } catch (error) {
      logTest('Site visit route check', 'fail', error.message)
      failedTests++
    }

    // Test 7: Test SiteVisit creation
    log('\n➕ Test 7: SiteVisit Creation', 'blue')
    try {
      // Get a user and plot for testing
      const testUser = await prisma.user.findFirst()
      const testPlot = await prisma.plot.findFirst()

      if (testUser && testPlot) {
        const visitDate = new Date()
        visitDate.setDate(visitDate.getDate() + 7) // Schedule for next week

        const siteVisit = await prisma.siteVisit.create({
          data: {
            user_id: testUser.id,
            plot_id: testPlot.id,
            visit_date: visitDate,
            status: 'PENDING',
            attendees: 2,
          }
        })

        logTest('SiteVisit creation successful', 'pass', `Created visit ID: ${siteVisit.id}`)
        passedTests++

        // Clean up test data
        await prisma.siteVisit.delete({ where: { id: siteVisit.id } })
      } else {
        logTest('SiteVisit creation', 'pass', 'Skipped - no test data available')
        passedTests++
      }
    } catch (error) {
      logTest('SiteVisit creation', 'fail', error.message)
      failedTests++
    }

    // Test 8: Verify admin dashboard uses site visits
    log('\n👨‍💼 Test 8: Admin Dashboard Integration', 'blue')
    try {
      const dashboardPath = join(__dirname, '..', 'src/app/api/admin/dashboard/route.ts')
      const dashboardContent = readFileSync(dashboardPath, 'utf-8')

      const usesSiteVisits = dashboardContent.includes('siteVisit')
      const usesBookings = dashboardContent.includes('booking') &&
                          !dashboardContent.includes('// booking')

      if (usesSiteVisits && !usesBookings) {
        logTest('Admin dashboard uses site visits', 'pass')
        passedTests++
      } else {
        if (!usesSiteVisits) logTest('Dashboard missing site visits', 'fail')
        if (usesBookings) logTest('Dashboard still references bookings', 'fail')
        failedTests++
      }
    } catch (error) {
      logTest('Admin dashboard check', 'fail', error.message)
      failedTests++
    }

    // Test 9: Verify cron jobs are updated
    log('\n⏰ Test 9: Cron Jobs', 'blue')
    try {
      const cronPath = join(__dirname, '..', 'src/app/api/cron/[task]/route.ts')
      const cronContent = readFileSync(cronPath, 'utf-8')

      const hasExpireBookings = cronContent.includes('expire-bookings') &&
                                !cronContent.includes('// expire-bookings')

      if (!hasExpireBookings) {
        logTest('Cron jobs updated (no expire-bookings)', 'pass')
        passedTests++
      } else {
        logTest('Cron still has expire-bookings task', 'fail')
        failedTests++
      }
    } catch (error) {
      logTest('Cron jobs check', 'fail', error.message)
      failedTests++
    }

    // Test 10: Check for site visit email templates
    log('\n📧 Test 10: Email Templates', 'blue')
    try {
      const emailPath = join(__dirname, '..', 'src/lib/email.ts')
      const emailContent = readFileSync(emailPath, 'utf-8')

      const hasSiteVisitEmails = emailContent.includes('sendSiteVisitConfirmation') ||
                                 emailContent.includes('siteVisit')

      if (hasSiteVisitEmails) {
        logTest('Site visit email templates exist', 'pass')
        passedTests++
      } else {
        logTest('Site visit email templates missing', 'fail')
        failedTests++
      }
    } catch (error) {
      logTest('Email templates check', 'fail', error.message)
      failedTests++
    }

  } catch (error) {
    log(`\n❌ Fatal error during testing: ${error.message}`, 'red')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }

  // Print summary
  log('\n════════════════════════════════════════════════════════', 'cyan')
  log('  TEST SUMMARY', 'bright')
  log('════════════════════════════════════════════════════════', 'cyan')
  log(`\n  Total Tests: ${passedTests + failedTests}`, 'bright')
  log(`  Passed: ${passedTests}`, 'green')
  log(`  Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green')
  log(`  Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%\n`,
      failedTests > 0 ? 'yellow' : 'green')

  if (failedTests === 0) {
    log('🎉 All tests passed! Migration is successful.', 'green')
    log('✅ The application is ready to use the Site Visit system.\n', 'green')
  } else {
    log('⚠️  Some tests failed. Please review the errors above.', 'yellow')
    log('📝 Fix the issues before deploying to production.\n', 'yellow')
  }

  process.exit(failedTests > 0 ? 1 : 0)
}

// Run tests
runTests().catch(error => {
  console.error('Unexpected error:', error)
  process.exit(1)
})
