import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE ?? process.env.SUPABASE_ANON_KEY ?? '';

console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Not found');
console.log('Supabase Key:', supabaseKey ? 'Found' : 'Not found');

// Only create client if we have valid credentials
export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
}) : null;

export const isSupabaseConfigured = () => {
  const configured = supabase !== null;
  console.log('isSupabaseConfigured called, returning:', configured);
  return configured;
};
