# FBMP Listings API - Usage Guide

A practical guide for integrating with the FBMP Listings API, including common use cases, error handling, and best practices.

## 🚀 Quick Start

### Base URL
```
https://fbmp-listings.vercel.app/api
```

### Authentication
No authentication required - the API is currently public.

### Rate Limits
No rate limiting currently implemented.

## 📋 Common Use Cases

### 1. Dashboard Integration

Display all listings in a dashboard:

```javascript
async function loadDashboard() {
  try {
    const response = await fetch('https://fbmp-listings.vercel.app/api/listings');
    const result = await response.json();
    
    if (result.success) {
      displayListings(result.data);
      updateCount(result.count);
    } else {
      showError('Failed to load listings');
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    showError('Network error occurred');
  }
}

function displayListings(listings) {
  const container = document.getElementById('listings-container');
  container.innerHTML = listings.map(listing => `
    <div class="listing-card">
      <h3>${listing.link}</h3>
      <span class="status status-${listing.status}">${getStatusText(listing.status)}</span>
      <p>Created: ${new Date(listing.created_at).toLocaleDateString()}</p>
    </div>
  `).join('');
}
```

### 2. Status Management System

Track and update listing statuses:

```javascript
class ListingManager {
  constructor() {
    this.baseUrl = 'https://fbmp-listings.vercel.app/api';
  }

  // Get listings by status
  async getListingsByStatus(status) {
    const response = await fetch(`${this.baseUrl}/listings/status/${status}`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch listings');
    }
    
    return result.data;
  }

  // Update listing status
  async updateStatus(listingId, newStatus) {
    const response = await fetch(`${this.baseUrl}/listings/${listingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update listing');
    }
    
    return result.data;
  }

  // Bulk status update
  async bulkUpdateStatus(listingIds, newStatus) {
    const promises = listingIds.map(id => this.updateStatus(id, newStatus));
    return Promise.allSettled(promises);
  }
}

// Usage
const manager = new ListingManager();

// Get all new listings
const newListings = await manager.getListingsByStatus(0);

// Mark as processed
await manager.updateStatus('listing-id', 1);

// Bulk update
const results = await manager.bulkUpdateStatus(['id1', 'id2'], 1);
```

### 3. Real-time Monitoring

Monitor listings for changes:

```javascript
class ListingMonitor {
  constructor() {
    this.baseUrl = 'https://fbmp-listings.vercel.app/api';
    this.interval = null;
    this.lastCheck = null;
  }

  start(intervalMs = 30000) { // Check every 30 seconds
    this.interval = setInterval(() => this.checkForUpdates(), intervalMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  async checkForUpdates() {
    try {
      const response = await fetch(`${this.baseUrl}/listings`);
      const result = await response.json();
      
      if (result.success && this.lastCheck) {
        const newListings = result.data.filter(
          listing => new Date(listing.created_at) > this.lastCheck
        );
        
        if (newListings.length > 0) {
          this.onNewListings(newListings);
        }
      }
      
      this.lastCheck = new Date();
    } catch (error) {
      console.error('Monitoring error:', error);
    }
  }

  onNewListings(listings) {
    // Implement your notification logic here
    console.log(`${listings.length} new listings found:`, listings);
    
    // Example: Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New FBMP Listings', {
        body: `${listings.length} new listings available`,
        icon: '/icon.png'
      });
    }
  }
}

// Usage
const monitor = new ListingMonitor();
monitor.start();
```

### 4. Data Export and Reporting

Generate reports and export data:

```javascript
class ListingReporter {
  constructor() {
    this.baseUrl = 'https://fbmp-listings.vercel.app/api';
  }

  async generateReport() {
    const [allListings, newListings, activeListings, inactiveListings] = await Promise.all([
      this.getAllListings(),
      this.getListingsByStatus(0),
      this.getListingsByStatus(1),
      this.getListingsByStatus(2)
    ]);

    return {
      total: allListings.length,
      byStatus: {
        new: newListings.length,
        active: activeListings.length,
        inactive: inactiveListings.length
      },
      byDate: this.groupByDate(allListings),
      summary: this.generateSummary(allListings)
    };
  }

  async getAllListings() {
    const response = await fetch(`${this.baseUrl}/listings`);
    const result = await response.json();
    return result.success ? result.data : [];
  }

  async getListingsByStatus(status) {
    const response = await fetch(`${this.baseUrl}/listings/status/${status}`);
    const result = await response.json();
    return result.success ? result.data : [];
  }

  groupByDate(listings) {
    const groups = {};
    listings.forEach(listing => {
      const date = new Date(listing.created_at).toDateString();
      groups[date] = (groups[date] || 0) + 1;
    });
    return groups;
  }

  generateSummary(listings) {
    const today = new Date().toDateString();
    const todayListings = listings.filter(
      listing => new Date(listing.created_at).toDateString() === today
    );

    return {
      totalToday: todayListings.length,
      averagePerDay: this.calculateAveragePerDay(listings),
      topDomains: this.getTopDomains(listings)
    };
  }

  calculateAveragePerDay(listings) {
    if (listings.length === 0) return 0;
    
    const firstDate = new Date(listings[listings.length - 1].created_at);
    const lastDate = new Date(listings[0].created_at);
    const daysDiff = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    
    return Math.round(listings.length / Math.max(daysDiff, 1));
  }

  getTopDomains(listings) {
    const domains = {};
    listings.forEach(listing => {
      try {
        const domain = new URL(listing.link).hostname;
        domains[domain] = (domains[domain] || 0) + 1;
      } catch (e) {
        // Invalid URL, skip
      }
    });
    
    return Object.entries(domains)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));
  }

  exportToCSV(listings) {
    const headers = ['ID', 'Link', 'Status', 'Created At', 'Updated At'];
    const rows = listings.map(listing => [
      listing.id,
      listing.link,
      listing.status,
      listing.created_at,
      listing.updated_at
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fbmp-listings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

// Usage
const reporter = new ListingReporter();

// Generate and display report
const report = await reporter.generateReport();
console.log('Report:', report);

// Export to CSV
const allListings = await reporter.getAllListings();
reporter.exportToCSV(allListings);
```

## 🛡️ Error Handling

### Best Practices

```javascript
class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new APIError(
        data.error || 'API request failed',
        response.status,
        data.details
      );
    }
    
    if (!data.success) {
      throw new APIError(
        data.error || 'API operation failed',
        response.status,
        data.details
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new APIError('Network error - check your connection', 0, error.message);
    }
    
    throw new APIError('Unexpected error occurred', 0, error.message);
  }
}

// Usage with error handling
try {
  const result = await apiRequest('https://fbmp-listings.vercel.app/api/listings');
  console.log('Success:', result.data);
} catch (error) {
  if (error instanceof APIError) {
    console.error(`API Error (${error.status}):`, error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Retry Logic

```javascript
async function apiRequestWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiRequest(url, options);
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        await new Promise(resolve => setTimeout(resolve, delay));
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      }
    }
  }
  
  throw lastError;
}
```

## 🔧 Configuration and Environment

### Environment Variables

```bash
# .env file
FBMP_API_BASE_URL=https://fbmp-listings.vercel.app/api
FBMP_API_TIMEOUT=30000
FBMP_API_RETRY_ATTEMPTS=3
```

### Configuration Class

```javascript
class APIConfig {
  constructor() {
    this.baseUrl = process.env.FBMP_API_BASE_URL || 'https://fbmp-listings.vercel.app/api';
    this.timeout = parseInt(process.env.FBMP_API_TIMEOUT) || 30000;
    this.retryAttempts = parseInt(process.env.FBMP_API_RETRY_ATTEMPTS) || 3;
    this.headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'FBMP-API-Client/1.0'
    };
  }

  getUrl(endpoint) {
    return `${this.baseUrl}${endpoint}`;
  }

  getRequestOptions(method = 'GET', body = null) {
    const options = {
      method,
      headers: this.headers,
      signal: AbortSignal.timeout(this.timeout)
    };
    
    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }
    
    return options;
  }
}
```

## 📊 Performance Optimization

### Caching Strategy

```javascript
class ListingCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear() {
    this.cache.clear();
  }
}

// Usage with cache
const cache = new ListingCache();

async function getListingsWithCache() {
  const cacheKey = 'all-listings';
  let data = cache.get(cacheKey);
  
  if (!data) {
    const result = await apiRequest('https://fbmp-listings.vercel.app/api/listings');
    data = result.data;
    cache.set(cacheKey, data);
  }
  
  return data;
}
```

### Batch Operations

```javascript
class BatchProcessor {
  constructor(batchSize = 10) {
    this.batchSize = batchSize;
  }

  async processBatch(items, processor) {
    const results = [];
    
    for (let i = 0; i < items.length; i += this.batchSize) {
      const batch = items.slice(i, i + this.batchSize);
      const batchResults = await Promise.all(
        batch.map(item => processor(item))
      );
      results.push(...batchResults);
      
      // Small delay between batches to avoid overwhelming the API
      if (i + this.batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  }
}

// Usage
const processor = new BatchProcessor(5);
const listingIds = ['id1', 'id2', 'id3', 'id4', 'id5', 'id6', 'id7'];

const results = await processor.processBatch(listingIds, async (id) => {
  const response = await fetch(`https://fbmp-listings.vercel.app/api/listings/${id}`);
  return response.json();
});
```

## 🧪 Testing

### Unit Tests

```javascript
// Using Jest or similar testing framework
describe('FBMP API Client', () => {
  let apiClient;
  
  beforeEach(() => {
    apiClient = new ListingManager();
  });
  
  test('should fetch listings successfully', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: [{ id: '1', link: 'test.com', status: 0 }]
        })
      })
    );
    
    const result = await apiClient.getListingsByStatus(0);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
  
  test('should handle API errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({
          error: 'Internal server error'
        })
      })
    );
    
    await expect(apiClient.getListingsByStatus(0))
      .rejects
      .toThrow('API request failed');
  });
});
```

### Integration Tests

```javascript
describe('FBMP API Integration', () => {
  test('should connect to live API', async () => {
    const response = await fetch('https://fbmp-listings.vercel.app/api/listings');
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data).toHaveProperty('success');
    expect(data).toHaveProperty('data');
  });
});
```

## 🚀 Deployment Considerations

### Production Checklist

- [ ] Implement proper error logging
- [ ] Add request/response monitoring
- [ ] Set up health checks
- [ ] Configure rate limiting
- [ ] Implement authentication if needed
- [ ] Set up API versioning strategy
- [ ] Configure CORS properly
- [ ] Set up backup and recovery procedures

### Monitoring

```javascript
class APIMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTimes: []
    };
  }

  trackRequest() {
    this.metrics.requests++;
  }

  trackError() {
    this.metrics.errors++;
  }

  trackResponseTime(startTime) {
    const responseTime = Date.now() - startTime;
    this.metrics.responseTimes.push(responseTime);
    
    // Keep only last 100 measurements
    if (this.metrics.responseTimes.length > 100) {
      this.metrics.responseTimes.shift();
    }
  }

  getStats() {
    const avgResponseTime = this.metrics.responseTimes.length > 0
      ? this.metrics.responseTimes.reduce((a, b) => a + b, 0) / this.metrics.responseTimes.length
      : 0;
    
    const errorRate = this.metrics.requests > 0
      ? (this.metrics.errors / this.metrics.requests) * 100
      : 0;
    
    return {
      totalRequests: this.metrics.requests,
      totalErrors: this.metrics.errors,
      errorRate: `${errorRate.toFixed(2)}%`,
      averageResponseTime: `${avgResponseTime.toFixed(2)}ms`
    };
  }
}
```

This comprehensive usage guide provides developers with practical examples, best practices, and ready-to-use code for integrating with the FBMP Listings API. The examples cover common use cases, error handling, performance optimization, and testing strategies.
