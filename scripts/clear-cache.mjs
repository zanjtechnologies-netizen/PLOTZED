import { Redis } from '@upstash/redis'

async function clearCache() {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!redisUrl || !redisToken) {
    console.log('❌ Redis not configured. Skipping cache clear.')
    console.log('   UPSTASH_REDIS_REST_URL:', redisUrl ? 'Set' : 'Not set')
    console.log('   UPSTASH_REDIS_REST_TOKEN:', redisToken ? 'Set' : 'Not set')
    return
  }

  console.log('🔧 Connecting to Redis...')
  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  })

  try {
    // Get all keys before clearing
    const keys = await redis.keys('*')
    console.log(`📊 Found ${keys.length} cached keys`)

    if (keys.length > 0) {
      console.log('\n🗑️  Clearing all cache...')
      await redis.flushdb()
      console.log('✅ Cache cleared successfully!')
    } else {
      console.log('ℹ️  No cached keys found')
    }

    // Verify
    const keysAfter = await redis.keys('*')
    console.log(`\n📊 Keys after clear: ${keysAfter.length}`)

  } catch (error) {
    console.error('❌ Error clearing cache:', error.message)
  }
}

clearCache()
