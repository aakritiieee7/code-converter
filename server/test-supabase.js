import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE;

console.log('URL:', url ? 'Found' : 'Not found');
console.log('Key:', key ? 'Found' : 'Not found');

if (url && key) {
  try {
    const client = createClient(url, key);
    console.log('Supabase client created successfully');
  } catch (error) {
    console.log('Error creating client:', error.message);
  }
} else {
  console.log('Missing URL or key');
}
