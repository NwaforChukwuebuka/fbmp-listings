import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Enable CORS for external access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid listing ID' });
    }

    if (req.method === 'GET') {
      // Get specific listing by ID
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
    }

    if (req.method === 'PUT') {
      // Update listing
      const { link, status } = req.body;
      
      const updateData = {} as any;
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
    }

    if (req.method === 'DELETE') {
      // Delete listing
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
    }

    // Method not allowed
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
