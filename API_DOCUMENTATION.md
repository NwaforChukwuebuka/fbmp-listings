# FBMP Listings API Documentation

A comprehensive REST API for managing Facebook Marketplace listings. This API provides full CRUD operations for listings with real-time database integration via Supabase.

## Base URL

**Production API:** `https://fbmp-listings.vercel.app/api`

## Authentication

Currently, this API is public and doesn't require authentication. In production, consider implementing API key authentication or JWT tokens for security.

## API Endpoints

### 1. Get All Listings

**GET** `/api/listings`

Returns all listings ordered by creation date (newest first).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "dde191dc-d939-4caa-9c08-e55e762925ad",
      "link": "https://www.facebook.com/marketplace/item/987654321098765/?ref=feed_rhcds",
      "status": 1,
      "created_at": "2025-08-18T17:27:34.640028+00:00",
      "updated_at": "2025-08-18T17:27:34.640028+00:00"
    }
  ],
  "count": 1
}
```

**cURL Example:**
```bash
curl https://fbmp-listings.vercel.app/api/listings
```

### 2. Get Listing by ID

**GET** `/api/listings/{id}`

Returns a specific listing by its UUID.

**Parameters:**
- `id` (string, required): The listing UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "dde191dc-d939-4caa-9c08-e55e762925ad",
    "link": "https://www.facebook.com/marketplace/item/987654321098765/?ref=feed_rhcds",
    "status": 1,
    "created_at": "2025-08-18T17:27:34.640028+00:00",
    "updated_at": "2025-08-18T17:27:34.640028+00:00"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Listing not found"
}
```

**cURL Example:**
```bash
curl https://fbmp-listings.vercel.app/api/listings/dde191dc-d939-4caa-9c08-e55e762925ad
```

### 3. Get Listings by Status

**GET** `/api/listings/status/{status}`

Returns all listings with a specific status.

**Parameters:**
- `status` (number, required): The status number to filter by (0, 1, 2, etc.)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "dde191dc-d939-4caa-9c08-e55e762925ad",
      "link": "https://www.facebook.com/marketplace/item/987654321098765/?ref=feed_rhcds",
      "status": 1,
      "created_at": "2025-08-18T17:27:34.640028+00:00",
      "updated_at": "2025-08-18T17:27:34.640028+00:00"
    }
  ],
  "count": 1,
  "status": 1
}
```

**cURL Example:**
```bash
curl https://fbmp-listings.vercel.app/api/listings/status/1
```

### 4. Update Listing

**PUT** `/api/listings/{id}`

Updates a specific listing. You can update the `link`, `status`, or both fields.

**Parameters:**
- `id` (string, required): The listing UUID

**Request Body:**
```json
{
  "status": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "dde191dc-d939-4caa-9c08-e55e762925ad",
    "link": "https://www.facebook.com/marketplace/item/987654321098765/?ref=feed_rhcds",
    "status": 1,
    "created_at": "2025-08-18T17:27:34.640028+00:00",
    "updated_at": "2025-08-18T18:45:12.123Z"
  }
}
```

**cURL Example:**
```bash
curl -X PUT "https://fbmp-listings.vercel.app/api/listings/dde191dc-d939-4caa-9c08-e55e762925ad" \
  -H "Content-Type: application/json" \
  -d '{"status": 1}'
```

### 5. Delete Listing

**DELETE** `/api/listings/{id}`

Deletes a specific listing.

**Parameters:**
- `id` (string, required): The listing UUID

**Response:**
```json
{
  "success": true,
  "message": "Listing deleted successfully"
}
```

**cURL Example:**
```bash
curl -X DELETE https://fbmp-listings.vercel.app/api/listings/dde191dc-d939-4caa-9c08-e55e762925ad
```

## Data Model

### Listing Object

```typescript
interface Listing {
  id: string;           // UUID (auto-generated)
  link: string;         // Facebook Marketplace URL (unique)
  status: number;       // Status code (0: New, 1: Active, 2: Inactive)
  created_at: string;   // ISO 8601 timestamp (auto-generated)
  updated_at: string;   // ISO 8601 timestamp (auto-updated)
}
```

### Status Codes

The API uses the following status values:
- `0` - New/Unprocessed
- `1` - Active/Processed
- `2` - Inactive/Archived

## HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "details": "Additional error details (if available)"
}
```

## CORS Support

All endpoints support CORS with the following headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Database Schema

The API uses a PostgreSQL database with the following structure:

```sql
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  link TEXT NOT NULL UNIQUE,
  status INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

**Indexes:**
- `idx_listings_created_at` - For date-based sorting
- `idx_listings_status` - For status-based filtering
- `idx_listings_created_at_date` - For daily statistics

## Example Usage

### JavaScript/Node.js

```javascript
const API_BASE = 'https://fbmp-listings.vercel.app/api';

// Get all listings
const getAllListings = async () => {
  const response = await fetch(`${API_BASE}/listings`);
  const data = await response.json();
  return data.data;
};

// Get listings with status 1 (Active)
const getActiveListings = async () => {
  const response = await fetch(`${API_BASE}/listings/status/1`);
  const data = await response.json();
  return data.data;
};

// Update a listing status
const updateListingStatus = async (id, status) => {
  const response = await fetch(`${API_BASE}/listings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status })
  });
  const data = await response.json();
  return data.data;
};

// Delete a listing
const deleteListing = async (id) => {
  const response = await fetch(`${API_BASE}/listings/${id}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  return data;
};
```

### Python

```python
import requests

API_BASE = 'https://fbmp-listings.vercel.app/api'

# Get all listings
def get_all_listings():
    response = requests.get(f'{API_BASE}/listings')
    return response.json()['data']

# Get listings by status
def get_listings_by_status(status):
    response = requests.get(f'{API_BASE}/listings/status/{status}')
    return response.json()['data']

# Update listing
def update_listing(listing_id, **kwargs):
    response = requests.put(
        f'{API_BASE}/listings/{listing_id}',
        json=kwargs
    )
    return response.json()['data']

# Delete listing
def delete_listing(listing_id):
    response = requests.delete(f'{API_BASE}/listings/{listing_id}')
    return response.json()
```

### cURL Examples

```bash
# Get all listings
curl https://fbmp-listings.vercel.app/api/listings

# Get listings with status 0
curl https://fbmp-listings.vercel.app/api/listings/status/0

# Update a listing status
curl -X PUT "https://fbmp-listings.vercel.app/api/listings/dde191dc-d939-4caa-9c08-e55e762925ad" \
  -H "Content-Type: application/json" \
  -d '{"status": 1}'

# Delete a listing
curl -X DELETE https://fbmp-listings.vercel.app/api/listings/dde191dc-d939-4caa-9c08-e55e762925ad
```

## Frontend Integration

The frontend application integrates directly with Supabase for creating new listings, while using the REST API for all other operations. This design allows for:

- Real-time updates via Supabase subscriptions
- RESTful API access for external integrations
- Optimized performance for read operations

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider implementing:
- Rate limiting per IP address
- API key-based quotas
- Request throttling for heavy users

## Monitoring & Logging

The API includes comprehensive logging:
- All API requests are logged
- Error details are captured and returned
- Database query performance is monitored

## Deployment

The API is deployed on Vercel with:
- Automatic deployments from the main branch
- Global CDN distribution
- Serverless function execution
- Environment variable management

## Environment Variables

Required environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Support & Issues

For API support or to report issues:
1. Check the project repository for known issues
2. Create a new issue with detailed error information
3. Include request/response examples when possible

## Future Enhancements

Planned features:
- POST endpoint for creating listings via API
- Bulk operations (batch updates, bulk delete)
- Advanced filtering and search
- Pagination for large datasets
- Webhook notifications for status changes
