#!/usr/bin/env node

/**
 * Simple test script for the FBMP Listings API
 * Run with: node test-api.js
 * 
 * Make sure to run the development server first:
 * npm run dev:api
 */

const BASE_URL = 'http://localhost:8080/api'; // Change this to your Vercel URL when deployed

async function testAPI() {
  console.log('🧪 Testing FBMP Listings API...\n');

  try {
    // Test 1: Get all listings
    console.log('1️⃣ Testing GET /api/listings');
    const allListings = await fetch(`${BASE_URL}/listings`);
    const allListingsData = await allListings.json();
    console.log('✅ All listings response:', JSON.stringify(allListingsData, null, 2));
    console.log('');

    // Test 2: Get listings by status (assuming status 0 exists)
    console.log('2️⃣ Testing GET /api/listings/status/0');
    const statusListings = await fetch(`${BASE_URL}/listings/status/0`);
    const statusListingsData = await statusListings.json();
    console.log('✅ Status listings response:', JSON.stringify(statusListingsData, null, 2));
    console.log('');

    // Test 3: Get specific listing (if any exist)
    if (allListingsData.data && allListingsData.data.length > 0) {
      const firstListingId = allListingsData.data[0].id;
      console.log(`3️⃣ Testing GET /api/listings/${firstListingId}`);
      const specificListing = await fetch(`${BASE_URL}/listings/${firstListingId}`);
      const specificListingData = await specificListing.json();
      console.log('✅ Specific listing response:', JSON.stringify(specificListingData, null, 2));
      console.log('');

      // Test 4: Update listing
      console.log(`4️⃣ Testing PUT /api/listings/${firstListingId}`);
      const updateResponse = await fetch(`${BASE_URL}/listings/${firstListingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 1
        })
      });
      const updateData = await updateResponse.json();
      console.log('✅ Update listing response:', JSON.stringify(updateData, null, 2));
      console.log('');

      // Test 5: Get updated listing to verify change
      console.log(`5️⃣ Testing GET /api/listings/${firstListingId} (after update)`);
      const updatedListing = await fetch(`${BASE_URL}/listings/${firstListingId}`);
      const updatedListingData = await updatedListing.json();
      console.log('✅ Updated listing response:', JSON.stringify(updatedListingData, null, 2));
      console.log('');

      // Test 6: Revert status back to 0
      console.log(`6️⃣ Testing PUT /api/listings/${firstListingId} (revert status)`);
      const revertResponse = await fetch(`${BASE_URL}/listings/${firstListingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 0
        })
      });
      const revertData = await revertResponse.json();
      console.log('✅ Revert status response:', JSON.stringify(revertData, null, 2));
      console.log('');

    } else {
      console.log('⚠️  No listings found to test individual operations');
    }

    console.log('🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your development server is running:');
      console.log('   npm run dev:api');
      console.log('\n💡 Or if you want to test with Vite dev server:');
      console.log('   npm run dev');
    }
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 If you\'re using Node.js < 18, install node-fetch:');
      console.log('   npm install node-fetch');
    }
  }
}

// Run the tests
testAPI();
