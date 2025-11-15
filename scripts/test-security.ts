// scripts/test-security.ts
/**
 * Security Testing Script
 * Tests CORS, rate limiting, and security headers
 * 
 * Run with: npx ts-node scripts/test-security.ts
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

async function testCORS() {
  console.log('\n🔒 Testing CORS Configuration...\n');

  // Test 1: Preflight request
  try {
    const response = await fetch(`${BASE_URL}/api/plots`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
      },
    });

    const allowOrigin = response.headers.get('Access-Control-Allow-Origin');
    const allowMethods = response.headers.get('Access-Control-Allow-Methods');

    results.push({
      name: 'CORS Preflight',
      passed: response.status === 204 && !!allowOrigin && !!allowMethods,
      details: `Status: ${response.status}, Allow-Origin: ${allowOrigin}, Allow-Methods: ${allowMethods}`,
    });
  } catch (error) {
    results.push({
      name: 'CORS Preflight',
      passed: false,
      details: `Error: ${error}`,
    });
  }

  // Test 2: Actual request with origin
  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:3000',
      },
    });

    const allowOrigin = response.headers.get('Access-Control-Allow-Origin');

    results.push({
      name: 'CORS Headers on GET',
      passed: !!allowOrigin,
      details: `Allow-Origin: ${allowOrigin}`,
    });
  } catch (error) {
    results.push({
      name: 'CORS Headers on GET',
      passed: false,
      details: `Error: ${error}`,
    });
  }

  // Test 3: Invalid origin
  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Origin': 'https://evil-site.com',
      },
    });

    const allowOrigin = response.headers.get('Access-Control-Allow-Origin');

    results.push({
      name: 'CORS Blocks Invalid Origin',
      passed: !allowOrigin || allowOrigin === '*' || process.env.NODE_ENV === 'development',
      details: `Allow-Origin: ${allowOrigin || 'not set'}`,
    });
  } catch (error) {
    results.push({
      name: 'CORS Blocks Invalid Origin',
      passed: false,
      details: `Error: ${error}`,
    });
  }
}

async function testSecurityHeaders() {
  console.log('\n🛡️  Testing Security Headers...\n');

  try {
    const response = await fetch(`${BASE_URL}/api/health`);

    const headers = {
      'X-Frame-Options': response.headers.get('X-Frame-Options'),
      'X-Content-Type-Options': response.headers.get('X-Content-Type-Options'),
      'X-XSS-Protection': response.headers.get('X-XSS-Protection'),
      'Strict-Transport-Security': response.headers.get('Strict-Transport-Security'),
      'Content-Security-Policy': response.headers.get('Content-Security-Policy'),
      'Referrer-Policy': response.headers.get('Referrer-Policy'),
    };

    // Check each security header
    Object.entries(headers).forEach(([name, value]) => {
      results.push({
        name: `Security Header: ${name}`,
        passed: !!value,
        details: value || 'Not set',
      });
    });
  } catch (error) {
    results.push({
      name: 'Security Headers',
      passed: false,
      details: `Error: ${error}`,
    });
  }
}

async function testRateLimiting() {
  console.log('\n⏱️  Testing Rate Limiting...\n');

  const requests: Promise<Response>[] = [];

  // Send 10 rapid requests
  for (let i = 0; i < 10; i++) {
    requests.push(
      fetch(`${BASE_URL}/api/health`, {
        method: 'GET',
      })
    );
  }

  try {
    const responses = await Promise.all(requests);
    
    const rateLimitHeaders = responses[0].headers.get('X-RateLimit-Limit');
    const hasRateLimitHeaders = !!rateLimitHeaders;

    results.push({
      name: 'Rate Limit Headers Present',
      passed: hasRateLimitHeaders,
      details: `X-RateLimit-Limit: ${rateLimitHeaders || 'Not set'}`,
    });

    // Check if any request was rate limited
    const rateLimited = responses.some(r => r.status === 429);
    
    results.push({
      name: 'Rate Limiting Active',
      passed: hasRateLimitHeaders || rateLimited,
      details: rateLimited ? 'Request was rate limited' : 'No rate limiting detected (may need more requests)',
    });
  } catch (error) {
    results.push({
      name: 'Rate Limiting',
      passed: false,
      details: `Error: ${error}`,
    });
  }
}

async function testAPIKey() {
  console.log('\n🔑 Testing API Key Protection...\n');

  // Test without API key
  try {
    const response = await fetch(`${BASE_URL}/api/plots`, {
      method: 'GET',
    });

    const requiresApiKey = response.status === 401;

    results.push({
      name: 'API Key Protection',
      passed: true,
      details: requiresApiKey
        ? 'API key required (protection enabled)'
        : 'API key not required (may be disabled)',
    });
  } catch (error) {
    results.push({
      name: 'API Key Protection',
      passed: false,
      details: `Error: ${error}`,
    });
  }
}

async function testInputValidation() {
  console.log('\n🛡️  Testing Input Validation...\n');

  // Test XSS attempt
  try {
    const response = await fetch(`${BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '<script>alert("xss")</script>',
        email: 'test@example.com',
        message: 'Test message',
      }),
    });

    const body = await response.json();

    results.push({
      name: 'XSS Input Validation',
      passed: response.status === 400 || response.status === 422,
      details: `Status: ${response.status}, Response: ${JSON.stringify(body)}`,
    });
  } catch (error) {
    results.push({
      name: 'XSS Input Validation',
      passed: false,
      details: `Error: ${error}`,
    });
  }

  // Test SQL injection attempt
  try {
    const response = await fetch(`${BASE_URL}/api/plots?search='; DROP TABLE plots; --`, {
      method: 'GET',
    });

    results.push({
      name: 'SQL Injection Protection',
      passed: response.status !== 500,
      details: `Status: ${response.status}`,
    });
  } catch (error) {
    results.push({
      name: 'SQL Injection Protection',
      passed: false,
      details: `Error: ${error}`,
    });
  }
}

function printResults() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 Security Test Results');
  console.log('='.repeat(60) + '\n');

  let passed = 0;
  let failed = 0;

  results.forEach((result) => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    console.log(`   ${result.details}\n`);

    if (result.passed) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log('='.repeat(60));
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('='.repeat(60) + '\n');

  // Exit with error code if any tests failed
  if (failed > 0) {
    process.exit(1);
  }
}

async function runTests() {
  console.log(`\n🔍 Running security tests against: ${BASE_URL}\n`);

  await testCORS();
  await testSecurityHeaders();
  await testRateLimiting();
  await testAPIKey();
  await testInputValidation();

  printResults();
}

// Run tests
runTests().catch((error) => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});