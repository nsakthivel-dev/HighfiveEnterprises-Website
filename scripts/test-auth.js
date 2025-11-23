import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env file
config({ path: '.env' });

// Get these from your Supabase project settings
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testAuth() {
  console.log('Testing Supabase authentication...');
  
  try {
    // List all users
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('Error listing users:', error.message);
      return;
    }
    
    console.log('Found users:', users.users.length);
    users.users.forEach(user => {
      console.log(`- ${user.email} (${user.id}) - confirmed: ${user.email_confirmed_at ? 'yes' : 'no'}`);
    });
    
    // Test login with one of the admin accounts
    console.log('\nTesting login with admin account...');
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'ajjigova111@gmail.com',
      password: '@arjun12345'
    });
    
    if (loginError) {
      console.error('Login failed:', loginError.message);
    } else {
      console.log('Login successful!');
      console.log('User:', data.user.email);
      console.log('Session:', data.session ? 'exists' : 'none');
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

testAuth();