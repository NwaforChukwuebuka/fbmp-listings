// Test script for Facebook URL validation
function isValidFacebookUrl(url) {
  try {
    const urlObj = new URL(url);
    
    // Check if it's a Facebook domain
    const facebookDomains = [
      'facebook.com',
      'www.facebook.com',
      'm.facebook.com',
      'fb.com',
      'www.fb.com'
    ];
    
    const isFacebookDomain = facebookDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
    );
    
    if (!isFacebookDomain) {
      return false;
    }
    
    // Accept any Facebook URL - they could be marketplace listings, shares, posts, etc.
    // Facebook's URL structure is complex and can include marketplace listings in various formats
    return true;
    
  } catch (error) {
    // Invalid URL format
    return false;
  }
}

// Test URLs
const testUrls = [
  'https://www.facebook.com/share/16bQu9t4DK/',
  'https://www.facebook.com/marketplace/item/123456789/',
  'https://facebook.com/marketplace/item/987654321/',
  'https://m.facebook.com/marketplace/item/111222333/',
  'https://www.fb.com/marketplace/item/444555666/',
  'https://www.facebook.com/groups/123456789/',
  'https://www.facebook.com/photo.php?fbid=123456789',
  'https://www.facebook.com/username/posts/123456789',
  'https://google.com/marketplace/item/123456789/', // Should fail
  'https://www.facebook.com', // Should pass
  'https://facebook.com', // Should pass
];

console.log('Testing Facebook URL validation:\n');

testUrls.forEach(url => {
  const isValid = isValidFacebookUrl(url);
  const status = isValid ? '✅ VALID' : '❌ INVALID';
  console.log(`${status}: ${url}`);
});

console.log('\n✅ The Facebook share URL should now be accepted!');
