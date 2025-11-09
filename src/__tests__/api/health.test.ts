/**
 * Integration tests for health API endpoint
 */

// ❌ Remove this
// import { Request } from 'node-fetch';

// ✅ Use Node’s built-in Request instead
const { Request } = globalThis;
import { GET } from '@/app/api/health/route'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: jest.fn().mockResolvedValue([{ result: 1 }]),
  },
}))

// Mock environment variables and feature flags
jest.mock('@/lib/env-validation', () => ({
  getEnv: jest.fn(() => ({
    NODE_ENV: 'test',
    UPSTASH_REDIS_REST_URL: 'mock-url',
    UPSTASH_REDIS_REST_TOKEN: 'mock-token',
  })),
  getFeatureFlags: jest.fn(() => ({
    redis: true, // Enable Redis for testing
    caching: true,
    rateLimiting: true,
    email: true,
    payments: true,
    backups: true,
    sms: true,
    sentry: true,
  })),
}))

// Mock Upstash Redis
const mockPing = jest.fn()
jest.mock('@upstash/redis', () => ({
  Redis: jest.fn(() => ({
    ping: mockPing,
  })),
}))

describe('Health API Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return healthy status', async () => {
    const request = new Request('http://localhost:3000/api/health')
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe('healthy')
    expect(data.environment).toBe('test')
    expect(data.version).toBe('0.1.0')
  })

  it('should include uptime information', async () => {
    const request = new Request('http://localhost:3000/api/health')
    const response = await GET()
    const data = await response.json()

    expect(data.uptime).toBeGreaterThanOrEqual(0)
    expect(typeof data.uptime).toBe('number')
  })

  it('should include timestamp', async () => {
    const request = new Request('http://localhost:3000/api/health')
    const response = await GET()
    const data = await response.json()

    expect(data.timestamp).toBeDefined()
    expect(new Date(data.timestamp).getTime()).toBeGreaterThan(0)
  })

  it('should check database connectivity', async () => {
    const request = new Request('http://localhost:3000/api/health')
    const response = await GET()
    const data = await response.json()

    expect(data.services.database).toBeDefined()
    expect(data.services.database.status).toBe('connected')
    expect(typeof data.services.database.responseTime).toBe('number')
  })

  it('should check Redis connectivity', async () => {
    const request = new Request('http://localhost:3000/api/health')
    const response = await GET()
    const data = await response.json()

    expect(data.services.redis).toBeDefined()
    expect(data.services.redis.status).toBe('connected')
    expect(typeof data.services.redis.responseTime).toBe('number')
  })

  it('should check API service', async () => {
    const request = new Request('http://localhost:3000/api/health')
    const response = await GET()
    const data = await response.json()

    expect(data.services.api).toBeDefined()
    expect(data.services.api.status).toBe('operational')
    expect(typeof data.services.api.responseTime).toBe('number')
  })

  it('should include feature flags', async () => {
    const request = new Request('http://localhost:3000/api/health')
    const response = await GET()
    const data = await response.json()

    expect(data.features).toBeDefined()
    expect(typeof data.features).toBe('object')

    // Check common features
    expect(typeof data.features.caching).toBe('boolean')
    expect(typeof data.features.rateLimiting).toBe('boolean')
    expect(typeof data.features.email).toBe('boolean')
    expect(typeof data.features.payments).toBe('boolean')
    expect(typeof data.features.errorTracking).toBe('boolean')
  })

  it('should return 503 if database is down', async () => {
    const { prisma } = require('@/lib/prisma')
    prisma.$queryRaw.mockRejectedValueOnce(new Error('Database connection failed'))

    const request = new Request('http://localhost:3000/api/health')
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(503)
    expect(data.status).toBe('unhealthy')
    expect(data.services.database.status).toBe('disconnected')
  })

  it('should handle Redis errors gracefully', async () => {
    mockPing.mockRejectedValueOnce(new Error('Redis connection failed'))

    const request = new Request('http://localhost:3000/api/health')
    const response = await GET()
    const data = await response.json()

    // Should still return 200 since Redis is optional
    expect(response.status).toBe(200)
    expect(data.services.redis.status).toBe('disconnected')
  })

  it('should measure response times accurately', async () => {
    const { prisma } = require('@/lib/prisma')

    // Add delay to simulate slow response
    prisma.$queryRaw.mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve([{ result: 1 }]), 50))
    )
    mockPing.mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve('PONG'), 30))
    )

    const request = new Request('http://localhost:3000/api/health')
    const response = await GET()
    const data = await response.json()

    expect(data.services.database.responseTime).toBeGreaterThan(40)
    expect(data.services.redis.responseTime).toBeGreaterThan(20)
  })

  it('should return consistent response structure', async () => {
    const request = new Request('http://localhost:3000/api/health')
    const response = await GET()
    const data = await response.json()

    // Verify all required fields are present
    expect(data).toHaveProperty('status')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('uptime')
    expect(data).toHaveProperty('environment')
    expect(data).toHaveProperty('version')
    expect(data).toHaveProperty('services')
    expect(data).toHaveProperty('features')

    // Verify services structure
    expect(data.services).toHaveProperty('api')
    expect(data.services).toHaveProperty('database')
    expect(data.services).toHaveProperty('redis')

    // Verify each service has required fields
    expect(data.services.api).toHaveProperty('status')
    expect(data.services.api).toHaveProperty('responseTime')
    expect(data.services.database).toHaveProperty('status')
    expect(data.services.database).toHaveProperty('responseTime')
    expect(data.services.redis).toHaveProperty('status')
    expect(data.services.redis).toHaveProperty('responseTime')
  })
})
