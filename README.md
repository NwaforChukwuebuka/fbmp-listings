# FBMP Listings - Facebook Marketplace Listings Manager

A modern web application for managing Facebook Marketplace listings with a RESTful API backend and real-time frontend.

## 🚀 Live Demo

- **Frontend:** [https://fbmp-listings.vercel.app](https://fbmp-listings.vercel.app)
- **API:** [https://fbmp-listings.vercel.app/api](https://fbmp-listings.vercel.app/api)

## ✨ Features

- 📱 **Modern UI/UX** - Built with React, TypeScript, and Tailwind CSS
- 🔄 **Real-time Updates** - Live data synchronization via Supabase
- 📊 **Status Management** - Track listing status (New, Active, Inactive)
- 🌐 **RESTful API** - Full CRUD operations for external integrations
- 📱 **Responsive Design** - Works on all devices
- 🚀 **Serverless** - Deployed on Vercel for scalability

## 🏗️ Architecture

```
Frontend (React + TypeScript) ←→ Supabase (Database + Real-time)
                ↓
        REST API (Vercel Functions)
                ↓
        External Integrations
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icons

### Backend
- **Vercel Functions** - Serverless API endpoints
- **Supabase** - PostgreSQL database with real-time features
- **Node.js** - Runtime environment

### Database
- **PostgreSQL** - Robust relational database
- **Row Level Security** - Secure data access
- **Real-time subscriptions** - Live updates

## 📚 API Documentation

### Quick Start

```bash
# Get all listings
curl https://fbmp-listings.vercel.app/api/listings

# Get listings with status 1 (Active)
curl https://fbmp-listings.vercel.app/api/listings/status/1

# Update a listing status
curl -X PUT "https://fbmp-listings.vercel.app/api/listings/{id}" \
  -H "Content-Type: application/json" \
  -d '{"status": 1}'
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/listings` | Get all listings |
| `GET` | `/api/listings/{id}` | Get specific listing |
| `GET` | `/api/listings/status/{status}` | Get listings by status |
| `PUT` | `/api/listings/{id}` | Update listing |
| `DELETE` | `/api/listings/{id}` | Delete listing |

📖 **Full API Documentation:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository

```bash
git clone https://github.com/NwaforChukwuebuka/fbmp-listings.git
cd fbmp-listings
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

The database schema is automatically created via Supabase migrations. Make sure your Supabase project has the required tables and policies.

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 6. Test the API

```bash
# Test all endpoints
node test-api.js

# Test specific endpoint
node test-api.js /listings/status/0 GET
```

## 🧪 Testing

### Manual Testing

```bash
# Test all API endpoints
npm run test:api

# Test specific functionality
npm run test:api -- /listings/status/1
```

### API Testing Examples

```javascript
// Get all listings
const response = await fetch('https://fbmp-listings.vercel.app/api/listings');
const data = await response.json();
console.log(data.data);

// Update listing status
const updateResponse = await fetch(`https://fbmp-listings.vercel.app/api/listings/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 1 })
});
```

## 📊 Database Schema

```sql
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  link TEXT NOT NULL UNIQUE,
  status INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### Status Values
- `0` - New/Unprocessed
- `1` - Active/Processed  
- `2` - Inactive/Archived

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy to your preferred hosting service
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

### Supabase Setup

1. Create a new Supabase project
2. Enable Row Level Security (RLS)
3. Create the listings table with proper policies
4. Set up real-time subscriptions

## 📱 Usage

### Adding Listings

1. Navigate to the application
2. Paste a Facebook Marketplace URL
3. Click "Add FBMP Listing"
4. The listing will be added with status 0 (New)

### Managing Listings

- **View All**: See all listings with their current status
- **Update Status**: Click on status badges to change listing status
- **Delete**: Remove listings that are no longer needed
- **Real-time**: All changes are reflected immediately across all clients

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Issues:** [GitHub Issues](https://github.com/NwaforChukwuebuka/fbmp-listings/issues)
- **Discussions:** [GitHub Discussions](https://github.com/NwaforChukwuebuka/fbmp-listings/discussions)

## 🔮 Roadmap

- [ ] POST endpoint for creating listings via API
- [ ] Bulk operations (batch updates, bulk delete)
- [ ] Advanced filtering and search
- [ ] Pagination for large datasets
- [ ] Webhook notifications for status changes
- [ ] User authentication and authorization
- [ ] API rate limiting
- [ ] Analytics dashboard

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend-as-a-service
- [Vercel](https://vercel.com) for seamless deployment
- [Tailwind CSS](https://tailwindcss.com) for the beautiful UI components
- [React](https://reactjs.org) for the powerful frontend framework
