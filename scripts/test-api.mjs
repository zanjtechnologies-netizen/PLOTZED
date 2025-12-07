// Test the plots API directly
async function testAPI() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  console.log('🧪 Testing API at:', baseUrl);
  console.log('');

  try {
    // Test 1: Get all plots
    console.log('Test 1: GET /api/plots');
    const response1 = await fetch(`${baseUrl}/api/plots?page=1&limit=5`);
    const data1 = await response1.json();

    console.log('Status:', response1.status);
    console.log('Response:', JSON.stringify(data1, null, 2));
    console.log('');

    // Test 2: Get plots with published filter
    console.log('Test 2: GET /api/plots?published=true');
    const response2 = await fetch(`${baseUrl}/api/plots?page=1&limit=5&published=true`);
    const data2 = await response2.json();

    console.log('Status:', response2.status);
    console.log('Plots count:', data2.data?.plots?.length || 0);
    console.log('Total:', data2.data?.pagination?.total || 0);
    console.log('');

    // Test 3: Search by slug
    console.log('Test 3: GET /api/plots/search?slug=residential-plot-dlf-gurgaon');
    const response3 = await fetch(`${baseUrl}/api/plots/search?slug=residential-plot-dlf-gurgaon`);
    const data3 = await response3.json();

    console.log('Status:', response3.status);
    console.log('Response:', JSON.stringify(data3, null, 2));

  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testAPI();
