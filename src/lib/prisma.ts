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
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma