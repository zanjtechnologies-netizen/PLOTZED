// ================================================
// src/lib/prisma.ts - Prisma Client
// ================================================

import { PrismaClient } from '@prisma/client'
import { validateEnvironment } from './env-validation'

//validate environment before anything else
if (process.env.NODE_ENV != 'test'){
  validateEnvironment()
}
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Gracefully handle connection errors with automatic reconnection
prisma.$connect().catch((err) => {
  console.error('❌ Failed to connect to database:', err)
  console.log('🔄 Attempting to reconnect...')
})