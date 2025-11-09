// ================================================
// prisma/seed.ts - Database Seeding Script
// ================================================

/**
 * Database Seed Script
 *
 * Purpose:
 * - Create initial admin user
 * - Add sample plots for development/testing
 * - Generate test users and bookings
 * - Populate database with realistic data
 *
 * Usage:
 *   npm run db:seed              # Run seed
 *   npm run db:seed:reset        # Reset DB and seed
 *
 * Environment:
 * - Development: Creates full sample data
 * - Production: Only creates admin user (safety)
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const isDevelopment = process.env.NODE_ENV !== 'production'

// ================================================
// SEED DATA CONFIGURATION
// ================================================

const ADMIN_USER = {
  email: process.env.ADMIN_EMAIL || 'admin@plotzed.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  name: 'Admin User',
  phone: '+919876543210',
  role: 'ADMIN' as const,
}

const SAMPLE_USERS = [
  {
    email: 'john.doe@example.com',
    password: 'User@123456',
    name: 'John Doe',
    phone: '+919876543211',
    role: 'CUSTOMER' as const,
  },
  {
    email: 'jane.smith@example.com',
    password: 'User@123456',
    name: 'Jane Smith',
    phone: '+919876543212',
    role: 'CUSTOMER' as const,
  },
  {
    email: 'bob.johnson@example.com',
    password: 'User@123456',
    name: 'Bob Johnson',
    phone: '+919876543213',
    role: 'CUSTOMER' as const,
  },
]

const SAMPLE_PLOTS = [
  {
    title: 'Luxury Villa Plot in Juhu, Mumbai',
    slug: 'luxury-villa-plot-juhu-mumbai',
    description: 'Premium residential plot in the heart of Juhu with sea-facing views. Perfect for building your dream villa. Located in a gated community with 24/7 security, water supply, and electricity connection.',
    price: 25000000, // 2.5 Cr
    booking_amount: 2500000, // 25 Lakhs
    plot_size: 2000, // sq ft
    dimensions: '40x50',
    facing: 'WEST',
    address: 'Juhu Tara Road, Juhu',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400049',
    latitude: 19.1075,
    longitude: 72.8263,
    status: 'AVAILABLE' as const,
    is_featured: true,
    is_published: true,
    amenities: ['Water Supply', 'Electricity', 'Gated Community', '24/7 Security', 'Park', 'Club House'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    ],
    rera_number: 'P51700000001',
  },
  {
    title: 'Beachfront Land in Calangute, Goa',
    slug: 'beachfront-land-calangute-goa',
    description: 'Stunning beachfront property with direct beach access. Ideal for resort or luxury villa development. Clear title, all approvals in place. Just 500 meters from Calangute Beach.',
    price: 15000000, // 1.5 Cr
    booking_amount: 1500000, // 15 Lakhs
    plot_size: 3000,
    dimensions: '50x60',
    facing: 'NORTH',
    address: 'Calangute Beach Road',
    city: 'Calangute',
    state: 'Goa',
    pincode: '403516',
    latitude: 15.5410,
    longitude: 73.7553,
    status: 'AVAILABLE' as const,
    is_featured: true,
    is_published: true,
    amenities: ['Beach Access', 'Water Supply', 'Electricity', 'Road Access'],
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    ],
    rera_number: 'P52100000042',
  },
  {
    title: 'Agricultural Land in Lonavala, Pune',
    slug: 'agricultural-land-lonavala-pune',
    description: 'Prime agricultural land with scenic hill views. Suitable for farmhouse or weekend retreat. Good water supply, all-weather road access. Perfect for organic farming or tourism.',
    price: 5000000, // 50 Lakhs
    booking_amount: 500000, // 5 Lakhs
    plot_size: 5000,
    dimensions: '100x50',
    facing: 'EAST',
    address: 'Old Mumbai-Pune Highway',
    city: 'Lonavala',
    state: 'Maharashtra',
    pincode: '410401',
    latitude: 18.7537,
    longitude: 73.4135,
    status: 'AVAILABLE' as const,
    is_featured: false,
    is_published: true,
    amenities: ['Water Supply', 'Road Access', 'Scenic Views'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    ],
    rera_number: 'P51700000089',
  },
  {
    title: 'Commercial Plot in Whitefield, Bangalore',
    slug: 'commercial-plot-whitefield-bangalore',
    description: 'Premium commercial plot in IT hub of Bangalore. Ideal for office complex or retail development. Excellent connectivity to major tech parks. High appreciation potential.',
    price: 35000000, // 3.5 Cr
    booking_amount: 3500000, // 35 Lakhs
    plot_size: 4000,
    dimensions: '80x50',
    facing: 'SOUTH',
    address: 'ITPL Main Road, Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    latitude: 12.9698,
    longitude: 77.7499,
    status: 'AVAILABLE' as const,
    is_featured: true,
    is_published: true,
    amenities: ['Water Supply', 'Electricity', 'Road Access', 'Metro Nearby', 'IT Park Nearby'],
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    ],
    rera_number: 'PRM/KA/RERA/1251/309/PR/171117/001654',
  },
  {
    title: 'Residential Plot in Sector 50, Noida',
    slug: 'residential-plot-sector-50-noida',
    description: 'Well-located residential plot in established sector. Close to schools, hospitals, and shopping centers. Metro station within walking distance. Ready for construction.',
    price: 8000000, // 80 Lakhs
    booking_amount: 800000, // 8 Lakhs
    plot_size: 1500,
    dimensions: '30x50',
    facing: 'NORTH',
    address: 'Sector 50, Noida',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    latitude: 28.5706,
    longitude: 77.3747,
    status: 'BOOKED' as const,
    is_featured: false,
    is_published: true,
    amenities: ['Water Supply', 'Electricity', 'Metro Nearby', 'School Nearby', 'Hospital Nearby'],
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    ],
    rera_number: 'UPRERAPRJ15145',
  },
  {
    title: 'Hill View Plot in Shimla, Himachal',
    slug: 'hill-view-plot-shimla-himachal',
    description: 'Breathtaking mountain views from this premium plot. Perfect for vacation home or resort. Cool climate year-round. Easy access from main road.',
    price: 6000000, // 60 Lakhs
    booking_amount: 600000, // 6 Lakhs
    plot_size: 2500,
    dimensions: '50x50',
    facing: 'EAST',
    address: 'Summer Hill Road',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    pincode: '171005',
    latitude: 31.1048,
    longitude: 77.1734,
    status: 'AVAILABLE' as const,
    is_featured: true,
    is_published: true,
    amenities: ['Mountain View', 'Water Supply', 'Electricity', 'Road Access'],
    images: [
      'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800',
    ],
    rera_number: 'HPRERA-SML-SML-0120-0014',
  },
]

// ================================================
// HELPER FUNCTIONS
// ================================================

async function clearDatabase() {
  console.log('🗑️  Clearing existing data...')

  await prisma.activityLog.deleteMany({})
  await prisma.payment.deleteMany({})
  await prisma.siteVisit.deleteMany({})
  await prisma.inquiry.deleteMany({})
  await prisma.booking.deleteMany({})
  await prisma.plot.deleteMany({})
  await prisma.blogPost.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('   ✅ Database cleared')
}

async function createAdminUser() {
  console.log('👤 Creating admin user...')

  const hashedPassword = await bcrypt.hash(ADMIN_USER.password, 10)

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_USER.email },
    update: {},
    create: {
      email: ADMIN_USER.email,
      password_hash: hashedPassword,
      name: ADMIN_USER.name,
      phone: ADMIN_USER.phone,
      role: ADMIN_USER.role,
      email_verified: true,
      kyc_verified: true,
    },
  })

  console.log(`   ✅ Admin created: ${admin.email}`)
  console.log(`   📧 Email: ${ADMIN_USER.email}`)
  console.log(`   🔑 Password: ${ADMIN_USER.password}`)

  return admin
}

async function createSampleUsers() {
  console.log('👥 Creating sample users...')

  const users = []

  for (const userData of SAMPLE_USERS) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password_hash: hashedPassword,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        email_verified: true,
        kyc_verified: false,
      },
    })

    users.push(user)
    console.log(`   ✅ User created: ${user.email}`)
  }

  return users
}

async function createSamplePlots() {
  console.log('🏘️  Creating sample plots...')

  const plots = []

  for (const plotData of SAMPLE_PLOTS) {
    const plot = await prisma.plot.create({
      data: plotData,
    })

    plots.push(plot)
    console.log(`   ✅ Plot created: ${plot.title}`)
  }

  return plots
}

async function createSampleBookings(users: any[], plots: any[]) {
  console.log('📋 Creating sample bookings...')

  // Create a booking for the Noida plot (status: BOOKED)
  const noidaPlot = plots.find(p => p.city === 'Noida')
  const johnDoe = users.find(u => u.email === 'john.doe@example.com')

  if (noidaPlot && johnDoe) {
    const booking = await prisma.booking.create({
      data: {
        user_id: johnDoe.id,
        plot_id: noidaPlot.id,
        booking_amount: noidaPlot.booking_amount,
        total_amount: noidaPlot.price,
        status: 'CONFIRMED',
        confirmed_at: new Date(),
      },
    })

    console.log(`   ✅ Booking created: ${johnDoe.name} -> ${noidaPlot.title}`)

    // Create a payment for this booking
    await prisma.payment.create({
      data: {
        user_id: johnDoe.id,
        booking_id: booking.id,
        amount: noidaPlot.booking_amount,
        status: 'COMPLETED',
        payment_type: 'BOOKING',
        payment_method: 'razorpay',
        razorpay_order_id: 'order_' + Math.random().toString(36).substr(2, 9),
        razorpay_payment_id: 'pay_' + Math.random().toString(36).substr(2, 9),
        completed_at: new Date(),
        invoice_number: `INV-${Date.now()}`,
      },
    })

    console.log(`   ✅ Payment created for booking`)
  }

  // Create pending booking
  const goaPlot = plots.find(p => p.city === 'Calangute')
  const janeSmith = users.find(u => u.email === 'jane.smith@example.com')

  if (goaPlot && janeSmith) {
    await prisma.booking.create({
      data: {
        user_id: janeSmith.id,
        plot_id: goaPlot.id,
        booking_amount: goaPlot.booking_amount,
        total_amount: goaPlot.price,
        status: 'PENDING',
      },
    })

    console.log(`   ✅ Pending booking created: ${janeSmith.name} -> ${goaPlot.title}`)
  }
}

async function createSampleInquiries(users: any[], plots: any[]) {
  console.log('💬 Creating sample inquiries...')

  const mumbaiPlot = plots.find(p => p.city === 'Mumbai')
  const bobJohnson = users.find(u => u.email === 'bob.johnson@example.com')

  if (mumbaiPlot && bobJohnson) {
    await prisma.inquiry.create({
      data: {
        user_id: bobJohnson.id,
        plot_id: mumbaiPlot.id,
        name: bobJohnson.name,
        email: bobJohnson.email,
        phone: bobJohnson.phone,
        message: 'I am interested in this property. Can you provide more details about the payment plans and available amenities?',
        status: 'NEW',
      },
    })

    console.log(`   ✅ Inquiry created`)
  }
}

async function createSampleSiteVisits(users: any[], plots: any[]) {
  console.log('📅 Creating sample site visits...')

  const bangalorePlot = plots.find(p => p.city === 'Bangalore')
  const janeSmith = users.find(u => u.email === 'jane.smith@example.com')

  if (bangalorePlot && janeSmith) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    await prisma.siteVisit.create({
      data: {
        user_id: janeSmith.id,
        plot_id: bangalorePlot.id,
        visit_date: tomorrow,
        visit_time: '10:00 AM',
        attendees: 2,
        notes: 'Looking forward to visiting the property',
        status: 'CONFIRMED',
      },
    })

    console.log(`   ✅ Site visit scheduled for tomorrow`)
  }
}

// ================================================
// MAIN SEED FUNCTION
// ================================================

async function seed() {
  console.log('╔════════════════════════════════════════════╗')
  console.log('║   PLOTZED DATABASE SEEDING                 ║')
  console.log('╚════════════════════════════════════════════╝')
  console.log()
  console.log(`Environment: ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'}`)
  console.log(`Database: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[1] || 'unknown'}`)
  console.log()

  try {
    // Clear database in development only
    if (isDevelopment) {
      await clearDatabase()
    }

    // Create admin user (always)
    const admin = await createAdminUser()
    console.log()

    // Create sample data (development only)
    if (isDevelopment) {
      const users = await createSampleUsers()
      console.log()

      const plots = await createSamplePlots()
      console.log()

      await createSampleBookings(users, plots)
      console.log()

      await createSampleInquiries(users, plots)
      console.log()

      await createSampleSiteVisits(users, plots)
      console.log()
    }

    console.log('╔════════════════════════════════════════════╗')
    console.log('║   ✅ SEEDING COMPLETED SUCCESSFULLY        ║')
    console.log('╚════════════════════════════════════════════╝')
    console.log()

    if (isDevelopment) {
      console.log('📊 Summary:')
      console.log('   - Admin user: 1')
      console.log('   - Sample users: 3')
      console.log('   - Sample plots: 6')
      console.log('   - Bookings: 2')
      console.log('   - Inquiries: 1')
      console.log('   - Site visits: 1')
      console.log()
      console.log('🔐 Login Credentials:')
      console.log(`   Admin: ${ADMIN_USER.email} / ${ADMIN_USER.password}`)
      console.log(`   User: john.doe@example.com / User@123456`)
      console.log()
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Execute seed
seed()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
