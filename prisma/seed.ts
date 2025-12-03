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
  // 2. CREATE CUSTOMER USERS
  // ================================================
  console.log('👥 Creating customer users...')

  const customerPassword = await bcrypt.hash('Customer@123', 10)

  const customers = await Promise.all([
    prisma.users.upsert({
      where: { email: 'rajesh.kumar@example.com' },
      update: {},
      create: {
        id: randomUUID(),
        email: 'rajesh.kumar@example.com',
        password_hash: customerPassword,
        name: 'Rajesh Kumar',
        phone: '+919999999901',
        role: 'CUSTOMER',
        email_verified: true,
        kyc_verified: true,
        updated_at: new Date(),
      },
    }),
    prisma.users.upsert({
      where: { email: 'priya.sharma@example.com' },
      update: {},
      create: {
        id: randomUUID(),
        email: 'priya.sharma@example.com',
        password_hash: customerPassword,
        name: 'Priya Sharma',
        phone: '+919999999902',
        role: 'CUSTOMER',
        email_verified: true,
        kyc_verified: false,
        updated_at: new Date(),
      },
    }),
    prisma.users.upsert({
      where: { email: 'amit.patel@example.com' },
      update: {},
      create: {
        id: randomUUID(),
        email: 'amit.patel@example.com',
        password_hash: customerPassword,
        name: 'Amit Patel',
        phone: '+919999999903',
        role: 'CUSTOMER',
        email_verified: false,
        kyc_verified: false,
        updated_at: new Date(),
      },
    }),
  ])

  console.log(`   ✅ Created ${customers.length} customers\n`)

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
      update: {},
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
        city: 'Pondicherry',
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
        images: ['/images/casuarina-greens.jpg'],
        rera_number: 'PY/RERA/2024/001',
        meta_title: 'Casuarina Greens - Premium Land in Auroville Green Belt | Plotzed',
        meta_description: '1.86 acres premium land in Auroville Green Belt, Pondicherry. 380 ft frontage, legally verified, perfect for villa construction.',
        updated_at: new Date(),
      },
    }),

    // 2. KATUMODE GREENS
    prisma.plots.upsert({
      where: { slug: 'katumode-greens' },
      update: {},
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
        city: 'Pondicherry',
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
        images: ['/images/katumode-greens.jpg'],
        rera_number: 'PY/RERA/2024/002',
        meta_title: 'Katumode Greens - Auroville Green Belt Premium Plot | Plotzed',
        meta_description: '1.35 acres premium plot in Auroville Green Belt, Pondicherry. 750 ft frontage, legally verified, ideal for luxury development.',
        updated_at: new Date(),
      },
    }),

    // 3. HOUSE PROPERTY - KOONIMEDU
    prisma.plots.upsert({
      where: { slug: 'house-property-koonimedu' },
      update: {},
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
        images: ['/images/house-property.jpg'],
        rera_number: 'PY/RERA/2024/003',
        meta_title: 'House Property Koonimedu - ECR Pondicherry | Plotzed',
        meta_description: '2 BHK house property in Koonimedu, ECR Pondicherry. 100m from ECR Main Road, beach access, perfect for serene living.',
        updated_at: new Date(),
      },
    }),

    // AVAILABLE PLOTS (8)
    prisma.plots.upsert({
      where: { slug: 'luxury-villa-plot-juhu-mumbai' },
      update: {},
      create: {
        id: randomUUID(),
        title: 'Luxury Villa Plot in Juhu, Mumbai',
        slug: 'luxury-villa-plot-juhu-mumbai',
        description: 'Premium residential plot in the heart of Juhu with sea-facing views. Perfect for building your dream villa. Located in a gated community with 24/7 security.',
        price: 25000000,
        booking_amount: 2500000,
        plot_size: 2000,
        dimensions: '40x50',
        facing: 'WEST',
        address: 'Juhu Tara Road, Juhu',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400049',
        latitude: 19.1075,
        longitude: 72.8263,
        status: 'AVAILABLE',
        is_featured: false,
        is_published: true,
        amenities: ['Water Supply', 'Electricity', 'Gated Community', '24/7 Security', 'Park', 'Club House'],
        images: ['/images/property-1.svg'],
        rera_number: 'P51700000001',
        meta_title: 'Luxury Villa Plot in Juhu, Mumbai | Plotzed',
        meta_description: 'Premium 2000 sq ft villa plot in Juhu with sea-facing views. Gated community with modern amenities.',
        updated_at: new Date(),
      },
    }),
    prisma.plots.upsert({
      where: { slug: 'beachfront-land-calangute-goa' },
      update: {},
      create: {
        id: randomUUID(),
        title: 'Beachfront Land in Calangute, Goa',
        slug: 'beachfront-land-calangute-goa',
        description: 'Stunning beachfront property with direct beach access. Ideal for resort or luxury villa development. Clear title, all approvals in place.',
        price: 15000000,
        booking_amount: 1500000,
        plot_size: 3000,
        dimensions: '50x60',
        facing: 'NORTH',
        address: 'Calangute Beach Road',
        city: 'Calangute',
        state: 'Goa',
        pincode: '403516',
        latitude: 15.5410,
        longitude: 73.7553,
        status: 'AVAILABLE',
        is_featured: false,
        is_published: true,
        amenities: ['Beach Access', 'Water Supply', 'Electricity', 'Road Access'],
        images: ['/images/property-2.svg'],
        rera_number: 'P52100000042',
        updated_at: new Date(),
      },
    }),
    prisma.plots.upsert({
      where: { slug: 'commercial-plot-whitefield-bangalore' },
      update: {},
      create: {
        id: randomUUID(),
        title: 'Commercial Plot in Whitefield, Bangalore',
        slug: 'commercial-plot-whitefield-bangalore',
        description: 'Premium commercial plot in IT hub of Bangalore. Ideal for office complex or retail development. Excellent connectivity to major tech parks.',
        price: 35000000,
        booking_amount: 3500000,
        plot_size: 4000,
        dimensions: '80x50',
        facing: 'SOUTH',
        address: 'ITPL Main Road, Whitefield',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560066',
        latitude: 12.9698,
        longitude: 77.7499,
        status: 'AVAILABLE',
        is_featured: false,
        is_published: true,
        amenities: ['Water Supply', 'Electricity', 'Road Access', 'Metro Nearby', 'IT Park Nearby'],
        images: ['/images/property-3.svg'],
        rera_number: 'PRM/KA/RERA/1251/309/PR/171117/001654',
        updated_at: new Date(),
      },
    }),
    prisma.plots.upsert({
      where: { slug: 'hill-view-plot-shimla' },
      update: {},
      create: {
        id: randomUUID(),
        title: 'Hill View Plot in Shimla, Himachal',
        slug: 'hill-view-plot-shimla',
        description: 'Breathtaking mountain views from this premium plot. Perfect for vacation home or resort. Cool climate year-round.',
        price: 6000000,
        booking_amount: 600000,
        plot_size: 2500,
        dimensions: '50x50',
        facing: 'EAST',
        address: 'Summer Hill Road',
        city: 'Shimla',
        state: 'Himachal Pradesh',
        pincode: '171005',
        latitude: 31.1048,
        longitude: 77.1734,
        status: 'AVAILABLE',
        is_featured: false,
        is_published: true,
        amenities: ['Mountain View', 'Water Supply', 'Electricity', 'Road Access'],
        images: ['/images/property-4.svg'],
        rera_number: 'HPRERA-SML-SML-0120-0014',
        updated_at: new Date(),
      },
    }),
    prisma.plots.upsert({
      where: { slug: 'agricultural-land-lonavala' },
      update: {},
      create: {
        id: randomUUID(),
        title: 'Agricultural Land in Lonavala, Pune',
        slug: 'agricultural-land-lonavala',
        description: 'Prime agricultural land with scenic hill views. Suitable for farmhouse or weekend retreat. Good water supply, all-weather road access.',
        price: 5000000,
        booking_amount: 500000,
        plot_size: 5000,
        dimensions: '100x50',
        facing: 'EAST',
        address: 'Old Mumbai-Pune Highway',
        city: 'Lonavala',
        state: 'Maharashtra',
        pincode: '410401',
        latitude: 18.7537,
        longitude: 73.4135,
        status: 'AVAILABLE',
        is_featured: false,
        is_published: true,
        amenities: ['Water Supply', 'Road Access', 'Scenic Views'],
        images: ['/images/property-5.svg'],
        rera_number: 'P51700000089',
        updated_at: new Date(),
      },
    }),
    prisma.plots.upsert({
      where: { slug: 'residential-plot-dlf-gurgaon' },
      update: {},
      create: {
        id: randomUUID(),
        title: 'Residential Plot in DLF Phase 4, Gurgaon',
        slug: 'residential-plot-dlf-gurgaon',
        description: 'Premium residential plot in prestigious DLF Phase 4. Surrounded by luxury villas and modern amenities. Metro connectivity.',
        price: 18000000,
        booking_amount: 1800000,
        plot_size: 3000,
        dimensions: '60x50',
        facing: 'NORTH',
        address: 'DLF Phase 4',
        city: 'Gurgaon',
        state: 'Haryana',
        pincode: '122002',
        latitude: 28.4595,
        longitude: 77.0266,
        status: 'AVAILABLE',
        is_featured: false,
        is_published: true,
        amenities: ['Water Supply', 'Electricity', 'Metro Nearby', 'Shopping Mall Nearby', 'Gated Community'],
        images: ['/images/property-6.svg'],
        rera_number: 'RC/REP/HARERA/GGM/2019/23',
        updated_at: new Date(),
      },
    }),
    prisma.plots.upsert({
      where: { slug: 'lake-view-plot-nainital' },
      update: {},
      create: {
        id: randomUUID(),
        title: 'Lake View Plot in Nainital, Uttarakhand',
        slug: 'lake-view-plot-nainital',
        description: 'Scenic plot with stunning lake views. Perfect for building a holiday home. Peaceful location with easy access to town.',
        price: 7500000,
        booking_amount: 750000,
        plot_size: 1800,
        dimensions: '40x45',
        facing: 'WEST',
        address: 'Mallital',
        city: 'Nainital',
        state: 'Uttarakhand',
        pincode: '263001',
        latitude: 29.3803,
        longitude: 79.4636,
        status: 'AVAILABLE',
        is_featured: false,
        is_published: true,
        amenities: ['Lake View', 'Water Supply', 'Electricity', 'Road Access'],
        images: [],
        rera_number: 'URERA/2020/45',
        updated_at: new Date(),
      },
    }),
    prisma.plots.upsert({
      where: { slug: 'commercial-plot-connaught-place-delhi' },
      update: {},
      create: {
        id: randomUUID(),
        title: 'Commercial Plot in Connaught Place, Delhi',
        slug: 'commercial-plot-connaught-place-delhi',
        description: 'Prime commercial plot in the heart of Delhi. Excellent for retail or office space. High footfall area with metro connectivity.',
        price: 50000000,
        booking_amount: 5000000,
        plot_size: 2500,
        dimensions: '50x50',
        facing: 'SOUTH',
        address: 'Inner Circle, Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        latitude: 28.6304,
        longitude: 77.2177,
        status: 'AVAILABLE',
        is_featured: false,
        is_published: true,
        amenities: ['Water Supply', 'Electricity', 'Metro Station', 'High Footfall', 'Prime Location'],
        images: [],
        rera_number: 'DL/RERA/2021/001',
        updated_at: new Date(),
      },
    }),

    // BOOKED PLOTS (4)
    prisma.plots.upsert({
      where: { slug: 'residential-plot-sector-50-noida' },
      update: {},
      create: {
        id: randomUUID(),
        title: 'Residential Plot in Sector 50, Noida',
        slug: 'residential-plot-sector-50-noida',
        description: 'Well-located residential plot in established sector. Close to schools, hospitals, and shopping centers. Metro station within walking distance.',
        price: 8000000,
        booking_amount: 800000,
        plot_size: 1500,
        dimensions: '30x50',
        facing: 'NORTH',
        address: 'Sector 50, Noida',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        latitude: 28.5706,
        longitude: 77.3747,
        status: 'BOOKED',
        is_featured: false,
        is_published: true,
        amenities: ['Water Supply', 'Electricity', 'Metro Nearby', 'School Nearby', 'Hospital Nearby'],
        images: [],
        rera_number: 'UPRERAPRJ15145',
        updated_at: new Date(),
      },
    }),
    prisma.plots.upsert({
      where: { slug: 'farmhouse-plot-alibaug' },
      update: {},
      create: {
        id: randomUUID(),
        title: 'Farmhouse Plot in Alibaug, Maharashtra',
        slug: 'farmhouse-plot-alibaug',
        description: 'Spacious farmhouse plot near beaches. Perfect weekend getaway location. Coconut and mango trees. Well water available.',
        price: 4500000,
        booking_amount: 450000,
        plot_size: 6000,
        dimensions: '100x60',
        facing: 'EAST',
        address: 'Mandwa Road',
        city: 'Alibaug',
        state: 'Maharashtra',
        pincode: '402201',
        latitude: 18.6414,
        longitude: 72.8722,
        status: 'BOOKED',
        is_featured: false,
        is_published: true,
        amenities: ['Well Water', 'Electricity', 'Beach Nearby', 'Fruit Trees'],
        images: [],
        rera_number: 'P51700000234',
        updated_at: new Date(),
      },
    }),
    prisma.plots.upsert({
      where: { slug: 'residential-plot-koramangala-bangalore' },
      update: {},
      create: {
        id: randomUUID(),
        title: 'Residential Plot in Koramangala, Bangalore',
        slug: 'residential-plot-koramangala-bangalore',
        description: 'Premium residential plot in upscale Koramangala. Surrounded by IT professionals and modern infrastructure. Great investment opportunity.',
        price: 22000000,
        booking_amount: 2200000,
        plot_size: 2200,
        dimensions: '44x50',
        facing: 'EAST',
        address: '5th Block, Koramangala',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560095',
        latitude: 12.9352,
        longitude: 77.6245,
        status: 'BOOKED',
        is_featured: false,
        is_published: true,
        amenities: ['Water Supply', 'Electricity', 'Metro Nearby', 'Shopping Mall', 'IT Parks Nearby'],
        images: [],
        rera_number: 'PRM/KA/RERA/1251/309/PR/180517/001988',
        updated_at: new Date(),
      },
    }),
    prisma.plots.upsert({
      where: { slug: 'villa-plot-ecr-chennai' },
      update: {},
      create: {
        id: randomUUID(),
        title: 'Villa Plot on ECR, Chennai',
        slug: 'villa-plot-ecr-chennai',
        description: 'Beach-facing villa plot on East Coast Road. Stunning sea views. Gated community with modern amenities and security.',
        price: 12000000,
        booking_amount: 1200000,
        plot_size: 2800,
        dimensions: '56x50',
        facing: 'SOUTH',
        address: 'East Coast Road, Neelankarai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600115',
        latitude: 12.9516,
        longitude: 80.2595,
        status: 'BOOKED',
        is_featured: false,
        is_published: true,
        amenities: ['Beach View', 'Gated Community', 'Water Supply', 'Electricity', 'Club House'],
        images: [],
        rera_number: 'TN/29/Building/0123/2020',
        updated_at: new Date(),
      },
    }),

    // SOLD PLOTS (3)
    prisma.plots.upsert({
      where: { slug: 'commercial-plot-mg-road-pune' },
      update: {},
      create: {
        id: randomUUID(),
        title: 'Commercial Plot on MG Road, Pune',
        slug: 'commercial-plot-mg-road-pune',
        description: 'Prime commercial plot on busy MG Road. High visibility location. Perfect for showroom or office space.',
        price: 28000000,
        booking_amount: 2800000,
        plot_size: 3200,
        dimensions: '64x50',
        facing: 'NORTH',
        address: 'MG Road, Camp',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        latitude: 18.5204,
        longitude: 73.8567,
        status: 'SOLD',
        is_featured: false,
        is_published: true,
        amenities: ['Water Supply', 'Electricity', 'High Visibility', 'Main Road Facing'],
        images: [],
        rera_number: 'P52100018053',
        updated_at: new Date(),
      },
    }),
    prisma.plots.upsert({
      where: { slug: 'residential-plot-banjara-hills-hyderabad' },
      update: {},
      create: {
        id: randomUUID(),
        title: 'Residential Plot in Banjara Hills, Hyderabad',
        slug: 'residential-plot-banjara-hills-hyderabad',
        description: 'Luxury residential plot in prestigious Banjara Hills. Elite neighborhood with excellent infrastructure.',
        price: 32000000,
        booking_amount: 3200000,
        plot_size: 3500,
        dimensions: '70x50',
        facing: 'WEST',
        address: 'Road No. 12, Banjara Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        latitude: 17.4239,
        longitude: 78.4738,
        status: 'SOLD',
        is_featured: false,
        is_published: false,
        amenities: ['Water Supply', 'Electricity', 'Gated Community', 'Club House', 'Shopping Mall Nearby'],
        images: [],
        rera_number: 'P02400003456',
        updated_at: new Date(),
      },
    }),
    prisma.plots.upsert({
      where: { slug: 'industrial-plot-manesar-gurgaon' },
      update: {},
      create: {
        id: randomUUID(),
        title: 'Industrial Plot in Manesar, Gurgaon',
        slug: 'industrial-plot-manesar-gurgaon',
        description: 'Large industrial plot in HSIIDC sector. Perfect for manufacturing unit or warehouse. Good road connectivity.',
        price: 40000000,
        booking_amount: 4000000,
        plot_size: 10000,
        dimensions: '100x100',
        facing: 'EAST',
        address: 'HSIIDC Sector 3',
        city: 'Manesar',
        state: 'Haryana',
        pincode: '122050',
        latitude: 28.3670,
        longitude: 76.9318,
        status: 'SOLD',
        is_featured: false,
        is_published: false,
        amenities: ['Water Supply', 'Electricity', 'Road Access', 'Industrial Zone'],
        images: [],
        rera_number: 'RC/REP/HARERA/GGM/2018/142',
        updated_at: new Date(),
      },
    }),
  ])

  console.log(`   ✅ Created ${plots.length} plots\n`)

  // ================================================
  // 4. CREATE 5 SITE VISITS
  // ================================================
  console.log('📅 Creating site visits...')

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(10, 0, 0, 0)

  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  nextWeek.setHours(14, 0, 0, 0)

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(11, 0, 0, 0)

  const siteVisits = await Promise.all([
    // PENDING
    prisma.site_visits.create({
      data: {
        id: randomUUID(),
        user_id: customers[0].id,
        plot_id: plots[0].id,
        visit_date: tomorrow,
        visit_time: '10:00 AM',
        attendees: 2,
        notes: 'Interested in sea-facing villa plot. Want to discuss payment plans.',
        status: 'PENDING',
        updated_at: new Date(),
      },
    }),
    // CONFIRMED
    prisma.site_visits.create({
      data: {
        id: randomUUID(),
        user_id: customers[1].id,
        plot_id: plots[2].id,
        visit_date: nextWeek,
        visit_time: '2:00 PM',
        attendees: 3,
        notes: 'Looking for commercial space for IT company. Bringing business partner.',
        status: 'CONFIRMED',
        updated_at: new Date(),
      },
    }),
    // COMPLETED
    prisma.site_visits.create({
      data: {
        id: randomUUID(),
        user_id: customers[2].id,
        plot_id: plots[4].id,
        visit_date: yesterday,
        visit_time: '11:00 AM',
        attendees: 1,
        notes: 'Want to build farmhouse for weekend getaways.',
        status: 'COMPLETED',
        updated_at: new Date(),
      },
    }),
    // CANCELLED
    prisma.site_visits.create({
      data: {
        id: randomUUID(),
        user_id: customers[0].id,
        plot_id: plots[1].id,
        visit_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        visit_time: '3:00 PM',
        attendees: 2,
        notes: 'Interested in beachfront property.',
        status: 'CANCELLED',
        updated_at: new Date(),
      },
    }),
    // RESCHEDULED
    prisma.site_visits.create({
      data: {
        id: randomUUID(),
        user_id: customers[1].id,
        plot_id: plots[3].id,
        visit_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        visit_time: '4:00 PM',
        attendees: 2,
        notes: 'Want to see mountain view plot. Considering vacation home.',
        status: 'RESCHEDULED',
        updated_at: new Date(),
      },
    }),
  ])

  console.log(`   ✅ Created ${siteVisits.length} site visits\n`)

  // ================================================
  // 5. CREATE 3 INQUIRIES
  // ================================================
  console.log('💬 Creating inquiries...')

  const inquiries = await Promise.all([
    // NEW
    prisma.inquiries.create({
      data: {
        id: randomUUID(),
        user_id: customers[0].id,
        plot_id: plots[5].id,
        name: customers[0].name,
        email: customers[0].email,
        phone: customers[0].phone || '+919876543211',
        message: 'I am interested in this DLF Gurgaon property. Can you provide more details about the payment plans and available amenities? Also, is home loan assistance available?',
        status: 'NEW',
        source: 'website',
        updated_at: new Date(),
      },
    }),
    // CONTACTED
    prisma.inquiries.create({
      data: {
        id: randomUUID(),
        user_id: customers[1].id,
        plot_id: plots[6].id,
        name: customers[1].name,
        email: customers[1].email,
        phone: customers[1].phone || '+919876543212',
        message: 'Looking for a vacation home plot in Nainital. Is this property near the main lake? What are the annual maintenance charges?',
        status: 'CONTACTED',
        source: 'website',
        updated_at: new Date(),
      },
    }),
    // QUALIFIED
    prisma.inquiries.create({
      data: {
        id: randomUUID(),
        name: 'Suresh Menon',
        email: 'suresh.menon@example.com',
        phone: '+919876543220',
        message: 'I am a serious buyer looking for investment properties in Mumbai. The Juhu villa plot looks interesting. I would like to schedule a meeting to discuss this further.',
        status: 'QUALIFIED',
        source: 'phone',
        plot_id: plots[0].id,
        updated_at: new Date(),
      },
    }),
  ])

  console.log(`   ✅ Created ${inquiries.length} inquiries\n`)

  // ================================================
  // 6. FINAL SUMMARY
  // ================================================
  console.log('╔════════════════════════════════════════════╗')
  console.log('║   ✅ SEEDING COMPLETED SUCCESSFULLY        ║')
  console.log('╚════════════════════════════════════════════╝\n')

  console.log('📊 Summary:')
  console.log(`   - Admin users: 1`)
  console.log(`   - Customer users: ${customers.length}`)
  console.log(`   - Total plots: ${plots.length}`)
  console.log(`     • Available: 11 (including 3 new featured properties)`)
  console.log(`     • Booked: 4`)
  console.log(`     • Sold: 3`)
  console.log(`   - Site visits: ${siteVisits.length}`)
  console.log(`   - Inquiries: ${inquiries.length}\n`)

  console.log('🔐 Login Credentials:')
  console.log('   Admin:')
  console.log('   └─ Email: plotzedrealestate@gmail.com')
  console.log('   └─ Password: Admin@123456\n')
  console.log('   Customer:')
  console.log('   └─ Email: rajesh.kumar@example.com')
  console.log('   └─ Password: Customer@123\n')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
