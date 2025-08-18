# FBMP Listings API Documentation

This API provides access to Facebook Marketplace listings data. All endpoints support CORS and return JSON responses.

## Base URL

When deployed to Vercel, your API will be available at:
```
https://your-app-name.vercel.app/api
```

## Authentication

Currently, this API is public and doesn't require authentication. In production, consider adding API key authentication.

## Endpoints

### 1. Get All Listings

**GET** `/api/listings`

Returns all listings ordered by creation date (newest first).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "115dddb4-d2ff-4f3c-81fd-098079933ae5",
      "link": "https://www.facebook.com/marketplace/item/123456789012345/",
      "status": 0,
      "created_at": "2025-08-18T14:30:32.038Z",
      "updated_at": "2025-08-18T14:30:32.038Z"
    }
  ],
  "count": 1
}
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
    "id": "115dddb4-d2ff-4f3c-81fd-098079933ae5",
    "link": "https://www.facebook.com/marketplace/item/123456789012345/",
    "status": 0,
    "created_at": "2025-08-18T14:30:32.038Z",
    "updated_at": "2025-08-18T14:30:32.038Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Listing not found"
}
```

### 3. Get Listings by Status

**GET** `/api/listings/status/{status}`

Returns all listings with a specific status.

**Parameters:**
- `status` (number, required): The status number to filter by

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "115dddb4-d2ff-4f3c-81fd-098079933ae5",
      "link": "https://www.facebook.com/marketplace/item/123456789012345/",
      "status": 0,
      "created_at": "2025-08-18T14:30:32.038Z",
      "updated_at": "2025-08-18T14:30:32.038Z"
    }
  ],
  "count": 1,
  "status": 0
}
```

### 4. Update Listing

**PUT** `/api/listings/{id}`

Updates a specific listing.

**Parameters:**
- `id` (string, required): The listing UUID

**Request Body:**
```json
{
  "link": "https://www.facebook.com/marketplace/item/new-link/",
  "status": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "115dddb4-d2ff-4f3c-81fd-098079933ae5",
    "link": "https://www.facebook.com/marketplace/item/new-link/",
    "status": 1,
    "created_at": "2025-08-18T14:30:32.038Z",
    "updated_at": "2025-08-18T15:45:12.123Z"
  }
}
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

## Data Model

### Listing Object

```typescript
interface Listing {
  id: string;           // UUID
  link: string;         // Facebook Marketplace URL
  status: number;       // Status code (0, 1, 2, etc.)
  created_at: string;   // ISO 8601 timestamp
  updated_at: string;   // ISO 8601 timestamp
}
```

## Status Codes

The API uses standard HTTP status codes:

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

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Example Usage

### JavaScript/Node.js
```javascript
// Get all listings
const response = await fetch('https://your-app.vercel.app/api/listings');
const data = await response.json();
console.log(data.data);

// Get listings with status 0
const statusResponse = await fetch('https://your-app.vercel.app/api/listings/status/0');
const statusData = await statusResponse.json();
console.log(statusData.data);

// Update a listing
const updateResponse = await fetch('https://your-app.vercel.app/api/listings/115dddb4-d2ff-4f3c-81fd-098079933ae5', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 1
  })
});
const updateData = await updateResponse.json();
```

### Python
```python
import requests

# Get all listings
response = requests.get('https://your-app.vercel.app/api/listings')
data = response.json()
print(data['data'])

# Get listings with status 0
status_response = requests.get('https://your-app.vercel.app/api/listings/status/0')
status_data = status_response.json()
print(status_data['data'])
```

### cURL
```bash
# Get all listings
curl https://your-app.vercel.app/api/listings

# Get listings with status 0
curl https://your-app.vercel.app/api/listings/status/0

# Update a listing
curl -X PUT https://your-app.vercel.app/api/listings/115dddb4-d2ff-4f3c-81fd-098079933ae5 \
  -H "Content-Type: application/json" \
  -d '{"status": 1}'
```

## Deployment Notes

1. Set environment variables in Vercel:
   - `VITE_SUPABASE_URL` or `SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` or `SUPABASE_ANON_KEY`

2. The API will be automatically deployed when you push to your main branch

3. Vercel will create serverless functions for each API endpoint

## Support

For API support or questions, please refer to the main project documentation or create an issue in the repository.
