import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: any, res: any) {
  // Enable CORS for external access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { status } = req.query;

      if (!status || typeof status !== 'string') {
        return res.status(400).json({ error: 'Invalid status parameter' });
      }

      // Convert status to number if it's a valid number
      const statusNumber = parseInt(status, 10);
      if (isNaN(statusNumber)) {
        return res.status(400).json({ error: 'Status must be a valid number' });
      }

      // Get listings by status
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
    }

    // Method not allowed
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
