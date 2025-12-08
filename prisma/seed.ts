// ================================================
// prisma/seed.ts - Database Seeding Script
// ================================================

import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()


async function main() {
  console.log('🌱 Starting database seed...\n')

  // ================================================
  // 1. CREATE ADMIN USER
  // ================================================
  console.log('👤 Creating admin user...')

  const adminPassword = await bcrypt.hash('Admin@123456', 10)

  const admin = await prisma.users.upsert({
    where: { email: 'plotzedrealestate@gmail.com' },
    update: {},
    create: {
      id: randomUUID(),
      email: 'plotzedrealestate@gmail.com',
      password_hash: adminPassword,
      name: 'Admin User',
      phone: '+919111111111',
      role: 'ADMIN',
      email_verified: true,
      kyc_verified: true,
      updated_at: new Date(),
    },
  })

  console.log(`   ✅ Admin: ${admin.email}\n`)

  // ================================================
  // 2. SKIP CREATING DUMMY CUSTOMER USERS
  // ================================================
  // No dummy customer users will be created
  console.log('👥 Skipping dummy customer users...\n')

  // ================================================
  // 3. CREATE 15 PLOT LISTINGS
  // ================================================
  console.log('🏘️  Creating plot listings...')

  const plots = await Promise.all([
    // ================================================
    // FEATURED PROPERTIES (3 NEW ADDITIONS)
    // ================================================

    // 1. CASUARINA GREENS
    prisma.plots.upsert({
      where: { slug: 'casuarina-greens' },
      update: {
        updated_at: new Date(),
      },
      create: {
        id: randomUUID(),
        title: 'Casuarina Greens',
        slug: 'casuarina-greens',
        description: 'Discover the rare opportunity to own premium land in the heart of Auroville\'s green belt, surrounded by lush Casuarina trees and unspoiled landscapes. Each land parcel is thoughtfully planned to provide privacy, long-term value, and an environment perfect for building your dream villa, retreat home, or eco-conscious estate. With proximity to Pondicherry city and major connecting highways, this project blends nature, accessibility, and future appreciation in one exclusive location.',
        price: 40500000, // ₹4.05 Cr
        booking_amount: 4050000, // 10% booking amount
        plot_size: 81000, // 1.86 acres = 81,000 sq ft
        dimensions: '380x213',
        facing: 'SOUTH',
        address: 'Auroville Green Belt Near Rayapudupakkam Lake',
        city: 'Auroville',
        state: 'Puducherry',
        pincode: '605101',
        latitude: 12.0064,
        longitude: 79.8083,
        status: 'AVAILABLE',
        is_featured: true,
        is_published: true,
        amenities: [
          'Prime Main-Road Frontage',
          'Legally Verified Land',
          'Green Belt Zone',
          'High Groundwater Level',
          'Custom Villa Construction',
          'Secure Location'
        ],
        images: [], // Upload via admin panel
        brochure: null, // Upload via admin panel
        rera_number: 'PY/RERA/2024/001',
        meta_title: 'Casuarina Greens - Premium Land in Auroville Green Belt | Plotzed',
        meta_description: '1.86 acres premium land in Auroville Green Belt, Pondicherry. 380 ft frontage, legally verified, perfect for villa construction.',
        updated_at: new Date(),
      },
    }),

    // 2. KATUMODE GREENS
    prisma.plots.upsert({
      where: { slug: 'katumode-greens' },
      update: {
        updated_at: new Date(),
      },
      create: {
        id: randomUUID(),
        title: 'Katumode Greens',
        slug: 'katumode-greens',
        description: 'This premium plot is located in one of Auroville\'s most sought-after and serene green-belt areas, celebrated for its tranquility and closeness to lifestyle hubs. It is perfectly suited for luxury villa developments, wellness retreats, or hospitality projects, or as a secure long-term investment. Auroville continues to attract global interest for sustainable living, unique community, and spiritual energy, making this a future-proof real estate asset.',
        price: 43200000, // ₹4.32 Cr
        booking_amount: 4320000, // 10% booking amount
        plot_size: 58806, // 1.35 acres = 58,806 sq ft
        dimensions: '750x78',
        facing: 'EAST',
        address: 'Katumode, Auroville Green Belt',
        city: 'Auroville',
        state: 'Puducherry',
        pincode: '605101',
        latitude: 12.0089,
        longitude: 79.8156,
        status: 'AVAILABLE',
        is_featured: true,
        is_published: true,
        amenities: [
          'Prime Main-Road Frontage',
          'Legally Verified Land',
          'Green Belt Zone',
          'High Groundwater Level',
          'Ready for Immediate Sale',
          'Secure Location'
        ],
        images: [], // Upload via admin panel
        brochure: null, // Upload via admin panel
        rera_number: 'PY/RERA/2024/002',
        meta_title: 'Katumode Greens - Auroville Green Belt Premium Plot | Plotzed',
        meta_description: '1.35 acres premium plot in Auroville Green Belt, Pondicherry. 750 ft frontage, legally verified, ideal for luxury development.',
        updated_at: new Date(),
      },
    }),

    // 3. HOUSE PROPERTY - KOONIMEDU
    prisma.plots.upsert({
      where: { slug: 'house-property-koonimedu' },
      update: {
        updated_at: new Date(),
      },
      create: {
        id: randomUUID(),
        title: 'House Property',
        slug: 'house-property-koonimedu',
        description: 'This premium plot is located in Koonimedu, just off the Pondy-Chennai ECR main road, offering a rare blend of beachside calm and excellent connectivity. With a quick 10-minute drive to the ECR main road, this property is perfectly suited for luxury villa development, wellness retreats, or hospitality projects, or as a secure long-term investment. A serene environment with beaches, resorts, and natural attractions makes this a highly desirable and future-proof real estate asset.',
        price: 19200000, // ₹1.92 Cr
        booking_amount: 1920000, // 10% booking amount
        plot_size: 10000, // Approx 10,000 sq ft for 2 BHK built-up
        dimensions: '100x100',
        facing: 'EAST',
        address: 'Koonimedu, ECR Main Road',
        city: 'Pondicherry',
        state: 'Puducherry',
        pincode: '605007',
        latitude: 11.9854,
        longitude: 79.8753,
        status: 'AVAILABLE',
        is_featured: true,
        is_published: true,
        amenities: [
          '2 BHK home',
          'ECR Main Road in 100 meters',
          'Green Belt Zone',
          'Sand Beach Access within 500 meters',
          'Custom Villa Construction',
          'Bird Sanctuary Nearby'
        ],
        images: [], // Upload via admin panel
        brochure: null, // Upload via admin panel
        rera_number: 'PY/RERA/2024/003',
        meta_title: 'House Property Koonimedu - ECR Pondicherry | Plotzed',
        meta_description: '2 BHK house property in Koonimedu, ECR Pondicherry. 100m from ECR Main Road, beach access, perfect for serene living.',
        updated_at: new Date(),
      },
    }),

  ])

  console.log(`   ✅ Created ${plots.length} plots\n`)

  // ================================================
  // 4. SKIP DUMMY SITE VISITS & INQUIRIES
  // ================================================
  console.log('📅 Skipping dummy site visits and inquiries...\n')

  // ================================================
  // 5. FINAL SUMMARY
  // ================================================
  console.log('╔════════════════════════════════════════════╗')
  console.log('║   ✅ SEEDING COMPLETED SUCCESSFULLY        ║')
  console.log('╚════════════════════════════════════════════╝\n')

  console.log('📊 Summary:')
  console.log(`   - Admin users: 1`)
  console.log(`   - Customer users: 0 (no dummy users)`)
  console.log(`   - Total plots: ${plots.length}`)
  console.log(`     • Featured properties: 3`)
  console.log(`     • Casuarina Greens (Auroville)`)
  console.log(`     • Katumode Greens (Auroville)`)
  console.log(`     • House Property (Koonimedu, ECR)`)
  console.log(`   - Site visits: 0 (no dummy data)`)
  console.log(`   - Inquiries: 0 (no dummy data)\n`)

  console.log('🔐 Admin Login Credentials:')
  console.log('   └─ Email: plotzedrealestate@gmail.com')
  console.log('   └─ Password: Admin@123456\n')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
