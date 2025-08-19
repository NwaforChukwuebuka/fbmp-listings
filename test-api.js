/**
 * FBMP Listings API Test Script
 * 
 * This script demonstrates how to use all the API endpoints
 * Run with: node test-api.js
 */

const API_BASE = 'https://fbmp-listings.vercel.app/api';

// Test data
const testListingId = 'dde191dc-d939-4caa-9c08-e55e762925ad'; // Replace with actual ID from your database

// Utility function for making HTTP requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    console.log(`\n${options.method || 'GET'} ${url}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return { response, data };
  } catch (error) {
    console.error(`Error making request to ${url}:`, error.message);
    return { error };
  }
}

// Test all API endpoints
async function testAllEndpoints() {
  console.log('🚀 Testing FBMP Listings API\n');
  console.log('=' .repeat(50));
  
  // 1. Get all listings
  console.log('\n1️⃣ Testing GET /api/listings');
  await makeRequest(`${API_BASE}/listings`);
  
  // 2. Get listing by ID
  console.log('\n2️⃣ Testing GET /api/listings/{id}');
  await makeRequest(`${API_BASE}/listings/${testListingId}`);
  
  // 3. Get listings by status
  console.log('\n3️⃣ Testing GET /api/listings/status/{status}');
  await makeRequest(`${API_BASE}/listings/status/0`); // New listings
  await makeRequest(`${API_BASE}/listings/status/1`); // Active listings
  
  // 4. Update listing
  console.log('\n4️⃣ Testing PUT /api/listings/{id}');
  await makeRequest(`${API_BASE}/listings/${testListingId}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 1 })
  });
  
  // 5. Test invalid requests
  console.log('\n5️⃣ Testing Error Handling');
  
  // Invalid ID format
  await makeRequest(`${API_BASE}/listings/invalid-uuid`);
  
  // Non-existent ID
  await makeRequest(`${API_BASE}/listings/00000000-0000-0000-0000-000000000000`);
  
  // Invalid status
  await makeRequest(`${API_BASE}/listings/status/invalid`);
  
  // Method not allowed
  await makeRequest(`${API_BASE}/listings`, { method: 'POST' });
  
  console.log('\n✅ API testing completed!');
}

// Test specific endpoint
async function testSpecificEndpoint(endpoint, method = 'GET', body = null) {
  const options = { method };
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  await makeRequest(`${API_BASE}${endpoint}`, options);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Test specific endpoint
    const [endpoint, method, body] = args;
    await testSpecificEndpoint(endpoint, method, body ? JSON.parse(body) : null);
  } else {
    // Test all endpoints
    await testAllEndpoints();
  }
}

// Run the tests
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  makeRequest,
  testAllEndpoints,
  testSpecificEndpoint
};
