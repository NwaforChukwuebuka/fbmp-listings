import express from 'express';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// UUID validation function
function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// API Routes

// GET /api/listings - Get all listings
app.get('/api/listings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch listings',
        details: error.message 
      });
    }

    return res.status(200).json({
      success: true,
      data,
      count: data?.length || 0
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// GET /api/listings/:id - Get specific listing by ID
app.get('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !isValidUUID(id)) {
      return res.status(400).json({ 
        error: 'Invalid listing ID', 
        details: 'ID must be a valid UUID format' 
      });
    }

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Listing not found' });
      }
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch listing',
        details: error.message 
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// PUT /api/listings/:id - Update listing
app.put('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { link, status } = req.body;

    if (!id || !isValidUUID(id)) {
      return res.status(400).json({ 
        error: 'Invalid listing ID', 
        details: 'ID must be a valid UUID format' 
      });
    }

    const updateData = {};
    if (link !== undefined) updateData.link = link;
    if (status !== undefined) updateData.status = status;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('listings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        error: 'Failed to update listing',
        details: error.message 
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// DELETE /api/listings/:id - Delete listing
app.delete('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !isValidUUID(id)) {
      return res.status(400).json({ 
        error: 'Invalid listing ID', 
        details: 'ID must be a valid UUID format' 
      });
    }

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        error: 'Failed to delete listing',
        details: error.message 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// GET /api/listings/status/:status - Get listings by status
app.get('/api/listings/status/:status', async (req, res) => {
  try {
    const { status } = req.params;

    if (!status) {
      return res.status(400).json({ error: 'Invalid status parameter' });
    }

    const statusNumber = parseInt(status, 10);
    if (isNaN(statusNumber)) {
      return res.status(400).json({ error: 'Status must be a valid number' });
    }

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('status', statusNumber)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch listings by status',
        details: error.message 
      });
    }

    return res.status(200).json({
      success: true,
      data,
      count: data?.length || 0,
      status: statusNumber
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
