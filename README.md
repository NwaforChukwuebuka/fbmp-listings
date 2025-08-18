# FBMP Listings

A React application for managing Facebook Marketplace listings with a modern UI built using shadcn/ui components.

## Features

- Modern React application with TypeScript
- Beautiful UI components from shadcn/ui
- Responsive design with Tailwind CSS
- Supabase integration for data management
- **REST API endpoints for external access**

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS
- Supabase
- **Express.js API (Vercel-compatible)**

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd fbmp-listings

# Step 3: Install the necessary dependencies
npm install

# Step 4: Set up environment variables
# Copy .env.example to .env and fill in your Supabase credentials

# Step 5: Start the development server
npm run dev:api
```

## Development

### Option 1: Full-Stack Development (Recommended for API testing)
```sh
npm run dev:api
```
This starts an Express.js server that serves both your React app and API endpoints at `http://localhost:8080`.

### Option 2: Frontend-Only Development
```sh
npm run dev
```
This starts only the Vite dev server for frontend development at `http://localhost:8080`.

## Building for Production

```sh
npm run build
```

## API Endpoints

This application exposes REST API endpoints for external applications to access listing data:

- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get specific listing by ID
- `GET /api/listings/status/:status` - Get listings by status
- `PUT /api/listings/:id` - Update a listing
- `DELETE /api/listings/:id` - Delete a listing

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## Testing the API

### Local Testing
```sh
# Start the development server
npm run dev:api

# In another terminal, test the API
node test-api.js
```

### Production Testing
When deployed to Vercel, test with your production URL:
```sh
# Update BASE_URL in test-api.js to your Vercel URL
# Then run the test
node test-api.js
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Application pages
- `src/integrations/supabase/` - Database integration
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions
- `api/` - **REST API endpoints (Vercel serverless functions)**
- `server.js` - **Development server with API support**

## Environment Variables

Create a `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Make your changes in your preferred IDE
2. Commit and push your changes
3. Changes will be reflected in the repository

## License

This project is private and proprietary.
